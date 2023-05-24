//--imports--
import { starterPkmn, lowLvlPkmn, midLvlPkmn, highLvlPkmn, allPkmn, capFirstLetter, addMoves, choose } from "./pokemonObj.js";
import {damageCalc, speedCheck, weaknessCalc} from "./battle-mechanic.js";


//--state variables--
let pkmnParty = localStorage.getItem('pkmnParty');
pkmnParty = JSON.parse(pkmnParty);
if (pkmnParty === null) {
    pkmnParty = [];
}

let gymBadges = localStorage.getItem('gymBadges');
gymBadges = JSON.parse(gymBadges);
if (gymBadges === null) {
    gymBadges = [];
}

console.log(gymBadges);

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
let gymleaderPlaceHolder;
let pkmnPartyDivs;
let movesDiv;
let statPlace;

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

    giveBadge () {
        let badgeStr = gymBadges.join(' ');
        if (!badgeStr.includes(this.badge)) {
            gymBadges.push(this.badge);
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

const mistyTeam = [
    ['psyduck', 'Psychic', 'Ice'],
    ['staryu', 'Ice', 'Dark'],
    ['golduck', 'Psychic', 'Fire'],
    ['lapras', 'Flying', 'Ground'],
    ['starmie', 'Ghost', 'Ground'],
    ['gyarados', 'Ground', 'Electric']
];
const gymMisty = new GymLeader ('Misty', 'misty.png', 'Cascade', mistyTeam);

const surgeTeam = [
    ['pikachu', 'Water', 'Flying'],
    ['magneton', 'Ice', 'Water'],
    ['electrode', 'Steel', 'Poison'],
    ['electabuzz', 'Ice', 'Fighting'],
    ['jolteon', 'Water', 'Bug'],
    ['raichu', 'Grass', 'Ice']
];
const gymSurge = new GymLeader ('Lt. Surge', 'surge.png', 'Thunder', surgeTeam)

const erikaTeam = [
    ['weepinbell', 'Ground', 'Fire'],
    ['gloom', 'Electric', 'Dark'],
    ['ivysaur', 'Ground', 'Electric'],
    ['victreebel', 'Ground', 'Fire'],
    ['vileplume', 'Rock', 'Ghost'],
    ['venusaur', 'Rock', 'Dark']
];
const gymErika = new GymLeader ('Erika', 'erika.png', 'Rainbow', erikaTeam)

const janineTeam = [
    ['grimer', 'Water', 'Fire'],
    ['golbat', 'Ground', 'Ghost'],
    ['arbok', 'Ice', 'Fire'],
    ['muk', 'Dark', 'Fighting'],
    ['gengar', 'Water', 'Rock'],
    ['weezing', 'Ice', 'Dark']
];
const gymJanine = new GymLeader ('Janine', 'janine.png', 'Soul', janineTeam)

const sabrinaTeam = [
    ['slowpoke', 'Ghost', 'Fire'],
    ['jynx', 'Rock', 'Electric'],
    ['starmie', 'Dark', 'Ground'],
    ['hypno', 'Ghost', 'Fire'],
    ['slowbro', 'Ice', 'Ground'],
    ['alakazam', 'Fire', 'Dark']
];
const gymSabrina = new GymLeader ('Sabrina', 'sabrina.png', 'Marsh', sabrinaTeam)

const blaineTeam = [
    ['ninetales', 'Electric', 'Psychic'],
    ['magmar', 'Dark', 'Ice'],
    ['rapidash', 'Fighting', 'Psychic'],
    ['flareon', 'Electric', 'Ground'],
    ['charizard', 'Water', 'Grass'],
    ['arcanine', 'Grass', 'Rock']
];
const gymBlaine = new GymLeader ('Blaine', 'blaine.png', 'Volcano', blaineTeam)

const giovanniTeam = [
    ['dugtrio', 'Rock', 'Flying'],
    ['marowak', 'Fire', 'Rock'],
    ['sandslash', 'Fire', 'Grass'],
    ['rhydon', 'Grass', 'Flying'],
    ['nidoqueen', 'Water', 'Electric'],
    ['nidoking', 'Dark', 'Ice']
];
const gymGiovanni = new GymLeader ('Giovanni', 'giovanni.png', 'Earth', giovanniTeam)

/*----- Functions -----*/
//Event Delegation
function addGlobalEventListener(type, selector, callback) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e)
    });
}

//Audio files
function playAudio (mp3, volume = .25) {
    let audio = new Audio(`assets/audio/${mp3}`);
    audio.volume = volume;
    
    return audio
}
function stopAudio (audio) {
    audio.pause();
    audio.currentTime = 0;
}
let wildMp3 = playAudio('wild.mp3');
let gymLeaderMp3 = playAudio('gymleader.mp3');
let gymLeaderFinalMp3 = playAudio('gymleaderFinal.mp3');
let victoryMp3 = playAudio('victory.mp3');


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

