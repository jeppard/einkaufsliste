import { Article } from '../article';
import { getConnection } from '../db';

const ARTICELS_TABLE_NAME = 'Articles';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ARTICELS_TABLE_NAME + ' (ID int auto_increment primary key, UserID int, Name varchar(50), Description varchar(250), Type int);';

    let conn;
    try {
        conn = await getConnection();
        await conn.query(query);
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

export async function getAllArticles (): Promise<Article[]> {
    let conn;
    const res: Article[] = [];
    try {
        conn = await getConnection();
        const articles = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME);

        if (articles != null) {
            articles.forEach((a: { ID: number; UserID: number; Name: string; Description: string; Type: number; }) => {
                res.push(new Article(a.ID, a.UserID, a.Name, a.Description, a.Type));
            });
        }
    } catch (err) {
        console.log('Failed to get all articles from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}
