const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'edutrack.db');
const db = new Database(dbFile);

// Run migrations
const initSql = fs.readFileSync(path.join(__dirname, 'migrations/init.sql'), 'utf8');
db.exec(initSql);

module.exports = db;
