const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all products with category name
router.get("/", (req, res) => {
    db.all(`
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add product
router.post("/", (req, res) => {
    const { name, price, stock, category_id } = req.body;
    if (!name || price == null || stock == null)
        return res.status(400).json({ error: "name, price, and stock are required" });

    db.run(
        "INSERT INTO products(name, price, stock, category_id) VALUES(?, ?, ?, ?)",
        [name, price, stock, category_id || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Update product
router.put("/:id", (req, res) => {
    const { name, price, stock, category_id } = req.body;
    if (!name || price == null || stock == null)
        return res.status(400).json({ error: "name, price, and stock are required" });

    db.run(
        "UPDATE products SET name=?, price=?, stock=?, category_id=? WHERE id=?",
        [name, price, stock, category_id || null, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Product not found" });
            res.json({ message: "Product updated" });
        }
    );
});

// Delete product
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM products WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    });
});

module.exports = router;