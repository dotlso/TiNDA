const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
    db.all("SELECT * FROM debts", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const { customer, amount, sale_id } = req.body;
    if (!customer || amount == null)
        return res.status(400).json({ error: "customer and amount are required" });

    db.run(
        "INSERT INTO debts(customer, amount, status, sale_id, payment_type) VALUES(?, ?, 'unpaid', ?, 'debt')",
        [customer, amount, sale_id || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

router.put("/:id/pay", (req, res) => {
    db.run(
        "UPDATE debts SET status='paid' WHERE id=?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Debt not found" });
            res.json({ message: "Debt marked as paid" });
        }
    );
});

router.delete("/:id", (req, res) => {
    db.run("DELETE FROM debts WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Debt not found" });
        res.json({ message: "Debt deleted" });
    });
});

router.put("/:id", (req, res) => {
    const { amount } = req.body;
    db.run(
        "UPDATE debts SET amount=? WHERE id=?",
        [amount, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Debt not found" });
            res.json({ message: "Debt updated" });
        }
    );
});

module.exports = router;