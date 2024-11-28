class MenuBox extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, width, height, textArray, colour)
    {
        super(scene, x, y);

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.textArray = textArray;
        this.colour = colour;

        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(colour, 1);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);

        this.add(this.graphics);

        this.text = this.scene.add.text(this.x + 10, this.y + 10, "", this.style);
        this.text.setWordWrapWidth(this.width - 20, true);
        this.add(this.text);

        this.scene.add.existing(this);

        this.textIndex = 0;
        this.previousIndex = 0;

    }

    showMenuObjects(options) {
        for (let i = 0; i < options.length; i++) {
            let text = this.scene.add.text(this.x + 10, this.y + 10 + (i * 20), options[i], this.style);
            this.add(text);
        }
    }

    animateText() // Boolean
    {
        // transfer text to text
        const newText = this.textArray[this.textIndex];
        const prevText = this.textArray[this.previousIndex];
        console.log(newText);

        // Check if the text is already displayed
        if (this.text.text.length > 0 && this.text.text !== newText && this.text.text !== prevText) { 
            return;
        }

        // Clear the text
        this.text.setText("");

        for(let i = 0; i < newText.length; i++)
        {
            setTimeout(() => {
                this.text.setText(this.text.text + newText[i]);
            }, i * 15);
        }

    
        this.previousIndex = this.textIndex;
        this.textIndex++;
        return false;
    }

    nextText()
    {
        if (this.textIndex === this.textArray.length) {
            this.textIndex = 0;
            this.setVisible(false);
            this.scene.textBoxVisible = false;   
            this.text.setText(""); 
        } else {
            this.animateText();
        }
    }
}