function teamCheck () {
    for (let i = 0; i < pkmnParty.length; i++) {
        if (pkmnParty[i].currentHp >= 1) return false;
    }
    return true;
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
            stopAudio(gymLeaderFinalMp3);
            victoryMp3.play()
            showBattleText(gymleaderPlaceHolder.badgeMessage);
            gymleaderPlaceHolder.giveBadge();
            canSwitch = false;
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

        if (gymTeam.length === 1) {
            stopAudio(gymLeaderMp3);
            gymLeaderFinalMp3.play();
        }
        return;
    }
    if (trainer === 'player' && pkmnParty[targetIdx].currentHp <= 0) {
        showBattleText("Can't switch to a fainted pokemon");
        return;
    }
    if (canSwitch) {
        canSwitch = false;
        canAttack = false;
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
                setTimeout (() => {
                    if (pkmnParty[targetIdx].currentHp > 0) {
                        attacking(document.querySelector('.enemy-pkmn'), getOppAttack(oppPkmn, pkmnParty[targetIdx]), playerHp, oppPkmn, pkmnParty[0]);
                    }
                }, "500");

                setTimeout (() => {
                    canSwitch = true;
                    canAttack = true
                }, "1000")
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
    
                    setTimeout (() => {
                        if (pkmnParty[targetIdx].currentHp > 0) {
                            attacking(document.querySelector('.enemy-pkmn'), getOppAttack(oppPkmn, pkmnParty[targetIdx]), playerHp, oppPkmn, pkmnParty[0]);
                        }
                    }, "500");
    
                    setTimeout (() => {
                        canSwitch = true;
                        canAttack = true;
                    }, "1000")
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

/*----- Renders -----*/
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

function renderWildBattle () {
    let lowWild = structuredClone(lowLvlPkmn);
    let midWild = structuredClone(midLvlPkmn);
    let highWild = structuredClone(highLvlPkmn);
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

    wildMp3.play();
}


function renderGymLeaderSelection () {
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

/*----- GymLeader Details -----*/
addGlobalEventListener('mouseover', '.gymleader', e => {
    let gymleaderGet = e.target.getAttribute('class').split(' ')[1];
    let gymDetailsDiv = document.querySelector(`.${gymleaderGet}-details`);
    gymDetailsDiv.classList.remove('hidden');
})
addGlobalEventListener('mouseout', '.gymleader', e => {
    let gymleaderGet = e.target.getAttribute('class').split(' ')[1];
    let gymDetailsDiv = document.querySelector(`.${gymleaderGet}-details`);
    gymDetailsDiv.classList.add('hidden');
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

    console.log(pkmnParty[0].currentHp);

    if (oppPkmn.currentHp <= 0 || pkmnParty[0].currentHp <= 0) {
        return false;
    }

    //Setting the game flow
    if (canAttack) {
        canAttack = false;
        canSwitch = false;

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
        canSwitch = true;
        playerImg.classList.remove('player-attacking');
        oppImg.classList.remove('enemy-attacking');

        if (oppPkmn.currentHp <= 0 && gameState === "wild battle") {
            let catchButton = document.querySelector('.catch')
            catchButton.classList.remove('hidden');
        }
        if (oppPkmn.currentHp <= 0 && gameState === "gym leader battle") {
            switchPkmn('gym leader battle', 0, 'opp');
        }
        if (teamCheck()) {
            showBattleText("You're out of usable pokemon"); 
        }
    }, "3000");


});

/*----- Move between screens -----*/
// Starter > Main Menu
addGlobalEventListener('click', '.starter', e => {
    addPkmnToParty(structuredClone(starterPkmn[Number(e.target.getAttribute('id'))]));
    removeElement('.starter-pkmn-container');
    renderMainMenu();
    gameState = 'main menu';
});

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

// Gym Leader Selection > Main Menu
addGlobalEventListener('click', '.go-back', e => {
    removeElement(".gymleader-selection-container");
    renderMainMenu();
    gameState = 'main menu';
});

//Wild Battle > Main Menu
addGlobalEventListener('click', '.run', e => {
    canAttack = true;
    removeElement(".wild-pkmn-container");
    renderMainMenu();
    gameState = 'main menu';

    healParty();

    //Save Team to the local Storage
    let jsonArr = JSON.stringify(pkmnParty);
    localStorage.setItem('pkmnParty', jsonArr);

    //Stop Audio
    stopAudio(wildMp3);
});

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
        case 'surge':
            gymleaderPlaceHolder = gymSurge;
            gymTeam = structuredClone(gymSurge.fullTeam);
            gymleaderName = gymSurge.name;
            break;  
        case 'erika':
            gymleaderPlaceHolder = gymErika;
            gymTeam = structuredClone(gymErika.fullTeam);
            gymleaderName = gymErika.name;
            break;   
        case 'janine':
            gymleaderPlaceHolder = gymJanine;
            gymTeam = structuredClone(gymJanine.fullTeam);
            gymleaderName = gymJanine.name;
            break;  
        case 'sabrina':
            gymleaderPlaceHolder = gymSabrina;
            gymTeam = structuredClone(gymSabrina.fullTeam);
            gymleaderName = gymSabrina.name;
            break; 
        case 'blaine':
            gymleaderPlaceHolder = gymBlaine;
            gymTeam = structuredClone(gymBlaine.fullTeam);
            gymleaderName = gymBlaine.name;
            break;
        case 'giovanni':
            gymleaderPlaceHolder = gymGiovanni;
            gymTeam = structuredClone(gymGiovanni.fullTeam);
            gymleaderName = gymGiovanni.name;
            break;  
    }

    renderGymLeaderBattle();
});

//Gym Leader Battle > Main Menu
addGlobalEventListener('click', '.leave', e => {
    if (gymTeam.length > 0) {
        for (let i = 0; i < pkmnParty.length; i++) {
            if (pkmnParty[i].currentHp > 0) {
                showBattleText("You can't run from a Gym Battle!");
                return;
            }
        }
    }
    removeElement(".gym-container");
    gameState = 'main menu';
    healParty();
    renderMainMenu();
    stopAudio(gymLeaderFinalMp3);
    stopAudio(gymLeaderMp3);
    stopAudio(victoryMp3);
    canSwitch = true;

    //Save Badges to the local Storage
    let arr = JSON.stringify(gymBadges);
    localStorage.setItem('gymBadges', arr);
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