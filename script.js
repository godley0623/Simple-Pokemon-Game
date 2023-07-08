//--imports--
import { starterPkmn, lowLvlPkmn, midLvlPkmn, highLvlPkmn, allPkmn, capFirstLetter, addMoves, choose } from "./pokemonObj.js";
import { damageCalc, speedCheck, weaknessCalc } from "./battle-mechanic.js";
import { GymLeader, EliteFour } from "./trainer.js";


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

let e4Beaten = localStorage.getItem('e4Beaten');
try {
    e4Beaten = JSON.parse(e4Beaten);
}
catch {
    e4Beaten = null;
}
if (e4Beaten === null) {
    e4Beaten = [];
}

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
let e4Team;
let e4Name;
let e4PlaceHolder;
let pkmnPartyDivs;
let movesDiv;
let statPlace;

//--cached elements--
const gameContainer = document.querySelector('.game-container');

//--classes--
class HealthBar {
    constructor(element, initialValue = 100) {
        this.valueElem = element.querySelector('.health-bar-value');
        this.fillElem = element.querySelector('.health-bar-fill');

        this.setValue(initialValue);
    }

    setValue(newValue) {
        if (newValue > 100) newValue = 100;
        if (newValue < 0) newValue = 0;

        this.value = newValue;
        this.update();
    }

    update() {
        const percentage = this.value + '%';

        this.fillElem.style.width = percentage;
        this.valueElem.textContent = percentage;
    }
}

//Gym Leaders
const brockTeam = [
    ['onix', 'Electric', 'Ghost'],
    ['graveler', 'Electric', 'Poison'],
    ['rhyhorn', 'Fire', 'Fighting'],
    ['kabutops', 'Fire', 'Psychic'],
    ['rhydon', 'Grass', 'Ice'],
    ['golem', 'Grass', 'Flying']
];
const gymBrock = new GymLeader('Brock', "brock.png", "Boulder", brockTeam);

const mistyTeam = [
    ['psyduck', 'Psychic', 'Ice'],
    ['staryu', 'Ice', 'Dark'],
    ['golduck', 'Psychic', 'Fire'],
    ['vaporeon', 'Flying', 'Ground'],
    ['starmie', 'Ghost', 'Ground'],
    ['gyarados', 'Ground', 'Electric']
];
const gymMisty = new GymLeader('Misty', 'misty.png', 'Cascade', mistyTeam);

const surgeTeam = [
    ['pikachu', 'Water', 'Flying'],
    ['magneton', 'Ice', 'Water'],
    ['electrode', 'Steel', 'Poison'],
    ['electabuzz', 'Ice', 'Fighting'],
    ['jolteon', 'Water', 'Bug'],
    ['raichu', 'Grass', 'Ice']
];
const gymSurge = new GymLeader('Lt. Surge', 'surge.png', 'Thunder', surgeTeam)

const erikaTeam = [
    ['weepinbell', 'Ground', 'Fire'],
    ['gloom', 'Electric', 'Dark'],
    ['ivysaur', 'Ground', 'Electric'],
    ['victreebel', 'Ground', 'Fire'],
    ['vileplume', 'Rock', 'Ghost'],
    ['venusaur', 'Rock', 'Dark']
];
const gymErika = new GymLeader('Erika', 'erika.png', 'Rainbow', erikaTeam)

const janineTeam = [
    ['grimer', 'Water', 'Fire'],
    ['golbat', 'Ground', 'Ghost'],
    ['arbok', 'Ice', 'Fire'],
    ['muk', 'Dark', 'Fighting'],
    ['gengar', 'Water', 'Rock'],
    ['weezing', 'Ice', 'Dark']
];
const gymJanine = new GymLeader('Janine', 'janine.png', 'Soul', janineTeam)

const sabrinaTeam = [
    ['slowpoke', 'Ghost', 'Fire'],
    ['jynx', 'Rock', 'Electric'],
    ['starmie', 'Dark', 'Ground'],
    ['hypno', 'Ghost', 'Fire'],
    ['slowbro', 'Ice', 'Ground'],
    ['alakazam', 'Fire', 'Dark']
];
const gymSabrina = new GymLeader('Sabrina', 'sabrina.png', 'Marsh', sabrinaTeam)

