/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let cards = document.querySelectorAll('.card');
let prevCard = null;
let matchesLeft = 8;
let moves = 0;

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        console.log('matches left', matchesLeft);
        console.log('prev', prevCard);
        console.log('curr', card);
        if(card.classList.contains('match') || card === prevCard) {
            return;
        } else if(prevCard === null) {
            card.classList.add('open', 'show');
            prevCard = card;
        } else {
            let symbol = card.firstElementChild.classList[1];
            let prevSymbol = prevCard ? prevCard.firstElementChild.classList[1] : '';

            if(symbol === prevSymbol) {
                showCardsMatch(prevCard, card);
            } else {
                showCardsDoNotMatch(prevCard, card);
            }         
        }
    })
});

const showCardsMatch = (prev, curr) => {
    prev.classList.remove('open', 'show');
    curr.classList.add('match', 'animated', 'tada');
    prev.classList.add('match', 'animated', 'tada');

    updateMoves();
    matchesLeft--;
    prevCard = null;

    setTimeout(function(){
        curr.classList.remove('animated', 'tada');
        prev.classList.remove('animated', 'tada');

        if(matchesLeft === 0) {
            alert(`Congratulations, you won in ${moves} moves!`);
        }
    },500); // for 1s = 1000ms
};

const showCardsDoNotMatch = (prev, curr) => {
    prev.classList.remove('open', 'show');
    curr.classList.add('no-match', 'animated', 'wobble');
    prev.classList.add('no-match', 'animated', 'wobble');
    
    updateMoves();
    prevCard = null;

    setTimeout(function(){
        curr.classList.remove('no-match', 'animated', 'wobble');
        prev.classList.remove('no-match', 'animated', 'wobble');
    },500); // for 1s = 1000ms
};

// Increase # of moves and update its display value
const updateMoves = () => {
    moves++;
    document.querySelectorAll('.moves')[0].textContent = moves;
}