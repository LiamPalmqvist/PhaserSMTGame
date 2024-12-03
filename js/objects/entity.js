
class Entity extends Phaser.GameObjects.Sprite {
    
    // This creates a new phaser class
    constructor(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en, moveIDs) {
        super(scene, x, y, texture);
        this.name = name; // entity name
        this.level = level; // entity level
        this.maxhp = maxhp; // max HP
        this.currenthp = maxhp; // current HP
        this.maxsp = maxsp; // max SP
        this.currentsp = maxsp // current SP
        this.st = st; // Strength
        this.ma = ma; // Magic
        this.sp = sp; // Speed
        this.lu = lu; // Luck
        this.ag = ag; // Accuracy
        this.en = en; // Endurance
        this.moveIDs = moveIDs; // array of move IDs
        this.scene.matter.add.gameObject(this);
        this.scene.add.existing(this);
        this.tag = "Entity";
    }

    kill() {
        this.destroy();
    }

    calculateLevelDifferenceMultipler(entity) {
        // calculates the damage multiplier to use based on the difference in level between the attacker and defender
        let difference = this.level-entity.level;
        //console.log("difference: ",difference);
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

class Enemy extends Entity {
    constructor(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en, moveIDs) {
        super(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en, moveIDs)
        this.tag = "Enemy";

        this.attacking = false;
        this.chosenAttack = 0;
        this.chosenTarget = 0;
    }

    preload() {
        this.on('animationcomplete', () => {
            //this.scene.currentBattle.currentTurn++;
           //console.log("Done");
        });
    }

    update() {
        if (this.currenthp > 0) {
            this.anims.play(this.name+'-idle-anim', true);
            
            if (this.attacking) {
                //console.log("Trying to attack");
                try {
                    this.chosenAttack = Math.floor(Math.random() * this.moveIDs.length);
                    // console.log(this.chosenAttack);
                    // console.log(this.scene.currentBattle.party1);
                    this.chosenTarget = Math.floor(Math.random() * this.scene.currentBattle.party1.length);
                    // console.log("Chosen target:", this.chosenTarget);
                    this.attack(this.scene.currentBattle.party1[this.chosenTarget], this.moveIDs[this.chosenAttack]);
                    //this.scene.currentBattle.playAnimation(this, this.scene.currentBattle.party1[this.chosenTarget], this.moveIDs[this.chosenAttack], true);
                    this.attacking = false;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    attack(entity, skillID) {
        try {
            // console.log(this.scene.currentBattle.currentTurn);
            // console.log("trying to attack 2");
            let skill = new Skill(skillID);
            // console.log(skillID);
            // console.log(skill);

            // console.log("Entity: ", entity);

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

            // console.log(didHit ? "Hit" : "Didn't hit");
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

            if (skill.basePower === 0) {
                // console.log("No base power");
                return;
            }

            // console.log("Skill type: ", skill.type)
            // console.log("affinity, skill.basePower, offence, this.en, armourDefence, levelDifference");
            // console.log(affinity, skill.basePower, offence, this.en, armourDefence, levelDifference);
            // console.log(8*this.en*armourDefence);
            // console.log((8*this.en*armourDefence) * 9 * levelDifference);
            // console.log(offence/(8*this.en*armourDefence) * 9 * levelDifference);
            // console.log(skill.basePower * 6 * (offence / (8*this.en * armourDefence) * 9 * levelDifference));
            // FINAL DAMAGE CALCULATION
            let damage = Math.floor(affinity * Math.sqrt(skill.basePower * 6 * (offence / (8*this.en * armourDefence) * 9 * levelDifference)-10) * 10)
            //console.log("Damage: ", damage)
            // ==============================================
            // ================DAMAGE ENTITY=================
            // ==============================================

            if (didHit) {
                if (entity.currenthp - damage < 0) {
                    entity.currenthp = 0;
                    console.log("dead");
                } else {
                    entity.currenthp -= damage;
                }
                // console.log("Entity HP: ", entity.currenthp);
                // console.log("Damage: ", damage);
                console.log(this.name, "attacked", entity.name, "with", skill.name, "for", damage, "damage");
            } else {
                console.log(this.name, "attacked", entity.name, "with", skill.name, "but missed");
            }
            this.scene.currentBattle.playAnimation(this, entity, skillID, didHit);
        } catch (error) {
            console.log(error);
        }
    }

}

class PC extends Entity {

    constructor(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en, moveIDs) {
        // This will set values to those of the Persona's once made
        super(scene, x, y, texture, name, level, maxhp, maxsp, st, ma, sp, lu, ag, en, moveIDs)
        // the "this" keyword refers to the current scene

        this.tag = "Player";

        this.sprinting = 1;

        this.speed = 2.5;

        this.attacking = false;

        this.overworldAttack = false;

        this.collidingWith = [];

        this.inBattle = false;

        this.choosingSkill = false;
        this.choosingTarget = false;

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

        this.enemySelected = 0;

        // Set up the player animations
        this.on('animationcomplete', () => {
            this.overworldAttack = false;
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

    update() {
        /* input */
        // Get angular velocity of the player
        this.prevVelocity = this.scene.player.getAngularVelocity();
        
        this.scene.player.setVelocity(0);
        // if the player isn't in battle
        if(!this.inBattle) {
            // If the Menu is visible
            if (this.scene.menuBoxVisible) {
                this.handleMenuInput(this.scene.activeMenu);
            // If the dialogue box is visible
            } else if (this.scene.textBoxVisible) {
                this.handleDialogueInput();
            // If nothing is visible
            } else {
                this.handleOverworldInput();
            }
        // if the player is in battle
        } else { 
            if (this.currenthp !== undefined && this.currenthp > 0) {
                this.anims.play(this.name+'-idle-anim', true);
                // if it's the player's turn
                if (this.scene.currentBattle.turnOrder[this.scene.currentBattle.currentTurn] === this) {
                    //console.log("In battle");
                    //this.scene.activeMenu.object.setVisible(true);
    
                    //this.handleMenuInput(this.scene.activeMenu);
                    this.handleBattleInput(this.scene.activeMenu);
                } else {
                    //console.log("Not Player's turn");
                    this.scene.currentBattle.playerChoosing = false;
                    this.scene.enemySelector.setVisible(false);
                    return;
                }
            } else {
                console.log("Fuck you")
                //this.anims.play(this.name+'-dead-anim', true);
            }
        }
    }

    handleOverworldInput() {

        if (this.overworldAttack) {
            for (let i = 0; i < this.collidingWith.length; i++) {
                this.collidingWith[i].destroy();
                this.scene.startBattle([this.collidingWith[i]*4]);
                this.collidingWith.splice(i, 1);
            };

            return;
        }

        // Attack
        if (this.KeyObjects.attack.isDown) {
            this.overworldAttack = true;
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
            this.scene.activeMenu.object.setVisible(true);
            this.scene.activeMenu.object.createMenuObjects();
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

    handleMenuInput(activeMenu) {
        
        if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
            console.log(activeMenu);
            activeMenu.object.setVisible(false);
            if (activeMenu.topLevel) {
                this.scene.menuBoxVisible = false;
            } else {
                this.scene.activeMenu = this.scene.menus;
                this.scene.activeMenu.object.setVisible(true);
            }
            this.KeyObjects.Holding.showMenu = true;
        } else if (this.KeyObjects.showMenu.isUp) {
            this.KeyObjects.Holding.showMenu = false;
        }

        // Menu navigation
        if (this.KeyObjects.up.isDown && !this.KeyObjects.Holding.up) {
            //console.log(activeMenu);
            console.log(activeMenu);
            activeMenu.object.decrementCursor();
            //console.log("up");
        } else if (this.KeyObjects.down.isDown && !this.KeyObjects.Holding.down) {
            activeMenu.object.incrementCursor();
            //console.log("down");
        }

        // Enter key
        if (this.KeyObjects.playText.isDown && !this.KeyObjects.Holding.playText) {
            activeMenu.object.selectOption();
            this.KeyObjects.Holding.playText = true;
        }
        
        if (this.KeyObjects.up.isDown) {
            this.KeyObjects.Holding.up = true;
        }
        if (this.KeyObjects.up.isUp) {
            this.KeyObjects.Holding.up = false;
        }
        if (this.KeyObjects.down.isDown) {
            this.KeyObjects.Holding.down = true;
        }
        if (this.KeyObjects.down.isUp) {
            this.KeyObjects.Holding.down = false;
        }
        if (this.KeyObjects.playText.isDown) {
            this.KeyObjects.Holding.playText = true;
        }
        if (this.KeyObjects.playText.isUp) {
            this.KeyObjects.Holding.playText = false;
        }
    }

    handleBattleInput(activeMenu) {
        if (this.choosingSkill) {

            if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
                console.log(activeMenu);
                if (activeMenu.topLevel) {
                    // this.scene.menuBoxVisible = false;
                    return;
                } else {
                    console.log("selecting enemy");
                    activeMenu.object.setVisible(false);
                    this.scene.activeMenu = this.scene.menus;
                    this.scene.activeMenu.object.setVisible(true);
                }
                this.KeyObjects.Holding.showMenu = true;
            } else if (this.KeyObjects.showMenu.isUp) {
                this.KeyObjects.Holding.showMenu = false;
            }
            
            // Menu navigation
            if (this.KeyObjects.up.isDown && !this.KeyObjects.Holding.up) {
                //console.log(activeMenu);
                //console.log(activeMenu.title);
                activeMenu.object.decrementCursor();
                //console.log("up");
            } else if (this.KeyObjects.down.isDown && !this.KeyObjects.Holding.down) {
                //console.log(this.activeMenu.options[this.activeMenu.cursorIndex]);
                activeMenu.object.incrementCursor();
                //console.log("down");
            }
            // Enter key - When the player selects an option
            if (this.KeyObjects.playText.isDown && !this.KeyObjects.Holding.playText) {
                this.KeyObjects.Holding.playText = true;
                this.selectedOption = activeMenu.object.selectOption();
                if (this.selectedOption !== undefined) {
                    this.choosingSkill = false;
                    this.choosingTarget = true;
                    this.scene.enemySelector.setVisible(true);
                    this.enemySelected = 0;
                    activeMenu.object.setVisible(false);
                    this.KeyObjects.Holding.playText = false;
                }
                //console.log("selected option:", this.selectedOption);
            }

        // When the player has selected an option
        } else if (this.choosingTarget) {

            if (this.KeyObjects.showMenu.isDown && !this.KeyObjects.Holding.showMenu) {
                this.scene.enemySelector.setVisible(false);
                activeMenu.object.setVisible(true);
                this.choosingTarget = false;
                this.choosingSkill = true;
            } else if (this.KeyObjects.showMenu.isUp) {
                this.KeyObjects.Holding.showMenu = false;
            }
            
            // Menu navigation
            if (this.KeyObjects.right.isDown && !this.KeyObjects.Holding.right) {
                if (this.enemySelected < this.scene.enemies.length - 1) {
                    this.enemySelected++;
                    this.scene.enemySelector.x = this.scene.enemies[this.enemySelected].x;
                    this.scene.enemySelector.y = this.scene.enemies[this.enemySelected].y-30;
                }
                //console.log(activeMenu);
                //console.log(activeMenu.title);
                //activeMenu.object.decrementCursor();
                //console.log("up");
            } else if (this.KeyObjects.left.isDown && !this.KeyObjects.Holding.left) {
                if (this.enemySelected > 0) {
                    this.enemySelected--;
                    this.scene.enemySelector.x = this.scene.enemies[this.enemySelected].x;
                    this.scene.enemySelector.y = this.scene.enemies[this.enemySelected].y-30;
                }
                //console.log(this.activeMenu.options[this.activeMenu.cursorIndex]);
                //activeMenu.object.incrementCursor();
                //console.log("down");
            }
            // Enter key - When the player selects an option
            if (this.KeyObjects.playText.isDown && !this.KeyObjects.Holding.playText) {
                this.KeyObjects.Holding.playText = true;
                this.selectedEnemy = this.scene.enemies[this.enemySelected];
                //console.log("selected option:", this.selectedEnemy, "selected skill:", this.selectedOption);
                this.attack(this.selectedEnemy, this.selectedOption);
            }
     
        }
        
        
        if (this.KeyObjects.up.isDown) {
            this.KeyObjects.Holding.up = true;
        }
        if (this.KeyObjects.up.isUp) {
            this.KeyObjects.Holding.up = false;
        }
        if (this.KeyObjects.down.isDown) {
            this.KeyObjects.Holding.down = true;
        }
        if (this.KeyObjects.down.isUp) {
            this.KeyObjects.Holding.down = false;
        }
        if (this.KeyObjects.left.isDown) {
            this.KeyObjects.Holding.left = true;
        }
        if (this.KeyObjects.left.isUp) {
            this.KeyObjects.Holding.left = false;
        }
        if (this.KeyObjects.right.isDown) {
            this.KeyObjects.Holding.right = true;
        }
        if (this.KeyObjects.right.isUp) {
            this.KeyObjects.Holding.right = false;
        }
        if (this.KeyObjects.playText.isDown) {
            this.KeyObjects.Holding.playText = true;
        }
        if (this.KeyObjects.playText.isUp) {
            this.KeyObjects.Holding.playText = false;
        }
        if (this.KeyObjects.showMenu.isDown) {
            this.KeyObjects.Holding.showMenu = true;
        }
        if (this.KeyObjects.showMenu.isUp) {
            this.KeyObjects.Holding.showMenu = false;
        }
    
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

        //console.log(didHit? "Hit" : "Didn't hit");
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
            if (entity.currenthp - damage < 0) {
                entity.currenthp = 0;
            } else {
                entity.currenthp -= damage;
            }  
            console.log(this.name, "attacked", entity.name, "with", skill.name, "for", damage, "damage");
            //console.log(entity.name + " HP: ", entity.currenthp);
        } else {
            console.log(this.name, "attacked", entity.name, "with", skill.name, "but missed");
        }
        this.scene.currentBattle.playAnimation(this, entity, skillID, didHit);
    }
}