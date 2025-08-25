// Team Bingo achievements
const bingoItems = [
  "✅ Closed 2+ Jira tickets",
  "🧠 Attended all stand-ups",
  "🧪 Logged a bug with clear repro steps",
  "🧼 Closed a ticket ahead of ETA",
  "🧑‍💻 Completed a task without reopening",
  "🧑‍🏫 Asked a question that helped the team",
  "🧑‍🔧 Unblocked someone else",
  "🧑‍💻 Tagged someone in a helpful comment",
  "🧪 Verified a fix in UAT env",
  "🧑‍💻 Participated in backlog grooming",
  "🧑‍💻 Reviewed 2+ PRs constructively",
  "🧑‍🏫 Clarified acceptance criteria",
  "🧑‍💻 Joined all syncs on time",
  "🧑‍🔧 Updated a test case or checklist",
  "🧑‍💻 Finished a task without reopening it",
  "🧑‍💻 Created a reusable component/test",
  "🧑‍🔧 Helped test a feature outside your module",
  "🧑‍🏫 Shared a tip/tool in chat",
  "🤝 Helped someone outside your usual scope",
  "🧑‍💻 Used a new shortcut/tool/plugin",
  "🧑‍💻 Completed a task with zero rework",
  "🧑‍🔧 Participated in a retro discussion",
  "🧑‍🏫 Explained a blocker clearly",
  "🗣️ Got a shoutout",
  "🧑‍💻 Finished a task without reminders"
];

let currentCard = [];
let markedSquares = new Set();

// LocalStorage key constants
const STORAGE_KEYS = {
  CURRENT_CARD: 'teamBingoCurrentCard',
  MARKED_SQUARES: 'teamBingoMarkedSquares',
  USER_NAME: 'teamBingoUserName'
};

// Save game state to localStorage
function saveGameState() {
  localStorage.setItem(STORAGE_KEYS.CURRENT_CARD, JSON.stringify(currentCard));
  localStorage.setItem(STORAGE_KEYS.MARKED_SQUARES, JSON.stringify([...markedSquares]));
}

// Load game state from localStorage
function loadGameState() {
  const savedCard = localStorage.getItem(STORAGE_KEYS.CURRENT_CARD);
  const savedMarkedSquares = localStorage.getItem(STORAGE_KEYS.MARKED_SQUARES);

  if (savedCard && savedMarkedSquares) {
    currentCard = JSON.parse(savedCard);
    markedSquares = new Set(JSON.parse(savedMarkedSquares));
    return true;
  }
  return false;
}

// Clear saved game state
function clearGameState() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_CARD);
  localStorage.removeItem(STORAGE_KEYS.MARKED_SQUARES);
}

// Save user name to localStorage
function saveUserName(name) {
  console.log('Saving user name:', name);
  localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  console.log('User name saved. Verification:', localStorage.getItem(STORAGE_KEYS.USER_NAME));
}

// Load user name from localStorage
function loadUserName() {
  const name = localStorage.getItem(STORAGE_KEYS.USER_NAME);
  console.log('Loading user name from localStorage:', name);
  console.log('Type of loaded name:', typeof name);
  return name;
}

