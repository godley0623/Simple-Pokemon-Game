let criticalHitMp3 = playAudio('criticalHit.mp3', 1);

function cap(str) {
    const firstLetter = str.charAt(0)

    const firstLetterCap = firstLetter.toUpperCase()

    const remainingLetters = str.slice(1)

    return firstLetterCap + remainingLetters
}

/*----- type matchups -----*/

function setTypeMatchup(type){
    let weakTo = [];
    let resist = [];
    let immuneTo = [];

    //Set the type match up for the first type
    switch(type[0]){
        case "Fire":
            weakTo.push("Water", "Rock", "Ground");
            resist.push("Grass", "Steel", "Fairy", "Fire", "Ice", "Bug");
            break;
        case "Water":
            weakTo.push("Grass", "Electric");
            resist.push("Water", "Fire", "Ice", "Steel");
            break;
        case "Grass":
            weakTo.push("Fire", "Ice", "Bug", "Flying", "Poison");
            resist.push("Grass", "Water", "Ground", "Electric");
            break;
        case "Electric":
            weakTo.push("Ground");
            resist.push("Electric", "Flying", "Steel")
            break;
        case "Normal":
            weakTo.push("Fighting");
            immuneTo.push("Ghost");
            break;
        case "Flying":
            weakTo.push("Electric", "Ice", "Rock");
            resist.push("Fighting", "Bug", "Grass");
            immuneTo.push("Ground");
            break;
        case "Bug":
            weakTo.push("Flying", "Rock", "Fire");
            resist.push("Fighting", "Ground", "Grass");
            break;
        case "Poison":
            weakTo.push("Ground", "Psychic");
            resist.push("Fighting", "Poison", "Bug", "Grass", "Fairy");
            break;
        case "Rock":
            weakTo.push("Water", "Grass", "Fighting", "Steel", "Ground");
            resist.push("Normal", "Fire", "Flying", "Poison", );
            break;
        case "Ground":
            weakTo.push("Water", "Grass", "Ice");
            resist.push("Poison", "Rock");
            immuneTo.push("Electric");
            break;
        case "Fighting":
            weakTo.push("Flying", "Psychic", "Fairy");
            resist.push("Rock", "Bug", "Dark");
            break;
        case "Psychic":
            weakTo.push("Ghost", "Dark", "Bug");
            resist.push("Fighting", "Psychic");
            break;
        case "Ghost":
            weakTo.push("Ghost", "Dark");
            resist.push("Poison", "Bug");
            immuneTo.push("Fighting", "Normal");
            break;
        case "Dark":
            weakTo.push("Fighting", "Bug", "Fairy")
            resist.push("Ghost", "Dark");
            immuneTo.push("Psychic");
            break;
        case "Steel":
            weakTo.push("Fire", "Ground", "Fighting");
            resist.push("Normal", "Psychic", "Bug", "Grass", "Fairy", "Flying", "Rock", "Steel", "Ice", "Dragon");
            immuneTo.push("Poison");
            break;
        case "Fairy":
            weakTo.push("Steel", "Poison");
            resist.push("Bug", "Fighting", "Dark");
            immuneTo.push("Dragon");
            break;
        case "Ice":
            weakTo.push("Fighting", "Fire", "Rock", "Steel");
            resist.push("Ice");
            break;
        case "Dragon":
            weakTo.push("Ice", "Dragon", "Fairy");
            resist.push("Fire", "Water", "Grass", "Electric");
            break;
    }

    //Set the type match up for the second type
    switch(type[1]){
        case "Fire":
            weakTo.push("Water", "Rock", "Ground");
            resist.push("Grass", "Steel", "Fairy", "Fire", "Ice", "Bug");
            break;
        case "Water":
            weakTo.push("Grass", "Electric");
            resist.push("Water", "Fire", "Ice", "Steel");
            break;
        case "Grass":
            weakTo.push("Fire", "Ice", "Bug", "Flying", "Poison");
            resist.push("Grass", "Water", "Ground", "Electric");
            break;
        case "Electric":
            weakTo.push("Ground");
            resist.push("Electric", "Flying", "Steel")
            break;
        case "Normal":
            weakTo.push("Fighting");
            immuneTo.push("Ghost");
            break;
        case "Flying":
            weakTo.push("Electric", "Ice", "Rock");
            resist.push("Fighting", "Bug", "Grass");
            immuneTo.push("Ground");
            break;
        case "Bug":
            weakTo.push("Flying", "Rock", "Fire");
            resist.push("Fighting", "Ground", "Grass");
            break;
        case "Poison":
            weakTo.push("Ground", "Psychic");
            resist.push("Fighting", "Poison", "Bug", "Grass", "Fairy");
            break;
        case "Rock":
            weakTo.push("Water", "Grass", "Fighting", "Steel", "Ground");
            resist.push("Normal", "Fire", "Flying", "Poison", );
            break;
        case "Ground":
            weakTo.push("Water", "Grass", "Ice");
            resist.push("Poison", "Rock");
            immuneTo.push("Electric");
            break;
        case "Fighting":
            weakTo.push("Flying", "Psychic", "Fairy");
            resist.push("Rock", "Bug", "Dark");
            break;
        case "Psychic":
            weakTo.push("Ghost", "Dark", "Bug");
            resist.push("Fighting", "Psychic");
            break;
        case "Ghost":
            weakTo.push("Ghost", "Dark");
            resist.push("Poison", "Bug");
            immuneTo.push("Fighting", "Normal");
            break;
        case "Dark":
            weakTo.push("Fighting", "Bug", "Fairy")
            resist.push("Ghost", "Dark");
            immuneTo.push("Psychic");
            break;
        case "Steel":
            weakTo.push("Fire", "Ground", "Fighting");
            resist.push("Normal", "Psychic", "Bug", "Grass", "Fairy", "Flying", "Rock", "Steel", "Ice", "Dragon");
            immuneTo.push("Poison");
            break;
        case "Fairy":
            weakTo.push("Steel", "Poison");
            resist.push("Bug", "Fighting", "Dark");
            immuneTo.push("Dragon");
            break;
        case "Ice":
            weakTo.push("Fighting", "Fire", "Rock", "Steel");
            resist.push("Ice");
            break;
        case "Dragon":
            weakTo.push("Ice", "Dragon", "Fairy");
            resist.push("Fire", "Water", "Grass", "Electric");
            break;
    }
    
    return [weakTo, resist, immuneTo, type];
}

