// API Service for managing winners data
window.TeamBingo.ApiService = {
  saveWinner: async function (name) {
    if (!window.TeamBingo.API_CONFIG.USE_API) {
      console.log('API disabled - Mock saving winner:', name);
      return Promise.resolve({ success: true, message: 'Mock save successful' });
    }

    try {
      const existingData = await this.getWinners();
      const binData = existingData || { name: "winners", winners: [] };

      // Find existing user or create new one
      let existingUser = binData.winners.find(winner => winner.name === name);

      if (existingUser) {
        // Increment bingo count for existing user
        existingUser.bingoCount = (existingUser.bingoCount || 1) + 1;
        existingUser["date-time"] = new Date().toISOString(); // Update last bingo time
      } else {
        // Add new user with first bingo
        const newWinner = {
          name: name,
          bingoCount: 1,
          "date-time": new Date().toISOString(),
          "first-bingo-time": new Date().toISOString() // Track when they got their first bingo
        };
        binData.winners.push(newWinner);
      }

      const response = await this._makeRequest('PUT', `${window.TeamBingo.API_CONFIG.BASE_URL}/${window.TeamBingo.API_CONFIG.BIN_ID}`, binData);
      console.log('Winner saved successfully');
      return response;
    } catch (error) {
      console.error('Error saving winner:', error);
      // Fall back to mock behavior on API error
      console.log('Falling back to mock save due to API error');
      return Promise.resolve({ success: true, message: 'Mock save (API fallback)' });
    }
  },

  getWinners: async function () {
    if (!window.TeamBingo.API_CONFIG.USE_API) {
      console.log('API disabled - Returning mock winners data');
      return Promise.resolve({
        name: "winners",
        winners: [
          { name: "Alice", bingoCount: 3, "date-time": "2025-08-24T10:30:00.000Z", "first-bingo-time": "2025-08-24T16:15:00.000Z" },
          { name: "Bob", bingoCount: 1, "date-time": "2025-08-24T14:15:00.000Z", "first-bingo-time": "2025-08-24T14:15:00.000Z" },
          { name: "Charlie", bingoCount: 2, "date-time": "2025-08-25T09:45:00.000Z", "first-bingo-time": "2025-08-24T09:30:00.000Z" }
        ]
      });
    }

    try {
      const response = await this._makeRequest('GET', `${window.TeamBingo.API_CONFIG.BASE_URL}/${window.TeamBingo.API_CONFIG.BIN_ID}/latest`);
      console.log('Data retrieved successfully');
      return response;
    } catch (error) {
      console.error('Error retrieving data:', error);
      // Fall back to mock data on API error
      console.log('Falling back to mock data due to API error');
      return {
        name: "winners",
        winners: [
          { name: "Alice", bingoCount: 3, "date-time": "2025-08-24T10:30:00.000Z", "first-bingo-time": "2025-08-24T09:15:00.000Z" },
          { name: "Bob", bingoCount: 1, "date-time": "2025-08-24T14:15:00.000Z", "first-bingo-time": "2025-08-24T14:15:00.000Z" },
          { name: "Charlie", bingoCount: 2, "date-time": "2025-08-25T09:45:00.000Z", "first-bingo-time": "2025-08-24T16:30:00.000Z" }
        ]
      };
    }
  },

  clearWinners: async function () {
    if (!window.TeamBingo.API_CONFIG.USE_API) {
      console.log('API disabled - Mock clearing winners');
      return Promise.resolve({ success: true, message: 'Mock clear successful' });
    }

    try {
      const response = await this._makeRequest('PUT', `${window.TeamBingo.API_CONFIG.BASE_URL}/${window.TeamBingo.API_CONFIG.BIN_ID}/latest`, { name: "winners", winners: [] });
      console.log('Winners cleared successfully');
      return response;
    } catch (error) {
      console.error('Error clearing winners:', error);
      throw new Error('Failed to clear winners');
    }
  },

  _makeRequest: function (method, url, data) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status >= 200 && req.status < 300) {
            try {
              const response = req.responseText ? JSON.parse(req.responseText) : {};
              resolve(response);
            } catch (error) {
              if (method === 'GET') {
                resolve({ name: "winners", winners: [] });
              } else {
                reject(error);
              }
            }
          } else {
            reject(new Error(`Request failed with status ${req.status}`));
          }
        }
      };

      req.open(method, url, true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-Master-Key", window.TeamBingo.API_CONFIG.MASTER_KEY);
      req.setRequestHeader("X-Access-Key", window.TeamBingo.API_CONFIG.ACCESS_KEY);

      if (method === 'GET') {
        req.setRequestHeader("X-BIN-META", "false");
      }

      req.send(data ? JSON.stringify(data) : null);
    });
  }
};