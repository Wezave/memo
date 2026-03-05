let blockBoard = false;
let firstCard, secondCard;
let isFirstCardOpened = false;
let moves = 0;
let currentTheme = 'numbers';

const menu = document.querySelector('.start-menu');
const game = document.querySelector('.game');
const board = document.querySelector('.board');
const winOverlay = document.querySelector('.win-overlay');
const winMovesSpan = document.querySelector('.victory-moves');
const winMenuButton = document.querySelector('.victory-menu-button');
const templateCard = document.getElementById('card-template');
const movesCount = document.querySelector('.moves-count');

const pairsRange = document.getElementById('pairs-range');
const pairsSpan = document.getElementById('pairs-value');
pairsRange.addEventListener('input', (e) => {
    const val = e.target.value;
    pairsSpan.textContent = `${val} пар (${val*2} карт)`;
});

const themeButtons = document.querySelectorAll('.theme-button');
themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTheme = btn.dataset.theme;
    });
});

const themes = {
    numbers: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19'],
    flags: ['🇦🇫','🇦🇽','🇦🇱','🇩🇿','🇦🇸','🇦🇩','🇦🇴','🇦🇮','🇦🇶','🇦🇬','🇦🇷','🇦🇲','🇦🇼','🇦🇺','🇦🇹','🇦🇿','🇧🇸','🇧🇭','🇧🇩','🇧🇧','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇲','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇻'],
    emojis: ['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','🤗','🤔','😐','😑',
             '😶','🙄','😏','😣','😥','😮','🤐','😯','😪']
};

function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function generateDeck(pairs, theme) {
    let values;
    if (theme === 'numbers') {
        values = [];
        for (let i = 0; i < pairs; i++) values.push(i.toString());
    } else {
        const arr = themes[theme];
        values = [];
        for (let i = 0; i < pairs; i++) {
            values.push(arr[Math.floor(Math.random() * arr.length)]);
        }
    }
    const deck = [...values, ...values];
    deck.sort(() => Math.random() - 0.5);
    return deck;
}

function renderCards(pairs) {
    const totalCards = pairs * 2;
    const mobile = isMobile();
    const deck = generateDeck(pairs, currentTheme);
    const gap = 10;
    const containerWidth = board.getBoundingClientRect().width;

    board.style.display = 'flex';
    board.style.flexWrap = 'wrap';
    board.style.justifyContent = 'center';
    board.style.gap = `${gap}px`;
    board.style.gridTemplateColumns = '';
    board.classList.toggle('mobile-board', mobile);
    board.innerHTML = '';

    let cardWidth, cardHeight;
    if (!mobile) {
        cardWidth = cardHeight = 100;
    } else {
        const minCardSize = 80;
        
        const maxColsByWidth = Math.floor((containerWidth + gap) / (minCardSize + gap));
        const maxCols = Math.min(maxColsByWidth, totalCards);
        const targetRatio = 1.5;
        const [rows, cols] = (() => {
            let bestCols = 2, bestDiff = Infinity;
            for (let c = 2; c <= maxCols; c++) {
                const r = Math.ceil(totalCards / c);
                const ratio = r / c;
                const diff = Math.abs(ratio - targetRatio);
                if (diff < bestDiff || (diff === bestDiff && c > bestCols)) {
                    bestDiff = diff;
                    bestCols = c;
                }
            }
            return [Math.ceil(totalCards / bestCols), bestCols];
        })();

        const availableHeight = 0.8 * window.innerHeight;
        const maxCardHeight = (availableHeight - (rows - 1) * gap) / rows;
        const maxCardWidth = (containerWidth - (cols - 1) * gap) / cols;
        let size = Math.min(maxCardWidth, maxCardHeight);
        cardWidth = cardHeight = Math.max(size, minCardSize);
    }

    for (let i = 0; i < totalCards; i++) {
        const cardElement = templateCard.content.cloneNode(true).firstElementChild;
        cardElement.querySelector('.card-front').textContent = deck[i];
        cardElement.dataset.value = deck[i];
        cardElement.style.width = cardWidth + 'px';
        cardElement.style.height = cardHeight + 'px';

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
        winMovesSpan.textContent = moves;
        winOverlay.classList.remove('visibility-hidden');
    }
}

function startGame(pairs) {
    blockBoard = false;
    isFirstCardOpened = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    movesCount.textContent = 'Перевернуто карточек: 0';
    winOverlay.classList.add('visibility-hidden');
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

winMenuButton.addEventListener('click', () => {
    winOverlay.classList.add('visibility-hidden');
    menu.classList.remove('visibility-hidden');
    game.classList.add('visibility-hidden');
});

pairsSpan.textContent = `${pairsRange.value} пар (${pairsRange.value*2} карт)`;