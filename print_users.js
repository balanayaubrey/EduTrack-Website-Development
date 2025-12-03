const db = require("./db");

const rows = db.prepare("SELECT id, username, password_hash FROM users").all();

console.log("=== USERS TABLE ===");
rows.forEach(r => {
  console.log(`${r.id} | ${r.username} | ${JSON.stringify(r.password_hash)}`);
});
