// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval;
let timeLeft = 30;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

// Add difficulty selection UI
const scorePanel = document.querySelector('.score-panel');
const difficultyDiv = document.createElement('div');
difficultyDiv.style.display = 'flex';
difficultyDiv.style.alignItems = 'center';
difficultyDiv.style.gap = '8px';
difficultyDiv.style.marginRight = '10px';
difficultyDiv.innerHTML = `
  <label for="difficulty-select" style="font-size: 16px;">Difficulty:</label>
  <select id="difficulty-select" style="font-size: 16px; padding: 2px 8px; border-radius: 4px;">
    <option value="easy">Easy</option>
    <option value="normal" selected>Normal</option>
    <option value="hard">Hard</option>
  </select>
`;
scorePanel.insertBefore(difficultyDiv, scorePanel.firstChild);

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: { winScore: 10, time: 30 },
  normal: { winScore: 20, time: 45 },
  hard: { winScore: 30, time: 60 }
};
let currentDifficulty = 'normal';
let winScore = DIFFICULTY_SETTINGS[currentDifficulty].winScore;
let difficultyTime = DIFFICULTY_SETTINGS[currentDifficulty].time;
document.getElementById("time").textContent = difficultyTime; // <-- Add this line

document.getElementById('difficulty-select').addEventListener('change', function(e) {
  currentDifficulty = e.target.value;
  winScore = DIFFICULTY_SETTINGS[currentDifficulty].winScore;
  difficultyTime = DIFFICULTY_SETTINGS[currentDifficulty].time;
  document.getElementById("time").textContent = difficultyTime;
});

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Hide cursor in game area
  document.getElementById("game-container").classList.add("hide-cursor");

  // Reset score, timer, and milestones
  document.getElementById("score").textContent = "0";
  timeLeft = DIFFICULTY_SETTINGS[currentDifficulty].time;
  document.getElementById("time").textContent = timeLeft;
  milestonesShown = {};

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Start the timer
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame(true); // Indicate time is up
    }
  }, 1000);
}

function endGame(isTimeUp = false) {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  // Show cursor again when game ends
  document.getElementById("game-container").classList.remove("hide-cursor");

  // Remove remaining drops
  document.querySelectorAll('.water-drop').forEach(drop => drop.remove());

  // Get score
  const score = parseInt(document.getElementById("score").textContent);

  // Winning and losing messages
  const winMessages = [
    "Amazing! You’re a water-saving hero! 💧🏆",
    "Fantastic job! You caught enough drops to make a difference!",
    "Winner! You kept the water flowing!",
    "Great work! You’ve mastered the water drop game!",
    "You did it! The world is a little better thanks to you!"
  ];
  const loseMessages = [
    "Good try! Give it another go to save more water!",
    "Almost there! Try again to catch more drops!",
    "Don’t give up! Every drop counts!",
    "Keep practicing! You can do it!",
    "Try again! The water needs you!"
  ];

  let message;
  // Show WIN message if player reached the winScore (regardless of time)
  if (score >= winScore) {
    message = winMessages[Math.floor(Math.random() * winMessages.length)];
    // Confetti effect
    if (window.confetti) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setTimeout(() => {
      showMessage(`You win! Your score: ${score}. ${message}`, true); // Pass true to show Play Again
    }, 300); // Wait 300ms so confetti is visible before message
  }
  // Show LOSE message if time is up and player did NOT reach winScore
  else if (isTimeUp) {
    message = loseMessages[Math.floor(Math.random() * loseMessages.length)];
    showMessage(`Time's up! Your score: ${score}. ${message}`, false, true); // Show Try Again button
  }
}

// --- Milestone Message Function ---
let milestoneTimeout;
function showMilestoneMessage(msg) {
  let msgDiv = document.getElementById('milestone-message');
  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = 'milestone-message';
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '20%';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translate(-50%, -50%)';
    msgDiv.style.background = '#fffbe7';
    msgDiv.style.border = '2px solid #FFC907';
    msgDiv.style.padding = '20px 32px';
    msgDiv.style.fontSize = '1.2rem';
    msgDiv.style.borderRadius = '10px';
    msgDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
    msgDiv.style.zIndex = '9999';
    msgDiv.style.textAlign = 'center';
    document.body.appendChild(msgDiv);
  }
  msgDiv.innerHTML = `<div>${msg}</div>`;
  msgDiv.style.display = 'block';

  // Clear previous timeout and hide after 5 seconds
  if (window.milestoneTimeout) clearTimeout(window.milestoneTimeout);
  window.milestoneTimeout = setTimeout(() => {
    msgDiv.style.display = 'none';
  }, 5000);
}

