import { User } from '../types/user';
import { saltRounds } from '../../../index';
import bcrypt from 'bcrypt';
import { getConnection } from '../db';

const TABLE_NAME = 'Accounts';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (id int auto_increment primary key, username varchar(50) unique, password varchar(200));';
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

export async function addAccount (username: string, password: string): Promise<number | null> {
    let conn;
    let res;
    try {
        const hash = await bcrypt.hash(password, saltRounds);

        conn = await getConnection();
        const rows = await conn.query('INSERT INTO ' + TABLE_NAME + ' (username, password) VALUES (?, ?) RETURNING id;', [username, hash]);

        if (rows && rows.length > 0) res = rows[0].id;
    } catch (err) {
        console.log(err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (!isNaN(res)) return res;
    else return null;
}

export async function getAccountByUsername (username: string): Promise<User | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT id, username FROM ' + TABLE_NAME + ' WHERE username=? LIMIT 1;', [username]);

        if (rows && rows.length > 0) {
            const account: { id: number, username: string} = rows[0];

            res = new User(account.id, account.username);
        }
    } catch (err) {
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (res) return res;
    else return null;
}

export async function getAccountByID (id: number): Promise<User | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT id, username FROM ' + TABLE_NAME + ' WHERE id=? LIMIT 1;', [id]);

        if (rows && rows.length > 0) {
            const account: { id: number, username: string } = rows[0];

            res = new User(account.id, account.username);
        }
    } catch (err) {
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (res) return res;
    else return null;
}

export async function verifyUser (username: string, password: string): Promise<boolean> {
    let conn;
    let res = false;
    try {
        conn = await getConnection();
        const rows = await conn.query('SELECT * FROM ' + TABLE_NAME + ' WHERE username=?;', [username]);

        if (rows && rows.length > 0) {
            const hash = rows[0].password;
            const match = await bcrypt.compare(password, hash);

            if (match) res = true;
        }
    } catch (err) {
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}
