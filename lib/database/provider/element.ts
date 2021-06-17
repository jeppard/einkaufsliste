import { ListElement } from '../list_element';
import { Article } from '../article';
import * as articleProvider from './articel';
import { getConnection } from '../db';

const ELEMENTS_TABLE_NAME = 'Elements';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ELEMENTS_TABLE_NAME + ' (ID int auto_increment primary key, ListID int, ArticleID int, Count int, UnitType varchar(50));';

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

export async function removeElement (elementID: number, listID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + ELEMENTS_TABLE_NAME + ' WHERE ID=? AND ListID=?', [elementID, listID]);
    } catch (err) {
        console.log('Failed to remove element from database: ' + err);
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
        const articles = await articleProvider.getAllArticles();
        const elements = await conn.query('SELECT * FROM ' + ELEMENTS_TABLE_NAME + ' WHERE ListID=?;', [listID]);

        if (articles != null && elements != null) {
            elements.forEach((e: { ArticleID: number; ListID: number; Count: number; UnitType: string; }) => {
                const article = (articles.filter((a) => e.ArticleID === a.id))[0];

                if (article != null) {
                    res.push(new ListElement(e.ListID, e.ListID, new Article(article.id, article.userID, article.name, article.description, article.type), e.Count, e.UnitType));
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
