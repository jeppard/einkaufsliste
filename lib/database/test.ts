// Test script to test all database relevant stuff
import * as accountProvider from './provider/account';
import * as listProvider from './provider/list';
import * as articleProvider from './provider/articel';
import * as elementProvider from './provider/element';
import * as articleTypeProvider from './provider/article_type';
import * as userListProvider from './provider/link_user_list';
import { getConnection } from './db';

export async function initDatabase (): Promise<void> {
    if (process.env.DROP_ALL_TABLES === 'yes') {
        const conn = await getConnection();
        await conn.query('DROP TABLE IF EXISTS Accounts');
        await conn.query('DROP TABLE IF EXISTS articles');
        await conn.query('DROP TABLE IF EXISTS articletypes');
        await conn.query('DROP TABLE IF EXISTS elements');
        await conn.query('DROP TABLE IF EXISTS link_user_list');
        await conn.query('DROP TABLE IF EXISTS lists');
        conn.end();
    }
    await accountProvider.initDatabase();
    await listProvider.initDatabase();
    await articleProvider.initDatabase();
    await elementProvider.initDatabase();
    await articleTypeProvider.initDatabase();
    await userListProvider.initDatabase();

    if (process.env.START_WITH_EXAMPEL_DATA === 'yes') {
        const user = await accountProvider.getAccountByUsername('InitialData');
        if (!user) initData();
    }
}

export async function initData (): Promise<void> {
    await accountProvider.addAccount('InitialData', '123');
    await accountProvider.addAccount('Maria', '123');
    await accountProvider.addAccount('Peter', '123');
    await accountProvider.addAccount('Gunther', '123');

    await listProvider.addList('Mein Einkauf', 2, 'Alle Sachen die ich brauche');
    await listProvider.addList('Wochenkauf', 3, 'Einkauf für jede Woche');

    await articleTypeProvider.addType(1, 'Essen', '#17A717');
    await articleTypeProvider.addType(1, 'Werkzeug', '#6C8188');
    await articleTypeProvider.addType(1, 'Material', '#782A1C');

    await articleTypeProvider.addType(2, 'Essen', '#17A717');
    await articleTypeProvider.addType(2, 'Werkzeug', '#6C8188');
    await articleTypeProvider.addType(2, 'Material', '#782A1C');

    await articleProvider.addArticle(1, 'Apfel', 'Ein netter Apfel', 1);
    await articleProvider.addArticle(1, 'Baum', 'Ein Baum', 3);
    await articleProvider.addArticle(1, 'Spaghetti', 'Lange Nudeln', 1);
    await articleProvider.addArticle(1, 'Brot', 'Weizen', 1);
    await articleProvider.addArticle(1, 'Rohr', 'Metall', 3);
    await articleProvider.addArticle(2, 'Gurke', 'Gemüse', 4);
    await articleProvider.addArticle(2, 'Tomaten', 'Rote Tomaten', 4);
    await articleProvider.addArticle(2, 'Maultaschen', 'In der Verpackung', 4);
    await articleProvider.addArticle(2, 'Besen', '', 5);
    await articleProvider.addArticle(2, 'Eisenplatte', 'Metall', 6);

    await elementProvider.addElement(1, 1, 10, 'Stück');
    await elementProvider.addElement(1, 2, 10, 'Bäume');
    await elementProvider.addElement(1, 3, 2, 'Packung');
    await elementProvider.addElement(1, 4, 1, 'Laib');
    await elementProvider.addElement(1, 5, 10, '10 cm');
    await elementProvider.addElement(2, 6, 2, 'Stück');
    await elementProvider.addElement(2, 7, 6, 'Stück');
    await elementProvider.addElement(2, 8, 1, 'Packung');
    await elementProvider.addElement(2, 9, 1, 'Stück');
    await elementProvider.addElement(2, 10, 2, '10x10 cm');

    await userListProvider.addLink(2, 1);
    await userListProvider.addLink(3, 1);
    await userListProvider.addLink(3, 2);
    await userListProvider.addLink(4, 1);
    await userListProvider.addLink(4, 2);

    console.log('Database filled with example data');
}
