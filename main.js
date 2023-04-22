//!VARIABLES

//CONSTANTS BASED ON GAME MODE
const KEY = "seven";
const LETTERS = KEY.length;
const NUMOFGUESS = 3;

//PALLETTE
const RED = "#FC372A";
const GREEN = "#7AE243";
const BLUE = "#0073FF";
const YELLOW = "#FCF52C";
const WHITE = "#EBEBCF";
const BLACK = "#242424";

//CODE FOR CHANGING COLOR OF PROMPT BASED ON GAME MODE
const MODE = window.location.href;
const PROMPT = document.querySelector("#prompt");
const GAMEBOARD = document.querySelector("#board");
const LINES = document.getElementById("board").childNodes;
const HISTORY = document.querySelector("#history");
const HISTORYHEADER = HISTORY.querySelector("p");
const SHAREBUTTON = document.querySelector("#share");

//VARIABLES FOR DYNAMIC SHARING
let shareLinkHref = document.querySelector("#shareLink");
const HREFPREFIX = "sms:&body=";

//VARIABLES FOR THE HARD/MED/EZ SUCCESS/FAIL MESSAGES
const HARDWIN = "I am truthful to Coach Matt’s difficult riddles. Here's what I scored: ";
const HARDLOSS = "I failed CMDR. But no matter, at least I did not succumb to the temptation of easy difficulty.";
const MEDWIN = "I beat Coach Matt’s riddle today! Here’s what I scored: ";
const MEDLOSS = "I failed CMDR. I am a certifed 🤡.";
const EZWIN = "I beat Coach Matt’s riddle today! But I played on easy mode… Here’s what I scored: ";
const EZLOSS = "I failed CMDR… And I played on the easiest difficult. Coach Matt has defeated me.";

//VARIABLES THAT CHANGE
let currentLocation = 0;
let currentGuess = 1;
let guessedWords = [];
let real = true;
let win = false;
let lost = false;

//VARS FOR TESTING LGSS
let gamesPlayed = 0;

//INITALIZE THE GAME
initLocalStorage();
createBoard();


//difficulty settings
if (MODE.includes("easy")) {
    PROMPT.style.color = GREEN;
    blueLines()
}
else if (MODE.includes("med")) {
    PROMPT.style.color = YELLOW;
    blueLines();
}
else /* (MODE.includes("hard")) */ { 
    PROMPT.style.color = RED;
}


//!FUNCTIONS

//FUNCTION TO MAKE "LETTER" AMOUNT OF LINES
function createBoard() {
    for (let i = 1; i <= LETTERS; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.setAttribute("id", i);
        GAMEBOARD.appendChild(line);
    }
}

