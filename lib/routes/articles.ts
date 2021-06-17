import express from 'express';
import { Article } from '../database/article';
import * as articleProvider from '../database/provider/articel';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List article specific stuff');
});

router.post('/add', async function (req, res) {
    const article: { userID: number, name: string, description: string, type: number } = req.body;

    if (article && areNumbers([article.userID, article.type]) && areNotNullOrEmpty([article.description, article.name])) {
        await articleProvider.addArticle(new Article(0, article.userID, article.name, article.description, article.type));

        res.status(201).send('Added article to list');
    } else {
        res.status(400).send('The given article is not in correct form');
    }
});

export { router };