function weaknessCheck(matchup){
    let w = 0;
    let r = 1;
    let i = 2;

    let dmg = {};
    let dupe = false;

    let fourTimes = [];
    let twoTimes = [];
    let halfResist = [];
    let quarterResist = [];
    let immune = [];

    //Check Weakness
    for(let o = 0; o < matchup[w].length; o++){
        if (matchup[w][o] != undefined){
            if(matchup[w].length > o+1){
                for(let p = o+1; p < matchup[w].length; p++){
                    if(matchup[w][o] == matchup[w][p]){
                        dmg[matchup[w][o]] = 4;
                        delete matchup[w][p];
                        dupe = true
                    }
                }
            }
            if(!dupe){
                dmg[matchup[w][o]] = 2;
            } else{
                dupe = false;
            }
        }
    }

    //Check Resist
    for(let o = 0; o < matchup[r].length; o++){
        if (matchup[r][o] != undefined){
            if(matchup[r].length > o+1){
                for(let p = o+1; p < matchup[r].length; p++){
                    if(matchup[r][o] == matchup[r][p]){
                        dmg[matchup[r][o]] = dmg[matchup[r][o]] / 4 || .25;
                        delete matchup[r][p];
                        dupe = true
                    }
                }
            }
            if(!dupe){
                dmg[matchup[r][o]] = dmg[matchup[r][o]] / 2 || .5;
            } else{
                dupe = false;
            }
        }

        //Remove from the dict if resist becomes normal effective
        if (dmg[matchup[r][o]] == 1){
            delete dmg[matchup[r][o]];
        }
    }

    //Check Immunity
    for(let o = 0; o < matchup[i].length; o++){
        if (matchup[i][o] != undefined){
            if(matchup[i].length > o+1){
                for(let p = o+1; p < matchup[i].length; p++){
                    if(matchup[i][o] == matchup[i][p]){
                        dmg[matchup[i][o]] = dmg[matchup[i][o]] * 0 || 0;
                        delete matchup[i][p];
                        dupe = true
                    }
                }
            }
            if(!dupe){
                dmg[matchup[i][o]] = dmg[matchup[i][o]] * 0 || 0;
            } else{
                dupe = false;
            }
        }
    }     

    //Seperating the types in different arrays
    for (const [key, value] of Object.entries(dmg)) {
        switch (value) {
            case 4:
                fourTimes.push(key);
                break;
            case 2:
                twoTimes.push(key);
                break;
            case .5:
                halfResist.push(key);
                break;
            case .25:
                quarterResist.push(key);
                break;
            case 0:
                immune.push(key);
                break;
        }
    }

    return {
        fourXEff: fourTimes,
        twoXEff: twoTimes,
        fourXRes: quarterResist,
        twoXRes: halfResist,
        immune: immune
    }
}

