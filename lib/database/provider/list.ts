import { getConnection } from '../db';
import { List } from '../list';

const TABLE_NAME = 'Lists';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (ID int auto_increment primary key, Name varchar(50), OwnerID int, Description varchar(250));';
    let conn;
    let res;
    try {
        conn = await getConnection();
        res = await conn.query(query);
    } catch (err) {
        console.log('Failed to initilaize database: ' + err);
        console.log('Result: ' + res);
    } finally {
        if (conn) conn.end();
    }
}

export async function addList (name: string, ownerid: number, description: string): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + TABLE_NAME + ' (Name, OwnerID, Description) VALUES (?, ?, ?);', [name, ownerid, description]);
    } catch (err) {
        // TODO add result
    } finally {
        if (conn) conn.end();
    }
}

export async function removeList (listID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + TABLE_NAME + ' WHERE ID = ?;', [listID]);
    } catch (err) {
        // TODO response
    } finally {
        if (conn) conn.end();
    }
}

export async function getListById (listID: number): Promise<List | null> {
    let conn;
    let rows;
    try {
        conn = await getConnection();
        rows = await conn.query('SELECT * FROM ' + TABLE_NAME + ' WHERE ID = ?;', [listID]);
    } catch (err) {
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (rows != null && rows.length > 0) {
        const row = rows[0];
        return new List(row.ID, row.Name, row.OwnerID, row.description, []);
    } else return null;
}
