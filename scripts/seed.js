import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    name: 'John Doe',
    phone: '123456789',
    date_of_birth: '2000-04-29',
    job_title: 'Software Engineer',
    department: 'IT Department',
    salary: '2000',
    start_date: '2022-01-01',
  },
  {
    name: 'Jane Smith',
    phone: '987654321',
    date_of_birth: '2002-04-29',
    job_title: 'Software Engineer',
    department: 'IT Department',
    salary: '3000',
    start_date: '2022-05-01',
  },
  {
    name: 'Alice Johnson',
    phone: '123459876',
    date_of_birth: '2002-04-12',
    job_title: 'Software Engineer',
    department: 'IT Department',
    salary: '2500',
    start_date: '2022-01-01',
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10T08:00:00',
    end_time: '2025-02-10T17:00:00',
    summary: 'worked on frontend',
  },
  {
    employee_id: 2,
    start_time: '2025-02-11T12:00:00',
    end_time: '2025-02-11T17:00:00',
    summary: 'worked on backend',
  },
  {
    employee_id: 3,
    start_time: '2025-02-12T07:00:00',
    end_time: '2025-02-12T16:00:00',
    summary: 'worked fullstack'
  },
];


const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

