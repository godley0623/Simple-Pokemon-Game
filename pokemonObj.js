import genOnePkmn from './data/genone_pkmn.json' assert {type: 'json'};
import genTwoPkmn from './data/gentwo_pkmn.json' assert {type: 'json'};
import genThreePkmn from './data/genthree_pkmn.json' assert {type: 'json'};

const genOneStarters = [genOnePkmn.bulbasaur, genOnePkmn.charmander, genOnePkmn.squirtle]
const genOneLowLvl = []
const genOneMidLvl = []
const genOneHighLvl = []

for (const [key, value] of Object.entries(genOnePkmn)) {
    if (value.atk <= 5) { 
        genOneLowLvl.push(genOnePkmn[`${value.name}`])
    } else if (value.atk > 5 && value.atk <= 7) {
        genOneMidLvl.push(genOnePkmn[`${value.name}`])
    } else {
        genOneHighLvl.push(genOnePkmn[`${value.name}`])
    }
}

for (const [key, value] of Object.entries(genTwoPkmn)) {
    if (value.atk <= 5) { 
        genOneLowLvl.push(genTwoPkmn[`${value.name}`])
    } else if (value.atk > 5 && value.atk <= 7) {
        genOneMidLvl.push(genTwoPkmn[`${value.name}`])
    } else {
        genOneHighLvl.push(genTwoPkmn[`${value.name}`])
    }
}

for (const [key, value] of Object.entries(genThreePkmn)) {
    if (value.atk <= 5) { 
        genOneLowLvl.push(genThreePkmn[`${value.name}`])
    } else if (value.atk > 5 && value.atk <= 7) {
        genOneMidLvl.push(genThreePkmn[`${value.name}`])
    } else {
        genOneHighLvl.push(genThreePkmn[`${value.name}`])
    }
}

/*----- Exports -----*/
export const starterPkmn = genOneStarters;
export const lowLvlPkmn = genOneLowLvl;
export const midLvlPkmn = genOneMidLvl;
export const highLvlPkmn = genOneHighLvl;
export const allPkmn = genOnePkmn;
export function capFirstLetter(str) {
    const firstLetter = str.charAt(0)

    const firstLetterCap = firstLetter.toUpperCase()

    const remainingLetters = str.slice(1)

    return firstLetterCap + remainingLetters
}

export function choose (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
    
}

export function addMoves(pkmn, types = []) {
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

/*----- Functions -----*/
function getMoves (type) {
    let moves = [];
    
    moves.push(capFirstLetter(type[0]));
    if (type[1] !== 'none') {
        moves.push(capFirstLetter(type[1]));
    }
    
    return moves;
}

function typeCheck (data) {
    try {
        return [data.types[0].type.name, data.types[1].type.name];
    }
    catch(error) {
        return [data.types[0].type.name, 'none'];
    }
}
