// Test script to test all database relevant stuff

const accountProvider = require("./provider/account");
const listProvider = require("./provider/list");
const articleProvider = require("./provider/articel");
const { Article } = require("./article");

module.exports.initDatabase = async function initDatabase() {
    await accountProvider.initDatabase();
    await listProvider.initDatabase();
    await articleProvider.initDatabase();
}

module.exports.initData = async function initData() {
    await accountProvider.addAccount("Test Person", "1235");

    await listProvider.addList("TEst", 218391279, "This is a List");

    await articleProvider.addArticle(new Article(1, 1, "Apfel", "Ein netter Apfel", 1));
    await articleProvider.addArticle(new Article(2, 1, "Baum", "Ein Baum", 1));
    await articleProvider.addElement(1, 1, 10, "Stück");
    await articleProvider.addElement(1, 2, 10, "Bäume");

    await articleProvider.getAllArticleElements(218391279);
}