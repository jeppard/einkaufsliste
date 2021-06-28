// Test script to test all database relevant stuff
import * as accountProvider from './provider/account';
import * as listProvider from './provider/list';
import * as articleProvider from './provider/articel';
import * as elementProvider from './provider/element';
import * as articleTypeProvider from './provider/article_type';
import { Article } from './types/article';

export async function initDatabase (): Promise<void> {
    await accountProvider.initDatabase();
    await listProvider.initDatabase();
    await articleProvider.initDatabase();
    await elementProvider.initDatabase();
    await articleTypeProvider.initDatabase();
}

export async function initData (): Promise<void> {
    await accountProvider.addAccount('Test', '123');

    await listProvider.addList('Test', 1, 'This is a List');

    await articleTypeProvider.addType('Essen', '#17A717');
    await articleTypeProvider.addType('Werkzeug', '#6C8188');
    await articleTypeProvider.addType('Material', '#782A1C');

    await articleProvider.addArticle(new Article(1, 1, 'Apfel', 'Ein netter Apfel', 1));
    await articleProvider.addArticle(new Article(2, 1, 'Baum', 'Ein Baum', 3));

    await elementProvider.addElement(1, 1, 10, 'Stück');
    await elementProvider.addElement(1, 2, 10, 'Bäume');
}
