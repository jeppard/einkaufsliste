import { getConnection } from '../db';
import { Tag } from '../types/tag';
import { checkTagArticleUse } from './article_tag';
import { checkTagElementUse } from './element_tag';

export const TAG_TABLE_NAME = 'TAGS';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + TAG_TABLE_NAME + ' (id int auto_increment primary key, listID int, name varchar(50));';
    let conn;
    try {
        conn = await getConnection();
        await conn.query(query);
    } catch (error) {
        console.log('Failed to initilaize database: ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function addTag (listID: number, name: string): Promise<Tag | null> {
    let conn;
    let res = null;
    try {
        conn = await getConnection();
        const rows = await conn.query('INSERT INTO ' + TAG_TABLE_NAME + ' (listID, name) VALUES (?, ?) RETURNING *;', [listID, name]);
        if (rows && rows.length > 0) res = new Tag(rows[0].id, rows[0].listID, rows[0].name);
    } catch (error) {
        console.log('Failed to add new tag to database: ' + error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
    return res;
}

export async function removeTag (id:number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + TAG_TABLE_NAME + ' WHERE id = ?;', [id]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to remove tag from database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function getTag (id: number): Promise<Tag | null> {
    let conn;
    let res = null;
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT * FROM ' + TAG_TABLE_NAME + ' WHERE id=? LIMIT 1;', [id]);
        if (rows && rows.length > 0) res = new Tag(rows[0].id, rows[0].listID, rows[0].name);
    } catch (error) {
        console.log('Failed to get Tag with id ' + id + ' from database: ' + error);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

export async function getAllTags (listID: number): Promise<Tag[]> {
    let conn;
    const res: Tag[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT * FROM ' + TAG_TABLE_NAME + ' WHERE listID=?;', [listID]);
        if (rows) {
            rows.forEach((element: {id: number, listID: number, name: string}) => {
                res.push(new Tag(element.id, element.listID, element.name));
            });
        }
    } catch (error) {
        console.log('Error getting all Tags with listID ' + listID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

export async function removeTagIfUnused (tagID: number): Promise<void> {
    if (!(await checkTagArticleUse(tagID) && (await checkTagElementUse(tagID)))) return;
    removeTag(tagID);
}
