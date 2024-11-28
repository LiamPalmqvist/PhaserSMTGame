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

        this.cursorIndex = 0;

        this.cursors = [];
        this.menuText = [];

    }

    showMenuObjects() {
        console.log("Showing MENU OBJECTS");
        for (let i = 0; i < this.menuText.length; i++) {
            this.menuText[i].destroy();
        }
        for (let i = 0; i < this.cursors.length; i++) {
            this.cursors[i].destroy();
        }

        for (let i = 0; i < this.textArray.length; i++) {
            let text = this.scene.add.text((this.x - this.width/4) + 20, (this.y - this.height + 130) + (i * 20), this.textArray[i], this.style);
            this.menuText.push(text);
            this.add(text);
        }
        for (let i = 0; i < this.textArray.length; i++) {
            console.log("Creating cursor");
            let cursor = this.scene.add.text(this.x - this.width/4, this.y - this.height + 130 + (i * 20), ">", this.style);
            this.cursors.push(cursor);
            this.add(cursor);
            cursor.setVisible(false);
        }

        this.cursors[this.cursorIndex].setVisible(true);
        console.log(this.cursors[this.cursorIndex]);
    }

    incrementCursor() {
        this.cursors[this.cursorIndex].setVisible(false);
        this.cursorIndex++;
        if (this.cursorIndex >= this.textArray.length) {
            this.cursorIndex = this.textArray.length - 1;
        }
        this.cursors[this.cursorIndex].setVisible(true);
        console.log(this.cursors[this.cursorIndex]);
        console.log(this.cursorIndex);
    }

    decrementCursor() {
        this.cursors[this.cursorIndex].setVisible(false);
        this.cursorIndex--;
        if (this.cursorIndex < 0) {
            this.cursorIndex = 0;
        }
        this.cursors[this.cursorIndex].setVisible(true);
        console.log(this.cursors[this.cursorIndex]);
        console.log(this.cursorIndex);
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