// Show name input modal
function showNameModal() {
  const modal = document.getElementById('nameModal');
  const nameInput = document.getElementById('nameInput');
  const submitBtn = document.getElementById('submitName');

  modal.classList.add('show');
  nameInput.focus();

  // Handle form submission
  const handleSubmit = () => {
    const name = nameInput.value.trim();
    if (name) {
      saveUserName(name);
      displayUserName(name);
      modal.classList.remove('show');

      // Remove event listeners to prevent multiple bindings
      submitBtn.removeEventListener('click', handleSubmit);
      nameInput.removeEventListener('keypress', handleKeyPress);
      nameInput.removeEventListener('input', handleInput);

      initializeBingoCard();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Handle input changes
  const handleInput = () => {
    submitBtn.disabled = !nameInput.value.trim();
  };

  // Add event listeners (only once)
  submitBtn.addEventListener('click', handleSubmit);
  nameInput.addEventListener('keypress', handleKeyPress);
  nameInput.addEventListener('input', handleInput);

  // Initially disable submit button
  submitBtn.disabled = true;
}

// Display user name in the UI
function displayUserName(name) {
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');

  userName.textContent = name;
  userInfo.style.display = 'block';
}

// Initialize the bingo card
function initializeBingoCard() {
  const bingoCard = document.getElementById('bingoCard');
  bingoCard.innerHTML = '';

  // Try to load saved game state first
  const hasLoadedState = loadGameState();

  if (!hasLoadedState) {
    // If no saved state, create new random card
    markedSquares.clear();
    const shuffledItems = [...bingoItems].sort(() => Math.random() - 0.5);
    currentCard = shuffledItems.slice(0, 24);
    markedSquares.add(12); // Add FREE space
    saveGameState();
  }

  // Create 25 squares (5x5 grid)
  for (let i = 0; i < 25; i++) {
    const square = document.createElement('div');
    square.className = 'bingo-square';
    square.dataset.index = i;

    // Center square (index 12) is FREE
    if (i === 12) {
      square.textContent = 'FREE SPACE';
      square.className += ' free';
    } else {
      // Adjust index for items array (account for FREE space)
      const itemIndex = i < 12 ? i : i - 1;
      square.textContent = currentCard[itemIndex];
    }

    // Restore marked state
    if (markedSquares.has(i)) {
      square.classList.add('marked');
    }

    square.addEventListener('click', () => toggleSquare(i));
    bingoCard.appendChild(square);
  }
}

// Toggle square marked state
function toggleSquare(index) {
  const square = document.querySelector(`[data-index="${index}"]`);

  // Don't allow toggling the FREE space
  if (index === 12) return;

  if (markedSquares.has(index)) {
    markedSquares.delete(index);
    square.classList.remove('marked');
  } else {
    markedSquares.add(index);
    square.classList.add('marked');
  }

  // Save state after each change
  saveGameState();
  checkForBingo();
}

// Check for bingo (5 in a row, column, or diagonal)
function checkForBingo() {
  const winConditions = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
  ];

  for (let condition of winConditions) {
    if (condition.every(index => markedSquares.has(index))) {
      celebrateBingo();
      return;
    }
  }
}

async function get() {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };

  req.open("GET", "https://api.jsonbin.io/v3/b/68abd5edae596e708fd45e67/latest", true);
  req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
  req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");
  req.setRequestHeader("X-BIN-META", "false");
  req.send();
}

// Celebrate bingo win
function celebrateBingo() {
  // Show completion message in the user info area
  const userInfo = document.getElementById('userInfo');
  const welcomeText = userInfo.querySelector('.welcome-text');

  // Replace welcome text with congratulations
  welcomeText.innerHTML = `🎉 BINGO! Great job ${loadUserName()}! 🎉`;
  welcomeText.style.color = '#4CAF50';
  userInfo.style.background = 'linear-gradient(145deg, #e8f5e8, #c8e6c9)';
  userInfo.style.borderColor = '#4CAF50';

  // Save winner to store
  const winnerName = loadUserName();
  if (winnerName) {
    saveWinner(winnerName).then(() => {
      console.log('Winner saved successfully');
      // Refresh winners display after saving
      displayWinners();
    }).catch(error => {
      console.error('Error saving winner:', error);
    });
  }

  // Create confetti
  createConfetti();
}

// Create confetti animation
function createConfetti() {
  const confettiContainer = document.getElementById('confettiContainer');

  // Clear any existing confetti first
  confettiContainer.innerHTML = '';

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

  // Create 50 confetti pieces
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Random horizontal position
    confetti.style.left = Math.random() * 100 + '%';

    // Random color
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Random animation delay (0 to 1 second)
    confetti.style.animationDelay = Math.random() * 1 + 's';

    // Random animation duration (3 to 5 seconds)
    confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';

    // Random size variation
    const size = Math.random() * 6 + 6; // 6px to 12px
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';

    // Ensure animation plays only once
    confetti.style.animationIterationCount = '1';
    confetti.style.animationFillMode = 'forwards';

    confettiContainer.appendChild(confetti);
  }

  // Clear confetti after animation completes
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 6000); // Increased timeout to ensure all animations complete
}

