class Battle {
    constructor(team1, team2) {
        if (team1 === undefined || team2 === undefined) {
            console.log("Need members in team");
            return;
        }

        // is the battle done?
        this.done = false;

        // Team 1
        this.team1 = team1;
        this.team1PressTurns = 0;
        this.team1ActiveMember = 0;
        this.selectedAttack = 0;
        this.selectedTarget = 0;
        // Team 2, same as team 1
        this.team2 = team2;
        this.team2PressTurns = 0;
        this.team2ActiveMember = 0;

        console.log(this.team1.length)

        for (let i = 0; i < this.team1.length; ++i) {
            if (this.team1[i].hp > 0) {
                this.team1PressTurns += 1;
            }
        }
        for (let i = 0; i < this.team2.length; ++i) {
            this.team2PressTurns++;
        }

        console.log("Team 1 Press Turns: " + this.team1PressTurns);
        console.log("Team 2 Press Turns: " + this.team2PressTurns);
    }

    update() {
        // This is where the battle will actually take place
        // the battles will go in order of team (This should be in order of speed,
        // but I don't know how I should implement that right now)
        if (!this.done) {
            // while the battle isn't done

            if (this.team1PressTurns > 0) {

                if (this.team1ActiveMember >= this.team1.length) {
                    this.team1ActiveMember = 0;
                }

                
                // first check if the current active member on the team is alive
                if (this.team1[this.team1ActiveMember].hp <= 0) {
                    this.team1ActiveMember++;
                    
                    // whenever a turn is passed, check if the team is dead
                    // by checking if all members have 0 hp
                    // if one member has more than 0 hp, the battle continues
                    for (let i = 0; i < this.team1.length; ++i) {
                        if (this.team1[i].hp < 0) {
                            console.log("Team member from team 1 is dead")
                        } else {
                            return;
                        }
                        this.done = true
                        console.log("Team 2 is the winner")
                    }
                    return;
                }
                
                // if the current team has more than 0 press turns
                // this will be decreased any time a member of a team does anything
                let memberAttacked = 0;
                this.team1[this.team1ActiveMember].attack(this.team2[memberAttacked], 10);
                console.log(`${this.team1[this.team1ActiveMember].name} attacked: ${this.team2[memberAttacked].name}`);
                // actually attack a member of the enemy team (this will be chosen in the future
                // but for now it's hard coded as the first member
                this.team1ActiveMember++;
                this.team1PressTurns--;
                // increment the active member in the team
                // and decrement the amount of press turns
                if (this.team1ActiveMember < this.team1.length) {
                    this.team1ActiveMember = 0;
                }
                // after incrementing the turns, IF the last member of the team has had their turn, the team1ActiveMember
                // will be higher than the amount of members of the team, meaning it will be reset
            } else if (this.team2PressTurns > 0 && this.team1PressTurns == 0) {
                // After the first team has had their turn, IF the second team has more than 0 press turns
                // AND the first team has none

                if (this.team2ActiveMember >= this.team2.length) {
                    this.team2ActiveMember = 0;
                }

                //console.log(this.team2[this.team2ActiveMember]);

                // first check if the current active member on the team is alive
                if (this.team2[this.team2ActiveMember].hp <= 0) {
                    this.team2ActiveMember++;
                    // if, upon incrementing the active member, the active member count is equal to the amount of members
                    // on the team, the battle is over
                    for (let i = 0; i < this.team2.length; ++i) {
                        if (this.team2[i].hp < 0) {
                            console.log("Team member from team 2 is dead")
                        } else {
                            return;
                        }
                        this.done = true
                        console.log("Team 1 is the winner")
                    }
                    return;
                }

                let memberAttacked = Math.floor(Math.random() * this.team1.length);
                this.team2[this.team2ActiveMember].attack(this.team1[memberAttacked], 10);
                console.log(`${this.team2[this.team2ActiveMember].name} attacked: ${this.team1[memberAttacked].name}`);
                // allow the active member of team2 to attack
                // currently coded as a random member of the ally team.
                this.team2ActiveMember++;
                this.team2PressTurns--;
                // increment active member and decrement press turns
                if (this.team2PressTurns == 0) {
                    // if the amount of turns left in team 2 is ZERO
                    for (let i = 0; i < this.team1.length; ++i) {
                        this.team1PressTurns += 1;
                    }
                    // add the press turns back to team 1
                    for (let i = 0; i < this.team2.length; ++i) {
                        this.team2PressTurns += 1;
                    }
                    // and team 2
                    this.team2ActiveMember = 0;
                    this.team1ActiveMember = 0;
                    // and reset the active member
                }
            }
        }

    }
}