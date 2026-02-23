const emojis = ['🍕', '🐶', '🚗', '🌟', '🎵', '🎲', '📱', '🎯'];
const cards = [...emojis, ...emojis]; // duplicate the emojis to create pairs

// Leaderboard array to store times for this session
let leaderboard = [];

// Timer variables
let startTime = null;
let timerInterval = null;

// Confetti setup
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiAnimationId = null;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

// Confetti functions
function createConfetti() {
    confettiPieces = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
    
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocityY: Math.random() * 3 + 2,
            velocityX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
}

function drawConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiPieces.forEach(piece => {
        confettiCtx.save();
        confettiCtx.translate(piece.x + piece.w / 2, piece.y + piece.h / 2);
        confettiCtx.rotate(piece.rotation * Math.PI / 180);
        confettiCtx.fillStyle = piece.color;
        confettiCtx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        confettiCtx.restore();
        
        piece.y += piece.velocityY;
        piece.x += piece.velocityX;
        piece.rotation += piece.rotationSpeed;
    });
    
    // Remove pieces that have fallen off screen
    confettiPieces = confettiPieces.filter(piece => piece.y < confettiCanvas.height);
    
    if (confettiPieces.length > 0) {
        confettiAnimationId = requestAnimationFrame(drawConfetti);
    } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function launchConfetti() {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }
    createConfetti();
    drawConfetti();
}

// Timer functions
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 10);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    return startTime ? ((Date.now() - startTime) / 1000).toFixed(2) : 0;
}

function updateTimerDisplay() {
    if (startTime) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        document.getElementById('time-display').textContent = elapsed;
    }
}

function resetTimer() {
    stopTimer();
    startTime = null;
    document.getElementById('time-display').textContent = '0.00';
}

// Leaderboard functions
function addToLeaderboard(time) {
    leaderboard.push(parseFloat(time));
    leaderboard.sort((a, b) => a - b); // Sort ascending (fastest first)
    leaderboard = leaderboard.slice(0, 10); // Keep only top 10
    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    const leaderboardEl = document.getElementById('leaderboard');
    
    if (leaderboard.length === 0) {
        leaderboardEl.innerHTML = '<li class="text-gray-500">No scores yet</li>';
        return;
    }
    
    leaderboardEl.innerHTML = leaderboard
        .map((time, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            return `<li class="py-1">${medal} ${time.toFixed(2)}s</li>`;
        })
        .join('');
}

// Game setup
setUpGame();

function setUpGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear previous cards before setting up new ones
    resetTimer();
    
    let gameStarted = false;
    let matchedPairs = 0;
    const totalPairs = emojis.length;
    
    function shuffle(cards) {
        const shuffled = [...cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const shuffleCards = shuffle(cards);

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    shuffleCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'w-20 h-20 rounded-lg bg-white flex items-center justify-center text-2xl cursor-pointer transform transition-all duration-200 hover:scale-105';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.dataset.matched = 'false';
        card.textContent = '';

        card.addEventListener('click', () => {
            if (lockBoard || card.textContent !== '' || card.dataset.matched === 'true') return;
            
            // Start timer on first card click
            if (!gameStarted) {
                gameStarted = true;
                startTimer();
            }
            
            card.textContent = card.dataset.emoji;

            if (!firstCard) {
                firstCard = card;
                return;
            }

            secondCard = card;

            if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                firstCard.dataset.matched = 'true';
                secondCard.dataset.matched = 'true';
                firstCard.classList.add('bg-green-200');
                secondCard.classList.add('bg-green-200');
                matchedPairs++;
                
                firstCard = null;
                secondCard = null;
                
                // Check for win
                if (matchedPairs === totalPairs) {
                    const finalTime = stopTimer();
                    addToLeaderboard(finalTime);
                    launchConfetti();
                }
            } else {
                lockBoard = true;
                setTimeout(() => {
                    firstCard.textContent = '';
                    secondCard.textContent = '';

                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;
                }, 1000);
            }
        });
        gameBoard.appendChild(card);
    });
}

// Reset button - remove old listener by replacing button
const oldResetBtn = document.getElementById('reset-btn');
const newResetBtn = oldResetBtn.cloneNode(true);
oldResetBtn.parentNode.replaceChild(newResetBtn, oldResetBtn);
newResetBtn.addEventListener('click', () => {
    setUpGame();
});
