import { Article } from '../article';
import { ListElement } from '../list_element';
import { getConnection } from '../db';

const ARTICELS_TABLE_NAME = 'Articles';
const ELEMENTS_TABLE_NAME = 'Elements';

export async function initDatabase (): Promise<void> {
    const query1 = 'CREATE TABLE IF NOT EXISTS ' + ARTICELS_TABLE_NAME + ' (ID int auto_increment primary key, UserID int, Name varchar(50), Description varchar(250), Type int);';
    const query2 = 'CREATE TABLE IF NOT EXISTS ' + ELEMENTS_TABLE_NAME + ' (ListID int, ArticleID int, Count int, UnitType varchar(50));';

    let conn;
    try {
        conn = await getConnection();
        await conn.query(query1);
        await conn.query(query2);
    } catch (err) {
        console.log('Failed to initilaize database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function addArticle (article: Article): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + ARTICELS_TABLE_NAME + ' (UserID, Name, Description, Type) VALUES (?, ?, ?, ?);', [article.userID, article.name, article.description, article.type]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to add new article to database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function removeArticle (articleID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + ARTICELS_TABLE_NAME + ' ID = ?;', [articleID]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to remove article from database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function addElement (listID: number, articleID: number, count: number, unitType: string): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + ELEMENTS_TABLE_NAME + ' (ListID, ArticleID, Count, UnitType) VALUES (?, ?, ?, ?);', [listID, articleID, count, unitType]);
    } catch (err) {
        console.log('Failed to add new Element to database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }
}

export async function getAllListArticles (listID: number): Promise<ListElement[]> {
    let conn;
    const res: ListElement[] = [];
    try {
        conn = await getConnection();
        const articles = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME);
        const elements = await conn.query('SELECT * FROM ' + ELEMENTS_TABLE_NAME + ' WHERE ListID=?;', [listID]);

        if (articles != null && elements != null) {
            elements.forEach((e: { ArticleID: number; ListID: number; Count: number; UnitType: string; }) => {
                let article = articles.filter((a: { ID: number; }) => e.ArticleID === a.ID);
                article = article[0];

                if (article != null) {
                    res.push(new ListElement(e.ListID, new Article(article.ID, article.UserID, article.Name, article.Description, article.Type), e.Count, e.UnitType));
                }
            });
        }
    } catch (err) {
        console.log('Failed to get all elements from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}
