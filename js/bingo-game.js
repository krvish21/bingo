// Core bingo game logic
window.TeamBingo = window.TeamBingo || {};

window.TeamBingo.BingoGame = {
  currentCard: [],
  markedSquares: new Set(),
  completedBingos: new Set(), // Track which bingo patterns have been completed

  // Generate a new random bingo card
  generateCard: function () {
    const shuffled = [...window.TeamBingo.BINGO_ITEMS].sort(() => Math.random() - 0.5);
    this.currentCard = new Array(window.TeamBingo.GAME_CONFIG.GRID_SIZE);

    // Calculate how many regular items we need (total grid minus free space)
    const regularItemsNeeded = window.TeamBingo.GAME_CONFIG.GRID_SIZE - 1;

    // Make sure we have enough items
    if (shuffled.length < regularItemsNeeded) {
      console.warn(`Not enough bingo items: need ${regularItemsNeeded}, have ${shuffled.length}`);
    }

    // Fill all positions except the free space
    let itemIndex = 0;
    for (let i = 0; i < window.TeamBingo.GAME_CONFIG.GRID_SIZE; i++) {
      if (i === window.TeamBingo.GAME_CONFIG.FREE_SPACE_INDEX) {
        this.currentCard[i] = "🎯 FREE SPACE";
      } else {
        // Ensure we don't go beyond available items
        if (itemIndex < shuffled.length) {
          this.currentCard[i] = shuffled[itemIndex];
          itemIndex++;
        } else {
          console.error(`No more items available for position ${i}`);
          this.currentCard[i] = "❓ Missing Item";
        }
      }
    }

    this.markedSquares = new Set();
    this.completedBingos = new Set(); // Reset completed bingos when generating new card
    this.markedSquares.add(window.TeamBingo.GAME_CONFIG.FREE_SPACE_INDEX);

    console.log('Generated new card:', this.currentCard);
    return this.currentCard;
  },

  // Render the bingo card in the DOM
  renderCard: function () {
    const bingoCard = document.getElementById('bingoCard');
    bingoCard.innerHTML = '';

    for (let i = 0; i < window.TeamBingo.GAME_CONFIG.GRID_SIZE; i++) {
      const square = document.createElement('div');
      square.className = 'bingo-square';

      if (i === window.TeamBingo.GAME_CONFIG.FREE_SPACE_INDEX) {
        square.classList.add('free-space', 'marked');
        square.innerHTML = '<div class="square-text">🎯<br>FREE<br>SPACE</div>';
      } else {
        if (this.markedSquares.has(i)) {
          square.classList.add('marked');
        }
        square.innerHTML = `<div class="square-text">${this.currentCard[i]}</div>`;

        square.addEventListener('click', () => this.toggleSquare(i));
      }

      square.style.animationDelay = `${i * 0.03}s`;
      bingoCard.appendChild(square);
    }
  },

  // Toggle a square's marked state
  toggleSquare: function (index) {
    if (index === window.TeamBingo.GAME_CONFIG.FREE_SPACE_INDEX) return;

    const square = document.getElementById('bingoCard').children[index];

    if (this.markedSquares.has(index)) {
      this.markedSquares.delete(index);
      square.classList.remove('marked');
      console.log(`Square ${index} unmarked`);

      // When unmarking, we need to check if any previously completed bingos are no longer valid
      this.recheckCompletedBingos();
    } else {
      this.markedSquares.add(index);
      square.classList.add('marked');
      console.log(`Square ${index} marked`);
    }

    // Save game state
    window.TeamBingo.GameStorage.saveGameState(this.currentCard, this.markedSquares, this.completedBingos);

    // Check for new wins after marking/unmarking
    return this.checkForNewWins();
  },

  // Recheck all bingo conditions to see which ones are still valid (used when unmarking squares)
  recheckCompletedBingos: function () {
    const stillValidBingos = new Set();

    for (let i = 0; i < window.TeamBingo.WIN_CONDITIONS.length; i++) {
      const condition = window.TeamBingo.WIN_CONDITIONS[i];
      const isStillComplete = condition.every(index => this.markedSquares.has(index));

      if (isStillComplete && this.completedBingos.has(i)) {
        stillValidBingos.add(i);
      }
    }

    this.completedBingos = stillValidBingos;
    console.log('Rechecked completed bingos:', Array.from(this.completedBingos));
  },

  // Check for new bingo wins (only trigger celebration for newly completed bingos)
  checkForNewWins: function () {
    console.log('Checking for new wins with marked squares:', Array.from(this.markedSquares));

    const newlyCompletedBingos = [];

    for (let i = 0; i < window.TeamBingo.WIN_CONDITIONS.length; i++) {
      const condition = window.TeamBingo.WIN_CONDITIONS[i];
      const isComplete = condition.every(index => this.markedSquares.has(index));

      // If this bingo is complete but we haven't celebrated it yet
      if (isComplete && !this.completedBingos.has(i)) {
        this.completedBingos.add(i);
        newlyCompletedBingos.push({
          index: i,
          condition: condition,
          type: this.getBingoType(i)
        });
        console.log(`NEW BINGO! Pattern ${i} (${this.getBingoType(i)}) completed:`, condition);
      }
    }

    // Return info about newly completed bingos for celebration
    return {
      hasNewBingo: newlyCompletedBingos.length > 0,
      newBingos: newlyCompletedBingos,
      totalBingos: this.completedBingos.size
    };
  },

  // Get human-readable bingo type description
  getBingoType: function (conditionIndex) {
    // Based on standard 5x5 bingo win conditions
    if (conditionIndex < 5) return `Row ${conditionIndex + 1}`;
    if (conditionIndex < 10) return `Column ${conditionIndex - 4}`;
    if (conditionIndex === 10) return 'Diagonal (Top-Left to Bottom-Right)';
    if (conditionIndex === 11) return 'Diagonal (Top-Right to Bottom-Left)';
    return `Pattern ${conditionIndex + 1}`;
  },

  // Load saved game state
  loadSavedState: function () {
    const savedState = window.TeamBingo.GameStorage.loadGameState();

    if (savedState.hasState) {
      this.currentCard = savedState.currentCard;
      this.markedSquares = savedState.markedSquares;
      this.completedBingos = savedState.completedBingos || new Set(); // Load completed bingos
      console.log('Loaded saved game state');
      return true;
    }

    return false;
  },

  // Reset the game
  reset: function () {
    this.generateCard();
    this.renderCard();
    this.completedBingos = new Set(); // Reset completed bingos
    window.TeamBingo.GameStorage.clearGameState();
    console.log('Game reset');
  },

  // Initialize or continue game
  initializeGame: function () {
    const hasLoadedState = this.loadSavedState();

    if (!hasLoadedState) {
      this.generateCard();
    }

    this.renderCard();
    console.log('Game initialized');
  }
};