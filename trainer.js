import genOnePkmn from './data/genone_pkmn.json' assert {type: 'json'}

function addMoves(pkmn, types = []) {
    if (types.length === 0) {
        const types = ["Fire", "Water", "Grass", "Electric", "Normal", "Flying", "Bug", "Poison", "Rock", "Ground", "Fighting", "Psychic", "Ghost", "Dark", "Steel", "Fairy", "Ice", "Dragon"];
        let amount = 2
        let dupe = true;
        let moveTypes = pkmn.moves.join(' ');
        let randType;

        while (amount > 0) {
            dupe = true
            while (dupe) {
                //get the array of types and weakness from the weakness script
                randType = choose(types);
                if (!moveTypes.includes(randType)) {
                    pkmn.moves.push(randType);
                    dupe = false;
                    moveTypes = moveTypes + ' ' + randType;
                    amount--;
                }

            }
        }
    } else {
        for (let i = 0; i < types.length; i++) {
            pkmn.moves.push(types[i]);
        }
    }
}

export class GymLeader {
    constructor(name, sprite, badge, team) {
        this.name = name;
        this.sprite = sprite;
        this.badge = badge;
        this.team = team;
        this.fullTeam = [];

        this.formatTeam();
        this.acePkmn = this.fullTeam[5];

        this.badgeMessage = `You defeated Gym Leader ${this.name}. You've earned the ${this.badge} Badge.`
    }

    formatTeam() {
        for (let i = 0; i < this.team.length; i++) {
            for (let [key, value] of Object.entries(genOnePkmn)) {
                if (this.team[i][0] === key) {
                    this.fullTeam.push(structuredClone(value));
                    addMoves(this.fullTeam[i], [this.team[i][1], this.team[i][2]]);
                    break;
                }
            }
        }
    }

    giveBadge() {
        let badgeStr = gymBadges.join(' ');
        if (!badgeStr.includes(this.badge)) {
            gymBadges.push(this.badge);
        }
    }
}
