// Global variables
let attacks;

const config = {
    type: Phaser.AUTO,
    width: 1450,
    height: 900,
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
        attacks: null,
        pc: {
            name: "Liam",
            hp: 10,
            maxHp: 10,
            mp: 100,
            maxMp: 100,
            attack: 20,
            defense: 20,
            speed: 20,
            magic: 20,
            x: null,
            y: null
        },
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