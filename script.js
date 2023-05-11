//--imports--
import { starterPkmn, lowLvlPkmn, midLvlPkmn, highLvlPkmn, allPkmn, capFirstLetter, addMoves, choose } from "./pokemonObj.js";
import {damageCalc, speedCheck, weaknessCalc} from "./battle-mechanic.js";


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
let gymTeam;
let gymleaderName;

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
    constructor (name, sprite, badge, team) {
        this.name = name;
        this.sprite = sprite;
        this.badge = badge;
        this.team = team;
        this.fullTeam = [];
        
        this.formatTeam();
        this.acePkmn = this.fullTeam[5];

        this.badgeMessage = `You defeated Gym Leader ${this.name}. You've earned the ${this.badge} Badge.`
    }

    formatTeam () {
        for (let i = 0; i < this.team.length; i++) {
            for (let [key, value] of Object.entries(allPkmn)) {
                if (this.team[i][0] === key) {
                    this.fullTeam.push(structuredClone(value));
                    addMoves(this.fullTeam[i], [this.team[i][1], this.team[i][2]]);
                    break;
                }
            }
        }
    }
}

//Gym Leaders
const brockTeam = [
    ['geodude', 'Ice', 'Steel'],
    ['onix', 'Electric', 'Ghost'],
    ['rhyhorn', 'Fire', 'Fighting'],
    ['graveler', 'Electric', 'Poison'],
    ['rhydon', 'Grass', 'Ice'],
    ['golem', 'Grass', 'Flying']
];
const gymBrock = new GymLeader ('Brock', "brock.png", "Boulder", brockTeam);
console.log(gymBrock);

