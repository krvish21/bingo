// LocalStorage key constants
window.TeamBingo = window.TeamBingo || {};
window.TeamBingo.STORAGE_KEYS = {
  CURRENT_CARD: 'teamBingoCurrentCard',
  MARKED_SQUARES: 'teamBingoMarkedSquares',
  COMPLETED_BINGOS: 'teamBingoCompletedBingos',
  USER_NAME: 'teamBingoUserName'
};

// API Configuration
window.TeamBingo.API_CONFIG = {
  BIN_ID: "68abdf7eae596e708fd46c8e", // Updated BIN_ID
  BASE_URL: "https://api.jsonbin.io/v3/b",
  MASTER_KEY: "$2a$10$au5QUvO96N2h.LhgE898weycIz9GBuIciW5gEhuSkLrqPLeMw6uVO",
  ACCESS_KEY: "$2a$10$REm0aaanMaWGc5FsPVB5GOZOKBu.VlTVqTDcuDbK2DXTAdtcwnXEq",

  ADMIN_BIN_ID: "68b150d7d0ea881f4069f0e3",

  USE_API: true, // Enable API for production use
};

// Confetti animation configuration
window.TeamBingo.CONFETTI_CONFIG = {
  COLORS: ['#3f84e5', '#f0e2e7', '#b20d30', '#c17817', '#3f784c'],
  COUNT: 50,
  DURATION_RANGE: { MIN: 3, MAX: 5 },
  SIZE_RANGE: { MIN: 6, MAX: 12 },
  CLEANUP_DELAY: 6000
};