import { getConnection } from '../db';
import { Filter } from '../types/filter';
import { Tag } from '../types/tag';
import * as tagProvider from './tag';

const FILTER_TABLE_NAME = 'filter';
const LINK_TABLE_NAME = 'filter_tag';

export async function initDatabase (): Promise<void> {
    const query1 = 'CREATE TABLE IF NOT EXISTS ' + FILTER_TABLE_NAME + ' (id int auto_increment primary key, listID int, name varchar(50), color varchar(10));';
    const query2 = 'CREATE TABLE IF NOT EXISTS ' + LINK_TABLE_NAME + ' (filterID int, tagID int);';
    let conn;
    try {
        conn = await getConnection();
        Promise.all([
            conn.query(query1),
            conn.query(query2)
        ]);
    } catch (err) {
        console.log('Error creating Table ' + FILTER_TABLE_NAME + ': ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function addFilter (listID: number, name: string, color:string, tags: string[]): Promise<Filter | undefined> {
    tags = [...new Set(tags.map(s => s.toLowerCase()))];
    let conn;
    let res;
    try {
        conn = await getConnection();
        const rows = await conn.query('INSERT INTO ' + FILTER_TABLE_NAME + ' (listID, name, color) VALUES (?, ?, ?) RETURNING id;', [listID, name, color]);
        if (rows && rows.length > 0) {
            res = new Filter(rows[0].id, listID, name, color, []);
            Promise.all(tags.map(async tagName => {
                let tagID = await tagProvider.getTagID(tagName, listID);
                if (tagID === -1) {
                    const tag = (await tagProvider.addTag(listID, tagName));
                    if (!tag) {
                        return;
                    }
                    tagID = tag.id;
                }
                return addTagToFilter(rows[0].id, tagID);
            }));
        }
    } catch (err) {
        console.log('An Error occured while adding Filter ' + name + ': ' + err);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

async function addTagToFilter (filterID: number, tagID: number) {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + LINK_TABLE_NAME + ' (filterID, tagID) VALUES (?, ?);', [filterID, tagID]);
    } catch (err) {
        console.log('Error adding Tag to Filter: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

async function removeAllTagsFromFilter (filterID: number) {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + LINK_TABLE_NAME + ' WHERE filterID=?;', [filterID]);
    } catch (err) {
        console.log('Error occoured while removig Tags from Filter ' + filterID + ': ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function updateFilter (filterID: number, listID: number, name: string, color:string, tags: string[]): Promise<void> {
    tags = [...new Set(tags.map(s => s.toLowerCase()))];
    let conn;
    try {
        conn = await getConnection();
        Promise.all([
            conn.query('UPDATE ' + FILTER_TABLE_NAME + ' listID=?, name=?, color=? WHERE id=?;', [listID, name, color, filterID]),
            removeAllTagsFromFilter(filterID)]);
        Promise.all(tags.map(async tagName => {
            let tagID = await tagProvider.getTagID(tagName, listID);
            if (tagID === -1) {
                const tag = (await tagProvider.addTag(listID, tagName));
                if (!tag) {
                    return;
                }
                tagID = tag.id;
            }
            return addTagToFilter(filterID, tagID);
        }));
    } catch (err) {
        console.error('Error update Filter ' + name + ': ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function getFilter (filterID:number):Promise<Filter | undefined> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT * FROM ' + FILTER_TABLE_NAME + ' WHERE id=? LIMIT 1;', [filterID]);
        if (rows && rows.length > 0) {
            res = new Filter(filterID, rows[0].listID, rows[0].name, rows[0].color, []);
            res.tags.concat(await getAllTagsFromFilter(filterID));
        }
    } catch (err) {
        console.log('Error getting Filter ' + filterID + ': ' + err);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

async function getAllTagsFromFilter (filterID: number):Promise<Tag[]> {
    let conn;
    const res: Tag[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT tagID FROM ' + LINK_TABLE_NAME + ' WHERE filterID=?;', filterID);
        if (rows && rows.length > 0) {
            res.concat(await Promise.all(rows.map((tag: {tagID: number}) => tagProvider.getTag(tag.tagID))));
        }
    } catch (error) {
        console.log('Error getting Tags from Filter ' + filterID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
    return res;
}

export async function getAllFilters (listID: number): Promise<Filter[]> {
    let conn;
    const res: Filter[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT * FROM ' + FILTER_TABLE_NAME + ' WHERE listID=?;', [listID]);
        if (rows && rows.length > 0) {
            res.concat(await Promise.all(rows.map(async (row:{id: number, listID: number, name:string, color:string}) => {
                return new Filter(row.id, row.listID, row.name, row.color, await getAllTagsFromFilter(row.id));
            })));
        }
    } catch (error) {
        console.log('Error getting all Filters from listID ' + listID + ': ' + error);
    } finally {
        if (conn) conn.end();
    }
    return res;
}
