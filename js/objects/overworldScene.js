/**
 * Represents the overworld scene in the game.
 *
 * @class OverworldScene
 * @extends {Phaser.Scene}
 *
 * @property {Object} menus - The menu object for the scene.
 * @property {string} mapName - The name of the map.
 * @property {Array<string>} tileNames - The names of the tiles.
 * @property {Array<string>} tilesets - The tilesets used in the map.
 * @property {Array<string>} layerNames - The names of the layers in the map.
 * @property {Array<string>} enemyTypes - The types of enemies in the scene.
 * @property {string} nextScene - The name of the next scene.
 * @property {Array<Entity>} enemies - The enemies in the scene.
 * @property {Array<Entity>} collidingWith - The entities colliding with the player.
 * @property {number} sprinting - The sprinting speed of the player.
 * @property {boolean} attacking - The attacking state of the player.
 * @property {number} speed - The speed of the player.
 * @property {number} prevVelocity - The previous velocity of the player.
 * @property {boolean} textBoxVisible - The visibility of the text box.
 * @property {boolean} menuBoxVisible - The visibility of the menu box.
 * @property {Array<Phaser.Tilemaps.Tileset>} mapTilesets - The tilesets used in the map.
 * @property {Array<Phaser.Tilemaps.LayerData>} mapLayers - The layers in the map.
 * @property {PC} player - The player character in the scene.
 * @property {Phaser.Physics.Matter.Sprite} sword - The player's sword hitbox.
 * @property {Phaser.Physics.Matter.Sprite} screenTransition - The screen transition hitbox.
 * @property {MenuBox} textBox - The text box in the scene.
 * @property {MenuBox} activeMenu - The active menu in the scene.
 * @property {number} speed - The speed of the player.
 * 
 * @example
 * let overworldScene = new OverworldScene(
 *  "OverworldScene",
 *  menus,
 *  "battleMap",
 *  "map",
 *  ["tiles1", "tiles2"],
 *  ["hyptosis_tile-art-batch-1", "hyptosis_tile-art-batch-2"],
 *  ["Ground", "Player", "Walls", "Accessories", "Collision"],
 *  5,
 *  ["Zombie", "Skeleton", "Imp"],
 *  "battleScene"
 * );
 * 
 */
class OverworldScene extends Phaser.Scene {
	player;
	KeyObjects;
	sprinting;
	attacking;
	enemies = [];
	collidingWith = [];

