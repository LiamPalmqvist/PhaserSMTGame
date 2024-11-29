class MenuBox extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, width, height, textArray, colour, textStyle)
    {
        super(scene, x, y);

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.textArray = textArray;
        this.colour = colour;
        this.style = textStyle;

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

        this.setScrollFactor(0);

    }

    showMenuObjects() {

        console.log("Showing MENU OBJECTS");

        this.cursorIndex = 0;

        // Clear the menu objects to prevent duplicates
        for (let i = 0; i < this.menuText.length; i++) {
            this.menuText[i].destroy();
        }
        this.menuText = [];
        for (let i = 0; i < this.cursors.length; i++) {
            this.cursors[i].destroy();
        }
        this.cursors = [];

        const newText = this.scene.add.text(this.x + 20, this.y + 20, "MENU", this.style);
        this.menuText.push(newText);
        this.add(newText);

        // Create the menu objects
        for (let i = 0; i < this.textArray.length; i++) {
            let text = this.scene.add.text(this.x + 30, this.y + 50 + (i * 20), this.textArray[i], this.style);
            this.menuText.push(text);
            this.add(text);
        }
        
        for (let i = 0; i < this.textArray.length; i++) {
            console.log("Creating cursor");
            let cursor = this.scene.add.text(this.x + 15, this.y + 50 + (i * 20), ">", this.style);
            this.cursors.push(cursor);
            this.add(cursor);
            cursor.setVisible(false);
        }
        // Create the cursor
        //let cursor = this.scene.add.text(this.x - this.width/4, this.y - this.height + 130, ">", this.style);

        // Set the first cursor to be visible
        this.cursors[this.cursorIndex].setVisible(true);
        console.log(this.cursors[this.cursorIndex].x, this.cursors[this.cursorIndex].y);
        console.log(this.cursors);
    }

    incrementCursor() {
        // First set the current cursor to be invisible
        this.cursors[this.cursorIndex].setVisible(false);
        // Increment the cursor index
        this.cursorIndex++;
        // Check if the cursor index is out of bounds
        if (this.cursorIndex >= this.textArray.length) {
            // If it is, set it to the last index
            this.cursorIndex = this.textArray.length - 1;
        }
        // Set the new cursor to be visible
        this.cursors[this.cursorIndex].setVisible(true);

        //console.log(this.cursors[this.cursorIndex]);
        //console.log(this.cursorIndex);
    }

    decrementCursor() {
        // Set the current cursor to be invisible
        this.cursors[this.cursorIndex].setVisible(false);
        // Decrement the cursor index
        this.cursorIndex--;
        // Check if the cursor index is out of bounds
        if (this.cursorIndex < 0) {
            // If it is, set it to the first index
            this.cursorIndex = 0;
        }
        // Set the new cursor to be visible
        this.cursors[this.cursorIndex].setVisible(true);

        //console.log(this.cursors[this.cursorIndex]);
        //console.log(this.cursorIndex);
    }

    selectOption() {
        console.log("Selecting option");
        try {
            console.log(this.scene.activeMenu.items[this.cursorIndex]);
            console.log("No menu found");
            //console.log(this.scene.activeMenu.items);
        } catch (error) {
            //console.log(this.cursorIndex);
            //console.log(this.textArray[this.cursorIndex]);
            this.scene.activeMenu.object.setVisible(false);
            this.scene.activeMenu = this.scene.activeMenu.options[this.textArray[this.cursorIndex]];
            this.scene.activeMenu.object.showMenuObjects();
            this.scene.activeMenu.object.setVisible(true);
            //console.log(this.scene.activeMenu);
            console.log("Found menu");
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