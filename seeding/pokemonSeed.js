const fs = require('fs');

function capFirstLetter(str) {
    const firstLetter = str.charAt(0)

    const firstLetterCap = firstLetter.toUpperCase()

    const remainingLetters = str.slice(1)

    return firstLetterCap + remainingLetters
}

function typeCheck (data) {
    try {
        return [data.types[0].type.name, data.types[1].type.name];
    }
    catch(error) {
        return [data.types[0].type.name, 'none'];
    }
}

function getMoves (type) {
    let moves = [];
    
    moves.push(capFirstLetter(type[0]));
    if (type[1] !== 'none') {
        moves.push(capFirstLetter(type[1]));
    }
    
    return moves;
}

/*----- Async Functions -----*/
async function getJSON(id) {
    return fetch('https://pokeapi.co/api/v2/pokemon/'+ id)
        .then(response => response.json())
}

async function getPokemon(amount, id = 1) {
    let pkmnObj;
    let pokemon = {};
    const amountTotal = amount

    while (amount > 0) {
        const data = await getJSON(id);
        pkmnObj = {
            name: data.forms[0].name,
            type: typeCheck(data),
            hp: Math.floor(data.stats[0].base_stat / 10) * 5,
            currentHp: Math.floor(data.stats[0].base_stat / 10) * 5,
            atk: Math.floor((Math.floor(data.stats[1].base_stat / 10) + Math.floor(data.stats[3].base_stat / 10)) / 2),
            def: Math.floor((Math.floor(data.stats[2].base_stat / 10) + Math.floor(data.stats[4].base_stat / 10)) / 2),
            spd: data.stats[5].base_stat,
            sprite: [data.sprites.versions['generation-v']['black-white'].animated.front_default, data.sprites.versions['generation-v']['black-white'].animated.back_default],
            icon: data.sprites.versions['generation-vii'].icons.front_default,
            moves: getMoves(typeCheck(data))
        };
        pokemon[pkmnObj.name] = pkmnObj;
        amount--
        id++
    }
    return pokemon
}

async function savePkmnToJson(from, to, filename) {
    pkmn = await getPokemon(to, from)
    pkmnString = JSON.stringify(pkmn)

    fs.writeFile(`./data/${filename}`, pkmnString, 'utf-8', (err) => {
        if (err) {
            console.error('An error occurred while saving the file:', err);
            return;
          }
          console.log('File saved successfully.');
    })
}

savePkmnToJson(494, 650 - 494, 'genfive_pkmn.json');