	/**
	 * @constructor
	 * @param {string} sceneName - The name of the scene.
	 * @param {Object} menus - The menu object for the scene.
     * @param {string} battleMapName - The name of the battle map.
	 * @param {string} mapName - The name of the map.
	 * @param {Array<string>} tileNames - The names of the tiles.
	 * @param {Array<string>} tilesets - The tilesets used in the map.
	 * @param {Array<string>} layerNames - The names of the layers in the map.
	 * @param {Array<string>} enemyTypes - The types of enemies in the scene.
	 * @param {string} nextScene - The name of the next scene.
	 */
	constructor(
		sceneName,
		menus,
        battleMapName,
		mapName,
		tileNames,
		tilesets,
		layerNames,
		enemyTypes,
		nextScene
	) {
		// Validate the constructor parameters
		try {
            const errors = [];

		// if the scene doesn't contain a map name
		if (!sceneName) {
			errors.push("The scene must contain a map name.");
		} else if (typeof sceneName !== "string") {
			// if the map name is not a string
			errors.push("The map name must be a string.");
		}

		// if the scene doesn't contain a menu object
		if (!menus) {
			errors.push("The scene must contain a menu object.");
		}

        // if the scene doesn't contain a battle map name
        if (!battleMapName) {
            errors.push("The scene must contain a battle map name.");
        }

		// if the constructor doesn't contain a map name
		if (!mapName) {
			errors.push("The constructor must contain a map name.");
		}

		// if the constructor doesn't contain tile names
		if (!tileNames) {
			errors.push("The constructor must contain tile names.");
		}

		// if the constructor doesn't contain tilesets
		if (!tilesets) {
			errors.push("The constructor must contain tilesets.");
		}

		// if the constructor doesn't contain layer names
		if (!layerNames) {
			errors.push("The constructor must contain layer names.");
		}

		// if the tile names and tilesets are not the same length
		if (tileNames.length !== tilesets.length) {
			errors.push("Tile names and tilesets must be the same length.");
		}

		// if the layer names doesn't contain a Player layer
		if (!layerNames.includes("Player")) {
			errors.push("The map must contain a Player layer.");
		}

		// if the layer names doesn't contain a Collides layer
		if (!layerNames.includes("Collision")) {
			errors.push("The map must contain a Collision layer.");
		}

		// if the scene doesn't contain a next scene]
		if (!nextScene) {
			errors.push("The scene must contain a next scene.");
		} else if (typeof nextScene !== "string") {
			// if the next scene is not a string
			errors.push("The next scene must be a string.");
		}

		if (errors.length > 0) {
			throw new Error(errors.join(" "));
		}
		} catch (error) {
			console.error(error);
		}

        console.log(enemyTypes);

		// Call the parent constructor
		super(sceneName);

		// Assign the constructor parameters to the class properties
		this.menus = menus;
		this.mapName = mapName;
        this.battleMapName = battleMapName;
		this.tilesets = tilesets;
		this.tileNames = tileNames;
		this.layerNames = layerNames;
		this.nextScene = nextScene;
        this.enemyTypes = enemyTypes;

		// Set the class properties
		this.enemies = [];
		this.collidingWith = [];
		this.sprinting = 1;
		this.textBoxVisible = false;
		this.menuBoxVisible = false;
		this.attacking = false;
		this.speed = 2.5;
		this.prevVelocity = 0;
	}

	/**
	 * @method preload
	 * @description Loads the assets for the scene.
	 */
	preload() {
		// the "this" keyword refers to the current scene

		this.sprinting = 1;

		//this.MouseObjects = this.input.addPointer();

		this.textBoxVisible = false;
		this.menuBoxVisible = false;

		this.mapLayers = [];
		this.mapTilesets = [];

		this.activeMenu = this.menus;
	}

