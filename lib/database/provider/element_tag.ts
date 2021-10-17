import { getConnection } from '../db';
import { Tag } from '../types/tag';
import * as tagProvider from './tag';

const TABLE_NAME = 'element_tag';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (elementID int, tagID int);';
    let conn;
    try {
        conn = await getConnection();
        conn.query(query);
    } catch (error) {
        console.log('Error creating Table ' + TABLE_NAME + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function addTagToElement (elementID: number, tagID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + TABLE_NAME + ' (elementID, tagID) VALUES (?, ?);', [elementID, tagID]);
    } catch (error) {
        console.log('Error occured adding Tag wih id ' + tagID + ' to element wit id ' + elementID + ': ' + error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

export async function addTagsToElementByName (tags: string[], elementID: number, listID: number): Promise<void> {
    tags = [...new Set(tags.map(s => s.toLowerCase()))];
    await Promise.all(tags.map(async (tag) => {
        const tagID = await tagProvider.getTagID(tag, listID);
        if (tagID > 0) {
            // Tag allready exists
            return addTagToElement(elementID, tagID);
        } else {
            // Tag has to be created
            const newTag = await tagProvider.addTag(listID, tag);
            if (newTag) return addTagToElement(elementID, newTag.id);
        }
    }));
}

export async function removeTagFromElement (elementID: number, tagID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + TABLE_NAME + ' WHERE elementID=? AND tagID=?;', [elementID, tagID]);
        await tagProvider.removeTagIfUnused(tagID);
    } catch (error) {
        console.log('Error removing Tag with id ' + tagID + ' from element with id ' + elementID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function getAllTagsOfElement (elementID: number): Promise<Tag[]> {
    let conn;
    const res: Tag[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT tagID FROM ' + TABLE_NAME + ' WHERE elementID=?;', [elementID]);
        if (rows && rows.length > 0) {
            for (const row of rows) {
                const tag = await tagProvider.getTag(row.tagID);
                if (tag) res.push(tag);
            }
        }
    } catch (error) {
        console.log('Could not read Tags from Element with id ' + elementID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

export async function removeAllTagsFromElement (elementID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        const rows = await conn.query('DELETE FROM ' + TABLE_NAME + ' WHERE elementID=? RETURNING tagID;', [elementID]);
        await Promise.all(rows.map((tagID: {tagID: number}) => {
            return tagProvider.removeTagIfUnused(tagID.tagID);
        }));
    } catch (error) {
        console.log('Error removing all Tags from element with id ' + elementID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function checkTagElementUse (tagID: number): Promise<boolean> {
    let conn;
    let result = false;
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT * FROM ' + TABLE_NAME + ' WHERE tagID=? LIMIT 1;', [tagID]);
        if (rows && rows.length > 0) result = true;
    } catch (error) {
        console.log('Error checking use of tag with id ' + tagID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
    return result;
}
