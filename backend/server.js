const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* TABLES */

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS categories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            stock INTEGER,
            category_id INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sales(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            payment_type TEXT DEFAULT 'paid'
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sale_items(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            total REAL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS debts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer TEXT,
            amount REAL,
            status TEXT DEFAULT 'unpaid',
            sale_id INTEGER,
            payment_type TEXT DEFAULT 'debt'
        )
    `);

});


app.use("/categories", require("./routes/categories"));
app.use("/inventory", require("./routes/inventory"));
app.use("/sales", require("./routes/sales"));
app.use("/debts", require("./routes/debts"));
app.use("/reports", require("./routes/reports"));

app.listen(3000, () => {
    console.log("TiNDA backend running on port 3000");
});