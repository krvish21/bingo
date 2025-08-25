// Main application controller
window.TeamBingo = window.TeamBingo || {};

window.TeamBingo.BingoApp = {
  currentUserName: null,

  // Initialize the entire application
  init: function () {
    console.log('Initializing Team Bingo application...');

    this.setupEventListeners();
    this.checkForExistingUser();
    this.loadWinners();
  },

  // Set up all event listeners
  setupEventListeners: function () {
    // Name submission
    const submitNameBtn = document.getElementById('submitName');
    const nameInput = document.getElementById('nameInput');

    submitNameBtn.addEventListener('click', () => this.handleNameSubmission());
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleNameSubmission();
    });

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => this.resetGame());
  },

  // Check if user already exists in storage
  checkForExistingUser: function () {
    const savedName = window.TeamBingo.UserStorage.loadUserName();
    console.log('Checking for existing user. Found:', savedName);

    if (savedName && savedName.trim() !== '') {
      this.currentUserName = savedName;
      this.displayUserName(savedName);
      this.startGame();
    } else {
      this.showNameModal();
    }
  },

  // Display user name in header
  displayUserName: function (name) {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (userInfo && userName) {
      userName.textContent = name;
      userInfo.style.display = 'block';
    }
  },

  // Show the name input modal
  showNameModal: function () {
    const modal = document.getElementById('nameModal');
    modal.classList.add('show');

    // Focus on input field
    const nameInput = document.getElementById('nameInput');
    setTimeout(() => nameInput.focus(), 100);
  },

  // Hide the name input modal
  hideNameModal: function () {
    const modal = document.getElementById('nameModal');
    modal.classList.remove('show');
  },

  // Handle name submission
  handleNameSubmission: function () {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name === '') {
      alert('Please enter your name!');
      return;
    }

    console.log('Name submitted:', name);
    this.currentUserName = name;
    window.TeamBingo.UserStorage.saveUserName(name);
    this.displayUserName(name);

    this.hideNameModal();
    this.startGame();
  },

  // Start the bingo game
  startGame: function () {
    console.log('Starting game for user:', this.currentUserName);
    window.TeamBingo.BingoGame.initializeGame();

    // Override the toggleSquare method to handle wins
    const originalToggleSquare = window.TeamBingo.BingoGame.toggleSquare.bind(window.TeamBingo.BingoGame);
    window.TeamBingo.BingoGame.toggleSquare = (index) => {
      const winResult = originalToggleSquare(index);

      // Handle newly completed bingos
      if (winResult.hasNewBingo) {
        this.handleNewBingos(winResult);
      }

      return winResult;
    };
  },

  // Handle newly completed bingos with individual celebration for each
  handleNewBingos: async function (winResult) {
    console.log(`${winResult.newBingos.length} new bingo(s) completed!`);

    // Celebrate each newly completed bingo individually
    for (let i = 0; i < winResult.newBingos.length; i++) {
      const bingo = winResult.newBingos[i];

      // Add delay between multiple bingo celebrations
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      console.log(`Celebrating bingo: ${bingo.type}`);

      // Create confetti for each bingo
      window.TeamBingo.UIUtils.createConfetti();

      // Show specific bingo achievement message
      window.TeamBingo.UIUtils.celebrateBingo(
        this.currentUserName,
        bingo.type,
        winResult.totalBingos
      );

      // Save this individual bingo win to API/storage
      try {
        await window.TeamBingo.ApiService.saveWinner(this.currentUserName, bingo.type);
        console.log(`Winner saved for ${bingo.type}`);
      } catch (error) {
        console.error(`Failed to save winner for ${bingo.type}:`, error);
      }
    }

    // Reload winners list after all celebrations
    this.loadWinners();
  },

  // Handle bingo win (legacy method - now unused but kept for compatibility)
  handleWin: async function () {
    // This method is no longer used since we handle individual bingos in handleNewBingos
    // Kept for backward compatibility
  },

  // Reset the game
  resetGame: function () {
    console.log('Resetting game...');

    // Reset UI
    if (this.currentUserName) {
      window.TeamBingo.UIUtils.resetUserInfo(this.currentUserName);
    }

    // Reset game logic
    window.TeamBingo.BingoGame.reset();

    // Reload winners (in case of changes)
    this.loadWinners();
  },

  // Load and display winners
  loadWinners: async function () {
    console.log('Loading winners...');
    await window.TeamBingo.WinnersUI.displayWinners(
      window.TeamBingo.ApiService.getWinners.bind(window.TeamBingo.ApiService)
    );
  }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  window.TeamBingo.BingoApp.init();
});