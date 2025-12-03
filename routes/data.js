const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

// upload directory
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ------------------------------
// ESSU GRADE SCALE
// ------------------------------
function essuGrade(avg) {
  if (avg >= 95) return 1.0;
  if (avg >= 90) return 1.5;
  if (avg >= 85) return 2.0;
  if (avg >= 80) return 2.5;
  if (avg >= 75) return 3.0;
  if (avg >= 70) return 3.5;
  if (avg >= 65) return 4.0;
  if (avg >= 60) return 4.5;
  return 5.0;
}

function predictRisk(grade) {
  if (grade >= 3.5) return "High";
  if (grade >= 3.0) return "Conditional";
  return "Low";
}

// ------------------------------
// UPLOAD ROUTE
// ------------------------------
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
      defval: "",
    });

    const students = {};

    // group rows by ID
    rows.forEach((r) => {
      const id = r["StudentID"]?.toString().trim();
      if (!id) return;

      if (!students[id]) {
        students[id] = {
          student_id: id,
          first_name: r["FirstName"] || "",
          last_name: r["LastName"] || "",
          name: r["Name"] || "",
          course: r["Course"] || "",
          year: Number(r["YearLevel"] || 0),
          subjects: [],
        };
      }

      students[id].subjects.push({
        subject: r["SubjectCode"],
        grade: Number(r["GradeNumeric"] || 0),
      });
    });

    const finalStudents = [];

    const insert = db.prepare(`
      INSERT OR REPLACE INTO students (
        student_id,
        first_name,
        last_name,
        name,
        course,
        year,
        grades_json,
        average_grade,
        attendance,
        essu_grade,
        risk_level,
        recommendations_json,
        raw_data_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    Object.values(students).forEach((s) => {
      const grades = s.subjects.map((g) => g.grade);
      const avg = grades.reduce((a, b) => a + b, 0) / grades.length;

      const essu = essuGrade(avg);
      const risk = predictRisk(essu);

      const recommendations =
        risk === "High"
          ? [
              "Immediate academic intervention needed",
              "Weekly monitoring required",
              "Join tutoring program immediately",
            ]
          : risk === "Conditional"
          ? [
              "Attend tutoring sessions",
              "Improve study schedule",
              "Talk to academic advisor",
            ]
          : ["Maintain strong performance", "Consider advanced coursework"];

      // save to DB
      insert.run(
        s.student_id,
        s.first_name,
        s.last_name,
        s.name,
        s.course,
        s.year,
        JSON.stringify(s.subjects),
        avg,
        0,
        essu,
        risk,
        JSON.stringify(recommendations),
        JSON.stringify(s)
      );

      finalStudents.push({
        studentId: s.student_id,
        name: s.name,
        course: s.course,
        year: s.year,
        grades: grades,
        averageGrade: avg,
        essUGrade: essu,
        riskLevel: risk,
        recommendations,
      });
    });

    res.json({ ok: true, students: finalStudents });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Failed to process upload" });
  }
});

module.exports = router;
