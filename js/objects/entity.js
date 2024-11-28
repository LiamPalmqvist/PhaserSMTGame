
class Entity extends Phaser.GameObjects.Sprite {
    
    // This creates a new phaser class
    constructor(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en) {
        super(scene, x, y, texture);
        this.name = name; // entity name
        this.level = level; // entity level
        this.maxhp = maxhp; // max HP
        this.hp = maxhp; // current HP
        this.maxsp = maxsp; // max SP
        this.sp = maxsp // current SP
        this.st = st; // Strength
        this.ma = ma; // Magic
        this.sp = sp; // Speed
        this.lu = lu; // Luck
        this.ag = ag; // Accuracy
        this.en = en; // Endurance¥
        this.scene.matter.add.gameObject(this);
        this.scene.add.existing(this);
        this.tag = "Entity";
    }

    kill() {
        this.destroy();
    }

    attack(entity, skillID) {
        let skill = new Skill(skillID);
        console.log(skill);
        // should be `let skill = new Skill(skillID)
        // temp empty entity until generating properly

        // ==============================================
        // ==============ACCURACY CHECKING===============
        // ==============================================

        // roll for accuracy
        // temp player shoe evasion var
        let shoeEvasion = 20;
        // other temp variable for affinity
        let affinity = 1;
        // other temp variable for defence
        let armourDefence = 15


        // FINAL EVASION CALCULATION
        let playerMultiplier = (entity.ag+200)/((shoeEvasion/2)+200)
        //console.log(playerMultiplier)
        //console.log(this.ag, entity.ag)
        let hitRate = Math.floor((this.ag + 200)/(entity.ag + 200) * playerMultiplier) * 100;
        //console.log("hitRate", hitRate);
        //console.log((this.ag + 200)/(entity.ag + 200) * playerMultiplier)
        // this should be 96 or lower to hit BECAUSE the skill's innate hit rate is 96
        // roll for a random number between 0 and the rolled hit rate
        let hit = Math.floor(Math.random() * 100)
        //console.log(hit)

        let didHit = hit <= hitRate;

        console.log(didHit ? "Hit" : "Didn't hit");
        // ==============================================
        // ===============ATTACK CHECKING================
        // ==============================================

        // This is calculated based on the level difference between the attacker and defender
        let levelDifference = this.calculateLevelDifferenceMultipler(entity)
        //console.log(levelDifference);
        // basic offence value
        let offence;

        // use different values if phys or mag attack
        if (skill.type === 'Str' || skill.type === "Sla" || skill.type === "Pie") {
            offence = this.st;
        } else {
            offence = this.ma;
        }
        //console.log("Offence: ", offence);

        //console.log("Skill type: ", skill.type)
        //console.log("affinity, skill.basePower, offence, this.en, armourDefence, levelDifference");
        //console.log(affinity, skill.basePower, offence, this.en, armourDefence, levelDifference);
        // FINAL DAMAGE CALCULATION
        let damage = Math.floor(affinity * Math.sqrt(skill.basePower * 6 * (offence / (8*this.en * armourDefence) * 9 * levelDifference)-10) * 10)
        //console.log("Damage: ", damage)
        // ==============================================
        // ================DAMAGE ENTITY=================
        // ==============================================

        if (didHit) {
            if (entity.hp - damage < 0) {
                entity.hp = 0;
                console.log("dead");
            } else {
                entity.hp -= damage;
            }
            console.log("Entity HP: ", entity.hp);
        } else {
            console.log("didn't hit")
        }
    }

    updatePosition() {

    }

    updateAnimation() {

    }

    calculateLevelDifferenceMultipler(entity) {
        // calculates the damage multiplier to use based on the difference in level between the attacker and defender
        let difference = this.level-entity.level;
        console.log("difference: ",difference);
        let dmgMultipler = {
            "-13":0.5,
            "-12":0.51,
            "-11":0.53,
            "-10":0.59,
            "-9":0.66,
            "-8":0.75,
            "-7":0.84,
            "-6":0.91,
            "-5":0.97,
            "-4":0.99,
            "-3":1.0,
            "-2":1.0,
            "-1":1.0,
            "0":1.0,
            "1":1.01,
            "2":1.03,
            "3":1.09,
            "4":1.16,
            "5":1.25,
            "6":1.34,
            "7":1.41,
            "8":1.47,
            "9":1.49,
            "10":1.5
        };
        if (difference < -13) {
            //console.log("Multiplier", 0.5);
            return 0.5;
        } else if (difference > 10) {
            //console.log("Multiplier",11.5);
            return 1.5;
        } else {
            //console.log("Multiplier",dmgMultipler[difference]);
            return dmgMultipler[difference];
        }
    }
}

