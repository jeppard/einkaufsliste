import { ArticleType } from '../types/aritcle_type';
import { getConnection } from '../db';

const ARTICELS_TABLE_NAME = 'ArticleTypes';

/**
 * Initialize the database for article types
 */
export async function initDatabase (): Promise<void> {
    const query = 'CREATE TABLE IF NOT EXISTS ' + ARTICELS_TABLE_NAME + ' (id int auto_increment primary key, name varchar(50), color varchar(10));';

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

export async function addType (name: string, color: string): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('INSERT INTO ' + ARTICELS_TABLE_NAME + ' (name, color) VALUES (?, ?);', [name, color]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to add new article type to database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function removeType (id: number): Promise<void> {
    let conn;
    try {
        conn = await getConnection();
        await conn.query('DELETE FROM ' + ARTICELS_TABLE_NAME + ' id = ?;', [id]);
    } catch (err) {
        // TODO Add result
        console.log('Failed to remove article type from database: ' + err);
    } finally {
        if (conn) conn.end();
    }
}

export async function getType (id: number): Promise<ArticleType | null> {
    let conn;
    let res;
    try {
        conn = await getConnection();
        let type = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME + ' WHERE id=? LIMIT 1', [id]);

        if (type && type.length > 0) {
            type = type[0];
            res = new ArticleType(type.id, type.name, type.color);
        }
    } catch (err) {
        console.log('Failed to get all articles types from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    if (res) return res;
    else return null;
}

export async function getAllTypes (): Promise<ArticleType[]> {
    let conn;
    const res: ArticleType[] = [];
    try {
        conn = await getConnection();
        const types = await conn.query('SELECT * FROM ' + ARTICELS_TABLE_NAME);

        if (types != null) {
            types.forEach((t: { id: number; name: string; color: string}) => {
                res.push(new ArticleType(t.id, t.name, t.color));
            });
        }
    } catch (err) {
        console.log('Failed to get all articles types from database: ' + err);
        // TODO Add result
    } finally {
        if (conn) conn.end();
    }

    return res;
}