const blaineTeam = [
    ['ninetales', 'Electric', 'Psychic'],
    ['magmar', 'Dark', 'Ice'],
    ['rapidash', 'Fighting', 'Psychic'],
    ['flareon', 'Electric', 'Ground'],
    ['charizard', 'Water', 'Grass'],
    ['arcanine', 'Grass', 'Rock']
];
const gymBlaine = new GymLeader('Blaine', 'blaine.png', 'Volcano', blaineTeam)

const giovanniTeam = [
    ['dugtrio', 'Rock', 'Flying'],
    ['marowak', 'Fire', 'Rock'],
    ['sandslash', 'Fire', 'Grass'],
    ['rhydon', 'Grass', 'Flying'],
    ['nidoqueen', 'Water', 'Electric'],
    ['nidoking', 'Dark', 'Ice']
];
const gymGiovanni = new GymLeader('Giovanni', 'giovanni.png', 'Earth', giovanniTeam)

//Elite Four
const loreleiTeam = [
    ['jynx', 'Water', 'Fighting'],
    ['dewgong', 'Poison', 'Psychic'],
    ['slowking', 'Fire', 'Ground'],
    ['cloyster', 'Grass', 'Fire'],
    ['walrein-lorelei', 'Dark', 'Flying'],
    ['lapras-lorelei', 'Psychic', 'Ground']
];
const e4Lorelei = new EliteFour('Lorelei', 'lorelei.png', loreleiTeam)

const brunoTeam = [
    ['steelix', 'Water', 'Flying'],
    ['hitmonchan', 'Ice', 'Ghost'],
    ['hitmonlee', 'Electric', 'Dark'],
    ['poliwrath', 'Ice', 'Grass'],
    ['hariyama-bruno', 'Bug', 'Rock'],
    ['machamp-bruno', 'Rock', 'Dark']
];
const e4Bruno = new EliteFour('Bruno', 'bruno.png', brunoTeam)

const agathaTeam = [
    ['misdreavus', 'Fairy', 'Fire'],
    ['muk', 'Ice', 'Ghost'],
    ['gengar', 'Fighting', 'Water'],
    ['dusclops', 'Bug', 'Rock'],
    ['crobat-agatha', 'Ground', 'Ghost'],
    ['gengar-agatha', 'Ice', 'Fairy']
];
const e4Agatha = new EliteFour('Agatha', 'agatha.png', agathaTeam)

const lanceTeam = [
    ['flygon', 'Steel', 'Flying'],
    ['aerodactyl', 'Ground', 'Grass'],
    ['dragonite', 'Rock', 'Ice'],
    ['salamence', 'Steel', 'Bug'],
    ['gyarados-lance', 'Gorund', 'Dark'],
    ['dragonite-lance', 'Steel', 'Ice']
];
const e4Lance = new EliteFour('Lance', 'lance.png', lanceTeam)

/*----- Functions -----*/
//Event Delegation
function addGlobalEventListener(type, selector, callback) {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e)
    });
}

//Audio files
function playAudio(mp3, volume = .25) {
    let audio = new Audio(`assets/audio/${mp3}`);
    audio.volume = volume;

    return audio
}
function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
}
let wildMp3 = playAudio('wild.mp3');
let gymLeaderMp3 = playAudio('gymleader.mp3');
let e4Mp3 = playAudio('e4.mp3');
let gymLeaderFinalMp3 = playAudio('gymleaderFinal.mp3');
let victoryMp3 = playAudio('victory.mp3');


function addPkmnToParty(pkmn) {
    if (pkmnParty.length < 6) {
        pkmnParty.push(pkmn);
        let partySize = pkmnParty.length;
        if (gameState === 'choose starter') addMoves(pkmnParty[partySize - 1]);

        if (gameState === 'wild battle') {
            showBattleText(`${capFirstLetter(pkmn.name)} was added to your party`);
        }
    } else {
        alert("Your party is full")
    }
}

