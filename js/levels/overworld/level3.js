class Level3 extends Phaser.Scene {
    
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
        super('Level3');
    }
    
    // This function is the function that loads the assets
    preload ()
    {

        // Load data needed
        this.sprinting = 1;

        // the "this" keyword refers to the current scene
        // the "load" object is used to load assets
        //this.load.setBaseURL('assets');

        // this.load.image('sky', 'images/59a.jpg');
        // this.load.image('logo', 'sprites/');
        // this.load.image('red', 'sprites/PFP.jpg');
        // this.load.image('logo', 'sprites/PFP.jpg');

        //this.load.atlas("attack", "sprites/sheets/03.png", "sprites/sheets/03.json");

        this.MouseObjects = this.input.addPointer();

        this.inputEnabled = true;
    }

    // This function loads initial game logic
    // And initiates all the game objects
    async create() {

        // Create the map
        const map = this.make.tilemap({ key: 'level3' });
        const tileset2 = map.addTilesetImage('hyptosis_til-art-batch-2', 'tiles2');
        const tileset = map.addTilesetImage('hyptosis_tile-art-batch-4', 'tiles3');

        // Create the layers
        const floor = map.createLayer('Floor', [tileset, tileset2], 0, 0);
        const floorDecal = map.createLayer('FloorDecals', [tileset, tileset2], 0, 0);
        const wallMidSection = map.createLayer('WallMidSection', [tileset, tileset2], 0, 0);
        const wallMidSectionDecals = map.createLayer('WallMidSectionDecals', [tileset, tileset2], 0, 0);
        
        // Locate the spawnpoint
        const spawnpoint = map.findObject("Objects", obj => obj.name === "SpawnPoint");
        
        // Locate the screen transition
        //const screenTransitionLocation = map.findObject("Objects", obj => obj.name === "EnterHouse");
        // this.screenTransition = this.matter.add.sprite(screenTransitionLocation.x, screenTransitionLocation.y-16, 'blank')
        // .setSensor(true)
        // .setCollisionGroup(3)
        // .setVisible(false);

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

        const enemyLocations = map.filterObjects("EnemySpawnPoints", obj => obj.name === "");
        console.log(enemyLocations[0]);
        // Create the enemies
        this.generateEnemies(enemyLocations);
        
        // Create the layers after the player
        const collidesDecal = map.createLayer('AbovePlayer', [tileset, tileset2], 0, 0);
        const wallTops = map.createLayer('Walls/WallTops', [tileset, tileset2], 0, 0);
        const wallTops2 = map.createLayer('Walls/WallTops2', [tileset, tileset2], 0, 0);
        const wallTops3 = map.createLayer('Walls/WallTops3', [tileset, tileset2], 0, 0);
        
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


        EventBus.emit('current-scene-ready', this);        
    }

    changeScene() {
        this.scene.start('BattleScene');
    }

    update() {
        /* input */
        // Get angular velocity of the player
        this.prevVelocity = this.player.getAngularVelocity();
        
        this.player.setVelocity(0);

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