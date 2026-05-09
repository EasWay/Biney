import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const db = new sqlite3.Database('biney_medical.db');

const loadCsv = (filename: string) => {
  const content = fs.readFileSync(path.join(process.cwd(), 'data', filename), 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, i) => {
      obj[header.trim()] = values[i]?.trim();
      return obj;
    }, {});
  });
};

db.serialize(() => {
  // Create Doctors Table
  db.run(`CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    specialization TEXT,
    years_experience INTEGER,
    clinic_branch TEXT
  )`);

  // Create Treatments Table
  db.run(`CREATE TABLE IF NOT EXISTS treatments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treatment_type TEXT,
    cost INTEGER,
    description TEXT
  )`);

  // Create Chat Sessions Table
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_session_timestamp ON sessions (session_id, timestamp)`);

  // Migrate Doctors
  const doctors = loadCsv('doctors.csv');
  const docStmt = db.prepare(`INSERT INTO doctors (first_name, last_name, specialization, years_experience, clinic_branch) VALUES (?, ?, ?, ?, ?)`);
  doctors.forEach(d => docStmt.run(d.first_name, d.last_name, d.specialization, d.years_experience, d.clinic_branch));
  docStmt.finalize();

  // Migrate Treatments
  const treatments = loadCsv('treatments.csv');
  const treatStmt = db.prepare(`INSERT INTO treatments (treatment_type, cost, description) VALUES (?, ?, ?)`);
  treatments.forEach(t => treatStmt.run(t.treatment_type, t.cost, t.description));
  treatStmt.finalize();

  console.log("✅ Migration Successful: Doctors and Treatments moved to SQLite.");
});

db.close();
