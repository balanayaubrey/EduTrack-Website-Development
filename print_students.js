// print_students.js
const db = require('./db');

console.log("=== STUDENTS TABLE ===");
const rows = db.prepare("SELECT student_id, name, course, year, grades_json FROM students;").all();

for (const r of rows) {
  console.log(
    "ID:", r.student_id,
    "| Name:", r.name,
    "| Course:", r.course,
    "| Year:", r.year,
    "| Grades:", r.grades_json
  );
}