// --- Win/Lose Message Function (unchanged, stays until reset) ---
function showMessage(msg, showPlayAgain = false, tryAgain = false) {
  let msgDiv = document.getElementById('game-message');
  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = 'game-message';
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '30%';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translate(-50%, -50%)';
    msgDiv.style.background = '#fffbe7';
    msgDiv.style.border = '2px solid #FFC907';
    msgDiv.style.padding = '32px 40px';
    msgDiv.style.fontSize = '1.5rem';
    msgDiv.style.borderRadius = '12px';
    msgDiv.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    msgDiv.style.zIndex = '9999';
    msgDiv.style.textAlign = 'center';
    document.body.appendChild(msgDiv);
  }

  if (showPlayAgain) {
    msgDiv.innerHTML = `
      <div>${msg}</div>
      <button id="play-again-btn" style="margin-top:20px; padding:10px 24px; font-size:1rem; border-radius:6px; border:none; background:#2E9DF7; color:#fff; cursor:pointer;">Play Again</button>
    `;
    msgDiv.style.display = 'block';
    document.getElementById('play-again-btn').onclick = function() {
      msgDiv.style.display = 'none';
      resetGame();
    };
  } else if (tryAgain) {
    msgDiv.innerHTML = `
      <div>${msg}</div>
      <button id="try-again-btn" style="margin-top:20px; padding:10px 24px; font-size:1rem; border-radius:6px; border:none; background:#F5402C; color:#fff; cursor:pointer;">Try Again</button>
    `;
    msgDiv.style.display = 'block';
    document.getElementById('try-again-btn').onclick = function() {
      msgDiv.style.display = 'none';
      resetGame();
    };
  } else {
    msgDiv.innerHTML = `<div>${msg}</div>`;
    msgDiv.style.display = 'block';
  }
}

// Add player image to the game container
function addPlayer() {
    const gameContainer = document.getElementById('game-container');
    let player = document.getElementById('player');
    if (!player) {
        player = document.createElement('img');
        player.id = 'player';
        player.src = 'img/water-can-transparent.png'; // Use your image path
        player.style.position = 'absolute';
        player.style.width = '90px';
        player.style.height = '90px';
        player.style.left = '370px'; // Centered horizontally (800px wide container)
        player.style.top = '520px';  // Near the bottom (600px tall container)
        player.style.zIndex = 10;
        gameContainer.appendChild(player);
    }
}
addPlayer();

// Player movement variables
let playerX = 370;
let playerY = 520;
const playerSpeed = 20;
const gameWidth = 800;
const gameHeight = 600;

// Listen for arrow key presses instead of WASD
document.addEventListener('keydown', function(e) {
    let moved = false;
    if (e.key === 'ArrowLeft') { // Left
        playerX = Math.max(0, playerX - playerSpeed);
        moved = true;
    }
    if (e.key === 'ArrowRight') { // Right
        playerX = Math.min(gameWidth - 60, playerX + playerSpeed);
        moved = true;
    }
    if (e.key === 'ArrowUp') { // Up
        playerY = Math.max(0, playerY - playerSpeed);
        moved = true;
    }
    if (e.key === 'ArrowDown') { // Down
        playerY = Math.min(gameHeight - 60, playerY + playerSpeed);
        moved = true;
    }
    if (moved) {
        const player = document.getElementById('player');
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';
    }
});

