class BattleScene extends Phaser.Scene {
    
    TILE_WIDTH_HALF = 32;
    TILE_HEIGHT_HALF = 16;

    /**
     * @constructor
     * @param {String} sceneName
     * @param {Object} menus
     * @param {String} overworldMapName
     * @param {String} mapName
     * @param {Array<String>} tileSets
     * @param {Array<String>} tileNames
     * @param {Array<String>} layerNames
     * @param {Array<String>} enemyTypes
     * @description The constructor for the BattleScene class.
     * This class is used to create the battle scenes for the game.
     * The battle scenes are used to create the battle maps and the enemies that are fought in the game.
     */
    constructor(sceneName, menus, overworldMapName, mapName, tileSets, tileNames, layerNames, enemyTypes) {
        super(sceneName);
        this.menus = menus;
        this.overworldMapName = overworldMapName;
        this.mapName = mapName;
        this.tileSets = tileSets;
        this.tileNames = tileNames;
        this.layerNames = layerNames;
        this.enemyTypes = enemyTypes;

        // Set the class properties
        this.player = {};
		this.enemies = [];
        this.aliveEnemies = [];
		this.collidingWith = [];
		this.sprinting = 1;
		this.textBoxVisible = false;
		this.menuBoxVisible = false;
		this.attacking = false;
		this.speed = 2.5;
		this.prevVelocity = 0;
        this.enemyPositions = [];
    }
    
    preload() {    
        this.textBoxVisible = false;
        this.menuBoxVisible = false;

        this.mapLayers = [];
        this.mapTilesets = [];

        this.activeMenu = this.menus;
    }

    // This function loads initial game logic
    // And initiates all the game objects
    async create() {
        
        // Create the map
		const map = this.make.tilemap({ key: this.mapName });

		// Create the layers
		for (let i = 0; i < this.tileSets.length; i++) {
			this.mapTilesets.push(
				map.addTilesetImage(this.tileNames[i], this.tileSets[i])
			);
		}

		// Create the layers
		// If the layer is a player layer, create the player
		// If the layer is a collides layer, create the collisions
		for (let i = 0; i < this.layerNames.length; i++) {
			// If the layer is a player layer, create the player
			if (this.layerNames[i] === "Player") {
				const spawnpoint = map.findObject(
					"PlayerPositions",
					(obj) => obj.name === "PC_Pos"
				);

                const spawnpointPos = {
                    x: (spawnpoint.x/64 - spawnpoint.y/32) * this.TILE_WIDTH_HALF + 200,
                    y: (spawnpoint.x/64 + spawnpoint.y/32) * this.TILE_HEIGHT_HALF + 50
                };
                //console.log(spawnpoint);
				this.player = new PC(
					this,
					spawnpointPos.x,
					spawnpointPos.y,
					"player",
					"mc",
					config.global.pc.level,
					config.global.pc.maxHp,
					config.global.pc.maxSp,
					config.global.pc.st,
					config.global.pc.ma,
					config.global.pc.sp,
					config.global.pc.lu,
					config.global.pc.ag,
					config.global.pc.en,
					config.global.pc.moveIDs
				)
                .setSize(32, 32)
                .setFixedRotation()
                .setCollisionGroup(1);

                this.player.inBattle = true;

                console.log(this.player);


			} else if (this.layerNames[i] === "EnemyPositions") {
                // Filter the objects in the map
                // This will return an array of objects that have x and y properties
				const enemyPositions = map.filterObjects("EnemyPositions", (obj) => obj);
                // Generate the enemies
                if (enemyPositions.length > 0) {
                    if (!this.enemyTypes) {
                        throw new Error("The constructor must contain enemy types.");
                    } else {
                        console.log(enemyPositions);
                        this.generateEnemies(enemyPositions);
                    }
                } else {
                    throw new Error("The map must contain enemy positions.");
                }
				// Otherwise, create the layer normally
			} else {
				this.mapLayers.push(
					map.createLayer(this.layerNames[i], this.mapTilesets, 0, 0)
				);
			}
		}

		// set up animations
		const anims = this.anims;

		// Assign the camera to a variable to make it easier to work with
		const camera = this.cameras.main;
		// Set the bounds of the camera to be the size of the map
        camera.setBounds(config.global.GLOBAL_ISO_OFFSET.x, config.global.GLOBAL_ISO_OFFSET.y, map.widthInPixels, map.heightInPixels);
		camera.setZoom(2.0);
		camera.startFollow(this.player, true, 0.08, 0.08);

        // If there are any places where text boxes are used, they can be created here
        
        /*
		// Create the Menu Box
		this.textBox = new MenuBox(
			this,
			camera.x + 125,
			camera.y + 270,
			800,
			200,
			["Woah.", "Scary house.", "I'm gonna have to go in, aren't I?"],
			"0x000000"
		);
		this.textBox.setVisible(false);
        */

        console.log(this.enemies);

        this.enemySelector = this.add.sprite(this.enemies[0].x, this.enemies[0].y-30, 'red')
            .setRotation(2*0.785398)
            .setVisible(false);

        this.spellObject = this.add.sprite(this.player.x, this.player.y)
        .setVisible(false);
        console.log(this.player);
        this.currentBattle = new Battle2([this.player], this.enemies, this);

        this.createMenus(this.menus, camera);
        this.activeMenu.object.setVisible(true);
        this.menus.object.createMenuObjects();

        console.log(this.activeMenu);

		EventBus.emit("current-scene-ready", this);
    }

