// Global variables

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
        enemyTypes: null,
        pc: { 
            name: 'Player',
            level: 1,
            maxHp: 100,
            maxSp: 50,
            st: 10,
            ma: 10,
            sp: 10,
            lu: 10,
            ag: 10,
            en: 10,
            moveIDs: [1, 2, 3],
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