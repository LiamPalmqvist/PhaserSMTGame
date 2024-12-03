class Battle_Cave extends Phaser.Scene {
    
    player;
    KeyObjects;
    MenuKeyObjects;
    controllingMenu;
    cameraTracking;


    TILE_WIDTH_HALF = 32;
    TILE_HEIGHT_HALF = 16;

    constructor() {
        super('Battle_Cave');
    }
    
    // This function is the function that loads the assets
    preload ()
    {
        this.menuBoxObjectsCreated = false;

        this.enemies = [];

        this.menus = {
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

        this.activeMenu = this.menus;
    }

    // This function loads initial game logic
    // And initiates all the game objects
    async create() {

        this.CameraKeys = this.input.keyboard.createCursorKeys();

        // Create the map
        const map = this.make.tilemap({ key: 'battle_cave' });
        const tileset = map.addTilesetImage('tileset_cave_1', 'iso_tiles1');

        // Create the layers
        const floor = map.createLayer('Ground', tileset, 0, 0);
        const waterBelow = map.createLayer('WaterBelow', tileset, 0, 0);
        const wall = map.createLayer('Wall', tileset, 0, 0);
        const wallDecals = map.createLayer('WallDecals', tileset, 0, 0);
        const behindPlayer = map.createLayer('BehindPlayer', tileset, 0, 0);
        
        // Locate the spawnpoint
        //const spawnpoint = map.findObject("Interactables", obj => obj.name === "Spawnpoint");
        
        // Locate the screen transition
        /*
        const screenTransitionLocation = map.findObject("Interactables", obj => obj.name === "EnterHouse");
        this.screenTransition = this.matter.add.sprite(screenTransitionLocation.x, screenTransitionLocation.y-16, 'blank')
        .setSensor(true)
        .setCollisionGroup(3)
        .setVisible(false);
        */
        // Locate the Player's spawnpoint
        const playerSpawnPoint = map.findObject("PlayerObjectLayer", obj => obj.name === "PC_Pos");

        // PLAYER GOES HERE
        //this.player = this.matter.add.sprite(playerSpawnPoint.x+config.global.GLOBAL_ENTITY_ISO_OFFSET.x, playerSpawnPoint.y+config.global.GLOBAL_ENTITY_ISO_OFFSET.y, 'player');
        let playerX = (playerSpawnPoint.x/64 - playerSpawnPoint.y/32) * this.TILE_WIDTH_HALF + 200;
        let playerY = (playerSpawnPoint.x/64 + playerSpawnPoint.y/32) * this.TILE_HEIGHT_HALF + 50;
        this.player = new PC(this, playerX, playerY, 'player', "Liam", 10, 100, 20, 20, 20, 20, 20, 20, 20, [20]);
        this.player.inBattle = true;
        console.log(playerSpawnPoint.x, playerSpawnPoint.y);
        console.log(config.global.GLOBAL_ENTITY_ISO_OFFSET.x, config.global.GLOBAL_ENTITY_ISO_OFFSET.y);
        
        this.playerX = playerX;
        this.playerY = playerY;

        // Create the layers after the player
        const inFrontOfPlayer = map.createLayer('InFrontOfPlayer', tileset, 0, 0);
        
        // Since we aren't moving the player, we don't need collisions

        // set up animations
        const anims = this.anims;
        
        // Assign the camera to a variable to make it easier to work with
        const camera = this.cameras.main;
        // Set the bounds of the camera to be the size of the map
        camera.setBounds(config.global.GLOBAL_ISO_OFFSET.x, config.global.GLOBAL_ISO_OFFSET.y, map.widthInPixels, map.heightInPixels);
        camera.setZoom(2);

        //camera.x = playerX;
        //camera.y = playerY;
        camera.startFollow(this.player, true, 0.08, 0.08);
        
        const enemyLocations = map.filterObjects("EnemyObjectLayer", obj => obj/*.name === ""*/);
        console.log(enemyLocations);
        // Create the enemies
        this.generateEnemies(enemyLocations);

        this.currentBattle = new Battle2([this.player], this.enemies, this);

        this.createMenus(this.menus, camera);
        this.activeMenu.object.setVisible(true);
        this.menus.object.createMenuObjects();
        
        //this.textBox = new MenuBox(this, camera.x + 125, camera.y + 270, 800, 200, ["Woah.", "Scary house.", "I'm gonna have to go in, aren't I?"], 0xffffff);

        console.log(this.activeMenu);


        EventBus.emit('current-scene-ready', this);        
    }

    changeScene() {
        this.scene.start('Level2');
    }

    update() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }

        //this.currentBattle.update();

        //this.getCameraControls();
        this.currentBattle.update();
        // Update the player
        this.player.update();

        // Update the enemies
        //for (let i = 0; i < this.enemies.length; i++) {
            //this.enemies[i].update();
        //}
    }

    generateEnemies(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            let enemyX = (enemies[i].x/64 - enemies[i].y/32) * this.TILE_WIDTH_HALF + 200;
            let enemyY = (enemies[i].x/64 + enemies[i].y/32) * this.TILE_HEIGHT_HALF + 50;
            //let enemy = new Entity(Phaser.Math.Between(0, 1024), Phaser.Math.Between(0, 768), 'enemy');
            //let enemy = new Enemy(this, enemies[i].x, enemies[i].y, 0, 0, 'enemy');
            let enemy = new Enemy(this, enemyX, enemyY, 'enemy', 'Enemy', 10, 100, 100, 10, 10, 10, 10, 10, 10);
            //this.add.text(enemyX, enemyY, (i+1), {font: 'bold 10px Arial', fill: '#FFFFFF'});
            //this.physics.add.existing(enemy);
            //let enemy = this.matter.add.sprite(Phaser.Math.Between(0, 1024), Phaser.Math.Between(0, 768), 'enemy');
            //enemy.setFixedRotation();
            //enemy.name = "Enemy";
            enemy.setSensor(true);
            enemy.setCollisionGroup(2);
            this.enemies.push(enemy);
        }
        console.log(this.enemies);
    }

    createMenus(menuBranch, camera) {
        try {
            let menuKeys = [];
            menuKeys = Object.keys(menuBranch.options);

            let longestMenuItem = 0;
            for (let i = 0; i < menuKeys.length; i++) {
                if (menuKeys[i].length > longestMenuItem) {
                    longestMenuItem = menuKeys[i].length;
                }
            }

            menuBranch.object = new MenuBox(this, camera.x + 180, camera.y + 120, 20*longestMenuItem, 35*menuKeys.length, menuKeys, 0x000000, {font: 'bold 15px Arial'});
            this.add.existing(menuBranch.object);
            //console.log(menuBranch);
            //console.log(menuBranch.object);
            //console.log(menuKeys);
            menuBranch.object.setVisible(false);
            
            //console.log("Creating menus");
            
            for (let i = 0; i < menuKeys.length; i++) {
                //console.log("Creating menu");
                //console.log(menuBranch.options[menuKeys[i]]);
                this.createMenus(menuBranch.options[menuKeys[i]], camera);
            }
            
        } catch (error) {
            console.log(error);
            try {
                let longestMenuItem = 0;
                for (let i = 0; i < menuBranch.items.length; i++) {
                    if (menuBranch.items[i].length > longestMenuItem) {
                        longestMenuItem = menuBranch.items[i].length;
                    }
                }

                menuBranch.object = new MenuBox(this, camera.x + 180, camera.y + 120, 20*longestMenuItem, 50 + 22*menuBranch.items.length, menuBranch.items, 0x000000, {font: 'bold 15px Arial'});
                menuBranch.object.setVisible(false);
                this.add.existing(menuBranch.object);
                //console.log(menuBranch.object);
            } catch (error) {
                console.log(error);
            }
        }
    }
}