	/**
	 * @method create
	 * @description Loads initial game logic and initiates all the game objects.
     * @example
	 */
	create() {
		// Create the map
		const map = this.make.tilemap({ key: this.mapName });

		// Create the layers
		for (let i = 0; i < this.tilesets.length; i++) {
			this.mapTilesets.push(
				map.addTilesetImage(this.tileNames[i], this.tilesets[i])
			);
		}

		// Create the layers
		// If the layer is a player layer, create the player
		// If the layer is a collides layer, create the collisions
		for (let i = 0; i < this.layerNames.length; i++) {
			// If the layer is a player layer, create the player
			if (this.layerNames[i] === "Player") {
				const spawnpoint = map.findObject(
					"Interactables",
					(obj) => obj.name === "SpawnPoint"
				);
                //console.log(spawnpoint);
				this.player = new PC(
					this,
					spawnpoint.x,
					spawnpoint.y,
					"player",
					config.global.pc.name,
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

                this.updatePlayerStats();

                // Create player sword hitbox
                this.sword = this.matter.add
                    .sprite(spawnpoint.x, spawnpoint.y)
                    .setFixedRotation()
                    .setSensor(true)
                    .setCollisionGroup(2)
                    .setSize(32, 32)
                    .setVisible(false);

				// If the layer is a collides layer, create the collisions
			} else if (this.layerNames[i] === "Collision") {
				const collisions = map.createLayer("Collision", this.mapTilesets, 0, 0);
				collisions.setCollisionByProperty({ Collides: true });
				this.matter.world.convertTilemapLayer(collisions);
				collisions.setVisible(false);
				this.mapLayers.push(collisions);

				// Otherwise, create the layer normally
			} else {
				this.mapLayers.push(
					map.createLayer(this.layerNames[i], this.mapTilesets, 0, 0)
				);
			}
		}

        // Create the enemies
        // the map.filterObjects function is used to filter the objects in the map
        // the first parameter is the name of the object layer
        // the second parameter is a function that filters the objects via the object's name property
        // if there are no objects in the object layer, the function returns an empty array
        const enemyLocations = map.filterObjects("EnemySpawnPoints", (obj) => obj.name === "");

        // if the constructor doesn't contain enemy types
		if (enemyLocations !== null) {
			if (!this.enemyTypes) {
				throw new Error("The constructor must contain enemy types if it contains an enemy amount.");
			} else {
                console.log("No enemies in this scene.");
            }
		}

        // Since this can be used in a scene without any enemies, the enemies parameter can be an empty array
        // If the enemyLocations parameter is empty, we can just return
        if (enemyLocations) {
            this.generateEnemies(enemyLocations);
        }

		// Locate the screen transition
		const screenTransitionLocation = map.findObject(
			"Interactables",
			(obj) => obj.name === "ScreenTransition"
		);

        // If the screen transition location is not null, create the screen transition
        // This means we can have a final level with no screen transition
        if (screenTransitionLocation !== null) {
            this.screenTransition = this.matter.add
                .sprite(
                    screenTransitionLocation.x,
                    screenTransitionLocation.y - 16,
                    "blank"
                )
                .setSensor(true)
                .setCollisionGroup(3)
                .setVisible(false);
        }

		// set up animations
		const anims = this.anims;

		// Assign the camera to a variable to make it easier to work with
		const camera = this.cameras.main;
		// Set the bounds of the camera to be the size of the map
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		camera.startFollow(this.player);
		camera.setZoom(1.5);

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

        // Create the menus
		this.createMenus(this.menus, camera, null);

        // Set the active menu to the menus object
		this.activeMenu = this.menus;

        console.log(this.activeMenu);

		EventBus.emit("current-scene-ready", this);
	}

	/**
	 * @method changeScene
	 * @description Changes the current scene to the next scene and resets the player's position and the enemies array.
     * @example
     * changeScene();
	 */
	changeScene() {
        this.scene.start(this.nextScene);
        config.global.pc.x = null;
        config.global.pc.y = null;
        config.global.enemies = [];
    }

    /**
     * @method startBattle
     * @description Starts a battle with the specified enemy.
     * @param {Number} enemyIndex - The index of the enemy to start the battle with. From the enemies array in the scene.
     * @example 
     * startBattle(enemy);
     * @throws {Error} Throws an error if the enemy parameter is not an Integer.
     */
    startBattle(enemyIndex) {
        if (!Number.isInteger(enemyIndex)) {
            throw new Error("The enemy parameter must be an Integer.");
        }

        config.global.enemies.push(enemyIndex);
        config.global.pc.x = this.player.x;
        config.global.pc.y = this.player.y;
        this.scene.start(this.battleMapName);
        this.scene.pause();
    }

	/**
	 * @method update
	 * @description Updates the game logic for each frame.
	 */
	update() {
		/* input */

		// Set the sword position
		if (this.player.flipX) {
			this.sword.setPosition(this.player.x - 30, this.player.y);
		} else {
			this.sword.setPosition(this.player.x + 30, this.player.y);
		}

		if (this.attacking) {
			for (let i = 0; i < this.collidingWith.length; i++) {
				this.collidingWith[i].destroy();
				this.collidingWith.splice(i, 1);
			}

			return;
		}

		// Handle input
		this.player.update();
	}

    /**
     * @method generateEnemies
     * @description Generates the enemies for the scene.
     * @param {Array<Object>} enemyLocations - The locations to generate enemies with x and y properties.
     * @param {Array<string>} enemyTypes - The types of enemies to generate.
     * @throws {Error} Throws an error if the enemyLocations parameter is not an array of arrays of numbers.
     * @throws {Error} Throws an error if the enemyTypes parameter is not an array.
     * @throws {Error} Throws an error if the enemyTypes parameter is not an array of strings.
     * @throws {Error} Throws an error if the enemyTypes parameter is provided without the enemies parameter.
     * @example
     * generateEnemies(5);
     * generateEnemies(5, ["enemy1", "enemy2", "enemy3"]);
     */
    generateEnemies(enemyLocations) { 
        // ====================================================================================================
        // ============== Validate the parameters for the generateEnemies function =============================
        // ====================================================================================================
        
        const errors = [];
        
        // Validate the enemies parameter
        if (!Array.isArray(enemyLocations)) {
            errors.push("The enemies parameter must be an array.");
        } else {
            
            // Check if the enemyLocations parameter is an array of objects with x and y properties
            for (let i = 0; i < enemyLocations.length; i++) {
                if (!Object.hasOwn(enemyLocations[i], "x")) {
                    errors.push("The enemies parameter must be an array of objects with x and y properties. Missing x property.");
                    break;
                }  
                if (!Object.hasOwn(enemyLocations[i], "y")) {
                    errors.push("The enemies parameter must be an array of objects with x and y properties. Missing y property.");
                    break;
                }
            }
        }
        
        /*
        // Validate the enemyTypes parameter
        if (this.enemyTypes) {
            if (!Array.isArray(this.enemyTypes)) {
                errors.push("The enemyTypes parameter must be an array.");
            } else if (this.enemyTypes.length === 0) {
                error.push("The enemyTypes parameter must contain at least one enemy type.");
            }
        }
        
        // If the enemyTypes parameter is provided without the enemyLocations parameter
        if (!enemyLocations && enemyTypes) {
            errors.push("The enemyTypes parameter cannot be provided without the enemies' locations.");
        }
        */

        if (errors.length > 0) {    
            throw new Error(errors.join(" "));
        }
        // ====================================================================================================
        // ============== After this point, the function is guaranteed to have valid parameters ===============
        // ====================================================================================================
        
        
        // reset the enemies array
        this.enemies = [];
        console.log(config.global.enemies);
        
        for (let i = 0; i < enemyLocations.length; i++) {
            
            // generate random enemy type
            // The logic here is that if the enemyTypes array is provided, then the enemy type is randomly selected from the array
            // Otherwise, the enemy type is "enemy"
            let enemyType = this.enemyTypes ? this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)] : "enemy";

            // Get enemy stats from the enemy type
            // and create the enemy
            console.log(this.enemyTypes);
            console.log(config.global.enemyTypes[enemyType]);
            let enemy = new Entity(
							this,                                           // scene
							enemyLocations[i].x,                            // x
							enemyLocations[i].y,                            // y
							enemyType,                                      // texture
                            enemyType,                                      // name
							config.global.enemyTypes[enemyType].LEVEL,  // level
							config.global.enemyTypes[enemyType].MAXHP,  // maxHp
							config.global.enemyTypes[enemyType].MAXSP,  // maxSp
							config.global.enemyTypes[enemyType].ST,     // st
							config.global.enemyTypes[enemyType].MA,     // ma
							config.global.enemyTypes[enemyType].SP,     // sp
							config.global.enemyTypes[enemyType].LU,     // lu
							config.global.enemyTypes[enemyType].AG,     // ag
							config.global.enemyTypes[enemyType].EN,     // en
							config.global.enemyTypes[enemyType].MOVEIDS // moveIDs
						)
                    .setSensor(true)
                    .setCollisionGroup(2);
            
            // Add the enemy to the enemies array
            this.enemies.push(enemy);

            // If the enemy is in the config.global.enemies array, set it to invisible
            if (config.global.enemies.includes(i)) {
                enemy.kill();
            }   
        }
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
                camera.x + 125,
                camera.y + 80,
                20 * longestMenuItem,
                35 * menuKeys.length,
                menuKeys,
                "0x000000",
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
                camera.x + 125,
                camera.y + 80,
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

