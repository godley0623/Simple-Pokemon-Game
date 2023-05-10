function getJSON(id) {
    return fetch('https://pokeapi.co/api/v2/pokemon/'+ id)
        .then(response => response.json())
}

async function getPokemon(amount, id = 1) {
    let pkmnObj;
    let pokemon = {};

    while (amount > 0) {
        const data = await getJSON(id);
        try {
            pkmnObj = {
                name: data.forms[0].name,
                type: [data.types[0].type.name, data.types[1].type.name],
                hp: Math.floor(data.stats[0].base_stat / 10) * 5,
                currentHp: Math.floor(data.stats[0].base_stat / 10) * 5,
                atk: Math.floor((Math.floor(data.stats[1].base_stat / 10) + Math.floor(data.stats[3].base_stat / 10)) / 2),
                def: Math.floor((Math.floor(data.stats[2].base_stat / 10) + Math.floor(data.stats[4].base_stat / 10)) / 2),
                spd: data.stats[5].base_stat,
                sprite: [data.sprites.versions['generation-v']['black-white'].animated.front_default, data.sprites.versions['generation-v']['black-white'].animated.back_default],
                icon: data.sprites.versions['generation-vii'].icons.front_default,
                moves: getMoves([data.types[0].type.name, data.types[1].type.name])
            };
        }
        catch(err) {
            pkmnObj = {
                name: data.forms[0].name,
                type: [data.types[0].type.name, 'none'],
                hp: Math.floor(data.stats[0].base_stat / 10) * 5,
                currentHp: Math.floor(data.stats[0].base_stat / 10) * 5,
                atk: Math.floor((Math.floor(data.stats[1].base_stat / 10) + Math.floor(data.stats[3].base_stat / 10)) / 2),
                def: Math.floor((Math.floor(data.stats[2].base_stat / 10) + Math.floor(data.stats[4].base_stat / 10)) / 2),
                spd: data.stats[5].base_stat,
                sprite: [data.sprites.versions['generation-v']['black-white'].animated.front_default, data.sprites.versions['generation-v']['black-white'].animated.back_default],
                icon: data.sprites.versions['generation-vii'].icons.front_default,
                moves: getMoves([data.types[0].type.name, 'none'])
            };        
        }
        pokemon[pkmnObj.name] = pkmnObj;
        amount--
        id++
    }
    return pokemon
}

const genOnePkmn = await getPokemon(151)
const genOneStarters = [genOnePkmn.bulbasaur, genOnePkmn.charmander, genOnePkmn.squirtle]
const genOneLowLvl = []//Object.entries(genOnePkmn).filter(([key, value]) => value.hp <= 20)
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
    if (types === []) {
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