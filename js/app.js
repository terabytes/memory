/*
 * Create a list that holds all of your cards
 */
let cards = document.querySelectorAll('.card');
let restart = document.querySelectorAll('.restart')[0];
let seconds = 0;

let opened = [];
let moves = 0;

let cardSymbols = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-anchor',
    'fa-leaf',
    'fa-bicycle',
    'fa-diamond',
    'fa-bomb',
    'fa-leaf',
    'fa-bomb',
    'fa-bolt',
    'fa-bicycle',
    'fa-paper-plane-o',
    'fa-cube'
];

/*
 * Restart the game on click
 */
restart.addEventListener('click', () => {
    restartGame();
});

/*
 * Flip the card open
 */
const openCard = (card) => {
    card.classList.add('open', 'show');
}

/*
 * Check the card on click
 * - see if it's the first card. if it is, open it.
 * - you cannot open a card already matched
 * - if no card has been opened for this pair yet, open it
 * - you cannot open a card previously opened
 * - if the card is a match, mark it as matched
 * - otherwise mark it as unmatched
 */
const checkCard = (card) => {
    if(isEmpty()) {
        openCard(card);
        markAsOpened(card);
    } else if(card.classList.contains('match')) {
        return;
    } else {
        let prevCard = opened[opened.length - 1];
        if(opened.length % 2 === 0) {
            openCard(card);
            markAsOpened(card);
        } else if (card === prevCard) {
            return;
        } else {
            let symbol = card.firstElementChild.classList[1];
            let prevSymbol = prevCard.firstElementChild.classList[1];

            if(symbol === prevSymbol) {
                markAsOpened(card);
                openCardsAsMatched(prevCard, card);
            } else {
                markAsClosed();
                openCardsAsUnmatched(prevCard, card);
            } 
        }
    } 
}

const isGameOver = () => {
    return opened.length === 16;
};

/*
 * Determine if no cards have been opened
 */
const isEmpty = () => {
    return opened.length === 0;
}

/*
 * Mark a card as opened if it is first of a pair in play or matched
 */
const markAsOpened = (card) => {
    opened.push(card);
}

/*
 * Mark a card as closed if it is not matched
 */
const markAsClosed = () => {
    opened.pop();
}

/*
 * Mark a pair of cards as matching
 */
const openCardsAsMatched = (prev, curr) => {
    prev.classList.remove('open', 'show');
    curr.classList.add('match', 'animated', 'tada');
    prev.classList.add('match', 'animated', 'tada');

    setTimeout(function(){
        curr.classList.remove('animated', 'tada');
        prev.classList.remove('animated', 'tada');
        if(isGameOver()) {
            alert(`Congratulations, you won in ${moves} moves in ${seconds} seconds!` +
            ` You have ${getStars()} star(s)! ${getStarDisplay(getStars())}`);
            resetTimer();
        }
    },500); // for 1s = 1000ms

    setMoves(moves + 1);
    updateMovesDisplay();
    updateStars();
};

/*
 * Mark a pair of cards as not matching
 */
const openCardsAsUnmatched = (prev, curr) => {
    prev.classList.remove('open', 'show');
    curr.classList.add('no-match', 'animated', 'wobble');
    prev.classList.add('no-match', 'animated', 'wobble');

    setTimeout(function(){
        curr.classList.remove('no-match', 'animated', 'wobble');
        prev.classList.remove('no-match', 'animated', 'wobble');
    },500); // for 1s = 1000ms

    setMoves(moves + 1);
    updateMovesDisplay();
    updateStars();
};

/*
 * Updates # of moves played
 */
const setMoves = (m) => {
    moves = m;
    
}

/*
 * Gets # of seconds elapsed
 */
const getSeconds = () => {
    return seconds;
}

/*
 * Updates # of seconds elapsed
 */
const setSeconds = (s) => {
    seconds = s;
}

/*
 * Updates # of moves displayed
 */
const updateMovesDisplay = () => {
    document.querySelectorAll('.moves')[0].textContent = moves;
}

/*
 * Updates # of seconds displayed
 */
const updateTimerDisplay = () => {
    document.querySelectorAll('.seconds')[0].textContent = seconds;
}

/*
 * Updates star rating based on # of moves
 */
const updateStars = () => {
    setStars(getStars());
}

/*
 * Determines star rating based on # of moves
 */
const getStars = () => {
    return (moves < 16) ? 3 : (moves < 22) ? 2 : 1;
}

/*
 * Formats text representation of star rating
 */
const getStarDisplay = (stars) => {
    return (stars === 3) ? `⭐⭐⭐` : (stars === 2) ? `⭐⭐` : `⭐`;
}

/*
 * Updates star display
 */
const setStars = (starCount) => {
    let stars = document.querySelectorAll('.stars')[0].children;
    if (starCount === 3) {
        for(let s = 0; s < 3; s++) {
            addSolidStar(stars[s].firstChild.classList);
        }
    }
    else if (starCount === 2) {
        let thirdStar = stars[2].firstChild.classList;
        removeSolidStar(thirdStar); 
    } else {
        let secondStar = stars[1].firstChild.classList;
        removeSolidStar(secondStar);
    }
}

/*
 * Updates star to make it solid
 */
const addSolidStar = (star) => {
    star.add('fa-star');
    star.remove('fa-star-o');
}

/*
 * Updates star to make it empty
 */
const removeSolidStar = (star) => {
    star.add('fa-star-o');
    star.remove('fa-star');
}

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Increment # of seconds every second
 */
const counter = () => {
    setSeconds(getSeconds() + 1);
    updateTimerDisplay();
}

/*
 * Stores unique id of timer
 */
var timerId;

/*
 * Starts timer, inspired by: https://medium.com/@jenniferfadriquela/helper-function-for-setinterval-ebbe2341123e
 */
const startTimer = () => {
    timerId = setInterval(() => {
        if(!isGameOver()) {
            counter();
        }
    }, 1000);
}

/*
 * Resets timer, function from: https://hackernoon.com/handling-time-intervals-in-javascript-83dc70cbfe05
 */
const resetTimer = () => {
    clearInterval(timerId);
}

/*
 * Resets game
 */
const restartGame = () => {
    opened = [];
    cardSymbols = shuffle(cardSymbols);
    cards.forEach((card, index) => {
        card.classList.remove('open', 'show', 'no-match', 'match');
        card.children[0].className = '';
        card.children[0].classList.add('fa', cardSymbols[index]);
    });
    setMoves(0);
    updateMovesDisplay();
    setStars(3);
    setSeconds(0);
    updateTimerDisplay();
    startTimer();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
restartGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
cards.forEach(card => {
    card.addEventListener('click', (e) => {
        checkCard(card);
    })
});