function getRandomPkmn(pkmnArry) {
    return pkmnArry[Math.floor(Math.random() * pkmnArry.length)]
}

function healParty() {
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnParty[i].currentHp = pkmnParty[i].hp;
    }
}

function teamCheck() {
    for (let i = 0; i < pkmnParty.length; i++) {
        if (pkmnParty[i].currentHp >= 1) return false;
    }
    return true;
}

let canSwitch = true;
function switchPkmn(gameState, targetIdx, trainer) {
    let team;
    let placeholder;
    let name;

    let switchIn;
    let gymDiv;
    gymDiv = document.querySelector('.gym-container');
    if (!gymTeam) {
        gymDiv = document.querySelector('.gym-container');
        team = e4Team;
        placeholder = e4PlaceHolder;
        name = e4Name;
    }else {
        team = gymTeam;
        placeholder = gymleaderPlaceHolder;
        name = gymleaderName;
    }

    let pkmnPartyDiv = document.querySelector('.pkmn-party');
    let yourPkmnContainer = document.querySelector('.your-pkmn-container');
    let oppPkmnContainer = document.querySelector('.opp-pkmn-container');
    let battleMoves = document.querySelector('.battle-moves');

    if (trainer === 'opp' && team.length >= 1) {
        //remove the opp pokemon image;
        removeElement('.enemy-pkmn');
        //remove the top index of the gymTeam array
        team.shift();
        if (team.length === 0) {
            if (gameState === 'gym leader battle') {
                stopAudio(gymLeaderFinalMp3);
                victoryMp3.play();
                showBattleText(placeholder.badgeMessage);
                placeholder.giveBadge(gymBadges);
                canSwitch = false;
                return;
            } else if (gameState === 'e4 battle') {
                stopAudio(gymLeaderFinalMp3);
                victoryMp3.play();
                showBattleText(placeholder.badgeMessage);
                placeholder.eliteFourBeaten(e4Beaten);
                canSwitch = false;
                return;                
            }
        }
        //Make oppPkmn equal the new gymTeam[0]
        oppPkmn = team[0];
        let newPkmn = document.createElement('img');
        newPkmn.setAttribute('class', 'enemy-pkmn');
        newPkmn.setAttribute('src', `${oppPkmn.sprite[0]}`);
        oppPkmnContainer.append(newPkmn);
        //updating the pokemon hp
        oppHp.setValue(Math.floor(team[0].currentHp / team[0].hp * 100))

        showBattleText(`${name} sent out ${capFirstLetter(team[0].name)}`)

        if (team.length === 1) {
            stopAudio(gymLeaderMp3);
            stopAudio(e4Mp3);
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
                yourPkmnContainer.append(switchIn);

                //updating the pokemon icon
                removeElement('.battle-party');
                pkmnPartyDivs = [];
                for (let i = 0; i < pkmnParty.length; i++) {
                    pkmnPartyDivs.push(document.createElement('div'));
                    pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
                    pkmnPartyDivs[i].innerHTML = `
                    <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
                    `;
                    pkmnPartyDiv.append(pkmnPartyDivs[i]);
                }

                //updating the pokemon moves
                removeElement('.moves-button');
                movesDiv = [];
                for (let i = 0; i < pkmnParty[0].moves.length; i++) {
                    movesDiv.push(document.createElement('button'));
                    movesDiv[i].innerText = pkmnParty[0].moves[i];
                    movesDiv[i].setAttribute('class', `moves-button move-${i}`);
                    battleMoves.append(movesDiv[i]);
                }

                //updating the pokemon hp
                playerHp.setValue(Math.floor(pkmnParty[0].currentHp / pkmnParty[0].hp * 100));

                //updating the battle text
                showBattleText(`${capFirstLetter(pkmnParty[0].name)} was sent out.`);
                showBattleText(`${capFirstLetter(pkmnParty[targetIdx].name)} was called back.`);

                //making the opponent attack if your hp wasn't 0
                setTimeout(() => {
                    if (pkmnParty[targetIdx].currentHp > 0) {
                        attacking(document.querySelector('.enemy-pkmn'), getOppAttack(oppPkmn, pkmnParty[targetIdx]), playerHp, oppPkmn, pkmnParty[0]);
                    }
                }, "500");

                setTimeout(() => {
                    canSwitch = true;
                    canAttack = true
                }, "1000")
                break;

            case "gym leader battle":
            case "e4 battle":
                //gymDiv = document.querySelector('.gym-container');
                switchIn;
                [pkmnParty[0], pkmnParty[targetIdx]] = [pkmnParty[targetIdx], pkmnParty[0]]

                //updating the pokemon battle sprite
                removeElement('.your-pkmn');
                switchIn = document.createElement('img');
                switchIn.setAttribute('class', 'your-pkmn');
                switchIn.setAttribute('src', `${pkmnParty[0].sprite[1]}`)
                yourPkmnContainer.append(switchIn);
                
                //updating the pokemon icon
                removeElement('.battle-party');
                pkmnPartyDivs = [];
                for (let i = 0; i < pkmnParty.length; i++) {
                    pkmnPartyDivs.push(document.createElement('div'));
                    pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
                    pkmnPartyDivs[i].innerHTML = `
                    <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
                    `;
                    pkmnPartyDiv.append(pkmnPartyDivs[i]);
                }

                //updating the pokemon moves
                removeElement('.moves-button');
                movesDiv = [];
                for (let i = 0; i < pkmnParty[0].moves.length; i++) {
                    movesDiv.push(document.createElement('button'));
                    movesDiv[i].innerText = pkmnParty[0].moves[i];
                    movesDiv[i].setAttribute('class', `moves-button move-${i}`);
                    battleMoves.append(movesDiv[i]);
                }

                //updating the pokemon hp
                playerHp.setValue(Math.floor(pkmnParty[0].currentHp / pkmnParty[0].hp * 100))

                //updating the battle text
                showBattleText(`${capFirstLetter(pkmnParty[0].name)} was sent out.`);
                showBattleText(`${capFirstLetter(pkmnParty[targetIdx].name)} was called back.`);

                setTimeout(() => {
                    if (pkmnParty[targetIdx].currentHp > 0) {
                        attacking(document.querySelector('.enemy-pkmn'), getOppAttack(oppPkmn, pkmnParty[targetIdx]), playerHp, oppPkmn, pkmnParty[0]);
                    }
                }, "500");

                setTimeout(() => {
                    canSwitch = true;
                    canAttack = true;
                }, "1000")
                break;
        }
    }
}