//FUNCTION TO MAKE BINARY ARRAY TO FIND VOWEL/CONSONANT (Y COUNTS, AND 0 == CONSONANT, 1 == VOWEL)
function vcArray(word) {
    let array = [];
    for (let i = 0; i < LETTERS; i++) {
        if (word[i] == "a" || word[i] == "e" || word[i] == "i" || word[i] == "o" || word[i] == "u" || word[i] == "y") {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    return array;
}

//FUNCTION TO COLOR LINES IF ON EASY/MED MODE
function blueLines() {
    let vowelArray = vcArray(KEY);
    let lineList = document.querySelectorAll(".line");

    //go over all the lines
    for (let i = 0; i < lineList.length; i++) {
        //if the line currently selected is a vowel, set it to blue
        if (vowelArray[i] == 1) {
            lineList[i].style.borderColor = BLUE;
        }
    }
}

//FUNCTION TO MAKE SURE THE BUTTONS INPUTTED ARE ALPHABETICAL LETTERS
function isLetter(input) {
    return (input.length == 1) && (input.toLowerCase() != input.toUpperCase());
}

//FUNCTION TO BUILD A STRING OUT OF ALL THE LETTERS INPUTTED
function stringBuilder() {
    let string = "";
    for (let i = 1; i <= LETTERS; i++) {
        string += LINES[i].innerHTML;
    }
    return string;
}

//FUNCTION TO COMPARE THE WORD INPUTTED TO THE CORRECT WORD
function correctWord(input) {
    for (let i = 0; i < LETTERS; i++) {
        if (input[i] != KEY[i]) {
            return false;
        }
    }
    return true;
}

//FUNCTION TO FIGURE OUT WHICH LETTERS ARE CORRECT OR NOT
function letterLocations(input) {
    let colors = [];
    for (let i = 0; i < LETTERS; i++) {
        //if it's in the correct spot
        if (input[i] == KEY[i]) {
            colors[i] = "G";
        }
        //if it's not in the correct spot, but in the word
        else if(KEY.includes(input[i])) {
            colors[i] = "Y";
        }
    }
    return colors;
}

//FUNCTION TO UPDATE THE COLORS OF THE LINES
function updateLineColors(input, colorArray) {
    for (let i = 0; i < LETTERS; i++) {
        //if the letter is in the correct spot, update it to green
        if (colorArray[i] == "G") {
            input[i].style.color = GREEN;
        }

        //if the letter is in the word, but not in the correct spot, update it to yellow
        else if(colorArray[i] == "Y") {
            input[i].style.color = YELLOW;
        }
    }
}

//FUNCTION TO CHECK IF THE WORD HAS ALREADY BEEN GUESSED
function uniqueGuess(input) {
    for (let i = 0; i < guessedWords.length; i++) {
        if (input == guessedWords[i]) {
            return false;
        }
    }
    return true;
}

//FUNCTION TO RESET ALL THE LINES TO BE BLANK
function resetInput() {
    for (let i = 1; i <= LETTERS; i++) {
        LINES[i].innerHTML = "";
    }
}

//FUNCTION TO ADD WORD TO THE HISTORY LIST
function updateHistory(input) {
    //create a new p with the word, and add it inside the "history" div
    let newP = document.createElement("p");

    //if it's easy mode, we need to update which characters are r/y/g
    if (MODE.includes("easy")) {
        //array of which lines need to be green/red/yellow
        let colorsArray = letterLocations(input);

        //create all the spans, put them inside the p.
        for (let i = 0; i < LETTERS; i++) {
            let span = document.createElement("span");
            let spanContent = document.createTextNode(input[i]);
            span.setAttribute("id", i);
            span.appendChild(spanContent);
            newP.appendChild(span);
        }

        //update colors. passes all the spans we created and the color array into function
        updateLineColors(newP.childNodes,colorsArray);
    }


    else { //just add the word inside the p tag.
        let pContent = document.createTextNode(input);
        newP.appendChild(pContent);
    }

    newP.setAttribute("id", "guess" + currentGuess);
    HISTORY.appendChild(newP);
}

//FUNCTION TO BUILD THE NUMBER OF STARS
function starBuilder(numOfStars, star) {
    let stars = "";
    for (let i = 0; i < numOfStars; i++) {
        stars += star;
    }
    return stars;
}

//FUNCTION TO GENERATE SCORE CARD
function generateScoreCard() {
    let scoreCard = "";

    if (win || lost) {
        if (MODE.includes("easy")) {
            if (currentGuess == 1) {
                shareLinkHref.setAttribute('href', HREFPREFIX + EZWIN + starBuilder(3,"⭐"));
            }
            else if(currentGuess == 2) {
                shareLinkHref.setAttribute('href', HREFPREFIX + EZWIN + starBuilder(2,"⭐"));
            }
            else if (currentGuess == 3) {
                shareLinkHref.setAttribute('href', HREFPREFIX + EZWIN + starBuilder(1,"⭐"));
            }
            else {
                shareLinkHref.setAttribute('href', HREFPREFIX + EZLOSS);
            }
        }

        else if (MODE.includes("med")) {
            if (currentGuess == 1) {
                shareLinkHref.setAttribute('href', HREFPREFIX + MEDWIN + starBuilder(3,"⭐"));
            }
            else if(currentGuess == 2) {
                shareLinkHref.setAttribute('href', HREFPREFIX + MEDWIN + starBuilder(2,"⭐"));
            }
            else if (currentGuess == 3) {
                shareLinkHref.setAttribute('href', HREFPREFIX + MEDWIN + starBuilder(1,"⭐"));
            }
            else {
                shareLinkHref.setAttribute('href', HREFPREFIX + MEDLOSS);
            }
        }

        else {
            if (currentGuess == 1) {
                shareLinkHref.setAttribute('href', HREFPREFIX + HARDWIN + starBuilder(3,"🌟"));
            }
            else if(currentGuess == 2) {
                shareLinkHref.setAttribute('href', HREFPREFIX + HARDWIN + starBuilder(3,"🌟"));
            }
            else if (currentGuess == 3) {
                shareLinkHref.setAttribute('href', HREFPREFIX + HARDWIN + starBuilder(3,"🌟"));
            }
            else {
                shareLinkHref.setAttribute('href', HREFPREFIX + HARDLOSS);
            }
        }
    }
}

//FUNCTION TO SHOW WIN
function winScreen() {
    for (let i = 1; i <= LETTERS; i++) {
        LINES[i].style.color = GREEN;
    }
}

//FUNCTIO TO SHOW LOSS
function lossScreen() {
    let ulost = "ULOST";
    for (let i = 1; i <= LETTERS; i++) {
        LINES[i].innerHTML = ulost[i-1];

        LINES[i].style.color = RED;
    }
}

//FUNCTION TO CHECK IF A WORD IS REAL //!DOES NOT WORK
function isReal(input) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
    .then(response => {
        if (response.ok) {
            real = true;
        }
        else if(response.status === 404) {
            real = false;
        }
        return response.json();
    })
}

//FUNCTION TO UPDATE THE AMOUNT OF GAMES PLAYED
function updateGamesPlayed() {
    window.localStorage.setItem("gamesPlayed", gamesPlayed + 1);
}

//LOCAL STORAGE STUFF
function initLocalStorage() {
    /*
    let storedCurrentGuess = window.localStorage.getItem("currentGuess");
    let storedGuessedWords = window.localStorage.getItem("guessedWords");
    let storedCurrentLocation = window.localStorage.getItem("currentLocation");
    let storedWin = window.localStorage.getItem("win");
    let storedLost = window.localStorage.getItem("lost"); */
    let storedGamesPlayed = window.localStorage.getItem("gamesPlayed");
    if (!storedGamesPlayed) {
        window.localStorage.setItem("gamesPlayed", gamesPlayed);
    }
    else {
        gamesPlayed = Number(storedGamesPlayed);
    }
}

//FUNCTION TO PRESERVE GAME STATE
function preserveGameState() {
    window.localStorage.setItem('guessedWords', JSON.stringify(guessedWords));
}

//THINGS TO DO WHEN A KEY IS PRESSED
document.addEventListener('keydown', function(event) {
    let key = event.key; //get the key that was pressed
   
    //if delete is pressed
    if ((key == "Backspace" || key == "Delete") && (currentLocation > 0)) {
        //reset the space to blank
        LINES[currentLocation].innerHTML = "";

        //update index
        currentLocation--;
    }



    //if enter is pressed
    else if ((key == "Enter" || key == "Submit") && (currentLocation == LETTERS)) {

        //show the history list once a word has been submitted
        HISTORYHEADER.style.color = WHITE;

        //get the word
        let userInput = stringBuilder().toLowerCase();

        //error checking
        let unique = uniqueGuess(userInput);
        isReal(userInput);

        if (unique && real) {
            //add word to guessed list
            guessedWords[currentGuess-1] = userInput;
            
            //see if the word is correct
            let correct = correctWord(userInput);

            //if word is correct
            if (correct) {
                //make sharebutton clickable
                SHAREBUTTON.style.backgroundColor = WHITE;
                SHAREBUTTON.style.color = BLACK;

                //stop all keyinput
                win = true;

                //make all the characters green (win screen)
                winScreen();

                //calculate score
                generateScoreCard();

                //update games played
                updateGamesPlayed();

            }
            else {
                //remove all the characters from the line
                resetInput();
            }

            currentGuess++;

            //history
            updateHistory(userInput);
        }
        else if (!unique) {
            alert("You have already guessed that word!");
            resetInput();
        }
        else if (!real) {
            alert("please use real english words");
            resetInput();
        }

        if (currentGuess == 4) {
            SHAREBUTTON.style.backgroundColor = WHITE;
            SHAREBUTTON.style.color = BLACK;
            updateGamesPlayed();
            lost = true;
            lossScreen();
            generateScoreCard();
        }

        currentLocation = 0;
    }



    //inputting letters (only happens when the game isn't won and you haven't guessed more than "NUMOFGUESS")
    else if (isLetter(key) && !win && currentGuess <= NUMOFGUESS && currentLocation < 5) {
        //updated index
        currentLocation++;

        //update the "line" to contain text
        LINES[currentLocation].innerHTML = key;
    }
}); 