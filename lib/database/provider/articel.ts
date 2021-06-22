import { Article } from '../article';
import { getConnection } from '../db';

const ARTICELS_TABLE_NAME = 'Articles';

/**
 * Initialize the database for articles
 */
export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ARTICELS_TABLE_NAME + ' (id int auto_increment primary key, userID int, name varchar(50), description varchar(250), type int);';

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
        await conn.query('INSERT INTO ' + ARTICELS_TABLE_NAME + ' (userID, name, description, type) VALUES (?, ?, ?, ?);', [article.userID, article.name, article.description, article.type]);
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
        await conn.query('DELETE FROM ' + ARTICELS_TABLE_NAME + ' id = ?;', [articleID]);
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
            res = new Article(article.ID, article.userID, article.name, article.description, article.type);
            console.log(res)
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

export async function getAllArticles (): Promise<Article[]> {
    let conn;
    const res: Article[] = [];
    try {
        conn = await getConnection();
        const articles = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME);

        if (articles != null) {
            articles.forEach((a: { id: number; userID: number; name: string; description: string; type: number; }) => {
                res.push(new Article(a.id, a.userID, a.name, a.description, a.type));
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
