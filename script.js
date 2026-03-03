const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
let blockBoard = false;
let firstCard, secondCard;
let isFirstCardOpened = false;
let moves = 0;

function renderCards(cardsCount) {
    

    const board = document.querySelector('.board');
    const templateCard = document.getElementById('card-template');
    const movesCount = document.querySelector('.moves-count');

    board.innerHTML = '';
    const values = [];
    for (let i = 0; i < cardsCount / 2; i++) {
        values.push(numbers[i % numbers.length]);
    }
    const deck = [...values, ...values];
    deck.sort(() => Math.random() - 0.5);

    for (let i = 0; i < cardsCount; i++) {
        const cardElement = templateCard.content.cloneNode(true).firstElementChild;
        cardElement.querySelector('.card-front').textContent = deck[i];
        cardElement.dataset.value = deck[i];

        cardElement.addEventListener('click', (event) => {
            const card = event.currentTarget;

            if (blockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');
            movesCount.textContent = `Сделано ходов: ${++moves}`;

            if (!isFirstCardOpened) {
                isFirstCardOpened = true;
                firstCard = card;
            } else {
                isFirstCardOpened = false;
                secondCard = card;
                blockBoard = true;
                checkMatch();
            }
            
        });

        board.appendChild(cardElement);
    };
}

function checkMatch() {
    const match = firstCard.dataset.value === secondCard.dataset.value;

    if (match) {
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            reset();
            isAllMatched();
        }, 1000)
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            reset();
        }, 1000);
    }
}

function reset() {
    isFirstCardOpened = false;
    blockBoard = false;
}

function isAllMatched() {
    if (document.querySelectorAll('.card.matched').length === document.querySelectorAll('.card').length) {
        alert(`Победа! Сделано ходов: ${moves}`);
        startGame();
    }
}

function setBoardSize(size) {
    const board = document.querySelector('.board');
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

function startGame() {
    blockBoard = false;
    isFirstCardOpened = false;
    firstCard = null;
    secondCard = null;
    moves = 0;

    setBoardSize(2);
    renderCards(4);
}

startGame();