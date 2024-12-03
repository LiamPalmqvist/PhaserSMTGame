class Skill {
    constructor(id) {
        let attacks = config.global.attacks;
        this.name = attacks.data[id].NAME;
        this.basePower = Number(attacks.data[id].SKILL_POWER);
        this.hitRate = Number(attacks.data[id].HIT_RATIO);
        this.type = attacks.data[id].TYPE;
    }
}