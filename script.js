let blockBoard = false;
let firstCard, secondCard;
let isFirstCardOpened = false;
let moves = 0;

const cardCount = 4;

function renderCards(cardsCount) {
    const board = document.querySelector('.board');
    const templateCard = document.getElementById('card-template');
    const movesCount = document.querySelector('.moves-count');

    movesCount.textContent = '';
    board.innerHTML = '';
    const values = [];
    for (let i = 1; i < cardsCount**2 / 2 + 1; i++) {
        values.push(i);
    }
    const deck = [...values, ...values];
    deck.sort(() => Math.random() - 0.5);

    for (let i = 0; i < cardsCount**2; i++) {
        const cardElement = templateCard.content.cloneNode(true).firstElementChild;
        cardElement.querySelector('.card-front').textContent = deck[i];
        cardElement.dataset.value = deck[i];

        cardElement.addEventListener('click', (event) => {
            const card = event.currentTarget;

            if (blockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

            card.classList.add('flipped');
            movesCount.textContent = `Перевернуто карточек: ${++moves}`;

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
        alert(`Победа! Перевернуто карточек: ${moves}`);
        menu.classList.remove('visibility-hidden');
        game.classList.add('visibility-hidden');
    }
}

function setBoardSize(size) {
    const board = document.querySelector('.board');
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

function startGame(val) {
    blockBoard = false;
    isFirstCardOpened = false;
    firstCard = null;
    secondCard = null;
    moves = 0;

    setBoardSize(val);
    renderCards(val);
}

const sizeRange = document.getElementById('size-range');
const sizeSpan = document.getElementById('size-value');

sizeRange.addEventListener('input', (e) => {
    const val = e.target.value;
    sizeSpan.textContent = `${val}x${val}`;
});

const menu = document.querySelector('.start-menu');
const game = document.querySelector('.game');

document.querySelector('.start-button').addEventListener('click', () => {
        menu.classList.add('visibility-hidden');
        game.classList.remove('visibility-hidden');
        startGame(sizeRange.value);
    }
);

document.querySelector('.home-button').addEventListener('click', () => {
        menu.classList.remove('visibility-hidden');
        game.classList.add('visibility-hidden');
})