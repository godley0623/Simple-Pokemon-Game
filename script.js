//--imports--
import { starterPkmn, lowLvlPkmn, midLvlPkmn, highLvlPkmn, capFirstLetter, addMoves, choose } from "./pokemonObj.js";
import {damageCalc, speedCheck} from "./battle-mechanic.js";


//--state variables--
let gameLoop = true;

let pkmnParty = localStorage.getItem('pkmnParty');
if (pkmnParty === null) {
    pkmnParty = [];
}

console.log(pkmnParty[0]);

let gameState;
if (pkmnParty.length > 0) {
    gameState = 'main menu';
} else {
    gameState = 'choose starter';
}

let playerHp;
let oppHp;
let oppPkmn;
let battleText;

//--cached elements--
const gameContainer = document.querySelector('.game-container');

//--classes--
class HealthBar {
    constructor (element, initialValue = 100) {
        this.valueElem = element.querySelector('.health-bar-value');
        this.fillElem = element.querySelector('.health-bar-fill');

        this.setValue(initialValue);
    }

    setValue (newValue) {
        if (newValue > 100) newValue = 100;
        if (newValue < 0) newValue = 0;

        this.value = newValue;
        this.update();
    }

    update () {
        const percentage = this.value + '%';
        
        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }
}

class GymLeader {
    constructor (name, sprite, team) {
        this.name = name;
        this.sprite = sprite;
        this.team = team;
    }
}

//Gym Leaders
const brockTeam = [
    ['geodude', ''],
    ['onix', ''],
    ['ryhorn', ''],
    ['graveler', ''],
    ['rydon', ''],
    ['golem', '']
];

const gymBrock = new GymLeader ('Brock', "", brockTeam);

//--functions--
//Event Delegation
function addGlobalEventListener(type, selector, callback) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e)
    });
}

function addPkmnToParty(pkmn) {
    if (pkmnParty.length < 6) {
        pkmnParty.push(pkmn);
        let partySize = pkmnParty.length;
        addMoves(pkmnParty[partySize-1]);
        
        if (gameState === 'wild battle') {
            showBattleText(`${capFirstLetter(pkmn.name)} was added to your party`);
        }
    } else {
        alert("Your party is full")
    }
}

function getRandomPkmn (pkmnArry) {
    return pkmnArry[Math.floor(Math.random() * pkmnArry.length)]
}

function healParty () {
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnParty[i].currentHp = pkmnParty[i].hp;
    }
}

let canSwitch = true;
function switchPkmn (gameState, targetIdx, trainer) {
    if (canSwitch || trainer === 'opp') {
        canSwitch = false;
        switch (gameState) {
            case "wild battle":
                let wildDiv = document.querySelector('.wild-pkmn-container');
                let switchIn;
                [pkmnParty[0], pkmnParty[targetIdx]] = [pkmnParty[targetIdx], pkmnParty[0]]
                console.log(pkmnParty[0], pkmnParty[targetIdx]);

                //updating the pokemon battle sprite
                removeElement('.your-pkmn');
                switchIn = document.createElement('img');
                switchIn.setAttribute('class', 'your-pkmn');
                switchIn.setAttribute('src', `${pkmnParty[0].sprite[1]}`)
                wildDiv.append(switchIn);

                //updating the pokemon icon
                removeElement('.battle-party');
                pkmnPartyDivs = [];
                for (let i = 0; i < pkmnParty.length; i++) {
                    pkmnPartyDivs.push(document.createElement('div'));
                    pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
                    pkmnPartyDivs[i].innerHTML = `
                    <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
                    `;
                    wildDiv.append(pkmnPartyDivs[i]);
                }

                //updating the pokemon moves
                removeElement('moves-button');
                movesDiv = [];
                for (let i = 0; i < pkmnParty[0].moves.length; i++) {
                    movesDiv.push(document.createElement('button'));
                    movesDiv[i].innerText = pkmnParty[0].moves[i];
                    movesDiv[i].setAttribute('class', `moves-button move-${i}`);
                    wildDiv.append(movesDiv[i]);
                }

                //updating the pokemon hp
                playerHp.setValue(pkmnParty[0].currentHp / pkmnParty[0].hp * 100)

                //updating the battle text
                showBattleText(`${capFirstLetter(pkmnParty[0].name)} was sent out.`);
                showBattleText(`${capFirstLetter(pkmnParty[targetIdx].name)} was called back.`);

                //making the opponent attack if your hp wasn't 0
                if (pkmnParty[targetIdx].currentHp > 0) {
                    attacking(document.querySelector('.enemy-pkmn'), getOppAttack(oppPkmn), playerHp, oppPkmn, pkmnParty[0]);
                }

                setTimeout (() => {
                    canSwitch = true;
                }, "2000")
                break;
        }
    }
}

