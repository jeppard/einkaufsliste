import { getConnection } from '../db';
import { Tag } from '../types/tag';
import * as tagProvider from './tag';

const TABLE_NAME = 'article_tag';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (articleID int, tagID int);';
    let conn;
    try {
        conn = await getConnection();
        conn.query(query);
    } catch (error) {
        console.log('Error creating Table ' + TABLE_NAME + ' : ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function addTagToArticle (articleID: number, tagID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + TABLE_NAME + ' (articleID, tagID) VALUES (?, ?);', [articleID, tagID]);
    } catch (error) {
        console.log('Error occured adding Tag wih id ' + tagID + ' to article wit id ' + articleID + ': ' + error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

export async function removeTagFromArticle (articleID: number, tagID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + TABLE_NAME + ' WHERE articleID=? AND tagID=?;', [articleID, tagID]);
        await tagProvider.removeTagIfUnused(tagID);
    } catch (error) {
        console.log('Error removing Tag with id ' + tagID + ' from aricle with id ' + articleID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function getAllTagsOfArticle (articleID: number): Promise<Tag[]> {
    let conn;
    const res: Tag[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT tagID FROM ' + TABLE_NAME + ' WHERE articleID=?;', [articleID]);
        if (rows && rows.length > 0) {
            for (const row of rows) {
                const tag = await tagProvider.getTag(row.tagID);
                if (tag) res.push(tag);
            }
        }
    } catch (error) {
        console.log('Could not read Tags from Article with id ' + articleID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

export async function removeAllTagsFromArticle (articleID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        const rows = await conn.query('DELETE FROM ' + TABLE_NAME + ' WHERE articleID=? RETURNING tagID;', [articleID]);
        await Promise.all(rows.map((tagID: {tagID:number}) => {
            return tagProvider.removeTagIfUnused(tagID.tagID);
        }));
    } catch (error) {
        console.log('Error removing all Tags from article with id ' + articleID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
}

export async function checkTagArticleUse (tagID: number): Promise<boolean> {
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

export async function addTagsToArticleByName (tags: string[], articleID: number, listID: number): Promise<void> {
    tags = [...new Set(tags.map(s => s.toLowerCase()))];
    await Promise.all(tags.map(async (tag) => {
        const tagID = await tagProvider.getTagID(tag, listID);
        if (tagID > 0) {
            // Tag allready exists
            return addTagToArticle(articleID, tagID);
        } else {
            // Tag has to be created
            const newTag = await tagProvider.addTag(listID, tag);
            if (newTag) return addTagToArticle(articleID, newTag.id);
        }
    }));
}
