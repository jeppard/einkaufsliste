import { getConnection } from '../db';
import { List } from '../types/list';
import { User } from '../types/user';
import { getAccountByID } from './account';
import { getListById } from './list';

const ARTICELS_TABLE_NAME = 'Link_User_List';

/**
 * Initialize the database for user list connection
 */
export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ARTICELS_TABLE_NAME + ' (userID int, listID int);';

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

export async function addLink (userID: number, listID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        const check = await conn.query('SELECT COUNT(*) FROM ' + ARTICELS_TABLE_NAME + ';');

        if (!isNaN(check[0]['COUNT(*)']) && check[0]['COUNT(*)'] === 0) {
            await conn.query('INSERT INTO ' + ARTICELS_TABLE_NAME + ' (userID, listID) VALUES (?, ?);', [userID, listID]);
        }
    } catch (err) {
        // TODO Add result
        console.log('Failed to add new user list link to database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function removeLink (userID: number, listID: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + ARTICELS_TABLE_NAME + ' WHERE userID=? AND listID=?;', [userID, listID]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to remove user list link from database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function getListsByUser (userID: number): Promise<List[]> {
    let conn;
    const res: List[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT listID FROM ' + ARTICELS_TABLE_NAME + ' WHERE userID=?;', [userID]);

        if (rows && rows.length > 0) {
            for (const row of rows) {
                const list = await getListById(row.listID);

                if (list) res.push(list);
            }
        }
    } catch (err) {
        console.log('Failed to get all lists by user from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}

export async function getUsersByList (listID: number): Promise<User[]> {
    let conn;
    const res: User[] = [];
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT userID FROM ' + ARTICELS_TABLE_NAME + ' WHERE listID=?;', [listID]);

        if (rows && rows.length > 0) {
            for (const row of rows) {
                const user = await getAccountByID(row.userID);

                if (user) res.push(user);
            }
        }
    } catch (err) {
        console.log('Failed to get all users by list from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}
