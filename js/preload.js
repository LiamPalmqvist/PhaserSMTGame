class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });

        //this.pc = new PC(this, game.config.width/2, game.config.height/2, "logo", "Liam", 10, 100, 20, 20, 20, 20, 20, 20, 20)
        //    .setDisplaySize(32, 32);
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        
        // Load images
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        this.load.image('blank', 'sprites/Blank50x57.png');

        // Load spritesheets
        this.load.json('data', 'data/attacks.json');


        // Load spritesheets & maps
        this.load.image('tiles1', 'tiles/hyptosis_tile-art-batch-1.png');
        this.load.image('tiles2', 'tiles/pixil-frame-0 (1).png');
        this.load.image('tiles3', 'tiles/hyptosis_tile-art-batch-4.png');
        this.load.tilemapTiledJSON('level1', 'maps/overworld/Floor1.tmj');
        this.load.tilemapTiledJSON('level2', 'maps/overworld/Floor2.tmj');
        this.load.tilemapTiledJSON('level3', 'maps/overworld/Floor3.tmj');
        this.load.tilemapTiledJSON('finalLevel', 'maps/overworld/FinalFloor.tmj');

        // Load iso spritesheets and maps
        this.load.image('iso_tiles1', 'tiles/iso_tileset_cave_1.png');
        this.load.image('iso_tiles2', 'tiles/iso_grassland_tiles.png');
        this.load.tilemapTiledJSON('battle_cave', 'maps/battle/Battle_Cave.tmj');
        this.load.tilemapTiledJSON('battle_graveyard', 'maps/battle/Battle_Graveyard.tmj');
        this.load.tilemapTiledJSON('battle_ruins', 'maps/battle/Battle_Ruins.tmj');
        this.load.tilemapTiledJSON('battle_sea', 'maps/battle/Battle_Sea.tmj');
        this.load.tilemapTiledJSON('battle_shore', 'maps/battle/Battle_Shore.tmj');

        // Load attack animations
        let elementTypes = ["alm", "ice", "win", "ele", "lig", "fir", "dar"]
        for (let i in elementTypes) {
            console.log("attack-"+elementTypes[i]);
            this.load.spritesheet("attack-"+elementTypes[i], "tiles/Spells/"+(elementTypes[i])+".png", { frameWidth: 64, frameHeight: 64});
        }

        // Load audio

        
        // loading animations
        this.load.spritesheet('mc-run-sprites', 'tiles/Run-Sheet.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('mc-idle-sprites', 'tiles/Idle-Sheet.png', { frameWidth: 64, frameHeight: 80 });
        this.load.spritesheet('mc-attack-sprites', 'tiles/Attack-01-Sheet.png', { frameWidth: 96, frameHeight: 80 });
        this.load.spritesheet('mc-dead-sprites', 'tiles/Dead-Sheet.png', { frameWidth: 80, frameHeight: 64 });
        this.load.spritesheet('Skeleton-sprites', 'tiles/Enemies/Skeleton.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('entity-sprites', 'tiles/Enemies/Entity.png', { frameWidth: 65, frameHeight: 64 });
        this.load.spritesheet('Zombie-sprites', 'tiles/Enemies/Zombie.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('Goblin-sprites', 'tiles/Enemies/Goblin.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('Goblin_Lumberjack-sprites', 'tiles/Enemies/Goblin_lumberjack.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('arrow-sprites', 'sprites/Pointer.png', { frameWidth: 32, frameHeight: 32 });
        // Load plugins
        //this.load.plugin('DialogueModalPlugin', 'plugins/DialoguePlugin.js');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        //this.pc = new PC(this, 400, 300, 'logo', 'Liam', 10, 100, 20, 20, 20, 20, 20, 20, 20)
        //    .setDisplaySize(32, 32);

        let elementTypes = ["alm", "", "ice", "win", "ele", "lig", "", "fir", "dar"]
        for (let i = 0; i < elementTypes.length; i++) {
            this.anims.create({
                key: elementTypes[i] + "-attack-anim",
                frames: this.anims.generateFrameNumbers("attack-"+elementTypes[i], { frames: [(12*i)+0, (12*i)+1, (12*i)+2, (12*i)+3, (12*i)+4, (12*i)+5, (12*i)+6, (12*i)+7, (12*i)+8, (12*i)+9, (12*i)+10, (12*i)+11]}),
                frameRate: 10,
                repeat: 0
            })
        }

        this.anims.create({
            key: "mc-left-run-anim",
            frames: this.anims.generateFrameNumbers("mc-run-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "mc-right-run-anim",
            frames: this.anims.generateFrameNumbers("mc-run-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "mc-up-run-anim",
            frames: this.anims.generateFrameNumbers("mc-run-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "mc-down-run-anim",
            frames: this.anims.generateFrameNumbers("mc-run-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "mc-idle-anim",
            frames: this.anims.generateFrameNumbers("mc-idle-sprites", { frames: [0, 1, 2, 3, 0, 0, 0, 0, 0] }),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "mc-attack-anim-1",
            frames: this.anims.generateFrameNumbers("mc-attack-sprites", { frames: [4, 5, 6, 7, 7, 7, 7] }),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "mc-attack-anim-2",
            frames: this.anims.generateFrameNumbers("mc-attack-sprites", { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "mc-dead-anim",
            frames: this.anims.generateFrameNumbers("mc-dead-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "mc-lie-anim",
            frames: this.anims.generateFrameNumbers("mc-dead-sprites", { frames: [7] }),
            frameRate: 10,
            repeat: 1
        })
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

        this.anims.create({
            key: "entity-idle-anim",
            frames: this.anims.generateFrameNumbers("entity-sprites", { frames: [0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 10,
            repeat: 1
        })

        let enemyTypes = ["Skeleton", "Zombie", "Goblin", "Goblin_lumberjack"]

        
        this.anims.create({
            key: "Skeleton-idle-anim",
            frames: this.anims.generateFrameNumbers("Skeleton-sprites", { frames: [224, 225, 226, 227, 227, 227, 226, 225, 224, 224] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Skeleton-hit-anim",
            frames: this.anims.generateFrameNumbers("Skeleton-sprites", { frames: [244, 245, 246, 246, 245, 244] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Skeleton-attack-anim",
            frames: this.anims.generateFrameNumbers("Skeleton-sprites", { frames: [224, 225, 226, 227, 228, 229, 230, 231, 232, 233] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Skeleton-miss-anim",
            frames: this.anims.generateFrameNumbers("Skeleton-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Skeleton-dead-anim",
            frames: this.anims.generateFrameNumbers("Skeleton-sprites", { frames: [244, 245, 246, 247, 248, 249, 250, 251] }),
            frameRate: 10
        })


    
        this.anims.create({
            key: "Goblin-idle-anim",
            frames: this.anims.generateFrameNumbers("Goblin-sprites", { frames: [0, 1, 2, 3, 3, 2, 1, 0] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Goblin-hit-anim",
            frames: this.anims.generateFrameNumbers("Goblin-sprites", { frames: [33, 32] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Goblin-attack-anim",
            frames: this.anims.generateFrameNumbers("Goblin-sprites", { frames: [12, 13, 14, 15, 16, 17, 18, 19] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Goblin-miss-anim",
            frames: this.anims.generateFrameNumbers("Goblin-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Goblin-dead-anim",
            frames: this.anims.generateFrameNumbers("Goblin-sprites", { frames: [40, 41, 42, 43, 44, 45, 46, 47] }),
            frameRate: 10
        })


    
        this.anims.create({
            key: "Goblin_Lumberjack-idle-anim",
            frames: this.anims.generateFrameNumbers("Goblin_Lumberjack-sprites", { frames: [0, 1, 2, 3, 3, 2, 1, 0] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Goblin_Lumberjack-hit-anim",
            frames: this.anims.generateFrameNumbers("Goblin_Lumberjack-sprites", { frames: [30, 31] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Goblin_Lumberjack-attack-anim",
            frames: this.anims.generateFrameNumbers("Goblin_Lumberjack-sprites", { frames: [20, 21, 22, 23, 24, 25] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Goblin_Lumberjack-miss-anim",
            frames: this.anims.generateFrameNumbers("Goblin_Lumberjack-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Goblin_Lumberjack-dead-anim",
            frames: this.anims.generateFrameNumbers("Goblin_Lumberjack-sprites", { frames: [32, 33, 34, 35, 36, 37] }),
            frameRate: 10
        })


    
        this.anims.create({
            key: "Zombie-idle-anim",
            frames: this.anims.generateFrameNumbers("Zombie-sprites", { frames: [0, 1, 2, 3, 3, 2, 1, 0] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Zombie-hit-anim",
            frames: this.anims.generateFrameNumbers("Zombie-sprites", { frames: [20, 21] }),
            frameRate: 10
        })
        
        this.anims.create({
            key: "Zombie-attack-anim",
            frames: this.anims.generateFrameNumbers("Zombie-sprites", { frames: [12, 13, 14, 15, 16, 17, 18, 19] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Zombie-miss-anim",
            frames: this.anims.generateFrameNumbers("Zombie-sprites", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 10
        })

        this.anims.create({
            key: "Zombie-dead-anim",
            frames: this.anims.generateFrameNumbers("Zombie-sprites", { frames: [22, 23, 24, 25, 26, 27] }),
            frameRate: 10
        })
    

    
        this.anims.create({
            key: "selector-float-anim",
            frames: this.anims.generateFrameNumbers("arrow-sprites", { frames: [0, 1, 2, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 2, 1, 1, 0, 0] }),
            frameRate: 10
        })

        //console.log(Level1.sceneName);
        this.scene.start('Level1');
        //this.scene.start('Battle_Cave');
    }
}
