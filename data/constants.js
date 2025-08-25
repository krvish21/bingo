// Global namespace for Team Bingo
window.TeamBingo = window.TeamBingo || {};

// Bingo game items/achievements
window.TeamBingo.BINGO_ITEMS = [
  "✅ Closed 2+ Jira tickets",
  "🧠 Attended all stand-ups",
  "🧪 Logged a bug with clear repro steps",
  "🧼 Closed a ticket ahead of ETA",
  "🧑‍💻 Completed a task without reopening",
  "🧑‍🏫 Asked a question that helped the team",
  "🧑‍🔧 Unblocked someone else",
  "🧑‍💻 Tagged someone in a helpful comment",
  "🧪 Verified a fix in UAT env",
  "🧑‍💻 Participated in backlog grooming",
  "🧑‍💻 Reviewed 2+ PRs constructively",
  "🧑‍🏫 Clarified acceptance criteria",
  "🧑‍💻 Joined all syncs on time",
  "🧑‍🔧 Updated a test case or checklist",
  "🧑‍💻 Finished a task without reopening it",
  "🧑‍💻 Created a reusable component/test",
  "🧑‍🔧 Helped test a feature outside your module",
  "🧑‍🏫 Shared a tip/tool in chat",
  "🤝 Helped someone outside your usual scope",
  "🧑‍💻 Used a new shortcut/tool/plugin",
  "🧑‍💻 Completed a task with zero rework",
  "🧑‍🔧 Participated in a retro discussion",
  "🧑‍🏫 Explained a blocker clearly",
  "🗣️ Got a shoutout",
  "🧑‍💻 Finished a task without reminders"
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