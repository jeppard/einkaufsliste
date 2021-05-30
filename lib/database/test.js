const accountProvider = require("./provider/account");
const listProvider = require("./provider/list");
const articleProvider = require("./provider/articel");

accountProvider.initDatabase();
accountProvider.addAccount("Test Person", "1235");

listProvider.initDatabase();
listProvider.addList("TEst", 218391279, "This is a List");

articleProvider.initDatabase();
// articleProvider.addArticle(21739127, "Apfel", 3);
// articleProvider.addElement(218391279, 1, 10, "Stueck");

articleProvider.getAllArticleElements(218391279);
