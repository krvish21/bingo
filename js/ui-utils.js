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
    // Update header user name
    const headerUserName = document.getElementById('headerUserName');
    if (headerUserName) {
      headerUserName.textContent = name;
    }

    // Update welcome message in userInfo
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      const welcomeText = userInfo.querySelector('.welcome-text');
      if (welcomeText) {
        welcomeText.innerHTML = `Welcome, <span class="user-name">${name}</span>!`;
      }
      userInfo.style.display = 'block';
    }
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

  // Update user info to normal state
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
  },

  // Update progress bar based on marked squares
  updateProgress: function () {
    const squares = document.querySelectorAll('.bingo-square');
    const markedSquares = document.querySelectorAll('.bingo-square.marked');
    const totalSquares = squares.length;
    const markedCount = markedSquares.length;

    // Calculate progress percentage
    const progressPercent = totalSquares > 0 ? Math.round((markedCount / totalSquares) * 100) : 0;

    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill) {
      progressFill.style.width = progressPercent + '%';

      // Add visual feedback for progress milestones
      if (progressPercent >= 75) {
        progressFill.style.background = 'linear-gradient(90deg, #c17817, #f4d03f)';
      } else if (progressPercent >= 50) {
        progressFill.style.background = 'linear-gradient(90deg, #3f84e5, #85c1f9)';
      } else if (progressPercent >= 25) {
        progressFill.style.background = 'linear-gradient(90deg, #28a745, #6bcf7f)';
      } else {
        progressFill.style.background = 'linear-gradient(90deg, #6c757d, #adb5bd)';
      }
    }

    if (progressText) {
      progressText.textContent = `${markedCount}/${totalSquares} (${progressPercent}%)`;
    }

    // Add subtle animation when progress changes
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.transform = 'scale(1.02)';
      setTimeout(() => {
        progressBar.style.transform = 'scale(1)';
      }, 200);
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

    // Add position classes for top 3
    if (index === 0) {
      winnerItem.classList.add('first-place');
    } else if (index === 1) {
      winnerItem.classList.add('second-place');
    } else if (index === 2) {
      winnerItem.classList.add('third-place');
    }

    // Create rank badge
    const rankBadge = document.createElement('div');
    rankBadge.className = 'winner-rank';
    
    if (index === 0) {
      rankBadge.classList.add('first');
      rankBadge.textContent = '👑';
    } else if (index === 1) {
      rankBadge.classList.add('second');
      rankBadge.textContent = '2';
    } else if (index === 2) {
      rankBadge.classList.add('third');
      rankBadge.textContent = '3';
    } else {
      rankBadge.classList.add('other');
      rankBadge.textContent = index + 1;
    }

    // Create main content container
    const winnerMain = document.createElement('div');
    winnerMain.className = 'winner-main';

    // Winner name
    const winnerName = document.createElement('div');
    winnerName.className = 'winner-name';
    winnerName.textContent = winner.name;

    // Winner stats container
    const winnerStats = document.createElement('div');
    winnerStats.className = 'winner-stats';

    // Bingo count badge
    const bingoCount = document.createElement('span');
    bingoCount.className = 'bingo-count';
    const count = winner.bingoCount || 1;
    bingoCount.textContent = `${count} bingo${count !== 1 ? 's' : ''}`;
    winnerStats.appendChild(bingoCount);

    // Context badge (only for first place with special achievements)
    if (index === 0) {
      const maxCount = Math.max(...allWinners.map(w => w.bingoCount || 1));
      const isHighestCount = (winner.bingoCount || 1) === maxCount;
      
      const earliestTime = Math.min(...allWinners.map(w => new Date(w["first-bingo-time"] || w["date-time"]).getTime()));
      const wasFirst = new Date(winner["first-bingo-time"] || winner["date-time"]).getTime() === earliestTime;

      if (isHighestCount || wasFirst) {
        const winnerContext = document.createElement('span');
        winnerContext.className = 'winner-context';
        
        if (isHighestCount && wasFirst) {
          winnerContext.textContent = "Most & First";
        } else if (isHighestCount) {
          winnerContext.textContent = "Most bingos";
        } else if (wasFirst) {
          winnerContext.textContent = "First winner";
        }
        
        if (winnerContext.textContent) {
          winnerStats.appendChild(winnerContext);
        }
      }
    }

    // Add name and stats to main container
    winnerMain.appendChild(winnerName);
    winnerMain.appendChild(winnerStats);

    // Winner time
    const winnerTime = document.createElement('div');
    winnerTime.className = 'winner-time';
    const date = new Date(winner['date-time']);
    winnerTime.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    // Assemble the winner item
    winnerItem.appendChild(rankBadge);
    winnerItem.appendChild(winnerMain);
    winnerItem.appendChild(winnerTime);

    return winnerItem;
  },

  _createPositionBadge: function (text, className) {
    // This function is now unused but keeping for compatibility
    const badge = document.createElement('div');
    badge.className = `position-badge ${className}`;
    badge.textContent = text;
    return badge;
  }
};