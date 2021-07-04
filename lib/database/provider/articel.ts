import { Article } from '../types/article';
import { getConnection } from '../db';

const ARTICELS_TABLE_NAME = 'Articles';

/**
 * Initialize the database for articles
 */
export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ARTICELS_TABLE_NAME + ' (id int auto_increment primary key, listID int, name varchar(50), description varchar(250), type int);';

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

export async function addArticle (article: Article): Promise<number | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        const rows = await conn.query('INSERT INTO ' + ARTICELS_TABLE_NAME + ' (listID, name, description, type) VALUES (?, ?, ?, ?) RETURNING id;', [article.listID, article.name, article.description, article.type]);

        if (rows && rows.length > 0) res = rows[0].id;
    } catch (err) {
        // TODO Add result
        console.log('Failed to add new article to database: ' + err);
    } finally {
        if (conn) conn.end();
    }
    if (res) return res;
    else return null;
}

export async function removeArticle (articleID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + ARTICELS_TABLE_NAME + ' WHERE id = ?;', [articleID]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to remove article from database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function getArticle (articleID: number): Promise<Article | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        let article = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME + ' WHERE id=? LIMIT 1', [articleID]);

        if (article && article.length > 0) {
            article = article[0];
            res = new Article(article.id, article.userID, article.name, article.description, article.type);
        }
    } catch (err) {
        console.log('Failed to get all articles from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (res) return res;
    else return null;
}

export async function getAllArticles (listID: number): Promise<Article[]> {
    let conn;
    const res: Article[] = [];
    try {
        conn = await getConnection();
        const articles = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME + ' WHERE listID=?', [listID]);

        if (articles != null) {
            articles.forEach((a: { id: number; listID: number; name: string; description: string; type: number; }) => {
                res.push(new Article(a.id, a.listID, a.name, a.description, a.type));
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
