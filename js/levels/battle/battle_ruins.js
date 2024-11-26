class Battle_Ruins extends Phaser.Scene {
    
    player;
    KeyObjects;
    MenuKeyObjects;
    controllingMenu;
    cameraTracking;

    constructor() {
        super('Battle_Ruins');
    }
    
    // This function is the function that loads the assets
    preload ()
    {

    }

    // This function loads initial game logic
    // And initiates all the game objects
    async create() {

        // Create the map
        const map = this.make.tilemap({ key: 'battle_ruins' });
        const tileset = map.addTilesetImage('grassland_tiles', 'iso_tiles2');

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
       const playerSpawnPoint = map.findObject("PlayerObjectLayer", obj => obj.name === "PC_Pos");

        // PLAYER GOES HERE
        this.player = this.matter.add.sprite(playerSpawnPoint.x+config.global.GLOBAL_ENTITY_ISO_OFFSET.x, playerSpawnPoint.y+config.global.GLOBAL_ENTITY_ISO_OFFSET.y, 'player');
        console.log(playerSpawnPoint.x, playerSpawnPoint.y);
        console.log(config.global.GLOBAL_ENTITY_ISO_OFFSET.x, config.global.GLOBAL_ENTITY_ISO_OFFSET.y);
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
        //camera.startFollow(this.player);

        /*
        // Set up the player animations
        this.player.on('animationcomplete', () => {
            this.attacking = false;
            console.log("Done")
        });

        this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {  
            if (bodyA.gameObject === this.screenTransition)
            {
                console.log("Collision with screen transition");
                this.changeScene();
            }

            if (bodyA.gameObject instanceof Entity) {
                console.log("Collision with enemy");
                this.collidingWith.push(bodyA.gameObject);
                console.log(this.collidingWith);
            
            } else if (bodyB.gameObject instanceof Entity) {
                console.log("Collision with enemy");
                this.collidingWith.push(bodyB.gameObject);
                console.log(this.collidingWith);
                
            }
        });

        this.matter.world.on("collisionend", (event, bodyA, bodyB) => {
            if (bodyA.gameObject === this.player || bodyB.gameObject === this.player) {
                return;
            }

            if (bodyA.gameObject instanceof Entity) {
                this.collidingWith = this.collidingWith.filter(entity => entity !== bodyA.gameObject);
                console.log("Uncollision with enemy");
                console.log(this.collidingWith);

            } else if (bodyB.gameObject instanceof Entity) {
                this.collidingWith = this.collidingWith.filter(entity => entity !== bodyB.gameObject);
                console.log("Uncollision with enemy");
                console.log(this.collidingWith);

            }
        });
        */
        EventBus.emit('current-scene-ready', this);        
    }

    changeScene() {
        this.scene.start('Level2');
    }

    update() {

        // Update the player
        //this.player.update();

        // Update the enemies
        //for (let i = 0; i < this.enemies.length; i++) {
            //this.enemies[i].update();
        //}
    }

    generateEnemies(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            //let enemy = new Entity(Phaser.Math.Between(0, 1024), Phaser.Math.Between(0, 768), 'enemy');
            let enemy = new Entity(this, enemies[i].x, enemies[i].y, 'enemy');
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
}