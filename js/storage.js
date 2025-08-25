// Game state management
window.TeamBingo.GameStorage = {
  saveGameState: function (currentCard, markedSquares, completedBingos) {
    localStorage.setItem(window.TeamBingo.STORAGE_KEYS.CURRENT_CARD, JSON.stringify(currentCard));
    localStorage.setItem(window.TeamBingo.STORAGE_KEYS.MARKED_SQUARES, JSON.stringify([...markedSquares]));
    localStorage.setItem(window.TeamBingo.STORAGE_KEYS.COMPLETED_BINGOS, JSON.stringify([...completedBingos]));
  },

  loadGameState: function () {
    const savedCard = localStorage.getItem(window.TeamBingo.STORAGE_KEYS.CURRENT_CARD);
    const savedMarkedSquares = localStorage.getItem(window.TeamBingo.STORAGE_KEYS.MARKED_SQUARES);
    const savedCompletedBingos = localStorage.getItem(window.TeamBingo.STORAGE_KEYS.COMPLETED_BINGOS);

    if (savedCard && savedMarkedSquares) {
      return {
        currentCard: JSON.parse(savedCard),
        markedSquares: new Set(JSON.parse(savedMarkedSquares)),
        completedBingos: savedCompletedBingos ? new Set(JSON.parse(savedCompletedBingos)) : new Set(),
        hasState: true
      };
    }
    return { hasState: false };
  },

  clearGameState: function () {
    localStorage.removeItem(window.TeamBingo.STORAGE_KEYS.CURRENT_CARD);
    localStorage.removeItem(window.TeamBingo.STORAGE_KEYS.MARKED_SQUARES);
    localStorage.removeItem(window.TeamBingo.STORAGE_KEYS.COMPLETED_BINGOS);
  }
};

// User management
window.TeamBingo.UserStorage = {
  saveUserName: function (name) {
    console.log('Saving user name:', name);
    localStorage.setItem(window.TeamBingo.STORAGE_KEYS.USER_NAME, name);
    console.log('User name saved. Verification:', localStorage.getItem(window.TeamBingo.STORAGE_KEYS.USER_NAME));
  },

  loadUserName: function () {
    const name = localStorage.getItem(window.TeamBingo.STORAGE_KEYS.USER_NAME);
    console.log('Loading user name from localStorage:', name);
    console.log('Type of loaded name:', typeof name);
    return name;
  }
};