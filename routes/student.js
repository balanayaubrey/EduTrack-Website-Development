const express = require("express");
const db = require("../db");
const router = express.Router();

// GET student full data (grades, risk, recommendations)
router.get("/:studentId", (req, res) => {
  const studentId = req.params.studentId;

  // get student base data
  const student = db
    .prepare("SELECT * FROM students WHERE student_id = ?")
    .get(studentId);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  // parse stored JSON fields
  let grades = [];
  let recommendations = [];

  try {
    grades = student.grades_json ? JSON.parse(student.grades_json) : [];
    recommendations = student.recommendations_json
      ? JSON.parse(student.recommendations_json)
      : [];
  } catch (err) {
    console.error("JSON parse error", err);
  }

  // ⭐ FIX: Normalize naming for frontend
  return res.json({
    ok: true,
    student: {
      studentId: student.student_id,
      name: student.name,
      course: student.course,
      year: student.year,

      grades,

      averageGrade: student.average_grade,
      essUGrade: student.essu_grade,
      riskLevel: student.risk_level,

      recommendations
    },
  });
});

module.exports = router;
