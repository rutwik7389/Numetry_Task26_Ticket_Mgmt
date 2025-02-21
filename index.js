require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Create a new ticket
app.post('/tickets', (req, res) => {
    const { subject, description } = req.body;
    const sql = "INSERT INTO tickets (subject, description) VALUES (?, ?)";
    db.query(sql, [subject, description], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, subject, description, status: "Open" });
    });
});

// Get all tickets
app.get('/tickets', (req, res) => {
    const sql = "SELECT * FROM tickets";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Get a ticket by ID
app.get('/tickets/:id', (req, res) => {
    const sql = "SELECT * FROM tickets WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).json({ message: "Ticket not found" });
        res.json(result[0]);
    });
});

// Update ticket status or details
app.put('/tickets/:id', (req, res) => {
    const { subject, description, status } = req.body;
    const sql = "UPDATE tickets SET subject = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    db.query(sql, [subject, description, status, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Ticket updated successfully" });
    });
});

// Delete a ticket
app.delete('/tickets/:id', (req, res) => {
    const sql = "DELETE FROM tickets WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Ticket deleted successfully" });
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
