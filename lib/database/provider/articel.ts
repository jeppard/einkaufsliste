import { Article } from '../types/article';
import * as articleTypeProvider from './article_type';
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

export async function addArticle (listID: number, name: string, description: string, type: number): Promise<number | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        // TODO better sulution to get inserted article id
        await conn.query('INSERT INTO ' + ARTICELS_TABLE_NAME + ' (listID, name, description, type) VALUES (?, ?, ?, ?);', [listID, name, description, type]);
        const articles = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME + ' WHERE id = LAST_INSERT_ID();');

        if (articles && articles.length > 0) {
            const a : { id: number, name: string, listID: number} = articles[0];

            if (a.name === name && a.listID === listID) res = a.id;
        }
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

            const articleType = await articleTypeProvider.getType(article.type);
            if (articleType) res = new Article(article.id, article.userID, article.name, article.description, articleType);
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
            for (const a of articles) {
                const articleType = await articleTypeProvider.getType(a.type);

                if (articleType) res.push(new Article(a.id, a.listID, a.name, a.description, articleType));
            }
        }
    } catch (err) {
        console.log('Failed to get all articles from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}