	/**
	 * @method updatePlayerStats
	 * @description Updates the player's stats in the menu.
	 */
	updatePlayerStats() {
		this.menus.options.Status.items = [
			this.player.name,
			"HP: " + this.player.currenthp + "/" + this.player.maxhp,
			"SP: " + this.player.currentsp + "/" + this.player.maxsp,
			"ST: " + this.player.st,
			"MA: " + this.player.ma,
			"LU: " + this.player.lu,
			"AG: " + this.player.ag,
			"EN: " + this.player.en,
		];
	}
}

OverworldMenus = {
    object: {},
    topLevel: true,
    title: "Menu",
    options: {
        Item: {
            object: {},
            topLevel: false,
            title: "items",
            items: [
                "Potion",
                "Ether",
                "Phoenix Down"
            ]
        },
        Equip: {
            object: {},
            parent: "Menu",
            topLevel: false,
            title: "Equip",
            options: {
                Weapon: {
                    object: {},
                    topLevel: false,
                    title: "Weapon",
                    items: [
                        "Sword",
                        "Axe",
                        "Bow"
                    ]
                },
                Armor: {
                    object: {},
                    topLevel: false,
                    title: "Armor",
                    options: {
                        Head: {
                            object: {},
                            topLevel: false,
                            title: "Head",
                            items: [
                                "Helmet",
                                "Hat"
                            ]
                        },
                        Body: {
                            object: {},
                            topLevel: false,
                            title: "Body",
                            items: [
                                "Chainmail",
                                "Leather"
                            ]
                        },
                        Legs: {
                            object: {},
                            topLevel: false,
                            title: "Legs",
                            items: [
                                "Pants",
                                "Shorts"
                            ]
                        }
                    }
                },
                Accessory: {
                    object: {},
                    topLevel: false,
                    title: "Accessory",
                    items: [
                        "Ring",
                        "Necklace",
                        "Bracelet"
                    ]
                }
            }
        },
        Status: {
            object: {},
            topLevel: false,
            title: "Status",
            items: [
                "LIAM",
                "HP: ", 
                "SP: ",
                "ST: ",
                "MA: ",
                "LU: ",
                "AG: ",
                "EN: "
            ]
        },
        Save: {
            object: {},
            topLevel: false,
            title: "Save",
            items: [
                "Save"
            ]
        },
        Quit: {
            object: {},
            topLevel: false,
            title: "Quit",
            items: [
                "Quit"
            ]
        }
    }
};

