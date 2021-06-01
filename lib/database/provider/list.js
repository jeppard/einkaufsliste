const pool = require("../db");
const { List } = require("../list");

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

module.exports.getListById = async function getListById(id) {
    let conn;
    let rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query("SELECT * FROM " + TABLE_NAME + " WHERE ID = ?;", [id]);


    } catch (err) {
        // TODO Add result
    } finally {
        conn.end();
    }

    if (rows != null && rows.length > 0) {
        const row = rows[0];
        return new List(row.ID, row.Name, row.OwnerID, row.description, null);
    } else return null;
}