    /**
     * @method update
     * @description Updates the game logic for each frame.
     */
    update() {
        for (let i = 0; i < this.aliveEnemies.length; i++) {
            this.aliveEnemies[i].update();
        }

        //this.currentBattle.update();

        //this.getCameraControls();
        this.currentBattle.update();
        // Update the player
        this.player.update();

        console.log(this.enemySelector);
        this.enemySelector.anims.play('selector-float-anim', true);

        // Update the enemies
        //for (let i = 0; i < this.enemies.length; i++) {
            //this.enemies[i].update();
        //}
    }

    /**
     * @method changeScene
     * @description Changes the current scene to the associated overworld map.
     */
    changeScene() {
        this.scene.start(this.overworldMapName);
    }

    /**
     * @method generateEnemies
     * @param {Object} enemyPositions 
     * @description Generates the enemies for the scene.
     */
    generateEnemies(enemyPositions) {
        this.enemies = [];
        this.aliveEnemies = [];

        let randomAmount = Math.floor(Math.random() * 3) + 1;

        console.log("Enemy Positions:", enemyPositions);
        for (let i = randomAmount; i > 0; i--) {
            // generate random enemy type based on the types passed in the constructor
            const thisEnemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            const enemyStats = config.global.enemyTypes[thisEnemyType];
            console.log("Enemy Stats:", enemyStats);

            // Since the enemies are generated in the battle scene, the x and y coordinates are calculated
            // using the formula to convert isometric coordinates to cartesian coordinates
            let posX = (enemyPositions[i].x/64 - enemyPositions[i].y/32) * this.TILE_WIDTH_HALF + 200;
            let posY = (enemyPositions[i].x/64 + enemyPositions[i].y/32) * this.TILE_HEIGHT_HALF + 50;
            let enemy = new Enemy(
							this,
							posX,
							posY,
							thisEnemyType,
							thisEnemyType,
							enemyStats.LEVEL,
							enemyStats.MAXHP,
							enemyStats.MAXSP,
							enemyStats.ST,
							enemyStats.MA,
							enemyStats.SP,
							enemyStats.LU,
							enemyStats.AG,
							enemyStats.EN,
							enemyStats.MOVEIDS
						);

            this.enemies.push(enemy);
            this.aliveEnemies.push(enemy);
        }
        console.log(this.enemies);
    }