const mistyTeam = [
    ['psyduck', 'Psychic', 'Ice'],
    ['staryu', 'Ice', 'Dark'],
    ['golduck', 'Psychic', 'Fire'],
    ['lapras', 'Flying', 'Ground'],
    ['starmie', 'Ghost', 'Ground'],
    ['gyarados', 'Ground', 'Electric']
]
const gymMisty = new GymLeader ('Misty', 'misty.png', 'Cascade', mistyTeam);
console.log(gymMisty);

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
        if (gameState === 'choose starter') addMoves(pkmnParty[partySize-1]);
        
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
    let switchIn;
    let gymDiv;
    if (trainer === 'opp' && gymTeam.length >= 1) {
        gymDiv = document.querySelector('.gym-container');
        //remove the opp pokemon image;
        removeElement('.enemy-pkmn');
        //remove the top index of the gymTeam array
        gymTeam.shift();
        if (gymTeam.length === 0) {
            showBattleText(gymleaderPlaceHolder.badgeMessage);
            return;
        }
        //Make oppPkmn equal the new gymTeam[0]
        oppPkmn = gymTeam[0];
        let newPkmn = document.createElement('img');
        newPkmn.setAttribute('class', 'enemy-pkmn');
        newPkmn.setAttribute('src', `${oppPkmn.sprite[0]}`);
        gymDiv.append(newPkmn);
        //updating the pokemon hp
        oppHp.setValue(Math.floor(gymTeam[0].currentHp / gymTeam[0].hp * 100))

        showBattleText(`${gymleaderName} sent out ${capFirstLetter(gymTeam[0].name)}`)
        return;
    }
    if (trainer === 'player' && pkmnParty[targetIdx].currentHp < 0) {
        showBattleText("Can't switch to a fainted pokemon");
        return;
    }
    if (canSwitch) {
        canSwitch = false;
        switch (gameState) {
            case "wild battle":
                let wildDiv = document.querySelector('.wild-pkmn-container');
                switchIn;
                [pkmnParty[0], pkmnParty[targetIdx]] = [pkmnParty[targetIdx], pkmnParty[0]]

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
                removeElement('.moves-button');
                movesDiv = [];
                for (let i = 0; i < pkmnParty[0].moves.length; i++) {
                    movesDiv.push(document.createElement('button'));
                    movesDiv[i].innerText = pkmnParty[0].moves[i];
                    movesDiv[i].setAttribute('class', `moves-button move-${i}`);
                    wildDiv.append(movesDiv[i]);
                }

                //updating the pokemon hp
                playerHp.setValue(Math.floor(pkmnParty[0].currentHp / pkmnParty[0].hp * 100));

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

                case "gym leader battle":
                    gymDiv = document.querySelector('.gym-container');
                    switchIn;
                    [pkmnParty[0], pkmnParty[targetIdx]] = [pkmnParty[targetIdx], pkmnParty[0]]
    
                    //updating the pokemon battle sprite
                    removeElement('.your-pkmn');
                    switchIn = document.createElement('img');
                    switchIn.setAttribute('class', 'your-pkmn');
                    switchIn.setAttribute('src', `${pkmnParty[0].sprite[1]}`)
                    gymDiv.append(switchIn);
    
                    //updating the pokemon icon
                    removeElement('.battle-party');
                    pkmnPartyDivs = [];
                    for (let i = 0; i < pkmnParty.length; i++) {
                        pkmnPartyDivs.push(document.createElement('div'));
                        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
                        pkmnPartyDivs[i].innerHTML = `
                        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
                        `;
                        gymDiv.append(pkmnPartyDivs[i]);
                    }
    
                    //updating the pokemon moves
                    removeElement('.moves-button');
                    movesDiv = [];
                    for (let i = 0; i < pkmnParty[0].moves.length; i++) {
                        movesDiv.push(document.createElement('button'));
                        movesDiv[i].innerText = pkmnParty[0].moves[i];
                        movesDiv[i].setAttribute('class', `moves-button move-${i}`);
                        gymDiv.append(movesDiv[i]);
                    }
    
                    //updating the pokemon hp
                    playerHp.setValue(Math.floor(pkmnParty[0].currentHp / pkmnParty[0].hp * 100))
    
                    //updating the battle text
                    showBattleText(`${capFirstLetter(pkmnParty[0].name)} was sent out.`);
                    showBattleText(`${capFirstLetter(pkmnParty[targetIdx].name)} was called back.`);
    
                    //making the opponent attack if your hp wasn't 0
                    if (pkmnParty[targetIdx].currentHp > 0) {
                        attacking(document.querySelector('.enemy-pkmn'), getOppAttack(oppPkmn), playerHp, oppPkmn, pkmnParty[targetIdx]);
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

function getOppAttack (oppPkmn, defender = pkmnParty[0]) {
    if (gameState === 'wild battle') { 
        return choose(oppPkmn.moves);
    } else if (gameState === 'gym leader battle') {
       return getBestAttack(defender);
    }
}

function getBestAttack (defender) {
    let moveOptions = [];
    let highest = 0
    let highestIdx = 0;

    for (let i = 0; i < oppPkmn.moves.length; i++) {
        moveOptions.push(weaknessCalc(defender, oppPkmn.moves[i]));
    }

    for (let i = 0; i < moveOptions.length; i++) {
        if (moveOptions[i] > highest) {
            highest = moveOptions[i];
            highestIdx = i;
        }
    }

    return oppPkmn.moves[highestIdx];
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
    let lowWild = structuredClone(lowLvlPkmn);
    let midWild = structuredClone(midLvlPkmn);
    let highWild = structuredClone(highLvlPkmn);
    //Getting the wild pokemon to battle
    if (pkmnParty.length <= 3) {
        oppPkmn = getRandomPkmn(lowWild);     
    } else if (pkmnParty.length >= 4 && pkmnParty.length <= 5) {
        oppPkmn = getRandomPkmn(choose([lowWild, midWild]));
    } else {
        oppPkmn = getRandomPkmn(choose([lowWild, midWild, midWild, highWild]));
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

    pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
        `;
        wildDiv.append(pkmnPartyDivs[i]);
    }

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


function renderGymLeaderSelection () {
    //GymLeader Selection Div Container
    const gymLeaderSDiv = document.createElement('div');
    gymLeaderSDiv.classList.add('gymleader-selection-container');
    gymLeaderSDiv.innerHTML = `
    <img id="brock" class="gymleader" src="assets/gymleaders/${gymBrock.sprite}">
    <img id="misty" class="gymleader" src="assets/gymleaders/${gymMisty.sprite}">
    `;
    gameContainer.append(gymLeaderSDiv);

    //Show Pokemon in Party
    /*let pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `main-menu-party party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='main-menu-icon' src=${pkmnParty[i].icon}>
        `;
        gymLeaderSDiv.append(pkmnPartyDivs[i]);
    }*/
}

function renderGymLeaderBattle () {
    oppPkmn = gymTeam[0];


     //Gym Battle Div Container
     const gymDiv = document.createElement('div');
     gymDiv.classList.add('gym-container');
     gymDiv.innerHTML = `
     <img class="your-pkmn" src="${pkmnParty[0].sprite[1]}">
     <img class="enemy-pkmn" src="${oppPkmn.sprite[0]}">
     <img class="battle-bg" src="assets/battle_bgs/00.png">
     <div class="battle-title">Gym Leader ${gymleaderName} wants to battle!</div>
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
}

/*----- Releasing Pokemon -----*/
addGlobalEventListener('click', '.stat-release', e => {
    if (pkmnParty.length === 1) {
        let newGameInput = prompt("Are you sure you want to release your last pokemon? This will restart the game. (y / n)", "n")
        if (newGameInput.toLocaleLowerCase() === 'y') {
            pkmnParty.splice(statPlace, 1);
            removeElement(".stat-container");
            renderStarterChoice();
            gameState = 'choose starter';
            return;
        } else {
            return;
        }
    }
    
    pkmnParty.splice(statPlace, 1);
    removeElement(".stat-container");
    renderMainMenu();
    gameState = 'main menu';
})

/*----- Catch wild pokemon -----*/
addGlobalEventListener('click', '.catch', e => {
    addPkmnToParty(structuredClone(oppPkmn));
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

                if (attackOrder[1].currentHp <= 0) {
                    playerImg.classList.add('faint');
                    showBattleText(`${capFirstLetter(attackOrder[1].name)} fainted!!!`);
                }
            } else {
                playerImg.classList.add('player-attacking');

                dmg = damageCalc(attackOrder[0], attackOrder[1], e.target.innerText, showBattleText);
                attackOrder[1].currentHp -= dmg;
                newHp = Math.floor(attackOrder[1].currentHp / attackOrder[1].hp * 100);
                oppHp.setValue(newHp);
                oppHp.update();

                if (attackOrder[1].currentHp <= 0) {
                    oppImg.classList.add('faint');
                    showBattleText(`${capFirstLetter(attackOrder[1].name)} fainted!!!`);
                }               
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

                    if (attackOrder[0].currentHp <= 0) {
                        playerImg.classList.add('faint');
                        showBattleText(`${capFirstLetter(attackOrder[0].name)} fainted!!!`);
                    }
                } else {
                    playerImg.classList.add('player-attacking');

                    dmg = damageCalc(attackOrder[1], attackOrder[0], e.target.innerText, showBattleText)
                    attackOrder[0].currentHp -= dmg;
                    newHp = Math.floor(attackOrder[0].currentHp / attackOrder[0].hp * 100);
                    oppHp.setValue(newHp);
                    oppHp.update();

                    if (attackOrder[0].currentHp <= 0) {
                        oppImg.classList.add('faint');
                        showBattleText(`${capFirstLetter(attackOrder[0].name)} fainted!!!`);
                    }
                }
            }
          }, "2000");      
    } else {
        return false;
    }

    setTimeout(() =>{
        if (oppPkmn.currentHp <= 0 && gameState === "gym leader battle") {
            switchPkmn('gym leader battle', 0, 'opp');
        }       
    }, "2500");

    setTimeout(() => {
        canAttack = true;
        playerImg.classList.remove('player-attacking');
        oppImg.classList.remove('enemy-attacking');

        if (oppPkmn.currentHp <= 0 && gameState === "wild battle") {
            let catchButton = document.querySelector('.catch')
            catchButton.classList.remove('hidden');
        }
        if (oppPkmn.currentHp <= 0 && gameState === "gym leader battle") {
            switchPkmn('gym leader battle', 0, 'opp');
        }
    }, "4000");


});

