//!VARIABLES
//CONSTANTS BASED ON GAME MODE
const KEY = "stone";
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
let HISTORY = document.querySelector("#history");
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
let win = false;
let lost = false;

//INITALIZE THE GAME
createBoard();
difficultySetting();

//!FUNCTIONS
//FUNCTION TO MAKE "LETTER" AMOUNT OF LINES
function createBoard() {
    GAMEBOARD.style.gridTemplateColumns = `repeat(${LETTERS}, 1fr)`;
    for (let i = 1; i <= LETTERS; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.setAttribute("id", i);
        GAMEBOARD.appendChild(line);
    }
}

//FUNCTION TO LOAD DIFFICULTY SETTING
function difficultySetting() {
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
                shareLinkHref.setAttribute('href', HREFPREFIX + HARDWIN + starBuilder(2,"🌟"));
            }
            else if (currentGuess == 3) {
                shareLinkHref.setAttribute('href', HREFPREFIX + HARDWIN + starBuilder(1,"🌟"));
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

    generateScoreCard();
}

//FUNCTION TO SHOW LOSS
function lossScreen() {
    let ulost = "ULOST";
    for (let i = 1; i <= LETTERS; i++) {
        LINES[i].innerHTML = ulost[i-1];

        LINES[i].style.color = RED;
    }

    SHAREBUTTON.style.backgroundColor = WHITE;
    SHAREBUTTON.style.color = BLACK;
    generateScoreCard();
}

//FUNCTION TO CALL API
async function checkResponseStatus(input) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
      if (response.status === 404) {
        return false; // return false if the response returns a 404 error
      } else if (response.ok) {
        return true; // return true if the response is successful
      }
    } catch (error) {
      console.error(error);
    }
    return false; // return false if there is an error making the request
}

//FUNCTION OF STUFF TO DO WHEN THE WORD IS REAl
function wordIsReal(userInput) {
    //check if word is real and unique
    let unique = uniqueGuess(userInput);

    //make sure the word hasn't already been guessed
    if (unique) {
        //show the history list
        HISTORYHEADER.style.color = WHITE;

        //add word to guessed list
        guessedWords[currentGuess-1] = userInput;

        //if word is correct
        if (correctWord(userInput)) {
            //make sharebutton clickable
            SHAREBUTTON.style.backgroundColor = WHITE;
            SHAREBUTTON.style.color = BLACK;

            //stop all keyinput
            win = true;

            //make all the characters green and generate the score card for the share button
            winScreen();
        }
        else {
            //remove all the characters from the line
            resetInput();

            //update currentGuess
            currentGuess++;
        }

        //update the history
        updateHistory(userInput);
    }
    else {
        alert("You have already guessed that word!");
        resetInput();
    }

    (currentGuess == 4) ? lost = true : lost = false;

    if (lost) {
        lossScreen();
    }
}

//FUNCTION OF STUFF TO DO WHEN THE WORD IS NOT REAL
function wordIsNotReal() {
    alert("Please only enter real words!");
    resetInput();
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
        //get the word
        let userInput = stringBuilder().toLowerCase();

        checkResponseStatus(userInput)
        .then((result) => {
            if (result == true) {
                wordIsReal(userInput);
            }
            else if (result == false) {
                wordIsNotReal();
            }

            currentLocation = 0;
        })
    }



    //inputting letters (only happens when the game isn't won and you haven't guessed more than "NUMOFGUESS")
    else if (isLetter(key) && !win && currentGuess <= NUMOFGUESS && currentLocation < 5) {
        //updated index
        currentLocation++;

        //update the "line" to contain text
        LINES[currentLocation].innerHTML = key;
    }
}); 