class PC extends Entity {

    constructor(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en) {
        // This will set values to those of the Persona's once made
        super(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en)
        // the "this" keyword refers to the current scene

        this.tag = "Player";

        this.sprinting = 1;

        this.speed = 2.5;

        this.attacking = false;

        this.collidingWith = [];

        this.KeyObjects = this.scene.input.keyboard.addKeys({
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

        // Set up the player animations
        this.on('animationcomplete', () => {
            this.attacking = false;
            console.log("Done")
        });


        this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {  
            if (bodyA.gameObject === this.scene.screenTransition)
            {
                console.log("Collision with screen transition");
                this.scene.changeScene();
            }

            if (bodyA.gameObject instanceof Entity && bodyA.gameObject.tag === "Entity") {
                console.log("Collision with enemy");
                this.collidingWith.push(bodyA.gameObject);
                console.log(this.collidingWith);
            
            } else if (bodyB.gameObject instanceof Entity && bodyB.gameObject.tag === "Entity") {
                console.log("Collision with enemy");
                this.collidingWith.push(bodyB.gameObject);
                console.log(this.collidingWith);
                
            }
        });

        this.scene.matter.world.on("collisionend", (event, bodyA, bodyB) => {
            if (bodyA.gameObject === this || bodyB.gameObject === this) {
                return;
            }

            if (bodyA.gameObject instanceof Entity && bodyA.gameObject.tag === "Entity") {
                this.collidingWith = this.collidingWith.filter(entity => entity !== bodyA.gameObject);
                console.log("Uncollision with enemy");
                console.log(this.collidingWith);

            } else if (bodyB.gameObject instanceof Entity && bodyB.gameObject.tag === "Entity") {
                this.collidingWith = this.collidingWith.filter(entity => entity !== bodyB.gameObject);
                console.log("Uncollision with enemy");
                console.log(this.collidingWith);

            }
        });
    }

    attack(entity, skillID) {

        let skill = new Skill(skillID);
        console.log(skill);
        // should be `let skill = new Skill(skillID)
        // temp empty entity until generating properly

        // ==============================================
        // ==============ACCURACY CHECKING===============
        // ==============================================

        // roll for accuracy
        let hitRate = Math.floor((this.ag + 200)/(entity.ag + 200)*skill.hitRate);
        // console.log(hitRate);
        // this should be 96 or lower to hit BECAUSE the skill's innate hit rate is 96
        // roll for a random number between 0 and the rolled hit rate
        let hit = Math.floor(Math.random() * 100)

        let didHit = hit <= hitRate;

        console.log(didHit? "Hit" : "Didn't hit");
        // ==============================================
        // ===============ATTACK CHECKING================
        // ==============================================

        // This is calculated based on the level difference between the attacker and defender
        let levelDifference = this.calculateLevelDifferenceMultipler(entity)
        // basic offence value
        let offence;

        // use different values if phys or mag attack
        if (skill.type === 'Str' || skill.type === "Sla" || skill.type === "Pie") {
            offence = this.st;
        } else {
            offence = this.ma;
        }
        //console.log("Offence: ", offence);

        //console.log("Skill type: ", skill.type)
        // Temp vat for affinity
        let affinity = 1 // either 0.25, 1, or 1.25
        // FINAL DAMAGE CALCULATION
        let damage = Math.floor(Math.sqrt(skill.basePower * 15 * (offence/this.en) * 2 * levelDifference * affinity))
        //console.log("Damage: ", damage)
        // ==============================================
        // ================DAMAGE ENTITY=================
        // ==============================================

        damage = 100;

        if (didHit) {
            if (entity.hp - damage < 0) {
                entity.hp = 0;
            } else {
                entity.hp -= damage;
            }  
            console.log(entity.name + " HP: ", entity.hp);
        } else {
            console.log("didn't hit")
        }
    }

    update() {
        /* input */
        // Get angular velocity of the player
        this.prevVelocity = this.scene.player.getAngularVelocity();
        
        this.scene.player.setVelocity(0);

        if (this.scene.menuBoxVisible) {
            this.handleMenuInput();
        } else if (this.scene.textBoxVisible) {
            this.handleDialogueInput();
        } else {
            this.handleOverworldInput();
        }
    }

    handleOverworldInput() {

        if (this.attacking) {
            for (let i = 0; i < this.collidingWith.length; i++) {
                this.collidingWith[i].destroy();
                this.collidingWith.splice(i, 1);
            };

            return;
        }

        // Attack
        if (this.KeyObjects.attack.isDown) {
            this.attacking = true;
            this.anims.play('mc-attack-anim-1', false);
            return;
        }

        // Horizontal movement
        if (this.KeyObjects.left.isDown && this.KeyObjects.right.isDown) {
            this.setVelocityX(0);
        } else if (this.KeyObjects.left.isDown) {
            this.setVelocityX(-this.speed);
        } else if (this.KeyObjects.right.isDown) {
            this.setVelocityX(this.speed);
        }

        // Vertical movement
        if (this.KeyObjects.up.isDown) {
            this.setVelocityY(-this.speed);
        } else if (this.KeyObjects.down.isDown) {
            this.setVelocityY(this.speed);
        }

        
        if (this.KeyObjects.sprint.isDown) {
            this.speed = 5;
        }

        if (this.KeyObjects.sprint.isUp) {
            this.speed = 2.5;
        }

        if (this.KeyObjects.left.isDown && this.KeyObjects.right.isDown) {
            this.anims.play('mc-idle-anim', false);
        } else if (this.KeyObjects.up.isDown) {
            this.anims.play('mc-up-run-anim', true);
        } else if (this.KeyObjects.down.isDown) {
            this.anims.play('mc-down-run-anim', true);
        } else if (this.KeyObjects.right.isDown) {
            this.anims.play('mc-right-run-anim', true);
        } else if (this.KeyObjects.left.isDown) {
            this.anims.play('mc-left-run-anim', true);
        } else {
            this.anims.play('mc-idle-anim', true);
        }

        if (this.KeyObjects.left.isDown && this.KeyObjects.right.isDown) {
            return;
        } else if (this.KeyObjects.left.isDown) {
            this.flipX = true;
        } else if (this.KeyObjects.right.isDown) {
            this.flipX = false;
        }

        if (this.KeyObjects.showDialogue.isDown && !this.KeyObjects.Holding.showDialogue) {
            this.scene.textBoxVisible = true;
            this.scene.textBox.setVisible(true);
            this.KeyObjects.Holding.showDialogue = true;
        } else if (this.KeyObjects.showDialogue.isUp) {
            this.KeyObjects.Holding.showDialogue = false;
        }

        if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
            this.scene.menuBoxVisible = true;
            this.scene.menuBox.setVisible(true);
            this.KeyObjects.Holding.showMenu = true;
        } else if (this.KeyObjects.showMenu.isUp) {
            this.KeyObjects.Holding.showMenu = false;
        }
    }

    handleDialogueInput() {
        // Handles input when the dialogue box is showing
        if (this.KeyObjects.showDialogue.isDown && !this.KeyObjects.Holding.showDialogue) {
            this.scene.textBoxVisible = false;
            this.scene.textBox.setVisible(false);
            this.KeyObjects.Holding.showDialogue = true;
        } else if (this.KeyObjects.showDialogue.isUp) {
            this.KeyObjects.Holding.showDialogue = false;
        } 
        
        // Displaying the text in the text box
        if (this.KeyObjects.playText.isDown && !this.KeyObjects.Holding.playText) {
            this.scene.textBox.nextText();
            this.KeyObjects.Holding.playText = true;
        } else if (this.KeyObjects.playText.isUp) {
            this.KeyObjects.Holding.playText = false;
        }
    }

    handleMenuInput() {
        if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
            this.scene.menuBoxVisible = false;
            this.scene.menuBox.setVisible(false);
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
    
}