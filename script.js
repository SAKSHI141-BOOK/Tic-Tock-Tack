const board = ['', '', '', '', '', '', '', '', ''];
const player = 'X';
const ai = 'O';
let gameOver = false;
let playerTurn = true;
let aiDifficulty = 'medium';

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const playAgainButton = document.getElementById('play-again');
const difficultySelect = document.getElementById('difficulty');

// Winning combinations
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Check if a player has won
const checkWinner = (player) => {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
};

// Minimax Algorithm for AI to make optimal moves
const minimax = (board, depth, isMaximizing) => {
    if (checkWinner(ai)) return 10 - depth;
    if (checkWinner(player)) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? ai : player;
            let score = minimax(board, depth + 1, !isMaximizing);
            board[i] = '';
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }

    return bestScore;
};

// AI chooses the best move based on difficulty level
const bestMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = ai;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
};

// AI selects a random move for easy difficulty
const randomMove = () => {
    const availableMoves = board.reduce((acc, curr, index) => {
        if (curr === '') acc.push(index);
        return acc;
    }, []);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Handle difficulty change
difficultySelect.addEventListener('change', () => {
    aiDifficulty = difficultySelect.value;
});

// Handle cell click
const handleClick = (index) => {
    if (gameOver || board[index] !== '' || !playerTurn) return;

    board[index] = player;
    cells[index].textContent = player;
    status.textContent = 'AI\'s Turn';

    if (checkWinner(player)) {
        showModal('You Win!');
        return;
    }

    if (board.every(cell => cell !== '')) {
        showModal('It\'s a Draw!');
        return;
    }

    playerTurn = false;

    // AI move
    setTimeout(() => {
        let aiMove;
        if (aiDifficulty === 'easy') {
            aiMove = randomMove();
        } else {
            aiMove = bestMove();
        }
        board[aiMove] = ai;
        cells[aiMove].textContent = ai;

        if (checkWinner(ai)) {
            showModal('AI Wins!');
            return;
        }

        if (board.every(cell => cell !== '')) {
            showModal('It\'s a Draw!');
            return;
        }

        playerTurn = true;
        status.textContent = 'Your Turn';
    }, 500);
};

// Show modal with result
const showModal = (message) => {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    gameOver = true;
    setTimeout(() => {
        resetGame();
    }, 2000);
};

// Reset the game
const resetGame = () => {
    board.fill('');
    cells.forEach(cell => cell.textContent = '');
    modal.style.display = 'none';
    status.textContent = 'Your Turn';
    gameOver = false;
    playerTurn = true;
};

// Event listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleClick(index));
});

playAgainButton.addEventListener('click', resetGame);







