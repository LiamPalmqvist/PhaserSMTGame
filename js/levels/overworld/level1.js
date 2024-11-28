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
        this.textBox = new MenuBox(this, camera.x, camera.y, 800, 200, ["Woah.", "Scary house.", "I'm gonna have to go in, aren't I?"], "0x000000");
        this.textBox.setVisible(false);

        this.menuBox = new MenuBox(this, camera.x, camera.y, 200, 500, ["Item", "Equip", "Status", "Save", "Quit"], "0x000000");
        this.menuBox.setVisible(false);

        EventBus.emit('current-scene-ready', this);        
    }

    changeScene() {
        this.scene.start('Level2');
    }

    update() {
        /* input */
        
        // config before checks
        //console.log(this.textBoxVisible);
        this.textBox.setPosition(this.cameras.main.x + 140, this.cameras.main.scrollY + 530);
        this.menuBox.setPosition(this.cameras.main.x + 65, this.cameras.main.scrollY + 170);
        
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

        if (this.menuBoxVisible) {
            this.menuBox.setVisible(true);
        }
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