function weaknessText(wArray) {
    var ft = "4x weak to: ";
    var tt = "2x weak to: ";
    var hr = "2x resistance to: ";
    var qr = "4x resistance to: ";
    var im = "Immune to: ";
    var type;

    wArray[5][1] != "None" ? type = `[${wArray[5][0]} / ${wArray[5][1]}]\n\n` : type = `[${wArray[5][0]}]\n\n`;

    //Four Times Weak
    for (var i = 0; i < wArray[0].length; i++) {
        ft = ft + `${wArray[0][i]}, `;
    }
    if (ft != "4x weak to: ") {
        ft = ft.slice(0, -2);
    }
    ft = ft + "\n\n";

    //Two Times Weak
    for (var i = 0; i < wArray[1].length; i++) {
        tt = tt + `${wArray[1][i]}, `;
    }
    if (tt != "2x weak to: ") {
        tt = tt.slice(0, -2);
    }
    tt = tt + "\n\n";

    //Four Times Resist
    for (var i = 0; i < wArray[2].length; i++) {
        qr = qr + `${wArray[2][i]}, `;
    }
    if (qr != "4x resistance to: ") {
        qr = qr.slice(0, -2);
    }
    qr = qr + "\n\n";

    //Two Times Resist
    for (var i = 0; i < wArray[3].length; i++) {
        hr = hr + `${wArray[3][i]}, `;
    }
    if (hr != "2x resistance to: ") {
        hr = hr.slice(0, -2);
    }
    hr = hr + "\n\n";

    //Immune
    for (var i = 0; i < wArray[4].length; i++) {
        im = im + `${wArray[4][i]}, `;
    }
    if (im != "Immune to: ") {
        im = im.slice(0, -2);
    }

    return type + ft + tt + qr + hr + im;
}

function getTypes() {
    var typeOne = document.getElementById("pkm-type1");
    var typeOneText = typeOne.options[typeOne.selectedIndex].text;
    var typeTwo = document.getElementById("pkm-type2");
    var typeTwoText = typeTwo.options[typeTwo.selectedIndex].text;

    return [typeOneText, typeTwoText];
}

function weaknessAlert() {
    typeM = setTypeMatchup(getTypes());
    weakC = weaknessCheck(typeM);
    weakT = weaknessText(weakC);

    //alert(weakT);
    var div = document.getElementById("hidden-pkm-type-matchups");

    if (div.style.display === "") {
        var p = document.createElement("p");
        p.id = "display-text";
        document.getElementById("hidden-pkm-type-matchups").appendChild(p);
        div.style.display = "block"; 
    }

    document.getElementById("display-text").innerText = weakT;
    return weakT;
}


