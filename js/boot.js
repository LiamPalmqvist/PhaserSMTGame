class Boot extends Phaser.Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        
        // Load the data for the attacks
        jQuery.ajax({
            url: "../data/attacks.json",
            dataType: 'json',
            success(response) {
                config.global.attacks = response;
            }
        })

        // Load the data for the enemy types
        jQuery.ajax({
            url: "../data/enemyTypes.json",
            dataType: 'json',
            success(response) {
                config.global.enemyTypes = response;
            }
        });
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}