/*----- Move between screens -----*/
// Starter > Main Menu
addGlobalEventListener('click', '.starter', e => {
    addPkmnToParty(structuredClone(starterPkmn[Number(e.target.getAttribute('id'))]));
    removeElement('.starter-pkmn-container');
    renderMainMenu();
    gameState = 'main menu';
});

let statPlace;
// Main Menu > Stat
addGlobalEventListener('click', '.main-menu-icon', e => {
    statPlace = Number(e.target.getAttribute('id'));
    removeElement(".main-menu");
    renderPokemonStats(pkmnParty[statPlace]);
    gameState = 'show pkmn stats';
});

// Stat > Stat
addGlobalEventListener('click', '.stat-menu-icon', e => {
    statPlace = Number(e.target.getAttribute('id'));
    removeElement(".stat-container");
    renderPokemonStats(pkmnParty[statPlace]);
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

// Main Menu > Gym Leader Selection
addGlobalEventListener('click', '.text2', e => {
    removeElement(".main-menu");
    renderGymLeaderSelection();
    gameState = 'gym leader selection';
});

//Wild Battle > Main Menu
addGlobalEventListener('click', '.run', e => {
    canAttack = true;
    removeElement(".wild-pkmn-container");
    renderMainMenu();
    gameState = 'main menu';

    //TODO: Create a function that fully heals the pokemon in your party
    healParty();

    //Save Team to the local Storage
    //localStorage.setItem('pkmnParty', pkmnParty);
});

let gymleaderPlaceHolder;
//Gym Leader Selection > Gym Leader Battle
addGlobalEventListener('click', '.gymleader', e => {
    removeElement(".gymleader-selection-container");
    gameState = 'gym leader battle';
    switch (e.target.getAttribute('id')) {
        case 'brock':
            gymleaderPlaceHolder = gymBrock;
            gymTeam = structuredClone(gymBrock.fullTeam);
            gymleaderName = gymBrock.name;
            break;
        case 'misty':
            gymleaderPlaceHolder = gymMisty;
            gymTeam = structuredClone(gymMisty.fullTeam);
            gymleaderName = gymMisty.name;
            break;            
    }

    renderGymLeaderBattle();
});

//Gym Leader Battle > Main Menu
addGlobalEventListener('click', '.leave', e => {
    if (gymTeam.length > 0) {
        for (let i = 0; i < pkmnParty.length; i++) {
            if (pkmnParty[i].currentHp > 0) {
                showBattleText("You Can't run from a Gym Battle!");
                return;
            }
        }
    }
    removeElement(".gym-container");
    gameState = 'main menu';
    healParty();
    renderMainMenu();
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