function attacking(img, attack, hp, attacker, defender) {
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

        setTimeout(() => {
            canAttack = true;
            canSwitch = true;
            img.classList.remove('enemy-attacking');
        }, "2000");
    } else {
        return;
    }
}

function getOppAttack(oppPkmn, defender = pkmnParty[0]) {
    if (gameState === 'wild battle') {
        return choose(oppPkmn.moves);
    } else if (gameState === 'gym leader battle' || gameState === 'e4 battle') {
        return getBestAttack(defender);
    }
}

function getBestAttack(defender) {
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

function showBattleText(message) {
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

function createHealthBar(owner) {
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
    <div class="text-container">
        <p class='main-menu-text text0'>Battle Wild Pokemon</p>
        <p class='main-menu-text text1 hidden'>Battle Trainer</p>
        <p class='main-menu-text text2'>Battle Gym Leader</p>
        <p class='main-menu-text text3'>Battle Elite Four</p>
    </div>

    <p class='main-menu-text-party'>Pokemon in Party</p>
    <div class='main-menu-pkmn-party'></div>
    `;
    gameContainer.append(menuDiv);

    //Gym Badges check
    if (gymBadges.length < 8) {
        const eliteFour = document.querySelector('.text3');
        eliteFour.classList.add('hidden'); 
    }

    //Show Pokemon in Party
    let pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `main-menu-party party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='main-menu-icon' src=${pkmnParty[i].icon}>
        `;
        document.querySelector('.main-menu-pkmn-party').append(pkmnPartyDivs[i]);
    }
}

function renderPokemonStats(pkmn) {
    //Stat Div Container
    const statDiv = document.createElement('div');
    statDiv.setAttribute('class', 'stat-container');
    statDiv.innerHTML = `
    <div class='box'>
        <img class='stat-pkmn-image' src='${pkmn.sprite[0]}'>
        <h3 class='stat-pkmn-name'>${capFirstLetter(pkmn.name)}</h3>
        <h3 class='stat-pkmn-type'>${structureType(pkmn.type)}</h3>
        <h4 class='stat-pkmn-stat hp'>HP: ${pkmn.hp}</h4>
        <h4 class='stat-pkmn-stat atk'>Attack: ${pkmn.atk}</h4>
        <h4 class='stat-pkmn-stat def'>Defense: ${pkmn.def}</h4>
        <h4 class='stat-pkmn-stat spd'>Speed: ${pkmn.spd}</h4>
        <h4 class='stat-pkmn-moves'>Moves: ${pkmn.moves.join(' / ')}</h4>
        <div class='stat-buttons'>
            <button class='stat-go-back'>Go Back</button>
            <button class='stat-release'>Release</button>
        </div>
    </div>
    
    <p class='stat-menu-text-party'>Pokemon in Party</p>
    <div class='stat-menu-pkmn-party'></div>
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
        document.querySelector(".stat-menu-pkmn-party").append(pkmnPartyDivs[i]);
    }
}

function renderWildBattle() {
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
    wildDiv.classList.add('pkmn-battle-container');
    wildDiv.classList.add('wild-pkmn-container')
    wildDiv.innerHTML = `
    <div class="battle-container bc-wild">
        <div class="your-health-container"></div>
        <div class="opp-health-container"></div>
        <div class="your-pkmn-container">
            <img class="your-pkmn" src="${pkmnParty[0].sprite[1]}">
        </div>
        <div class="opp-pkmn-container">
            <img class="enemy-pkmn" src="${oppPkmn.sprite[0]}">
        </div>
    </div>
    <div class="battle-title">A wild ${capFirstLetter(oppPkmn.name)} appeared!</div>
    <div class="battle-text bt-wild"></div>
    <div class="pkmn-party pp-wild"></div>
    <div class="battle-moves bm-wild"></div>
    <div class="run-catch rc-wild">
        <button class="catch hidden">Catch</button>    
        <button class="run">Run</button>
    </div>
    `;
    gameContainer.append(wildDiv);

    pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
        `;
        document.querySelector('.pkmn-party').append(pkmnPartyDivs[i]);
    }

    movesDiv = [];
    battleText = [];
    for (let i = 0; i < pkmnParty[0].moves.length; i++) {
        movesDiv.push(document.createElement('button'));
        movesDiv[i].innerText = pkmnParty[0].moves[i];
        movesDiv[i].setAttribute('class', `moves-button move-${i}`);
        document.querySelector('.battle-moves').append(movesDiv[i]);
    }

    const healthContainer = [document.querySelector('.your-health-container'), document.querySelector('.opp-health-container')];
    let playerHpDiv = createHealthBar('player');
    healthContainer[0].append(playerHpDiv);
    playerHp = new HealthBar(playerHpDiv, 100);

    let oppHpDiv = createHealthBar('opp');
    healthContainer[1].append(oppHpDiv);
    oppHp = new HealthBar(oppHpDiv, 100);

    wildMp3.play();
}


function renderGymLeaderSelection() {
    //GymLeader Selection Div Container
    const gymLeaderSDiv = document.createElement('div');
    gymLeaderSDiv.classList.add('gymleader-selection-container');
    gymLeaderSDiv.innerHTML = `
    <div class="gymleader-container">
        <img id="brock" class="gymleader brock" src="assets/gymleaders/${gymBrock.sprite}">
        <img id="misty" class="gymleader misty" src="assets/gymleaders/${gymMisty.sprite}">
        <img id="surge" class="gymleader surge" src="assets/gymleaders/${gymSurge.sprite}">
        <img id="erika" class="gymleader erika" src="assets/gymleaders/${gymErika.sprite}">
        <img id="janine" class="gymleader janine" src="assets/gymleaders/${gymJanine.sprite}">
        <img id="sabrina" class="gymleader sabrina" src="assets/gymleaders/${gymSabrina.sprite}">
        <img id="blaine" class="gymleader blaine" src="assets/gymleaders/${gymBlaine.sprite}">
        <img id="giovanni" class="gymleader giovanni" src="assets/gymleaders/${gymGiovanni.sprite}">
    </div>

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
    
    <div class="gymleader-footer">
        <h3 class="badges">Badges (${gymBadges.length}/8): ${gymBadges.join(', ')}</h3>
        <button class="go-back">Go Back</button>
    </div>
    `;
    gameContainer.append(gymLeaderSDiv);
}

function renderGymLeaderBattle() {
    oppPkmn = gymTeam[0];


    //Gym Battle Div Container
    const gymDiv = document.createElement('div');
    gymDiv.classList.add('pkmn-battle-container');
    gymDiv.classList.add('gym-container');
    gymDiv.innerHTML = `
     <div class="battle-container">
         <div class="your-health-container"></div>
         <div class="opp-health-container"></div>
         <div class="your-pkmn-container">
             <img class="your-pkmn" src="${pkmnParty[0].sprite[1]}">
         </div>
         <div class="opp-pkmn-container">
             <img class="enemy-pkmn" src="${oppPkmn.sprite[0]}">
         </div>
     </div>
     <div class="battle-title">Gym Leader ${gymleaderName} wants to battle!</div>
     <div class="trainer">
       <img class="trainer-img" src="assets/gymleaders/${gymleaderPlaceHolder.sprite}">
     </div>
     <div class="battle-text"></div>
     <div class="pkmn-party"></div>
     <div class="battle-moves"></div>
     <div class="run-catch">
       <button class="leave">Run</button>
     </div>
    `;
    gameContainer.append(gymDiv);

    pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
        `;
        document.querySelector('.pkmn-party').append(pkmnPartyDivs[i]);
    }

    movesDiv = [];
    battleText = [];
    for (let i = 0; i < pkmnParty[0].moves.length; i++) {
        movesDiv.push(document.createElement('button'));
        movesDiv[i].innerText = pkmnParty[0].moves[i];
        movesDiv[i].setAttribute('class', `moves-button move-${i}`);
        document.querySelector('.battle-moves').append(movesDiv[i]);
    }

    const healthContainer = [document.querySelector('.your-health-container'), document.querySelector('.opp-health-container')];
    let playerHpDiv = createHealthBar('player');
    healthContainer[0].append(playerHpDiv);
    playerHp = new HealthBar(playerHpDiv, 100);

    let oppHpDiv = createHealthBar('opp');
    healthContainer[1].append(oppHpDiv);
    oppHp = new HealthBar(oppHpDiv, 100);

    gymLeaderMp3.play();
}

