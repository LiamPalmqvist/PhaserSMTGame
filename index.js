// Global variables
let attacks;

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [
        Boot,
        Preloader,
        Level1,
        Level2,
        Level3,
        Battle_Cave,
        Battle_Graveyard,
        Battle_Ruins,
        Battle_Sea,
        Battle_Shore
    ],
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: false
        }
    },
    global: {
        pc: null,
        enemies: [],
        GLOBAL_ISO_OFFSET :{
            x: -600,
            y: -100
        },
        GLOBAL_ENTITY_ISO_OFFSET : {
            x: -300,
            y: -50
        }
    }
}

const StartGame = new Phaser.Game(config);