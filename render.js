/*----- Imports -----*/
import { HealthBar } from './classes/healthbar.js';

/*----- DOM Elements -----*/
const gameContainer = document.querySelector('.game-container');

/*----- Global Variables -----*/
let wildMp3 = playAudio('wild.mp3');
let gymLeaderMp3 = playAudio('gymleader.mp3');
let gymLeaderFinalMp3 = playAudio('gymleaderFinal.mp3');
let victoryMp3 = playAudio('victory.mp3');


/*----- Renders -----*/
export function renderStarterChoice(starterPkmn) {
    //Starter Div Container
    const starterDiv = document.createElement('div');
    starterDiv.classList.add('starter-pkmn-container');
    starterDiv.innerHTML = `<div class="starter-pkmn-text">Choose your starter Pokemon</div>`;
    gameContainer.append(starterDiv);

    //Creating the starter pokemon
    const pkmnDiv1 = document.createElement('div');
    pkmnDiv1.setAttribute('class', 'starter-pkmn inline-block');
    pkmnDiv1.setAttribute('id', 'pkmn-0');
    pkmnDiv1.innerHTML = `
    <img id="0" class="starter" src=${starterPkmn[0].sprite[0]}>
    `;
    starterDiv.append(pkmnDiv1);

    const pkmnDiv2 = document.createElement('div');
    pkmnDiv2.setAttribute('class', 'starter-pkmn inline-block');
    pkmnDiv2.setAttribute('id', 'pkmn-1');
    pkmnDiv2.innerHTML = `
    <img id="1" class="starter" src=${starterPkmn[1].sprite[0]}>
    `;
    starterDiv.append(pkmnDiv2);

    const pkmnDiv3 = document.createElement('div');
    pkmnDiv3.setAttribute('class', 'starter-pkmn inline-block');
    pkmnDiv3.setAttribute('id', 'pkmn-2');
    pkmnDiv3.innerHTML = `
    <img id="2" class="starter" src=${starterPkmn[2].sprite[0]}>
    `;
    starterDiv.append(pkmnDiv3);
}

export function renderMainMenu(pkmnParty) {
    //Menu Div Container
    const menuDiv = document.createElement('div');
    menuDiv.setAttribute('class', 'main-menu');
    menuDiv.innerHTML = `
    <h1 class="title">Pokemon: Simplified Version</h1>
    <p class='main-menu-text text0'>Battle Wild Pokemon</p>
    <p class='main-menu-text text1 hidden'>Battle Trainer</p>
    <p class='main-menu-text text2'>Battle Gym Leader</p>

    <p class='main-menu-text-party'>Pokemon in Party</p>
    `;
    gameContainer.append(menuDiv);

    //Show Pokemon in Party
    let pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `main-menu-party party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='main-menu-icon' src=${pkmnParty[i].icon}>
        `;
        menuDiv.append(pkmnPartyDivs[i]);
    }
}

export function renderPokemonStats(pkmn, pkmnParty) {
    //Stat Div Container
    const statDiv = document.createElement('div');
    statDiv.setAttribute('class', 'stat-container');
    statDiv.innerHTML = `
    <div class='box'></div>
    <img class='stat-pkmn-image' src='${pkmn.sprite[0]}'>
    <h3 class='stat-pkmn-name'>${capFirstLetter(pkmn.name)}</h3>
    <h3 class='stat-pkmn-type'>${structureType(pkmn.type)}</h3>
    <h4 class='stat-pkmn-stat hp'>HP: ${pkmn.hp}</h4>
    <h4 class='stat-pkmn-stat atk'>Attack: ${pkmn.atk}</h4>
    <h4 class='stat-pkmn-stat def'>Defense: ${pkmn.def}</h4>
    <h4 class='stat-pkmn-stat spd'>Speed: ${pkmn.spd}</h4>
    <h4 class='stat-pkmn-moves'>Moves: ${pkmn.moves.join(' / ')}</h4>
    <button class='stat-go-back'>Go Back</button>
    <button class='stat-release'>Release</button>
    <p class='stat-menu-text-party'>Pokemon in Party</p>
    `;
    gameContainer.append(statDiv);

    //Show Pokemon in Party
    let pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `stat-menu-party party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='stat-menu-icon' src=${pkmnParty[i].icon}>
        `;
        statDiv.append(pkmnPartyDivs[i]);
    }
}

