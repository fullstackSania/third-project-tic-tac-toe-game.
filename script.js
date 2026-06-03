// Game Variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "two-player"; // "two-player" or "vs-ai"
let xScore = 0;
let oScore = 0;
let tieScore = 0;

// DOM Elements
const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const xScoreElement = document.getElementById("xScore");
const oScoreElement = document.getElementById("oScore");
const tieScoreElement = document.getElementById("tieScore");
const winnerModal = document.getElementById("winnerModal");
const modalMessage = document.getElementById("modalMessage");
const modalEmoji = document.getElementById("modalEmoji");

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize game
function init() {
    cells.forEach(cell => {
        cell.addEventListener("click", () => handleCellClick(cell));
    });
    updateTurnDisplay();
}

// Handle cell click
function handleCellClick(cell) {
    const index = cell.getAttribute("data-index");
    
    if (!gameActive || board[index] !== "") return;
    
    // If vs AI and it's O's turn, don't allow click
    if (gameMode === "vs-ai" && currentPlayer === "O") return;
    
    makeMove(index);
    
    // If vs AI and game is still active and it's O's turn
    if (gameMode === "vs-ai" && gameActive && currentPlayer === "O") {
        setTimeout(() => {
            if (gameActive && currentPlayer === "O") {
                aiMove();
            }
        }, 300);
    }
}

// Make a move
function makeMove(index) {
    board[index] = currentPlayer;
    updateCellUI(index);
    
    if (checkWinner()) {
        handleWin();
    } else if (checkTie()) {
        handleTie();
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnDisplay();
    }
}

// Update cell UI
function updateCellUI(index) {
    const cell = cells[index];
    cell.textContent = board[index];
    cell.classList.add(board[index].toLowerCase());
    cell.style.animation = "slideUp 0.3s ease";
}

// Check winner
function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningCells(pattern);
            return true;
        }
    }
    return false;
}

// Highlight winning cells
function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add("winner-cell");
    });
}

// Handle win
function handleWin() {
    gameActive = false;
    
    if (currentPlayer === "X") {
        xScore++;
        xScoreElement.textContent = xScore;
        showModal("🎉", `Player X Wins! 🏆`);
    } else {
        oScore++;
        oScoreElement.textContent = oScore;
        showModal("🎉", `Player O Wins! 🏆`);
    }
    
    updateScoreDisplay();
}

// Handle tie
function handleTie() {
    gameActive = false;
    tieScore++;
    tieScoreElement.textContent = tieScore;
    showModal("🤝", "It's a Tie! 🤝");
    updateScoreDisplay();
}

// Check tie
function checkTie() {
    return board.every(cell => cell !== "");
}

// Show modal
function showModal(emoji, message) {
    modalEmoji.textContent = emoji;
    modalMessage.textContent = message;
    winnerModal.style.display = "flex";
}

// Close modal
function closeModal() {
    winnerModal.style.display = "none";
    resetGame();
}

// Reset game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner-cell");
        cell.style.animation = "";
    });
    
    updateTurnDisplay();
}

// Reset score
function resetScore() {
    xScore = 0;
    oScore = 0;
    tieScore = 0;
    xScoreElement.textContent = xScore;
    oScoreElement.textContent = oScore;
    tieScoreElement.textContent = tieScore;
    resetGame();
}

// Update turn display
function updateTurnDisplay() {
    if (gameActive) {
        turnText.innerHTML = `<span class="player-turn">Player ${currentPlayer}'s Turn</span>`;
    }
}

// Update score display
function updateScoreDisplay() {
    xScoreElement.textContent = xScore;
    oScoreElement.textContent = oScore;
    tieScoreElement.textContent = tieScore;
}

// Set game mode
function setMode(mode) {
    gameMode = mode;
    resetGame();
    resetScore();
    
    // Update active button
    document.querySelectorAll(".mode-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");
    
    // If vs AI and current player is O, AI moves first
    if (gameMode === "vs-ai" && currentPlayer === "O") {
        setTimeout(() => {
            if (gameActive) {
                aiMove();
            }
        }, 500);
    }
}

// AI Move (Smart AI)
function aiMove() {
    if (!gameActive) return;
    
    const bestMove = getBestMove();
    if (bestMove !== -1) {
        makeMove(bestMove);
    }
}

// Get best move using Minimax algorithm
function getBestMove() {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            if (checkWinner()) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    
    // Check if player can win and block
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            if (checkWinner()) {
                board[i] = "";
                return i;
            }
            board[i] = "";
        }
    }
    
    // Take center
    if (board[4] === "") return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === "");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => board[i] === "");
    if (availableEdges.length > 0) {
        return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }
    
    return -1;
}

// Start game
init();