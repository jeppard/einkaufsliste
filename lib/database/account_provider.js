const pool = require("./db");

module.exports.initDatabase = async function initDatabase() {
    const query = "CREATE TABLE IF NOT EXISTS Accounts (id int auto_increment primary key, name varchar(50), password varchar(50));";
    let conn;
    let res;
    try {
        conn = await pool.getConnection();
        res = await conn.query(query);
    } catch (err) {
        console.log("Database initlization result: " + res);
        console.log("Failed to initilaize database: " + err)
    } finally {
        conn.end();
    }
}