// UI utilities for DOM manipulation and animations
window.TeamBingo = window.TeamBingo || {};

window.TeamBingo.UIUtils = {
  // Create confetti animation
  createConfetti: function () {
    const confettiContainer = document.getElementById('confettiContainer');
    confettiContainer.innerHTML = '';

    for (let i = 0; i < window.TeamBingo.CONFETTI_CONFIG.COUNT; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = window.TeamBingo.CONFETTI_CONFIG.COLORS[Math.floor(Math.random() * window.TeamBingo.CONFETTI_CONFIG.COLORS.length)];
      confetti.style.animationDelay = Math.random() * 1 + 's';
      confetti.style.animationDuration = (Math.random() * (window.TeamBingo.CONFETTI_CONFIG.DURATION_RANGE.MAX - window.TeamBingo.CONFETTI_CONFIG.DURATION_RANGE.MIN) + window.TeamBingo.CONFETTI_CONFIG.DURATION_RANGE.MIN) + 's';

      const size = Math.random() * (window.TeamBingo.CONFETTI_CONFIG.SIZE_RANGE.MAX - window.TeamBingo.CONFETTI_CONFIG.SIZE_RANGE.MIN) + window.TeamBingo.CONFETTI_CONFIG.SIZE_RANGE.MIN;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';

      confetti.style.animationIterationCount = '1';
      confetti.style.animationFillMode = 'forwards';

      confettiContainer.appendChild(confetti);
    }

    setTimeout(function () {
      confettiContainer.innerHTML = '';
    }, window.TeamBingo.CONFETTI_CONFIG.CLEANUP_DELAY);
  },

  // Display user name in the UI
  displayUserName: function (name) {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    userName.textContent = name;
    userInfo.style.display = 'block';
  },

  // Celebrate a specific bingo achievement
  celebrateBingo: function (userName, bingoType, totalBingos) {
    const userInfo = document.getElementById('userInfo');
    const welcomeText = userInfo.querySelector('.welcome-text');

    // Show specific bingo achievement message
    let message = `🎉 BINGO! ${userName} completed: ${bingoType}`;
    if (totalBingos > 1) {
      message += ` (${totalBingos} total bingos!)`;
    }
    message += ' 🎉';

    welcomeText.innerHTML = message;
    welcomeText.style.color = '#b20d30';
    userInfo.style.background = 'linear-gradient(145deg, #c17817, #f0e2e7)';
    userInfo.style.borderColor = '#c17817';
    userInfo.style.boxShadow = '0 8px 20px rgba(193, 120, 23, 0.4)';

    // Reset the message after 4 seconds
    setTimeout(() => {
      this.resetUserInfo(userName);
    }, 4000);
  },

  // Update user info for bingo celebration (legacy method)
  celebrateUser: function (userName) {
    // Legacy method - replaced by celebrateBingo
    this.celebrateBingo(userName, 'Bingo', 1);
  },

  // Reset user info to normal state
  resetUserInfo: function (userName) {
    const userInfo = document.getElementById('userInfo');
    const welcomeText = userInfo.querySelector('.welcome-text');

    welcomeText.innerHTML = `Welcome, <span id="userName">${userName}</span>!`;
    welcomeText.style.color = '#3f84e5';
    userInfo.style.background = '#f0e2e7';
    userInfo.style.borderColor = 'rgba(63, 132, 229, 0.3)';
  },

  // Show/hide completion message
  toggleCompletionMessage: function (show) {
    show = show || false;
    const completionMessage = document.getElementById('completionMessage');
    if (completionMessage) {
      completionMessage.style.display = show ? 'block' : 'none';
    }
  }
};

