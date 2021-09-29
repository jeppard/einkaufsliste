import { ListElement } from '../types/list_element';
import { Article } from '../types/article';
import * as articleProvider from './articel';
import * as tagElementProvider from './element_tag';
import { getConnection } from '../db';
import { getAllTagsOfElement } from './element_tag';
import { getAllTagsOfArticle } from './article_tag';

const ELEMENTS_TABLE_NAME = 'Elements';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ELEMENTS_TABLE_NAME + ' (id int auto_increment primary key, listID int, articleID int, count int, unitType varchar(50));';

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

export async function addElement (listID: number, articleID: number, count: number, unitType: string, tags: string[]): Promise<number | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        const rows = await conn.query('INSERT INTO ' + ELEMENTS_TABLE_NAME + ' (listID, articleID, count, unitType) VALUES (?, ?, ?, ?) RETURNING id;', [listID, articleID, count, unitType]);
        if (rows && rows.length > 0) {
            res = rows[0].id;
            await tagElementProvider.addTagsToElementByName(tags, res, listID);
        }
    } catch (err) {
        console.log('Failed to add new Element to database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (!isNaN(res)) return res;
    else return null;
}

export async function removeElement (elementID: number, listID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + ELEMENTS_TABLE_NAME + ' WHERE id=? AND listID=?', [elementID, listID]);
        await tagElementProvider.removeAllTagsFromElement(elementID);
    } catch (err) {
        console.log('Failed to remove element from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }
}

export async function updateElement (id: number, listID: number, articleID: number, count: number, unitType: string, tags: string[]): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('UPDATE ' + ELEMENTS_TABLE_NAME + ' SET listID=?, articleID=?, count=?, unitType=? WHERE id=?;', [listID, articleID, count, unitType, id]);
        await tagElementProvider.removeAllTagsFromElement(id);
        await tagElementProvider.addTagsToElementByName(tags, id, listID);
    } catch (err) {
        console.log('Failed to update element in database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }
}

export async function getElement (listID: number, elementID: number): Promise<ListElement | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        let element = await conn.query('SELECT * FROM ' + ELEMENTS_TABLE_NAME + ' WHERE listID=? AND id=? LIMIT 1;', [listID, elementID]);

        if (element && element.length > 0) {
            element = element[0];
            const elementTags = getAllTagsOfElement(element.id);
            const article = await articleProvider.getArticle(element.articleID);
            if (article) {
                res = new ListElement(element.id, element.listID, article, element.count, element.unitType, await elementTags);
            }
        }
    } catch (err) {
        console.log('Failed to get a element from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (res) return res;
    else return null;
}

export async function getAllElementsWithArticles (listID: number): Promise<ListElement[]> {
    let conn;
    const res: ListElement[] = [];
    try {
        conn = await getConnection();
        const articles = await articleProvider.getAllArticles(listID);
        const elements = await conn.query('SELECT * FROM ' + ELEMENTS_TABLE_NAME + ' WHERE listID=?;', [listID]);

        if (articles != null && elements != null) {
            for (const e of elements) {
                const arr = articles.filter((a) => e.articleID === a.id);

                if (arr != null && arr.length > 0) {
                    const article = arr[0];
                    res.push(new ListElement(e.id, e.listID, new Article(article.id, article.listID, article.name, article.description, article.type, await getAllTagsOfArticle(article.id)), e.count, e.unitType, await getAllTagsOfElement(e.id)));
                }
            }
        }
    } catch (err) {
        console.log('Failed to get all elements from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }
    return res;
}