/*----- calculation -----*/
function choose (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
    
}

export function speedCheck (yourPkmn, oppPkmn) {
    let speedTieLoser;
    if (yourPkmn.spd > oppPkmn.spd) {
        return [yourPkmn, oppPkmn]
    } else if (yourPkmn.spd < oppPkmn.spd) {
        return [oppPkmn, yourPkmn];        
    } else {
        let speedTieWinner = choose([yourPkmn, oppPkmn]);
        if (speedTieWinner === yourPkmn) {
            speedTieLoser = oppPkmn;
        } else {
            speedTieLoser = yourPkmn;
        }
        return [speedTieWinner, speedTieLoser]
    }
}

function critCalc () {
    if (Math.floor(Math.random() * 16) === 1) {
        return 2
    } else {
        return 1
    }
}

function missCalc () {
    if (Math.floor(Math.random() * 11) === 1) {
        return 0;
    } else {
        return 1;
    }
}

let fourEff = 2.5;
let twoEff = 1.75;
let fourRes = .4;
let twoRes = .75;
let stab = 1.5;

export function weaknessCalc (pkmn, moveType) {
    const typeMatchup = weaknessCheck(setTypeMatchup([cap(pkmn.type[0]), cap(pkmn.type[1])]));
    let arr = Object.entries(typeMatchup);

    let multiplier;
    let types;
    for (let i = 0; i < arr.length; i++) {
        multiplier = arr[i][0];
        types = arr[i][1].join(' ');

        if (multiplier === 'fourXEff' && types.includes(moveType)) {
            return fourEff;
        }
        else if (multiplier === 'twoXEff' && types.includes(moveType)) {
            return twoEff;
        }
        else if (multiplier === 'fourXRes' && types.includes(moveType)) {
            return fourRes;
        }
        else if (multiplier === 'twoXRes' && types.includes(moveType)) {
            return twoRes;
        }
        else if (multiplier === 'immune' && types.includes(moveType)) {
            return 0;
        }
    }

    return 1;
}

function stabCalc (pkmn, moveType) {
    let types = pkmn.type.join(' ');
    if (types.includes(moveType)) {
        return stab;
    } else {
        return 1;
    }
}

export function damageCalc (attacker, defender, moveType, showBattleText) {
    let baseCalc = Math.floor(attacker.atk - defender.def / 3.5);
    let weakness = weaknessCalc(defender, moveType);
    let crit = critCalc();
    let random = Math.floor(Math.random() * 3);
    let miss = missCalc();
    let stabCheck = stabCalc(attacker, moveType);

    if (baseCalc <= 0) baseCalc = 1;

    //Check if a miss or crit happens and then update the battle text
    if (weakness === 0) {
        console.log("It doesn't affect X");
        showBattleText(`It doesn't affect ${cap(defender.name)}`);
    }

    if (miss !== 1 && weakness !== 0) {
        console.log('The attack missed');
        showBattleText(`The attack missed.`);
    }
    if (miss === 1) {
        if (crit !== 1) {
            console.log('Critical Hit!!!');
            showBattleText(`It's a Critical Hit!!!`);
            criticalHitMp3.play();
        }
        if (weakness === twoEff || weakness === fourEff) {
            console.log("It's super effective!")
            showBattleText(`It's super effective!`);
        }
        else if (weakness === twoRes || weakness === fourRes) {
            console.log("It's not very effective")
            showBattleText(`It's not very effective`);
        }
    }

        //announcing the attack
        showBattleText(`${cap(attacker.name)} used Attack:${moveType}`);

    return Math.floor(((baseCalc * crit * stabCheck) + random) * weakness * miss);

}

function playAudio (mp3, volume = .25) {
    let audio = new Audio(`assets/audio/${mp3}`);
    audio.volume = volume;
    
    return audio
}