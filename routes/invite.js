// routes/invite.js
const express = require("express");
const db = require("../db");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Faculty invites student → auto-create login
router.post("/send", async (req, res) => {
  const { studentId, name, course, year } = req.body;

  if (!studentId || !name) {
    return res.status(400).json({ error: "Missing student info" });
  }

  try {
    // Extract lastname for default password
    const lastName = name.split(" ").slice(-1)[0].toLowerCase();
    const defaultPassword = lastName;

    // Hash password
    const hash = await bcrypt.hash(defaultPassword, 10);

    // Check if user already exists
    const existing = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(studentId);

    // Insert new user
    if (!existing) {
      db.prepare(`
        INSERT INTO users (username, password_hash, role, student_id, name)
        VALUES (?, ?, 'student', ?, ?)
      `).run(studentId, hash, studentId, name);
    } else {
      // Update password if user exists (optional)
      db.prepare(`
        UPDATE users SET password_hash = ? WHERE username = ?
      `).run(hash, studentId);
    }

    // Record invitation
    db.prepare(`
      INSERT INTO invitations (username, student_id, role, used)
      VALUES (?, ?, 'student', 1)
    `).run(studentId, studentId);

    res.json({
      ok: true,
      message: "Student invited successfully.",
      login: {
        username: studentId,
        password: defaultPassword // show to faculty ONLY
      }
    });

  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ error: "Failed to invite student" });
  }
});

module.exports = router;
