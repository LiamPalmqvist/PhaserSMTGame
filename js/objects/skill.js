class Skill {
    constructor(id) {
        this.id = id;
        this.basePower = Number(attacks.data[id].SKILL_POWER);
        this.hitRate = Number(attacks.data[id].HIT_RATIO);
        this.type = attacks.data[id].TYPE;
    }
}