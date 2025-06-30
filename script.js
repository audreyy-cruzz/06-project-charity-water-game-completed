// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval;
let timeLeft = 30;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Reset score and timer
  document.getElementById("score").textContent = "0";
  timeLeft = 30;
  document.getElementById("time").textContent = timeLeft;

  // Add the water can image if not already present
  if (!document.getElementById('water-can-img')) {
    const canImg = document.createElement('img');
    canImg.src = 'img/water-can-transparent.png';
    canImg.alt = 'Watering Can';
    canImg.id = 'water-can-img';
    canImg.style.position = 'absolute';
    canImg.style.bottom = '20px';
    canImg.style.left = '50%';
    canImg.style.transform = 'translateX(-50%)';
    canImg.style.width = '120px';
    canImg.style.zIndex = '10';
    document.querySelector('.game-wrapper').appendChild(canImg);
  }

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
  if (score >= 20) {
    message = winMessages[Math.floor(Math.random() * winMessages.length)];
    if (!isTimeUp) {
      // Confetti effect
      if (window.confetti) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setTimeout(() => {
        showMessage(`You win! Your score: ${score}. ${message}`);
      }, 300); // Wait 300ms so confetti is visible before message
    }
  } else {
    message = loseMessages[Math.floor(Math.random() * loseMessages.length)];
    if (isTimeUp) {
      showMessage(`Time's up! Your score: ${score}. ${message}`);
    }
  }
}

function showMessage(msg) {
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
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.background = '#FFC907';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.fontSize = '1rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => { msgDiv.style.display = 'none'; };
    msgDiv.appendChild(closeBtn);
    document.body.appendChild(msgDiv);
  }
  msgDiv.innerHTML = `<div>${msg}</div>`;
  // Re-add close button after setting innerHTML
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.marginTop = '20px';
  closeBtn.style.padding = '8px 16px';
  closeBtn.style.background = '#FFC907';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '6px';
  closeBtn.style.fontSize = '1rem';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => { msgDiv.style.display = 'none'; };
  msgDiv.appendChild(closeBtn);
  msgDiv.style.display = 'block';
}

function createDrop() {
  if (!gameRunning) return;

  // Decide if this drop is good (blue) or bad (red)
  const isBadDrop = Math.random() < 0.25; // 25% chance for a red drop

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";
  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  // Increment or decrement score when drop is clicked
  drop.addEventListener("click", () => {
    if (!gameRunning) return;
    const scoreElem = document.getElementById("score");
    let score = parseInt(scoreElem.textContent);

    if (isBadDrop) {
      score = Math.max(0, score - 1); // Prevent negative scores
    } else {
      score += 1;
    }
    scoreElem.textContent = score;
    drop.remove();

    // Check for win condition (only for good drops)
    if (!isBadDrop && score >= 20) {
      endGame();
    }
  });
}

// Add this after your start button event listener
document.getElementById("reset-btn").addEventListener("click", resetGame);

function resetGame() {
  // Stop any running intervals
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  gameRunning = false;

  // Reset score and timer
  document.getElementById("score").textContent = "0";
  timeLeft = 30;
  document.getElementById("time").textContent = timeLeft;

  // Remove all drops
  document.querySelectorAll('.water-drop').forEach(drop => drop.remove());

  // Optionally remove the watering can image
  const canImg = document.getElementById('water-can-img');
  if (canImg) canImg.remove();
}
