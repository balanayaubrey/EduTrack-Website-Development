const db = require("./db");

function ensureFaculty() {
  const exists = db.prepare(
    "SELECT * FROM users WHERE username = 'faculty1'"
  ).get();

  if (exists) {
    console.log("✔ Faculty already exists.");
    return;
  }

  db.prepare(`
    INSERT INTO users (username, password_hash, role, name, email)
    VALUES ('faculty1', 'faculty123', 'faculty', 'Default Faculty', 'faculty@example.com')
  `).run();

  console.log("✔ Faculty created: username=faculty1 | password=faculty123");
}

ensureFaculty();
