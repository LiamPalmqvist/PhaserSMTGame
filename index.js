// Global variables
let attacks;

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [
        Boot,
        Preloader,
        Game
    ],
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: false
        }
    },
    global: [
        pc = null,
        enemies = []
    ]    
}

const StartGame = new Phaser.Game(config);