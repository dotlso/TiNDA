const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all categories
router.get("/", (req, res) => {
    db.all("SELECT * FROM categories ORDER BY name", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a category
router.post("/", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });

    db.run(
        "INSERT INTO categories(name) VALUES(?)",
        [name],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name });
        }
    );
});

// Delete a category
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM categories WHERE id=?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Category not found" });
        res.json({ message: "Category deleted" });
    });
});

module.exports = router;