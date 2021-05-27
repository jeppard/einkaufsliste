const pool = require("./db");

const TABLE_NAME = "Accounts"

module.exports.initDatabase = async function initDatabase() {
    const query = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (id int auto_increment primary key, name varchar(50) unique, password varchar(50));";
    let conn;
    let res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(query);
    } catch (err) {
        console.log("Failed to initilaize database: " + err);
        console.log("Result: " + res);
    } finally {
        conn.end();
    }
}

module.exports.addAccount = async function addAccount(name, password) {
    let conn;
    let res;
    try {
        conn = await pool.getConnection();
        res = await conn.query("INSERT INTO " + TABLE_NAME + " (name, password) VALUES (?, ?);", [name, password]);
    } catch (err) {
        // TODO Add result
    } finally {
        conn.end();
    }
}