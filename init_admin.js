const db = require("./db");

function ensureAdmin() {
  const exists = db.prepare(
    "SELECT * FROM users WHERE username = 'admin'"
  ).get();

  if (exists) {
    console.log("✔ Admin already exists.");
    return;
  }

  db.prepare(`
    INSERT INTO users (username, password_hash, role, name, email)
    VALUES ('admin', 'admin123', 'admin', 'System Administrator', 'admin@example.com')
  `).run();

  console.log("✔ Admin created: username=admin | password=admin123");
}

ensureAdmin();