function attacking (img, attack, hp, attacker, defender) {
    if (attacker.currentHp > 0) {
        canAttack = false;
        canSwitch = false;

        console.log(defender)
        
        img.classList.add('enemy-attacking');
        let dmg = damageCalc(attacker, defender, attack, showBattleText);
        defender.currentHp -= dmg;
        let newHp = Math.floor(defender.currentHp / defender.hp * 100);
        hp.setValue(newHp);
        hp.update();
    
        setTimeout (() => {
        canAttack = true;
        canSwitch = true;
        img.classList.remove('enemy-attacking');
        }, "2000");
    } else {
        return;
    }
}

function getOppAttack (oppPkmn, method = 'random') {
    if (method === 'random') { 
        return choose(oppPkmn.moves);
    }
}

function showBattleText (message) {
    if (battleText.length === 4) {
        battleText.pop();
    }
    battleText.unshift(message);
    document.querySelector('.battle-text').innerText = battleText.join('\n\n');
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

function removeElement(selector) {
    let elements = document.querySelectorAll(selector);
    elements.forEach((element) => element.parentNode.removeChild(element));
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

//Renders
function renderStarterChoice() {
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

function renderMainMenu() {
    //Generate Menu Text

    //Menu Div Container
    const menuDiv = document.createElement('div');
    menuDiv.setAttribute('class', 'main-menu');
    menuDiv.innerHTML = `
    <p class='main-menu-text text0'>Battle Wild Pokemon</p>
    <p class='main-menu-text text1'>Battle Trainer</p>
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

function renderPokemonStats(pkmn) {
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

let pkmnPartyDivs;
let movesDiv;
function renderWildBattle () {
    //Getting the wild pokemon to battle
    oppPkmn = getRandomPkmn(lowLvlPkmn);

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

    pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
        `;
        wildDiv.append(pkmnPartyDivs[i]);
    }
    console.log(pkmnPartyDivs);

    movesDiv = [];
    battleText = [];
    for (let i = 0; i < pkmnParty[0].moves.length; i++) {
        movesDiv.push(document.createElement('button'));
        movesDiv[i].innerText = pkmnParty[0].moves[i];
        movesDiv[i].setAttribute('class', `moves-button move-${i}`);
        wildDiv.append(movesDiv[i]);
    }

    let playerHpDiv = createHealthBar('player');
    wildDiv.append(playerHpDiv);
    playerHp = new HealthBar(playerHpDiv, 100);

    let oppHpDiv = createHealthBar('opp');
    wildDiv.append(oppHpDiv);
    oppHp = new HealthBar(oppHpDiv, 100);
}


/*----- Catch wild pokemon -----*/
addGlobalEventListener('click', '.catch', e => {
    addPkmnToParty(oppPkmn);
    e.target.classList.add('hidden');
})

/*----- Switch Between Pokemon -----*/
addGlobalEventListener('click', '.battle-icon', e => {
    switchPkmn(gameState, Number(e.target.getAttribute('id')), 'player');
})

/*----- Clicking the attack buttons -----*/
let canAttack = true;
addGlobalEventListener('click', '.moves-button', e => {
    let playerImg = document.querySelector('.your-pkmn');
    let oppImg = document.querySelector('.enemy-pkmn');

    if (oppPkmn.currentHp <= 0 || pkmnParty[0].currentHp <= 0) {
        return false;
    }

    //Setting the game flow
    if (canAttack) {
        canAttack = false;

        let dmg;
        let newHp;
        let attackOrder;
        let oppAttack;
        
        //Getting the order of attackers
        attackOrder = speedCheck(pkmnParty[0], oppPkmn);
        //Selecting the attack for the opponent
        oppAttack = getOppAttack(oppPkmn);

        //Attack Phase
        
        if (attackOrder[0].currentHp > 0) {
            if (attackOrder[0] === oppPkmn) {
                oppImg.classList.add('enemy-attacking');

                dmg = damageCalc(attackOrder[0], attackOrder[1], oppAttack, showBattleText);
                attackOrder[1].currentHp -= dmg;
                newHp = Math.floor(attackOrder[1].currentHp / attackOrder[1].hp * 100);
                playerHp.setValue(newHp);
                playerHp.update();
            } else {
                playerImg.classList.add('player-attacking');

                dmg = damageCalc(attackOrder[0], attackOrder[1], e.target.innerText, showBattleText);
                attackOrder[1].currentHp -= dmg;
                newHp = Math.floor(attackOrder[1].currentHp / attackOrder[1].hp * 100);
                oppHp.setValue(newHp);
                oppHp.update();
            }
        }

        setTimeout(() => {
            if (attackOrder[1].currentHp > 0) {
                console.log("Delayed for 1 second.");
                if (attackOrder[1] === oppPkmn) {
                    oppImg.classList.add('enemy-attacking');

                    dmg = damageCalc(attackOrder[1], attackOrder[0], oppAttack, showBattleText);
                    attackOrder[0].currentHp -= dmg;
                    newHp = Math.floor(attackOrder[0].currentHp / attackOrder[0].hp * 100);
                    playerHp.setValue(newHp);
                    playerHp.update();
                } else {
                    playerImg.classList.add('player-attacking');

                    dmg = damageCalc(attackOrder[1], attackOrder[0], e.target.innerText, showBattleText)
                    attackOrder[0].currentHp -= dmg;
                    newHp = Math.floor(attackOrder[0].currentHp / attackOrder[0].hp * 100);
                    oppHp.setValue(newHp);
                    oppHp.update();
                }
            }
          }, "2000");      
    } else {
        return false;
    }
    setTimeout(() => {
        canAttack = true;
        playerImg.classList.remove('player-attacking');
        oppImg.classList.remove('enemy-attacking');

        if (oppPkmn.currentHp <= 0 && gameState === "wild battle") {
            let catchButton = document.querySelector('.catch')
            catchButton.classList.remove('hidden');
        }
    }, "4000");
});

/*----- Move between screens -----*/
// Starter > Main Menu
addGlobalEventListener('click', '.starter', e => {
    addPkmnToParty(starterPkmn[Number(e.target.getAttribute('id'))]);
    removeElement('.starter-pkmn-container');
    renderMainMenu();
    gameState = 'main menu';
});

// Main Menu > Stat
addGlobalEventListener('click', '.main-menu-icon', e => {
    removeElement(".main-menu");
    renderPokemonStats(pkmnParty[Number(e.target.getAttribute('id'))]);
    gameState = 'show pkmn stats';
});

// Stat > Stat
addGlobalEventListener('click', '.stat-menu-icon', e => {
    removeElement(".stat-container");
    renderPokemonStats(pkmnParty[Number(e.target.getAttribute('id'))]);
    gameState = 'show pkmn stats';
});

// Stat > Main Menu
addGlobalEventListener('click', '.stat-go-back', e => {
    removeElement(".stat-container");
    renderMainMenu();
    gameState = 'main menu';
});

// Main Menu > Wild Battle
addGlobalEventListener('click', '.text0', e => {
    removeElement(".main-menu");
    renderWildBattle();
    gameState = 'wild battle';
});

//Wild Battle > Main Menu
addGlobalEventListener('click', '.run', e => {
    removeElement(".wild-pkmn-container");
    renderMainMenu();
    gameState = 'main menu';

    //TODO: Create a function that fully heals the pokemon in your party
    healParty();

    //Save Team to the local Storage
    //localStorage.setItem('pkmnParty', pkmnParty);
});

//--Game State--
switch(gameState) {
    case 'choose starter':
        renderStarterChoice();
        break;
    case 'main menu':
        renderMainMenu();
        break;
    case 'show pkmn stats':
        renderPokemonStats();
        break;
}