    /**
     * @description Creates the menus for the scene.
     * @param {Object} menuBranch
     * @param {Object} camera
     * @param {Object} parent
     */
    createMenus(menuBranch, camera, parent) {
        // If the menuBranch object contains an options property, it is a menu
        try {
            let menuKeys = [];
            menuKeys = Object.keys(menuBranch.options);

            let longestMenuItem = 0;
            for (let i = 0; i < menuKeys.length; i++) {
                if (menuKeys[i].length > longestMenuItem) {
                    longestMenuItem = menuKeys[i].length;
                }
            }

            menuBranch.object = new MenuBox(
                this,
                camera.x + 180,
                camera.y + 120,
                20 * longestMenuItem,
                35 * menuKeys.length,
                menuKeys,
                0x000000,
                { font: "bold 15px Arial" },
                menuBranch.title,
                parent
            );
            this.add.existing(menuBranch.object);
            //console.log(menuBranch);
            //console.log(menuBranch.object);
            //console.log(menuKeys);
            menuBranch.object.setVisible(false);

            //console.log("Creating menus");

            for (let i = 0; i < menuKeys.length; i++) {
                //console.log("Creating menu");
                //console.log(menuBranch.options[menuKeys[i]]);
                this.createMenus(menuBranch.options[menuKeys[i]], camera, menuBranch);
            }
        // If the menuBranch object contains an items property, it is a menu item
        } catch (error) {
            let longestMenuItem = 0;
            for (let i = 0; i < menuBranch.items.length; i++) {
                if (menuBranch.items[i].length > longestMenuItem) {
                    longestMenuItem = menuBranch.items[i].length;
                }
            }

            menuBranch.object = new MenuBox(
                this,
                camera.x + 180,
                camera.y + 120,
                20 * longestMenuItem,
                50 + 22 * menuBranch.items.length,
                menuBranch.items,
                "0x000000",
                { font: "bold 15px Arial" },
                menuBranch.title,
                parent
            );
            menuBranch.object.setVisible(false);
            this.add.existing(menuBranch.object);
            //console.log(menuBranch.object);
        }
    }
}

BattleMenus = {
    object: {},
    topLevel: true,
    title: "Menu",
    options: {
        Attack: {
            object: {},
            topLevel: false,
            title: "Attack",
            items: [
                "Attack 1",
                "Attack 2",
                "Attack 3",
            ]
        },
        Item: {
            object: {},
            parent: "Menu",
            topLevel: false,
            title: "Item",
            items: [
                "Potion",
                "Ether",
                "Phoenix Down"
            ]
        },
        Act: {
            object: {},
            topLevel: false,
            title: "Act",
            items: [
                "Say hi",
                "Say bye"
            ]
        },
        Run: {
            object: {},
            topLevel: false,
            title: "Run",
            items: [
                "Save"
            ]
        }
    }
};

// Create the battle scenes
Battle_Cave = new BattleScene(
	"Battle_Cave",
	BattleMenus,
	"Level2",
	"battle_cave",
	["iso_tiles1"],
	["tileset_cave_1"],
    ["Ground", "WaterBelow", "Wall", "WallDecals", "BehindPlayer", "Player", "EnemyPositions", "AbovePlayer"],
	["Skeleton"],
);
Battle_Graveyard = new BattleScene(
	"Battle_Graveyard",
	BattleMenus,
	"Level3",
	"battle_graveyard",
	["iso_tiles2"],
	["grassland_tiles"],
	["Ground", "GravesBehind", "Fences", "Fences2", "Player", "EnemyPositions", "Graves"],
	["Skeleton"]
);
Battle_Ruins = new BattleScene(
	"Battle_Ruins",
	BattleMenus,
	"Level2",
	"battle_ruins",
	[],
	[],
	[],
	0,
	[],
	"Level3"
);
Battle_Sea = new BattleScene(
	"Battle_Sea",
	BattleMenus,
	"Level2",
	"battle_sea",
	[],
	[],
	[],
	0,
	[],
	"Level1"
);
Battle_Shore = new BattleScene(
	"Battle_Shore",
	BattleMenus,
	"Level2",
	"battle_shore",
	[],
	[],
	[],
	0,
	[],
	"Level1"
);
