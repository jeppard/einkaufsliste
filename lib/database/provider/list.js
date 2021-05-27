const pool = require("../db");

const TABLE_NAME = "Lists"

module.exports.initDatabase = async function initDatabase() {
    const query = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (ID int auto_increment primary key, Name varchar(50), OwnerID int, Description varchar(250));";
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

module.exports.addList = async function addList(name, ownerid, description) {
    let conn;
    let res;
    try {
        conn = await pool.getConnection();
        res = await conn.query("INSERT INTO " + TABLE_NAME + " (Name, OwnerID, Description) VALUES (?, ?, ?);", [name, ownerid, description]);
    } catch (err) {
        // TODO Add result
    } finally {
        conn.end();
    }
}