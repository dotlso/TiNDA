const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/", (req, res) => {
    const { items, payment_type = "paid" } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0)
        return res.status(400).json({ error: "items array is required" });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.run("INSERT INTO sales(date, payment_type) VALUES(datetime('now'), ?)", [payment_type], function (err) {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
            }

            const saleID = this.lastID;
            let pending = items.length;
            let failed = false;

            items.forEach((item) => {
                db.get(
                    "SELECT price, stock FROM products WHERE id=?",
                    [item.product_id],
                    (err, product) => {
                        if (failed) return;

                        if (err || !product) {
                            failed = true;
                            db.run("ROLLBACK");
                            return res.status(404).json({ error: `Product ${item.product_id} not found` });
                        }

                        if (product.stock < item.quantity) {
                            failed = true;
                            db.run("ROLLBACK");
                            return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` });
                        }

                        const total = product.price * item.quantity;

                        db.run(
                            "INSERT INTO sale_items(sale_id, product_id, quantity, total) VALUES(?, ?, ?, ?)",
                            [saleID, item.product_id, item.quantity, total],
                            (err) => {
                                if (err && !failed) {
                                    failed = true;
                                    db.run("ROLLBACK");
                                    return res.status(500).json({ error: err.message });
                                }
                            }
                        );

                        db.run(
                            "UPDATE products SET stock = stock - ? WHERE id=?",
                            [item.quantity, item.product_id],
                            (err) => {
                                if (err && !failed) {
                                    failed = true;
                                    db.run("ROLLBACK");
                                    return res.status(500).json({ error: err.message });
                                }

                                pending--;
                                if (pending === 0 && !failed) {
                                    db.run("COMMIT");
                                    res.json({ message: "Sale recorded", sale_id: saleID });
                                }
                            }
                        );
                    }
                );
            });
        });
    });
});

module.exports = router;