function renderEliteFourSelection() {
    //E4 Selection Div Container
    const eliteFourDiv = document.createElement('div');
    eliteFourDiv.classList.add('e4-selection-container');
    eliteFourDiv.innerHTML = `
    <div class="e4-container">
        <img id="lorelei" class="e4 lorelei" src="assets/e4/${e4Lorelei.sprite}">
        <img id="bruno" class="e4 bruno" src="assets/e4/${e4Bruno.sprite}">
        <img id="agatha" class="e4 agatha" src="assets/e4/${e4Agatha.sprite}">
        <img id="lance" class="e4 lance" src="assets/e4/${e4Lance.sprite}">
    </div>

    <div id="e4-details" class="lorelei-details hidden">
        <h2>Lorelei</h2>
        <h2>Ice Type Specialist</h2>
        <h2>Ace Pokemon: <img src="${e4Lorelei.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="e4-details" class="bruno-details hidden">
        <h2>Bruno</h2>
        <h2>Fighting Type Specialist</h2>
        <h2>Ace Pokemon: <img src="${e4Bruno.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="e4-details" class="agatha-details hidden">
        <h2>Agatha</h2>
        <h2>Ghost Type Specialist</h2>
        <h2>Ace Pokemon: <img src="${e4Agatha.acePkmn.sprite[0]}"><h2>
    </div>
    <div id="e4-details" class="lance-details hidden">
        <h2>Lance</h2>
        <h2>Dragon Type Specialist</h2>
        <h2>Ace Pokemon: <img src="${e4Lance.acePkmn.sprite[0]}"><h2>
    </div>
    
    <div class="e4-footer">
        <h3 class="badges">Elite4 (${e4Beaten.length}/4): ${e4Beaten.join(', ')}</h3>
        <button class="e4-go-back">Go Back</button>
    </div>
    `;
    gameContainer.append(eliteFourDiv);
    const brunoEl = document.querySelector('#bruno');
    const agathaEl = document.querySelector('#agatha');
    const lanceEl = document.querySelector('#lance');

    function e4MemberCheck(e4, winsNeeded) {
        const gameCheck = localStorage.getItem('game');
        if (gameCheck) return false;

        const e4Wins = e4Beaten.length;
        if (e4Wins < winsNeeded) {
            e4.classList.add('hidden');
        }
    }
    e4MemberCheck(brunoEl, 1);
    e4MemberCheck(agathaEl, 2);
    e4MemberCheck(lanceEl, 3);

}