// Modify createDrop to not use click, but check for collision
function createDrop() {
    if (!gameRunning) return;

    const isBadDrop = Math.random() < 0.25;
    const drop = document.createElement("div");
    drop.className = "water-drop";
    if (isBadDrop) drop.classList.add("bad-drop");

    // Make drops different sizes for visual variety
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.8 + 0.5;
    const size = initialSize * sizeMultiplier;
    drop.style.width = drop.style.height = `${size}px`;

    const gameWidth = document.getElementById("game-container").offsetWidth;
    const xPosition = Math.random() * (gameWidth - 60);
    drop.style.left = xPosition + "px";
    drop.style.top = "-60px";
    drop.style.animation = "none"; // We'll animate manually

    document.getElementById("game-container").appendChild(drop);

    // Animate drop falling and check for collision
    let dropY = -60;
    const dropSpeed = 1 + Math.random() * 1.7; // px per frame
    function fall() {
        if (!gameRunning) {
            drop.remove();
            return;
        }
        dropY += dropSpeed;
        drop.style.top = dropY + "px";
        // Collision detection
        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const dropRect = drop.getBoundingClientRect();
        const containerRect = document.getElementById('game-container').getBoundingClientRect();

        // Adjust rects to be relative to container
        const playerBox = {
            left: playerRect.left - containerRect.left,
            right: playerRect.right - containerRect.left,
            top: playerRect.top - containerRect.top,
            bottom: playerRect.bottom - containerRect.top
        };
        const dropBox = {
            left: dropRect.left - containerRect.left,
            right: dropRect.right - containerRect.left,
            top: dropRect.top - containerRect.top,
            bottom: dropRect.bottom - containerRect.top
        };

        // Check overlap
        if (
            playerBox.left < dropBox.right &&
            playerBox.right > dropBox.left &&
            playerBox.top < dropBox.bottom &&
            playerBox.bottom > dropBox.top
        ) {
            // Collected!
            if (!isBadDrop) {
                let score = parseInt(document.getElementById("score").textContent, 10) + 1;
                document.getElementById("score").textContent = score;
                // Play audio
                const audio = document.getElementById('collect-sound');
                if (audio) {
                    audio.currentTime = 0; // rewind to start
                    audio.play();
                }
                // Milestone messages for current difficulty
                (MILESTONES[currentDifficulty] || []).forEach(milestone => {
                    if (score === milestone.score && !milestonesShown[milestone.score]) {
                        // Pick a random message from the array
                        const messages = milestone.messages;
                        const msg = messages[Math.floor(Math.random() * messages.length)];
                        showMilestoneMessage(msg);
                        milestonesShown[milestone.score] = true;
                    }
                });
                // WIN CHECK: End game immediately if winScore reached
                if (score >= winScore) {
                    endGame(false); // Not time up, but win
                    drop.remove();
                    return;
                }
            } else {
                // Bad drop: decrease score by 1, but not below 0
                let score = Math.max(0, parseInt(document.getElementById("score").textContent, 10) - 1);
                document.getElementById("score").textContent = score;
            }
            drop.remove();
            return;
        }

        // Remove drop if it falls out of bounds
        if (dropY > gameHeight) {
            drop.remove();
            return;
        }
        requestAnimationFrame(fall);
    }
    requestAnimationFrame(fall);
}

// Add this after your start button event listener
document.getElementById("reset-btn").addEventListener("click", resetGame);

function resetGame() {
  // Stop any running intervals
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;

  // Show cursor again when game is reset
  document.getElementById("game-container").classList.remove("hide-cursor");

  // Reset score, timer, and milestones
  document.getElementById("score").textContent = "0";
  timeLeft = DIFFICULTY_SETTINGS[currentDifficulty].time;
  document.getElementById("time").textContent = timeLeft;
  milestonesShown = {}; // <-- reset milestones

  // Remove all drops
  document.querySelectorAll('.water-drop').forEach(drop => drop.remove());

  // Reset player position
  playerX = 370;
  playerY = 520;
  const player = document.getElementById('player');
  if (player) {
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
  }

  // Optionally remove the watering can image (if you want to)
  const canImg = document.getElementById('water-can-img');
  if (canImg) canImg.remove();
}

// Milestone scores and messages tailored to difficulty, with random selection
const MILESTONES = {
  easy:    [
    { score: 5, messages: [
      "Halfway there! 🚰",
      "Keep it up! You're doing great! 💧",
      "Awesome! You're halfway to the goal! 🌟"
    ]}
  ],
  normal:  [
    { score: 10, messages: [
      "Halfway there! 🚰",
      "Great job! 10 points reached! 💦",
      "You're making a splash! 🌊"
    ]}
  ],
  hard:    [
    { score: 15, messages: [
      "Halfway there! 🚰",
      "Impressive! 15 points down! 💪",
      "You're a water-catching pro! 🏆"
    ]}
  ]
};
let milestonesShown = {}; // Track which milestones have been shown
