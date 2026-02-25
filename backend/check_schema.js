const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

const tables = ["notifications", "event_results"];

const checkTables = async () => {
    for (const table of tables) {
        await new Promise((resolve) => {
            db.all(`PRAGMA table_info(${table})`, [], (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Table: ${table}`);
                    console.log(JSON.stringify(rows, null, 2));
                }
                resolve();
            });
        });
    }
    db.close();
};

checkTables();