// Display winners function
async function displayWinners() {
  try {
    const data = await getWinners();
    const winnersSection = document.getElementById('winnersSection');
    const winnersList = document.getElementById('winnersList');

    // Extract winners array from the bin structure
    const winners = data && data.winners ? data.winners : [];

    if (winners.length > 0) {
      winnersList.innerHTML = '';

      // Show most recent 5 winners
      const recentWinners = winners.slice(-5).reverse();

      recentWinners.forEach((winner, index) => {
        const winnerItem = document.createElement('div');
        winnerItem.className = 'winner-item';

        // Add position classes and badges for top 3
        if (index === 0) {
          winnerItem.classList.add('first-place');
          const badge = document.createElement('div');
          badge.className = 'position-badge first';
          badge.textContent = '1';
          winnerItem.appendChild(badge);
        } else if (index === 1) {
          winnerItem.classList.add('second-place');
          const badge = document.createElement('div');
          badge.className = 'position-badge second';
          badge.textContent = '2';
          winnerItem.appendChild(badge);
        } else if (index === 2) {
          winnerItem.classList.add('third-place');
          const badge = document.createElement('div');
          badge.className = 'position-badge third';
          badge.textContent = '3';
          winnerItem.appendChild(badge);
        }

        const winnerName = document.createElement('span');
        winnerName.className = 'winner-name';
        winnerName.textContent = winner.name;

        const winnerDate = document.createElement('span');
        winnerDate.className = 'winner-date';

        // Format the UTC date to local date/time
        const date = new Date(winner['date-time']);
        winnerDate.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        winnerItem.appendChild(winnerName);
        winnerItem.appendChild(winnerDate);
        winnersList.appendChild(winnerItem);
      });
    } else {
      // Show "no winners" message when list is empty
      winnersList.innerHTML = '<div class="no-winners">No winners yet. Be the first!</div>';
    }
  } catch (error) {
    console.error('Error displaying winners:', error);
    const winnersList = document.getElementById('winnersList');
    winnersList.innerHTML = '<div class="no-winners">No winners yet. Be the first!</div>';
  }
}

// Reset the card
function resetCard() {
  markedSquares.clear();
  const squares = document.querySelectorAll('.bingo-square');
  squares.forEach(square => {
    square.classList.remove('marked');
  });
  // Keep FREE space marked
  markedSquares.add(12);

  // Restore welcome text
  const savedName = loadUserName();
  if (savedName && savedName.trim() !== '') {
    const userInfo = document.getElementById('userInfo');
    const welcomeText = userInfo.querySelector('.welcome-text');
    welcomeText.innerHTML = `Welcome, <span id="userName">${savedName}</span>!`;
    welcomeText.style.color = '#1565c0';
    userInfo.style.background = 'linear-gradient(145deg, #e3f2fd, #bbdefb)';
    userInfo.style.borderColor = '#90caf9';
  }

  // Hide completion message (if it exists)
  const completionMessage = document.getElementById('completionMessage');
  if (completionMessage) {
    completionMessage.style.display = 'none';
  }

  // Clear winners from store
  clearWinners().then(() => {
    console.log('Winners cleared successfully');
    // Show "no winners" message after clearing
    displayWinners();
  }).catch(error => {
    console.error('Error clearing winners:', error);
  });

  // Save the reset state
  saveGameState();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
  const savedName = loadUserName();

  // Debug: Log the saved name to console
  console.log('Saved name from localStorage:', savedName);

  // Check if teamBingoUserName is empty, null, or just whitespace
  if (savedName && savedName.trim() !== '') {
    // User has played before and has a valid name, show their name and initialize the card
    console.log('Valid name found, displaying user name and initializing card');
    displayUserName(savedName);
    initializeBingoCard();

    // Load and display winners on page load
    displayWinners();
  } else {
    // First time user or name is empty, show name input modal
    console.log('No valid name found, showing modal');
    showNameModal();

    // Still load winners even for new users
    displayWinners();
  }

  document.getElementById('resetBtn').addEventListener('click', resetCard);

  // Add animations
  setTimeout(() => {
    const squares = document.querySelectorAll('.bingo-square');
    squares.forEach((square, index) => {
      square.style.animationDelay = `${index * 50}ms`;
    });
  }, 100);
});