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

        this.KeyObjects = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            attack: 'SPACE',
            //rotateRight: 'E',
            //rotateLeft: 'Q',
            sprint: 'SHIFT',
            //changeScene: 'SPACE'
            showMenu: 'ESC',
            showDialogue: 'T',
            playText: 'ENTER'
        });  // this.KeyObjects.up, this.KeyObjects.down, this.KeyObjects.left, this.KeyObjects.right

        this.KeyObjects.Holding = {
            up: false,
            down: false,
            left: false,
            right: false,
            attack: false,
            sprint: false,
            showMenu: false,
            showDialogue: false,
            playText: false
        }

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
        this.player = this.matter.add
        .sprite(spawnpoint.x, spawnpoint.y, 'red')
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
        this.textBox = new MenuBox(this, camera.x, camera.y, 800, 200, ["Woah.", "Scary house.", "I'm gonna have to go in, aren't I?"], "0xffffff");
        this.textBox.setVisible(false);

        this.menuBox = new MenuBox(this, camera.x, camera.y, 800, 200, ["Item", "Equip", "Status", "Save", "Quit"], "0x000000");
        this.menuBox.setVisible(false);
        
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

        EventBus.emit('current-scene-ready', this);        
    }

    changeScene() {
        this.scene.start('Level2');
    }

    update() {
        /* input */
        // Get angular velocity of the player
        this.prevVelocity = this.player.getAngularVelocity();
        
        this.player.setVelocity(0);
        
        // config before checks
        //console.log(this.textBoxVisible);
        this.textBox.setPosition(this.cameras.main.x + 140, this.cameras.main.scrollY + 530);
        this.menuBox.setPosition(this.cameras.main.x, this.cameras.main.scrollY + 530);
        
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

        if (this.menuBoxVisible) {
            this.handleMenuInput();
        } else if (this.textBoxVisible) {
            this.handleDialogueInput();
        } else {
            this.handleOverworldInput();
        }
        //console.log(this.textBox.x, this.textBox.y);
    }

    handleOverworldInput() {
        // Attack
        if (this.KeyObjects.attack.isDown) {
            this.attacking = true;
            this.player.anims.play('mc-attack-anim-1', false);
            return;
        }

        // Horizontal movement
        if (this.KeyObjects.left.isDown && this.KeyObjects.right.isDown) {
            this.player.setVelocityX(0);
        } else if (this.KeyObjects.left.isDown) {
            this.player.setVelocityX(-this.speed);
        } else if (this.KeyObjects.right.isDown) {
            this.player.setVelocityX(this.speed);
        }

        // Vertical movement
        if (this.KeyObjects.up.isDown) {
            this.player.setVelocityY(-this.speed);
        } else if (this.KeyObjects.down.isDown) {
            this.player.setVelocityY(this.speed);
        }

        
        if (this.KeyObjects.sprint.isDown) {
            this.speed = 5;
        }

        if (this.KeyObjects.sprint.isUp) {
            this.speed = 2.5;
        }

        if (this.KeyObjects.left.isDown && this.KeyObjects.right.isDown) {
            this.player.anims.play('mc-idle-anim', false);
        } else if (this.KeyObjects.up.isDown) {
            this.player.anims.play('mc-up-run-anim', true);
        } else if (this.KeyObjects.down.isDown) {
            this.player.anims.play('mc-down-run-anim', true);
        } else if (this.KeyObjects.right.isDown) {
            this.player.anims.play('mc-right-run-anim', true);
        } else if (this.KeyObjects.left.isDown) {
            this.player.anims.play('mc-left-run-anim', true);
        } else {
            this.player.anims.play('mc-idle-anim', true);
        }

        if (this.KeyObjects.left.isDown && this.KeyObjects.right.isDown) {
            return;
        } else if (this.KeyObjects.left.isDown) {
            this.player.flipX = true;
        } else if (this.KeyObjects.right.isDown) {
            this.player.flipX = false;
        }

        if (this.KeyObjects.showDialogue.isDown && !this.KeyObjects.Holding.showDialogue) {
            this.textBoxVisible = true;
            this.textBox.setVisible(true);
            this.KeyObjects.Holding.showDialogue = true;
        } else if (this.KeyObjects.showDialogue.isUp) {
            this.KeyObjects.Holding.showDialogue = false;
        }

        if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
            this.menuBoxVisible = true;
            this.menuBox.setVisible(true);
            this.KeyObjects.Holding.showMenu = true;
        } else if (this.KeyObjects.showMenu.isUp) {
            this.KeyObjects.Holding.showMenu = false;
        }
    }

    handleDialogueInput() {
        // Handles input when the dialogue box is showing
        if (this.KeyObjects.showDialogue.isDown && !this.KeyObjects.Holding.showDialogue) {
            this.textBoxVisible = false;
            this.textBox.setVisible(false);
            this.KeyObjects.Holding.showDialogue = true;
        } else if (this.KeyObjects.showDialogue.isUp) {
            this.KeyObjects.Holding.showDialogue = false;
        } 
        
        // Displaying the text in the text box
        if (this.KeyObjects.playText.isDown && !this.KeyObjects.Holding.playText) {
            this.textBox.nextText();
            this.KeyObjects.Holding.playText = true;
        } else if (this.KeyObjects.playText.isUp) {
            this.KeyObjects.Holding.playText = false;
        }
    }

    handleMenuInput() {
        if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
            this.menuBoxVisible = false;
            this.menuBox.setVisible(false);
            this.KeyObjects.Holding.showMenu = true;
        } else if (this.KeyObjects.showMenu.isUp) {
            this.KeyObjects.Holding.showMenu = false;
        }
        // if (this.KeyObjects.up.isDown) {
        //     this.textBox.changeSelection(-1);
        // } else if (this.KeyObjects.down.isDown) {
        //     this.textBox.changeSelection(1);
        // }
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