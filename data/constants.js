// Global namespace for Team Bingo
window.TeamBingo = window.TeamBingo || {};

// Bingo game items/achievements
window.TeamBingo.BINGO_ITEMS = [
  // Collaboration & Communication
  "🤝 Helped unblock a teammate",
  "💡 Shared useful knowledge in standup",
  "✍️ Improved documentation clarity",
  "👥 Participated actively in refinement",
  "🎯 Delivered constructive PR feedback",

  // Quality & Testing
  "🐛 Reported issue with clear steps",
  "✅ Verified fix before deployment",
  "🔍 Found edge case in testing",
  "📝 Updated test documentation",
  "🎯 Achieved zero-defect delivery",

  // Process Improvement
  "⚡ Suggested workflow improvement",
  "📊 Updated task status promptly",
  "🎉 Completed work ahead of time",
  "🔄 Shared valuable retro feedback",
  "📈 Helped improve team metrics",

  // Learning & Growth
  "📚 Learned new tool/technique",
  "🤓 Shared learning with team",
  "💪 Stepped out of comfort zone",
  "🌱 Applied feedback effectively",
  "🎓 Mentored/supported others",

  // Team Success
  "🎯 Met sprint commitment",
  "🚀 Contributed to team goals",
  "💬 Raised risks early",
  "🌟 Received peer recognition",
  "🤝 Supported cross-team effort"
];

// Winning conditions for bingo (rows, columns, diagonals)
window.TeamBingo.WIN_CONDITIONS = [
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

// Game configuration
window.TeamBingo.GAME_CONFIG = {
  GRID_SIZE: 25,
  FREE_SPACE_INDEX: 12,
  CARDS_TO_SHOW: 24,
  MAX_WINNERS_DISPLAY: 5
};