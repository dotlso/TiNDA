const express = require("express");
const router = express.Router();
const db = require("../database");

// Individual transactions
router.get("/transactions", (req, res) => {
    db.all(`
        SELECT 
            s.id,
            DATE(s.date) as date,
            COALESCE(s.payment_type, 'paid') as payment_type,
            GROUP_CONCAT(p.name || ' x' || si.quantity, ', ') AS items,
            SUM(si.total) AS total
        FROM sales s
        JOIN sale_items si ON si.sale_id = s.id
        JOIN products p ON p.id = si.product_id
        GROUP BY s.id
        ORDER BY s.id DESC
    `, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Product sales summary
router.get("/sales", (req, res) => {
    db.all(`
        SELECT p.name, SUM(s.quantity) AS total_sold, SUM(s.total) AS revenue
        FROM sale_items s
        JOIN products p ON p.id = s.product_id
        GROUP BY p.name
        ORDER BY total_sold DESC
    `, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Demand
router.get("/demand", (req, res) => {
    db.all(`
        SELECT p.name, SUM(s.quantity) AS demand
        FROM sale_items s
        JOIN products p ON p.id = s.product_id
        GROUP BY p.name
        ORDER BY demand DESC
    `, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;