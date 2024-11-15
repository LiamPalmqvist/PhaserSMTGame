
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
    
}