PRAGMA foreign_keys = ON;

/* -------------------------------
   STUDENTS TABLE
-------------------------------- */
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  course TEXT,
  year INTEGER,
  grades_json TEXT,             -- JSON array of subject grades
  average_grade REAL,
  attendance REAL,
  essu_grade REAL,
  risk_level TEXT,
  recommendations_json TEXT,
  raw_data_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* -------------------------------
   USERS TABLE
-------------------------------- */
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'student',
  student_id TEXT,              -- FK link to students.student_id
  name TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* -------------------------------
   INVITATIONS TABLE
-------------------------------- */
CREATE TABLE IF NOT EXISTS invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE,
  username TEXT,
  student_id TEXT,
  role TEXT DEFAULT 'student',
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME
);
