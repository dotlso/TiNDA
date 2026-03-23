const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { app } = require("electron");

const dbPath = path.join(app.getPath("userData"), "tinda.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite at:", dbPath);
    }
});

module.exports = db;