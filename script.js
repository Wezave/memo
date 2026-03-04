let blockBoard = false;
let firstCard, secondCard;
let isFirstCardOpened = false;
let moves = 0;

const menu = document.querySelector('.start-menu');
const game = document.querySelector('.game');
const board = document.querySelector('.board');
const templateCard = document.getElementById('card-template');
const movesCount = document.querySelector('.moves-count');

const pairsRange = document.getElementById('pairs-range');
const pairsSpan = document.getElementById('pairs-value');
pairsRange.addEventListener('input', (e) => {
    const val = e.target.value;
    pairsSpan.textContent = `${val} пар (${val*2} карт)`;
});

function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function findBestGrid(totalCards, targetRatio, maxCols) {
    let bestCols = 2;
    let bestDiff = Infinity;

    for (let cols = 2; cols <= maxCols; cols++) {
        const rows = Math.ceil(totalCards / cols);
        const ratio = rows / cols;
        const diff = Math.abs(ratio - targetRatio);
        if (diff < bestDiff || (diff === bestDiff && cols > bestCols)) {
            bestDiff = diff;
            bestCols = cols;
        }
    }
    const rows = Math.ceil(totalCards / bestCols);
    return [rows, bestCols];
}

function renderCards(pairs) {
    const totalCards = pairs * 2;
    const mobile = isMobile();

    const containerWidth = board.getBoundingClientRect().width;
    const gap = 10;
    const minCardSize = 80;

    if (!mobile) {
        const cardSize = 100;
        const maxCols = Math.floor((containerWidth + gap) / (cardSize + gap));
        const cols = Math.min(maxCols, totalCards);
        board.style.gridTemplateColumns = `repeat(${cols}, ${cardSize}px)`;
        board.classList.remove('mobile-board');
        board.innerHTML = '';

        const values = [];
        for (let i = 1; i <= pairs; i++) {
            values.push(i);
        }
        const deck = [...values, ...values];
        deck.sort(() => Math.random() - 0.5);

        for (let i = 0; i < totalCards; i++) {
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
        }
        return;
    }

    const maxColsByWidth = Math.floor((containerWidth + gap) / (minCardSize + gap));
    const maxCols = Math.min(maxColsByWidth, totalCards);
    const targetRatio = 1.5;
    const [rows, cols] = findBestGrid(totalCards, targetRatio, maxCols);

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const availableHeight = 0.8 * window.innerHeight;
    const maxCardHeight = (availableHeight - (rows - 1) * gap) / rows;
    const maxCardWidth = (containerWidth - (cols - 1) * gap) / cols;
    let cardSize = Math.min(maxCardWidth, maxCardHeight);
    cardSize = Math.max(cardSize, minCardSize);
    board.style.setProperty('--card-size', `${cardSize}px`);
    board.classList.add('mobile-board');

    board.innerHTML = '';

    const values = [];
    for (let i = 1; i <= pairs; i++) {
        values.push(i);
    }
    const deck = [...values, ...values];
    deck.sort(() => Math.random() - 0.5);

    for (let i = 0; i < totalCards; i++) {
        const cardElement = templateCard.content.cloneNode(true).firstElementChild;
        cardElement.querySelector('.card-front').textContent = deck[i];
        cardElement.dataset.value = deck[i];
        cardElement.style.width = 'var(--card-size)';
        cardElement.style.height = 'var(--card-size)';

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
    }
}

function checkMatch() {
    const match = firstCard.dataset.value === secondCard.dataset.value;

    if (match) {
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            reset();
            isAllMatched();
        }, 1000);
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
    firstCard = null;
    secondCard = null;
}

function isAllMatched() {
    if (document.querySelectorAll('.card.matched').length === document.querySelectorAll('.card').length) {
        alert(`Победа! Перевернуто карточек: ${moves}`);
        menu.classList.remove('visibility-hidden');
        game.classList.add('visibility-hidden');
    }
}

function startGame(pairs) {
    blockBoard = false;
    isFirstCardOpened = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    movesCount.textContent = 'Перевернуто карточек: 0';

    renderCards(pairs);
}

document.querySelector('.start-button').addEventListener('click', () => {
    const pairs = parseInt(pairsRange.value);
    menu.classList.add('visibility-hidden');
    game.classList.remove('visibility-hidden');
    startGame(pairs);
});

document.querySelector('.home-button').addEventListener('click', () => {
    menu.classList.remove('visibility-hidden');
    game.classList.add('visibility-hidden');
});

pairsSpan.textContent = `${pairsRange.value} пар (${pairsRange.value*2} карт)`;