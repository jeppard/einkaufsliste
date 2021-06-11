import { getConnection } from '../db';

const TABLE_NAME = 'Accounts';

export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (id int auto_increment primary key, name varchar(50) unique, password varchar(50));';
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

export async function addAccount (name: string, password: string): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + TABLE_NAME + ' (name, password) VALUES (?, ?);', [name, password]);
    } catch (err) {
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }
}
