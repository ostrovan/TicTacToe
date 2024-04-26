let playerText = document.getElementById('playerText')
let restartBtn = document.getElementById('restartBtn')
let boxes = Array.from(document.getElementsByClassName('box'))

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')

const O_TEXT = "O"
const X_TEXT = "X"
let currentPlayer = X_TEXT
let spaces = Array(9).fill(null)

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked))
}

let gameActive = true; // Adaugăm o variabilă care să țină evidența dacă jocul este activ sau nu

function getBestMove() {
    // Prioritatea este să verificăm dacă putem câștiga
    for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i];
        if (spaces[a] === currentPlayer && spaces[b] === currentPlayer && spaces[c] === null) {
            return c;
        }
        if (spaces[a] === currentPlayer && spaces[c] === currentPlayer && spaces[b] === null) {
            return b;
        }
        if (spaces[b] === currentPlayer && spaces[c] === currentPlayer && spaces[a] === null) {
            return a;
        }
    }

    // Dacă nu putem câștiga, verificăm să blocăm câștigul utilizatorului
    const opponent = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
    for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i];
        if (spaces[a] === opponent && spaces[b] === opponent && spaces[c] === null) {
            return c;
        }
        if (spaces[a] === opponent && spaces[c] === opponent && spaces[b] === null) {
            return b;
        }
        if (spaces[b] === opponent && spaces[c] === opponent && spaces[a] === null) {
            return a;
        }
    }

    // Dacă nu putem câștiga nici să blocăm, alegem o poziție aleatorie
    const emptySpaces = spaces.reduce((acc, curr, index) => {
        if (curr === null) {
            acc.push(index);
        }
        return acc;
    }, []);

    return emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
}

function computerMove() {
    if (!gameActive) return; // Dacă jocul nu este activ, nu facem nimic

    const bestMove = getBestMove();

    spaces[bestMove] = currentPlayer;
    boxes[bestMove].innerText = currentPlayer;

    if (playerHasWon() !== false) {
        gameActive = false; // Setăm gameActive la false pentru a opri jocul
        playerText.innerHTML = `${currentPlayer} has won!`;
        let winning_blocks = playerHasWon();

        winning_blocks.map(box => (boxes[box].style.backgroundColor = winnerIndicator));
        return;
    }

    // Verificăm dacă mai sunt spații disponibile
    if (!spaces.includes(null)) {
        gameActive = false; // Setăm gameActive la false pentru a opri jocul
        playerText.innerHTML = "It's a draw!";
        return;
    }

    // Schimbăm jucătorul curent
    currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
}

function boxClicked(e) {
    if (!gameActive) return; // Dacă jocul nu este activ, nu facem nimic

    const id = e.target.id;

    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWon() !== false) {
            gameActive = false; // Setăm gameActive la false pentru a opri jocul
            playerText.innerHTML = `${currentPlayer} has won!`;
            let winning_blocks = playerHasWon();

            winning_blocks.map(box => (boxes[box].style.backgroundColor = winnerIndicator));
            return;
        }

        // Verificăm dacă mai sunt spații disponibile
        if (!spaces.includes(null)) {
            gameActive = false; // Setăm gameActive la false pentru a opri jocul
            playerText.innerHTML = "It's a draw!";
            return;
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;

        // După ce utilizatorul a făcut o mișcare, programăm mișcarea computerului cu o întârziere de 2 secunde
        setTimeout(computerMove, 300);
    }
}

const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition

        if(spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a,b,c]
        }
    }
    return false


}

restartBtn.addEventListener('click', restart)

function restart() {
    gameActive = true;
    spaces.fill(null)

    boxes.forEach( box => {
        box.innerText = ''
        box.style.backgroundColor=''
    })

    playerText.innerHTML = 'Tic Tac Toe'

    currentPlayer = X_TEXT
}

startGame()