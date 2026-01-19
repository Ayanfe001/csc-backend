const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./csc111_exam.db');

app.use(cors()); 
app.use(bodyParser.json());

// Initialize Database Table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        score INTEGER,
        date TEXT
    )`);
});

// Save Score Endpoint
app.post('/api/save-score', (req, res) => {
    const { name, score } = req.body;
    const date = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });
    db.run(`INSERT INTO results (name, score, date) VALUES (?, ?, ?)`, [name, score, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "success", message: "Result Saved Permanently" });
    });
});

// Fetch All Results Endpoint
app.get('/api/admin/results', (req, res) => {
    db.all(`SELECT * FROM results ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Clear All Results Endpoint
app.delete('/api/admin/clear-results', (req, res) => {
    db.run(`DELETE FROM results`, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "All records have been permanently cleared from the server." });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
