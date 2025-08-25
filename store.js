// Define the bin ID as a constant to ensure consistency
const BIN_ID = "68abdf7eae596e708fd46c8e";

// Toggle for API requests - set to false during testing
const USE_API = false; // Change to true for production

async function createBin(payload) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };

  req.open("POST", "https://api.jsonbin.io/v3/b", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
  req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");

  req.send(payload);
}

async function updateBin(payload) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };

  req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
  req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");

  req.send(payload);
}

async function readBin() {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };

  req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
  req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
  req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");
  req.setRequestHeader("X-BIN-META", "false");

  req.send();
}

async function deleteBin() {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };

  req.open("DELETE", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
  req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
  req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");
  req.send();
}

// Winner-specific storage functions
async function saveWinner(name) {
  if (!USE_API) {
    console.log('API disabled - Mock saving winner:', name);
    // Simulate successful save with mock data
    return Promise.resolve({ success: true, message: 'Mock save successful' });
  }

  return new Promise((resolve, reject) => {
    // First, get existing data
    getWinners().then(existingData => {
      // Ensure we have the correct structure
      const binData = existingData || { name: "winners", winners: [] };

      // Add new winner to the winners array
      const newWinner = {
        name: name,
        "date-time": new Date().toISOString() // UTC format
      };

      binData.winners.push(newWinner);

      // Update the bin with new data structure
      let req = new XMLHttpRequest();

      req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          if (req.status >= 200 && req.status < 300) {
            console.log('Winner saved successfully');
            resolve(JSON.parse(req.responseText));
          } else {
            console.error('Error saving winner:', req.responseText);
            reject(new Error('Failed to save winner'));
          }
        }
      };

      req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
      req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");

      req.send(JSON.stringify(binData));
    }).catch(reject);
  });
}

async function getWinners() {
  if (!USE_API) {
    console.log('API disabled - Returning mock winners data');
    // Return mock data for testing
    const mockData = {
      name: "winners",
      winners: [
        { name: "Alice", "date-time": "2025-08-24T10:30:00.000Z" },
        { name: "Bob", "date-time": "2025-08-24T14:15:00.000Z" },
        { name: "Charlie", "date-time": "2025-08-25T09:45:00.000Z" }
      ]
    };
    return Promise.resolve(mockData);
  }

  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status >= 200 && req.status < 300) {
          try {
            const response = JSON.parse(req.responseText);
            console.log('Data retrieved successfully');
            // Return the full structure, let displayWinners handle the winners array
            resolve(response);
          } catch (error) {
            console.log('No existing data found, starting with empty structure');
            resolve({ name: "winners", winners: [] });
          }
        } else {
          console.error('Error retrieving data:', req.responseText);
          resolve({ name: "winners", winners: [] }); // Return empty structure on error
        }
      }
    };

    req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
    req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
    req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");
    req.setRequestHeader("X-BIN-META", "false");

    req.send();
  });
}

async function clearWinners() {
  if (!USE_API) {
    console.log('API disabled - Mock clearing winners');
    // Simulate successful clear
    return Promise.resolve({ success: true, message: 'Mock clear successful' });
  }

  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status >= 200 && req.status < 300) {
          console.log('Winners cleared successfully');
          resolve(JSON.parse(req.responseText));
        } else {
          console.error('Error clearing winners:', req.responseText);
          reject(new Error('Failed to clear winners'));
        }
      }
    };

    req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO");
    req.setRequestHeader("X-Access-Key", "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq");

    req.send(JSON.stringify({ name: "winners", winners: [] })); // Send empty structure
  });
}