// Winners display utilities
window.TeamBingo.WinnersUI = {
  displayWinners: async function (getWinnersFunction) {
    try {
      const data = await getWinnersFunction();
      const winnersList = document.getElementById('winnersList');
      const winners = data && data.winners ? data.winners : [];

      if (winners.length > 0) {
        // Sort winners: First by bingo count (highest first), then by first bingo time (earliest first)
        const sortedWinners = winners.sort((a, b) => {
          const aCount = a.bingoCount || 1;
          const bCount = b.bingoCount || 1;

          // Primary sort: by bingo count (descending)
          if (aCount !== bCount) {
            return bCount - aCount;
          }

          // Secondary sort: if counts are equal, sort by who got first bingo earliest
          const aFirstTime = new Date(a["first-bingo-time"] || a["date-time"]);
          const bFirstTime = new Date(b["first-bingo-time"] || b["date-time"]);
          return aFirstTime - bFirstTime;
        });

        winnersList.innerHTML = '';
        const recentWinners = sortedWinners.slice(0, window.TeamBingo.GAME_CONFIG.MAX_WINNERS_DISPLAY);

        for (let i = 0; i < recentWinners.length; i++) {
          const winnerItem = this._createWinnerItem(recentWinners[i], i, winners);
          winnersList.appendChild(winnerItem);
        }
      } else {
        winnersList.innerHTML = '<div class="no-winners">No winners yet. Be the first!</div>';
      }
    } catch (error) {
      console.error('Error displaying winners:', error);
      const winnersList = document.getElementById('winnersList');
      winnersList.innerHTML = '<div class="no-winners">No winners yet. Be the first!</div>';
    }
  },

  _createWinnerItem: function (winner, index, allWinners) {
    const winnerItem = document.createElement('div');
    winnerItem.className = 'winner-item';

    // Add position classes and badges for top 3
    if (index === 0) {
      winnerItem.classList.add('first-place');
      const badge = this._createPositionBadge('👑', 'first');
      winnerItem.appendChild(badge);
    } else if (index === 1) {
      winnerItem.classList.add('second-place');
      const badge = this._createPositionBadge('2', 'second');
      winnerItem.appendChild(badge);
    } else if (index === 2) {
      winnerItem.classList.add('third-place');
      const badge = this._createPositionBadge('3', 'third');
      winnerItem.appendChild(badge);
    }

    const winnerName = document.createElement('span');
    winnerName.className = 'winner-name';
    winnerName.textContent = winner.name;

    const bingoCount = document.createElement('span');
    bingoCount.className = 'bingo-count';
    const count = winner.bingoCount || 1;
    bingoCount.textContent = `${count} bingo${count !== 1 ? 's' : ''}`;

    // Show additional context for the winner
    const winnerContext = document.createElement('span');
    winnerContext.className = 'winner-context';

    // Check if this person has the highest bingo count
    const maxCount = Math.max(...allWinners.map(w => w.bingoCount || 1));
    const isHighestCount = (winner.bingoCount || 1) === maxCount;

    // Check if this person was first chronologically
    const earliestTime = Math.min(...allWinners.map(w => new Date(w["first-bingo-time"] || w["date-time"]).getTime()));
    const wasFirst = new Date(winner["first-bingo-time"] || winner["date-time"]).getTime() === earliestTime;

    if (index === 0) {
      if (isHighestCount && wasFirst) {
        winnerContext.textContent = "Most bingos & First winner";
      } else if (isHighestCount) {
        winnerContext.textContent = "Most bingos";
      } else if (wasFirst) {
        winnerContext.textContent = "First winner";
      }
    }

    const winnerDate = document.createElement('span');
    winnerDate.className = 'winner-date';
    const date = new Date(winner['date-time']);
    winnerDate.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    // Create info container for name, bingo count, and context
    const infoContainer = document.createElement('div');
    infoContainer.className = 'winner-info';
    infoContainer.appendChild(winnerName);
    infoContainer.appendChild(bingoCount);
    if (winnerContext.textContent) {
      infoContainer.appendChild(winnerContext);
    }

    winnerItem.appendChild(infoContainer);
    winnerItem.appendChild(winnerDate);

    return winnerItem;
  },

  _createPositionBadge: function (text, className) {
    const badge = document.createElement('div');
    badge.className = `position-badge ${className}`;
    badge.textContent = text;
    return badge;
  }
};