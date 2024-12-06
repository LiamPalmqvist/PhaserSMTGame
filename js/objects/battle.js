class Battle2 {
    constructor(party1, party2, scene) {
        console.log(party1, party2);

        this.scene = scene;

        this.party1 = party1;
        this.party2 = party2;
        this.done = false;
        this.winners = null;
        this.currentTurn = 0;
        this.playerChoosing = false;

        this.animating = false;

        this.turnOrder = this.getTurnOrder();
    }

    

    playAnimation(origin, target, attack, didHit) { // gameObject, gameObject, string, bool
        origin.attacking = false;
        this.animating = true;
        console.log("didhit:", didHit);
        //console.log("Current turn:",this.currentTurn);
        origin.anims.chain(origin.name+"-attack-anim", true);
        if (didHit) {
            // Set the spell's position to the target's position
            this.scene.spellObject.x = target.x;
            this.scene.spellObject.y = target.y;
            // Make the spell visible
            this.scene.spellObject.setVisible(true);
            // Play the spell's animation
            this.scene.spellObject.anims.play(config.global.attacks.data[attack].TYPE+'-attack-anim', true);
            // When the animation is complete, make the spell invisible
            this.scene.spellObject.on('animationcomplete', () => {
                this.scene.spellObject.setVisible(false);
            });
            
            // Play the target's hit animation
            target.anims.play(target.name+'-hit-anim', true);
            console.log("Playing hit animation");
        } else {
            target.anims.play(target.name+'-miss-anim', true);
            this.checkIfBattleIsOver();
            //console.log("Current turn has been increased:", this.currentTurn);
            if (this.currentTurn >= this.turnOrder.length) {
                //console.log("Current turn is greater than:", this.turnOrder.length);
                this.currentTurn = 0;
            }
        }

        if (target.currenthp <= 0) {
            target.anims.chain(target.name+'-dead-anim', false);
        }

        this.scene.spellObject.on('animationcomplete', () => {
            this.checkIfBattleIsOver();
            //console.log("Current turn has been increased:", this.currentTurn);
            if (this.currentTurn >= this.turnOrder.length) {
                //console.log("Current turn is greater than:", this.turnOrder.length);
                this.currentTurn = 0;
            }
            this.turnOrder[this.currentTurn].attacking = true;
            this.animating = false;
        });
        
        this.currentTurn++;
        // wait 2 seconds
    }

    getTurnOrder() {
        let turnOrder = [];
        for (let i = 0; i < this.party1.length; i++) {
            turnOrder.push(this.party1[i]);
        }
        for (let i = 0; i < this.scene.aliveEnemies.length; i++) {
            turnOrder.push(this.scene.aliveEnemies[i]);
        }

        turnOrder.sort((a, b) => {
            return b.ag - a.ag;
        });

        console.log("Turn order:", turnOrder, this.party1, this.scene.aliveEnemies);

        return turnOrder;
    }

    checkIfBattleIsOver() {
        let party1Dead = true;
        let party2Dead = true;
        this.scene.aliveEnemies = [];

        for (let i = 0; i < this.party1.length; i++) {
            if (this.party1[i].currenthp > 0) {
                party1Dead = false;
                //console.log("Party 1 is not dead");
            }
        }

        for (let i = 0; i < this.party2.length; i++) {
            if (this.party2[i].currenthp > 0) {
                party2Dead = false;
                this.scene.aliveEnemies.push(this.party2[i]);
                //console.log("Party 2 is not dead");
            }
        }

        if (party1Dead) {
            console.log("Party 1 is dead");
            this.done = true;
            this.winners = this.party2;
            return;
        }

        if (party2Dead) {
            console.log("Party 2 is dead");
            this.done = true;
            this.winners = this.party1;
            this.scene.changeScene();
            return;
        }

        console.log("turn, Alive enemies:",this.scene.aliveEnemies, this.party2);
    }

    checkIfCurrentPlayerIsDead() {
        console.log(this.turnOrder[this.currentTurn]);
        console.log(this.turnOrder[this.currentTurn], this.turnOrder[this.currentTurn].currenthp, "hp");
        return this.turnOrder[this.currentTurn].currenthp <= 0;
    }

    showBattleMenu() {
        // Show the battle menu
        this.scene.menus.object.setVisible(true);
    }

    updateBattleGUI() {

        //console.log("Current player:", this.turnOrder[this.currentTurn]);
        //console.log("Menu before:", this.scene.menus);

        let partyMember = this.turnOrder[this.currentTurn];
        //console.log(partyMember);
        //console.log("Party 1 turn");
        this.scene.menus.options.Attack.items = [];

        for (let i = 0; i < partyMember.moveIDs.length; i++) {
            this.scene.menus.options.Attack.items.push(partyMember.moveIDs[i].toString());
        }

        this.scene.menus.options.Attack.items.slice(1);

        //console.log("Menu after:", this.scene.menus);    
    }

    update() {
        if (!this.done && !this.animating) {
            this.checkIfBattleIsOver();

            //console.log("Current turn:", this.currentTurn);
                        
            if (this.checkIfCurrentPlayerIsDead()) {
                console.log(this.turnOrder[this.currentTurn], "is dead with", this.turnOrder[this.currentTurn].currenthp, "hp");
                this.currentTurn++;
                return;
            }

            if (this.playerChoosing) {
                // sends an update to the current turn
                // This is a PC class
                this.turnOrder[this.currentTurn].update();
                return;
            }

            // sends an update to the current turn
            // This is an NPC class
            this.turnOrder[this.currentTurn].attacking = true;
            
            this.turnOrder[this.currentTurn].update();
            //console.log("Current turn:", this.turnOrder[this.currentTurn]);
            
            
            if (this.party1.includes(this.turnOrder[this.currentTurn])) {
                this.updateBattleGUI(); // This is causing problems for some reason
                this.scene.createMenus(this.scene.menus.options.Attack, this.scene.cameras.main);
                this.showBattleMenu();
                this.playerChoosing = true;
                this.turnOrder[this.currentTurn].choosingSkill = true;
                //console.log("Party 1 turn");
            }
        }
    }
}