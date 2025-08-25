// Global namespace for Team Bingo
window.TeamBingo = window.TeamBingo || {};

// Bingo game items/achievements
window.TeamBingo.BINGO_ITEMS = [
  "✅ Closed 2+ Jira tickets",
  "🧠 Attended all stand-ups",
  "🧪 Logged bug with clear steps",
  "🧼 Closed ticket ahead of ETA",
  "✅ Completed task (no reopens)",
  "❓ Asked helpful question",
  "🧑‍🔧 Unblocked someone else",
  "🏷️ Tagged helpful comment",
  "🧪 Verified fix in UAT env",
  "📋 Joined backlog grooming",
  "👀 Reviewed 2+ PRs well",
  "📝 Clarified AC",
  "🧑‍💻 Joined all syncs on time",
  "🧪 Updated test/checklist",
  "✅ Finished (no reopens)",
  "🔧 Created reusable code",
  "🧪 Tested outside module",
  "💡 Shared tip/tool",
  "🤝 Helped outside scope",
  "🔧 Used new tool",
  "✅ Zero rework task",
  "🔄 Joined retro talk",
  "🚫 Explained blocker",
  "🗣️ Got a shoutout",
  "✅ Self-managed task"
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