require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes

app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/students', (req, res) => {
  const { id, regNumber, firstName, lastName, gender, dob, level, gradeLevel, parentName, parentPhone, status, photo } = req.body;
  db.query('INSERT INTO students (id, regNumber, firstName, lastName, gender, dob, level, gradeLevel, parentName, parentPhone, status, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, regNumber, firstName, lastName, gender, dob, level, gradeLevel, parentName, parentPhone, status, photo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(req.body);
  });
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { regNumber, firstName, lastName, gender, dob, level, gradeLevel, parentName, parentPhone, status, photo } = req.body;
  db.query('UPDATE students SET regNumber = ?, firstName = ?, lastName = ?, gender = ?, dob = ?, level = ?, gradeLevel = ?, parentName = ?, parentPhone = ?, status = ?, photo = ? WHERE id = ?', [regNumber, firstName, lastName, gender, dob, level, gradeLevel, parentName, parentPhone, status, photo, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student updated' });
  });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted' });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});