Level1 = new OverworldScene(
	"Level1",                                                                   // sceneName
	this.OverworldMenus,                                                        // menus
	"Battle_Cave",                                                              // battleMapName
	"level1",                                                                   // mapName
	["hyptosis_tile-art-batch-1", "hyptosis_til-art-batch-2"],                  // tileNames
	["tiles1", "tiles2"],                                                       // tilesets
	[
		"Floor",
		"FloorDecal",
		"Collides",
		"Player",
		"CollidesDecal",
		"Decal",
		"Collision",
	],                                                                          // layerNames
	[],                                                                         // enemyTypes
	"Level2"                                                                    // nextScene
);
Level2 = new OverworldScene(
	"Level2",                                                                   // sceneName
	this.OverworldMenus,                                                        // menus
	"Battle_Graveyard",                                                         // battleMapName
	"level2",                                                                   // mapName
	["hyptosis_tile-art-batch-1", "hyptosis_til-art-batch-2"],                  // tileNames
	["tiles1", "tiles2"],                                                       // tilesets
	["Ground", "Walls", "Accessories", "Player", "WallsInFront", "Collision"],  // layerNames
	["Skeleton"],                                                               // enemyTypes
	"Level3"                                                                    // nextScene
);
Level3 = new OverworldScene(
	"Level3",                                                                   // sceneName
	this.OverworldMenus,                                                        // menus
	"Battle_Graveyard",                                                         // battleMapName
	"level3",                                                                   // mapName
	[
		"hyptosis_tile-art-batch-1",
		"hyptosis_til-art-batch-2",
		"hyptosis_tile-art-batch-4",
	],                                                                          // tileNames
	["tiles1", "tiles2", "tiles3"],                                             // tilesets
	[
		"Floor",
		"FloorDecals",
		"WallMidSection",
		"WallMidSectionDecals",
		"Player",
		"AbovePlayer",
		"Walls/WallTops",
		"Walls/WallTops2",
		"Walls/WallTops3",
		"Collision",
	],                                                                          // layerNames
	["Skeleton"],                                                               // enemyTypes
	"Level3"                                                                    // nextScene
);