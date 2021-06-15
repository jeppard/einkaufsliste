// Test script to test all database relevant stuff
import * as accountProvider from './provider/account';
import * as listProvider from './provider/list';
import * as articleProvider from './provider/articel';
import * as elementProvider from './provider/element';
import { Article } from './article';

export async function initDatabase (): Promise<void> {
    await accountProvider.initDatabase();
    await listProvider.initDatabase();
    await articleProvider.initDatabase();
    await elementProvider.initDatabase();
}

export async function initData (): Promise<void> {
    await accountProvider.addAccount('Test Person', '1235');

    await listProvider.addList('Test', 1, 'This is a List');

    await articleProvider.addArticle(new Article(1, 1, 'Apfel', 'Ein netter Apfel', 1));
    await articleProvider.addArticle(new Article(2, 1, 'Baum', 'Ein Baum', 1));
    await elementProvider.addElement(1, 1, 10, 'Stück');
    await elementProvider.addElement(1, 2, 10, 'Bäume');
}
