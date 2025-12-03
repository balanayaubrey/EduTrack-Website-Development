// routes/auth.js
const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");   // ✅ MUST be at the top

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  // If password_hash is not hashed (admin/faculty), compare plain text
  let valid = false;

  if (user.password_hash.startsWith("$2b$")) {
    // bcrypt hashed (students)
    valid = bcrypt.compareSync(password, user.password_hash);
  } else {
    // plain text (admin/faculty)
    valid = password === user.password_hash;
  }

  if (!valid) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, student_id: user.student_id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    ok: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      student_id: user.student_id,
      name: user.name,
    }
  });
});

module.exports = router;
