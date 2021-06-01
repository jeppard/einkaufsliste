// Test script to test all database relevant stuff

const accountProvider = require("./provider/account");
const listProvider = require("./provider/list");
const articleProvider = require("./provider/articel");
const { Article } = require("./article");

module.exports.initDatabase = async function initDatabase() {
    await accountProvider.initDatabase();
    await accountProvider.addAccount("Test Person", "1235");

    await listProvider.initDatabase();
    await listProvider.addList("TEst", 218391279, "This is a List");

    await articleProvider.initDatabase();
    await articleProvider.addArticle(new Article(1, 1, "Apfel", "Ein netter Apfel", 1));
    await articleProvider.addElement(1, 1, 10, "Stueck");

    await articleProvider.getAllArticleElements(218391279);
}