export function renderWildBattle (pkmnLvl, pkmnParty) {
    let oppPkmn;

    let lowWild = structuredClone(pkmnLvl[0]);
    let midWild = structuredClone(pkmnLvl[1]);
    let highWild = structuredClone(pkmnLvl[2]);
    //Getting the wild pokemon to battle
    if (pkmnParty.length <= 2) {
        oppPkmn = getRandomPkmn(lowWild);     
    } else if (pkmnParty.length >= 3 && pkmnParty.length < 5) {
        oppPkmn = getRandomPkmn(choose([lowWild, midWild, midWild]));
    } else {
        oppPkmn = getRandomPkmn(choose([lowWild, midWild, midWild, midWild, highWild]));
    }
    addMoves(oppPkmn); 

    //Wild Battle Div Container
    const wildDiv = document.createElement('div');
    wildDiv.classList.add('wild-pkmn-container');
    wildDiv.innerHTML = `
    <img class="your-pkmn" src="${pkmnParty[0].sprite[1]}">
    <img class="enemy-pkmn" src="${oppPkmn.sprite[0]}">
    <img class="battle-bg" src="assets/battle_bgs/00.png">
    <div class="battle-title">A wild ${capFirstLetter(oppPkmn.name)} appeared!</div>
    <div class="battle-text"></div>
    <button class="run">Go Back</button>
    <button class="catch hidden">Catch</button>
    `;
    gameContainer.append(wildDiv);

    let pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
        `;
        wildDiv.append(pkmnPartyDivs[i]);
    }

    let movesDiv = [];
    let battleText = [];
    for (let i = 0; i < pkmnParty[0].moves.length; i++) {
        movesDiv.push(document.createElement('button'));
        movesDiv[i].innerText = pkmnParty[0].moves[i];
        movesDiv[i].setAttribute('class', `moves-button move-${i}`);
        wildDiv.append(movesDiv[i]);
    }

    let playerHpDiv = createHealthBar('player');
    wildDiv.append(playerHpDiv);
    let playerHp = new HealthBar(playerHpDiv, 100);

    let oppHpDiv = createHealthBar('opp');
    wildDiv.append(oppHpDiv);
    let oppHp = new HealthBar(oppHpDiv, 100);

    wildMp3.play();
}


export function renderGymLeaderSelection () {
    //GymLeader Selection Div Container
    const gymLeaderSDiv = document.createElement('div');
    gymLeaderSDiv.classList.add('gymleader-selection-container');
    gymLeaderSDiv.innerHTML = `
    <img id="brock" class="gymleader brock" src="assets/gymleaders/${gymBrock.sprite}">
    <img id="misty" class="gymleader misty" src="assets/gymleaders/${gymMisty.sprite}">
    <img id="surge" class="gymleader surge" src="assets/gymleaders/${gymSurge.sprite}">
    <img id="erika" class="gymleader erika" src="assets/gymleaders/${gymErika.sprite}">
    <img id="janine" class="gymleader janine" src="assets/gymleaders/${gymJanine.sprite}">
    <img id="sabrina" class="gymleader sabrina" src="assets/gymleaders/${gymSabrina.sprite}">
    <img id="blaine" class="gymleader blaine" src="assets/gymleaders/${gymBlaine.sprite}">
    <img id="giovanni" class="gymleader giovanni" src="assets/gymleaders/${gymGiovanni.sprite}">
    <h3 class="badges">Badges (${gymBadges.length}/8): ${gymBadges.join(', ')}</h3>
    <button class="go-back">Go Back</button>

    <div id="gym-details" class="brock-details hidden">
        <h2>Brock</h2>
        <h2>Rock Type Specialist</h2>
        <h2>Badge: ${gymBrock.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymBrock.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="gym-details" class="misty-details hidden">
        <h2>Misty</h2>
        <h2>Water Type Specialist</h2>
        <h2>Badge: ${gymMisty.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymMisty.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="gym-details" class="surge-details hidden">
        <h2>Lt. Surge</h2>
        <h2>Electric Type Specialist</h2>
        <h2>Badge: ${gymSurge.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymSurge.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="gym-details" class="erika-details hidden">
        <h2>Erika</h2>
        <h2>Grass Type Specialist</h2>
        <h2>Badge: ${gymErika.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymErika.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="gym-details" class="janine-details hidden">
        <h2>Janine</h2>
        <h2>Poison Type Specialist</h2>
        <h2>Badge: ${gymJanine.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymJanine.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="gym-details" class="sabrina-details hidden">
        <h2>Sabrina</h2>
        <h2>Psychic Type Specialist</h2>
        <h2>Badge: ${gymSabrina.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymSabrina.acePkmn.sprite[0]}"><h2>
    </div> 
    <div id="gym-details" class="blaine-details hidden">
        <h2>Blaine</h2>
        <h2>Fire Type Specialist</h2>
        <h2>Badge: ${gymBlaine.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymBlaine.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="gym-details" class="giovanni-details hidden">
        <h2>Giovanni</h2>
        <h2>Ground Type Specialist</h2>
        <h2>Badge: ${gymGiovanni.badge}</h2>
        <h2>Ace Pokemon: <img src="${gymGiovanni.acePkmn.sprite[0]}"><h2>
    </div>       
    `;
    gameContainer.append(gymLeaderSDiv);
}

export function renderGymLeaderBattle () {
    oppPkmn = gymTeam[0];


     //Gym Battle Div Container
     const gymDiv = document.createElement('div');
     gymDiv.classList.add('gym-container');
     gymDiv.innerHTML = `
     <img class="your-pkmn" src="${pkmnParty[0].sprite[1]}">
     <img class="enemy-pkmn" src="${oppPkmn.sprite[0]}">
     <img class="battle-bg" src="assets/battle_bgs/00.png">
     <div class="battle-title">Gym Leader ${gymleaderName} wants to battle!</div>
     <img class="trainer-img" src="assets/gymleaders/${gymleaderPlaceHolder.sprite}">
     <div class="battle-text"></div>
     <button class="leave">Go Back</button>
     `;
     gameContainer.append(gymDiv);
 
     pkmnPartyDivs = [];
     for (let i = 0; i < pkmnParty.length; i++) {
         pkmnPartyDivs.push(document.createElement('div'));
         pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
         pkmnPartyDivs[i].innerHTML = `
         <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
         `;
         gymDiv.append(pkmnPartyDivs[i]);
     }
 
     movesDiv = [];
     battleText = [];
     for (let i = 0; i < pkmnParty[0].moves.length; i++) {
         movesDiv.push(document.createElement('button'));
         movesDiv[i].innerText = pkmnParty[0].moves[i];
         movesDiv[i].setAttribute('class', `moves-button move-${i}`);
         gymDiv.append(movesDiv[i]);
     }
 
     let playerHpDiv = createHealthBar('player');
     gymDiv.append(playerHpDiv);
     playerHp = new HealthBar(playerHpDiv, 100);
 
     let oppHpDiv = createHealthBar('opp');
     gymDiv.append(oppHpDiv);
     oppHp = new HealthBar(oppHpDiv, 100);

     gymLeaderMp3.play();
}

/*----- Functions -----*/
function capFirstLetter(str) {
    const firstLetter = str.charAt(0)

    const firstLetterCap = firstLetter.toUpperCase()

    const remainingLetters = str.slice(1)

    return firstLetterCap + remainingLetters
}

function structureType(type) {
    if (type[1] != 'none') {
        let type1 = capFirstLetter(type[0]);
        let type2 = capFirstLetter(type[1]);
        return `${type1} / ${type2}`;
    }
    else {
        return capFirstLetter(type[0]);
    }
}

function getRandomPkmn (pkmnArry) {
    return pkmnArry[Math.floor(Math.random() * pkmnArry.length)]
}

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

function choose (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
    
}

function createHealthBar (owner) {
    let healthBarDiv = document.createElement('div');
    healthBarDiv.setAttribute('class', `health-bar-${owner}`);
    healthBarDiv.innerHTML = `
    <div class="health-bar-value">100%</div>
    <div class="health-bar-fill"></div>
    `;
    
    return healthBarDiv;
}

function playAudio (mp3, volume = .25) {
    let audio = new Audio(`assets/audio/${mp3}`);
    audio.volume = volume;
    
    return audio
}
function stopAudio (audio) {
    audio.pause();
    audio.currentTime = 0;
}