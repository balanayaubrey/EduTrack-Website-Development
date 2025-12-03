const db = require("./db");

// REMOVE existing admin if broken
db.prepare("DELETE FROM users WHERE username = 'admin'").run();

// INSERT real working admin
db.prepare(`
  INSERT INTO users (username, password_hash, role, name, email)
  VALUES ('admin', 'admin123', 'admin', 'System Administrator', 'admin@example.com')
`).run();

console.log("✔ Admin created successfully!");
console.log("👉 Username: admin");
console.log("👉 Password: admin123");
