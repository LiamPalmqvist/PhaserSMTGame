class Level1 extends Phaser.Scene {
    
    player;
    KeyObjects;
    sprinting;
    attacking;
    speed = 2.5;
    prevVelocity;
    enemies = [];
    collidingWith = []
    enemyGroup;

    constructor() {
        super('Level1');
    }
    
    // This function is the function that loads the assets
    preload ()
    {
        // the "this" keyword refers to the current scene

        this.sprinting = 1;

        this.MouseObjects = this.input.addPointer();

        this.textBoxVisible = false;
        this.menuBoxVisible = false;

        this.menus = {
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
                    items: [
                        "Weapon",
                        "Armor",
                        "Accessory"
                    ]
                },
                Status: {
                    object: {},
                    topLevel: false,
                    title: "Status",
                    items: [
                        "Liam",
                        "HP: 100",
                        "MP: 20",
                        "ATK: 20",
                        "DEF: 20",
                        "MAG: 20",
                        "RES: 20",
                        "SPD: 20"
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

        this.activeMenu = this.menus;
    }

    // This function loads initial game logic
    // And initiates all the game objects
    async create() {

        // Create the map
        const map = this.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('hyptosis_tile-art-batch-1', 'tiles1');
        const tileset2 = map.addTilesetImage('hyptosis_til-art-batch-2', 'tiles2');

        // Create the layers
        const floor = map.createLayer('Floor', [tileset, tileset2], 0, 0);
        const floorDecal = map.createLayer('FloorDecal', [tileset, tileset2], 0, 0);
        const collides = map.createLayer('Collides', [tileset, tileset2], 0, 0);
        
        // Locate the spawnpoint
        const spawnpoint = map.findObject("Interactables", obj => obj.name === "Spawnpoint");
        
        // Locate the screen transition
        const screenTransitionLocation = map.findObject("Interactables", obj => obj.name === "EnterHouse");
        this.screenTransition = this.matter.add.sprite(screenTransitionLocation.x, screenTransitionLocation.y-16, 'blank')
            .setSensor(true)
            .setCollisionGroup(3)
            .setVisible(false);

        // Create the player
        this.player = new PC(this, spawnpoint.x, spawnpoint.y, 'player')
            .setSize(32, 32)
            .setFixedRotation()
            .setCollisionGroup(1);

        // Create player sword hitbox
        this.sword = this.matter.add.sprite(spawnpoint.x, spawnpoint.y, 'red')
            .setFixedRotation()
            .setSensor(true)
            .setCollisionGroup(2)
            .setSize(32, 32)
            .setVisible(false);
        
        // Create the layers after the player
        const collidesDecal = map.createLayer('CollidesDecal', [tileset, tileset2], 0, 0);
        const decal = map.createLayer('Decal', [tileset, tileset2], 0, 0);
        
        // Create the collisions
        const collisions = map.createLayer('Collision', [tileset, tileset2], 0, 0);
        collisions.setCollisionByProperty({Collides: true});
        this.matter.world.convertTilemapLayer(collisions);
        collisions.setVisible(false);
        
        // set up animations
        const anims = this.anims;
        
        // Assign the camera to a variable to make it easier to work with
        const camera = this.cameras.main;
        // Set the bounds of the camera to be the size of the map
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(this.player);
        camera.setZoom(1.5);

        // Create the Menu Box
        this.textBox = new MenuBox(this, camera.x + 125, camera.y + 270, 800, 200, ["Woah.", "Scary house.", "I'm gonna have to go in, aren't I?"], "0x000000");
        this.textBox.setVisible(false);

        //this.menuBox = new MenuBox(this, camera.x + 125, camera.y + 80, 150, 180, ["Item", "Equip", "Status", "Save", "Quit"], "0x000000", {font: 'bold 20px Arial', fill: '#FFFFFF'});
        //this.menuBox.setVisible(false);
        
        //this.menuBox.itemMenu = new MenuBox(this, camera.x + 150, camera.y + 90, 150, 180, ["Potion", "Ether", "Phoenix Down"], "0x000000", {font: 'bold 20px Arial', fill: '#FFFFFF'});
        //this.menuBox.itemMenu.setVisible(false);

        this.createMenus(this.menus, camera);
        this.activeMenu = this.menus;
        console.log(this.menus);

        EventBus.emit('current-scene-ready', this);        
    }

    changeScene() {
        this.scene.start('Level2');
    }

    update() {
        /* input */
        
        // config before checks
        //console.log(this.textBoxVisible);
        //this.textBox.setPosition(this.cameras.main.x + 140, this.cameras.main.scrollY + 530);
        //this.menuBox.setPosition(this.cameras.main.x + 65, this.cameras.main.scrollY + 170);
        
        // Set the sword position
        if (this.player.flipX) {
            this.sword.setPosition(this.player.x-30, this.player.y);
        } else {
            this.sword.setPosition(this.player.x+30, this.player.y);
        }

        if (this.attacking) {
            for (let i = 0; i < this.collidingWith.length; i++) {
                this.collidingWith[i].destroy();
                this.collidingWith.splice(i, 1);
            };

            return;
        }

        // Handle input
        this.player.update();
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

            menuBranch.object = new MenuBox(this, camera.x + 125, camera.y + 80, 20*longestMenuItem, 35*menuKeys.length, menuKeys, "0x000000");
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
            let longestMenuItem = 0;
            for (let i = 0; i < menuBranch.items.length; i++) {
                if (menuBranch.items[i].length > longestMenuItem) {
                    longestMenuItem = menuBranch.items[i].length;
                }
            }

            menuBranch.object = new MenuBox(this, camera.x + 125, camera.y + 80, 20*longestMenuItem, 50 + 22*menuBranch.items.length, menuBranch.items, "0x000000");
            menuBranch.object.setVisible(false);
            this.add.existing(menuBranch.object);
            //console.log(menuBranch.object);
        }
    }
}