function renderEliteFourBattle() {
    oppPkmn = e4Team[0];


    //Elite Four Div Container
    const e4Div = document.createElement('div');
    e4Div.classList.add('pkmn-battle-container');
    e4Div.classList.add('gym-container');
    e4Div.innerHTML = `
     <div class="battle-container">
         <div class="your-health-container"></div>
         <div class="opp-health-container"></div>
         <div class="your-pkmn-container">
             <img class="your-pkmn" src="${pkmnParty[0].sprite[1]}">
         </div>
         <div class="opp-pkmn-container">
             <img class="enemy-pkmn" src="${oppPkmn.sprite[0]}">
         </div>
     </div>
     <div class="battle-title">E4 Member ${e4Name} wants to battle!</div>
     <div class="trainer">
       <img class="trainer-img" src="assets/e4/${e4PlaceHolder.sprite}">
     </div>
     <div class="battle-text"></div>
     <div class="pkmn-party"></div>
     <div class="battle-moves"></div>
     <div class="run-catch">
       <button class="e4-leave">Run</button>
     </div>
    `;
    gameContainer.append(e4Div);

    pkmnPartyDivs = [];
    for (let i = 0; i < pkmnParty.length; i++) {
        pkmnPartyDivs.push(document.createElement('div'));
        pkmnPartyDivs[i].setAttribute('class', `battle-party battle-party-${i}`);
        pkmnPartyDivs[i].innerHTML = `
        <img id="${i}" class='battle-icon' src=${pkmnParty[i].icon}>
        `;
        document.querySelector('.pkmn-party').append(pkmnPartyDivs[i]);
    }

    movesDiv = [];
    battleText = [];
    for (let i = 0; i < pkmnParty[0].moves.length; i++) {
        movesDiv.push(document.createElement('button'));
        movesDiv[i].innerText = pkmnParty[0].moves[i];
        movesDiv[i].setAttribute('class', `moves-button move-${i}`);
        document.querySelector('.battle-moves').append(movesDiv[i]);
    }

    const healthContainer = [document.querySelector('.your-health-container'), document.querySelector('.opp-health-container')];
    let playerHpDiv = createHealthBar('player');
    healthContainer[0].append(playerHpDiv);
    playerHp = new HealthBar(playerHpDiv, 100);

    let oppHpDiv = createHealthBar('opp');
    healthContainer[1].append(oppHpDiv);
    oppHp = new HealthBar(oppHpDiv, 100);

    e4Mp3.play();
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

/*----- E4 Details -----*/
addGlobalEventListener('mouseover', '.e4', e => {
    let e4Get = e.target.getAttribute('class').split(' ')[1];
    let e4DetailsDiv = document.querySelector(`.${e4Get}-details`);
    e4DetailsDiv.classList.remove('hidden');
})
addGlobalEventListener('mouseout', '.e4', e => {
    let e4Get = e.target.getAttribute('class').split(' ')[1];
    let e4DetailsDiv = document.querySelector(`.${e4Get}-details`);
    e4DetailsDiv.classList.add('hidden');
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

    setTimeout(() => {
        if (oppPkmn.currentHp <= 0 && gameState === "gym leader battle") {
            switchPkmn('gym leader battle', 0, 'opp');
        }
        if (oppPkmn.currentHp <= 0 && gameState === "e4 battle") {
            switchPkmn('e4 battle', 0, 'opp');
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
        if (oppPkmn.currentHp <= 0 && gameState === "e4 battle") {
            switchPkmn('e4 battle', 0, 'opp');
        }
        if (teamCheck()) {
            showBattleText("You're out of usable pokemon");
            if (e4Name) {
                e4Beaten = [];
                let jsonArr = [];
                localStorage.setItem('e4Beaten', jsonArr);
            }
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

// Main Menu > Elite Four Selection
addGlobalEventListener('click', '.text3', e => {
    removeElement(".main-menu");
    renderEliteFourSelection();
    gameState = 'elite four selection';
});

// Gym Leader Selection > Main Menu
addGlobalEventListener('click', '.go-back', e => {
    removeElement(".gymleader-selection-container");
    renderMainMenu();
    gameState = 'main menu';
});

// Elite Four Selection > Main Menu
addGlobalEventListener('click', '.e4-go-back', e => {
    removeElement(".e4-selection-container");
    renderMainMenu();
    gameState = 'main menu';

    e4Beaten = [];
    let jsonArr = [];
    localStorage.setItem('e4Beaten', jsonArr);
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
    stopAudio(e4Mp3);
    stopAudio(victoryMp3);
    canSwitch = true;

    //Save Badges to the local Storage
    let arr = JSON.stringify(gymBadges);
    localStorage.setItem('gymBadges', arr);
});

//Elite Four Selection > Elite Four Battle
addGlobalEventListener('click', '.e4', e => {
    removeElement(".e4-selection-container");
    gameState = 'e4 battle';
    switch (e.target.getAttribute('id')) {
        case 'lorelei':
            e4PlaceHolder = e4Lorelei;
            e4Team = structuredClone(e4Lorelei.fullTeam);
            e4Name = e4Lorelei.name;
            break;
        case 'bruno':
            e4PlaceHolder = e4Bruno;
            e4Team = structuredClone(e4Bruno.fullTeam);
            e4Name = e4Bruno.name;
            break;
        case 'agatha':
            e4PlaceHolder = e4Agatha;
            e4Team = structuredClone(e4Agatha.fullTeam);
            e4Name = e4Agatha.name;
            break;
        case 'lance':
            e4PlaceHolder = e4Lance;
            e4Team = structuredClone(e4Lance.fullTeam);
            e4Name = e4Lance.name;
            break;
    }

    renderEliteFourBattle();
});

//E4 Battle > E4 Selection
addGlobalEventListener('click', '.e4-leave', e => {
    if (e4Team.length > 0) {
        for (let i = 0; i < pkmnParty.length; i++) {
            if (pkmnParty[i].currentHp > 0) {
                showBattleText("You can't run from an Elite Four Battle!");
                return;
            }
        }
    }
    removeElement(".gym-container");
    gameState = 'e4 selection';
    healParty();
    renderEliteFourSelection();
    stopAudio(gymLeaderFinalMp3);
    stopAudio(gymLeaderMp3);
    stopAudio(e4Mp3);
    stopAudio(victoryMp3);
    canSwitch = true;

    //Save Badges to the local Storage
    let arr = JSON.stringify(e4Beaten);
    localStorage.setItem('e4Beaten', arr);
});

//--Game State--
switch (gameState) {
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