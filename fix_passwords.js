const db = require("./db");
const bcrypt = require("bcryptjs");

const students = [
  { id: "22-00005", password: "tiu123" },
  { id: "22-00006", password: "obina123" },
  { id: "22-00007", password: "casaba123" },
  { id: "22-00008", password: "salinas123" },
  { id: "22-00009", password: "senobio123" },
];

students.forEach(s => {
  const hash = bcrypt.hashSync(s.password, 10);

  db.prepare(`
    UPDATE users SET password_hash = ? WHERE username = ?
  `).run(hash, s.id);

  console.log(`Updated: ${s.id} -> ${s.password}`);
});
