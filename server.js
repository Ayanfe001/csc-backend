const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./csc111_exam.db');

app.use(cors()); // Allows GitHub Pages to talk to this server
app.use(bodyParser.json());

// Initialize Database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        score INTEGER,
        date TEXT
    )`);
});

// Endpoint to save scores
app.post('/api/save-score', (req, res) => {
    const { name, score } = req.body;
    const date = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });
    
    db.run(`INSERT INTO results (name, score, date) VALUES (?, ?, ?)`, [name, score, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "success", message: "Result Saved Permanently" });
    });
});

// Endpoint to fetch scores for Admin
app.get('/api/admin/results', (req, res) => {
    db.all(`SELECT * FROM results ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CBT Backend running on port ${PORT}`);
});
