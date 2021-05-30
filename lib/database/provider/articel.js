const { Article } = require("../article");
const pool = require("../db");
const { ListElement } = require("../list_element");

const ARTICELS_TABLE_NAME = "Articles"
const ELEMENTS_TABLE_NAME = "Elements"

module.exports.initDatabase = async function initDatabase() {
    const query1 = "CREATE TABLE IF NOT EXISTS " + ARTICELS_TABLE_NAME + " (ID int auto_increment primary key, UserID int, Name varchar(50), Type int);";
    const query2 = "CREATE TABLE IF NOT EXISTS " + ELEMENTS_TABLE_NAME + " (ListID int, ArticleID int, Count int, UnitType varchar(50));";

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(query1);
        await conn.query(query2);
    } catch (err) {
        console.log("Failed to initilaize database: " + err);
    } finally {
        conn.end();
    }
}

module.exports.addArticle = async function addArticle(userID, name, type) {
    let conn;
    let res;
    try {
        conn = await pool.getConnection();
        res = await conn.query("INSERT INTO " + ARTICELS_TABLE_NAME + " (UserID, Name, Type) VALUES (?, ?, ?);", [userID, name, type]);
    } catch (err) {
        // TODO Add result
        console.log("Failed to add new Article to database: " + err);
    } finally {
        conn.end();
    }
}

module.exports.addElement = async function addElement(listID, articleID, count, unitType) {
    let conn;
    let res;
    try {
        conn = await pool.getConnection();
        res = await conn.query("INSERT INTO " + ELEMENTS_TABLE_NAME + " (ListID, ArticleID, Count, UnitType) VALUES (?, ?, ?, ?);", [listID, articleID, count, unitType]);
    } catch (err) {
        console.log("Failed to add new Element to database: " + err);
        // TODO Add result
    } finally {
        conn.end();
    }
}

module.exports.getAllArticleElements = async function getListArticles(listID) {
    let conn;
    let res = [];
    try {
        conn = await pool.getConnection();
        const articles = await conn.query("SELECT * FROM " + ARTICELS_TABLE_NAME);
        const elements = await conn.query("SELECT * FROM " + ELEMENTS_TABLE_NAME + " WHERE ListID=?;", [listID]);

        if (articles != null && elements != null) {
            elements.forEach(e => {
                let article = articles.filter(a => e.ArticleID == a.ID);
                article = article[0];

                if (article != null) {
                    res.push(new ListElement(new Article(article.ID, article.Name, article.Type), e.Count, e.UnityType));
                }
            });
        }
    } catch (err) {
        console.log("Failed to get all elements from database: " + err);
        // TODO Add result
    } finally {
        conn.end();
    }

    console.log(res);
    return res;
}