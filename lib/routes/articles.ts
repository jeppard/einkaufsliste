import express from 'express';
import * as articleProvider from '../database/provider/articel';
import { Article } from '../database/article';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List article specific stuff');
});

router.post('/add', async function (req, res) {
    if (req.body && req.body.article) {
        try {
            const article: Article = JSON.parse(req.body.article);

            await articleProvider.addArticle(article);
            res.status(201).send('Added article to list');
            return;
        } catch (err) {
            res.status(406).send('The given article is not i an correct form');
            return;
        }
    }
    res.status(400).send('Body with article doesnt exist');
});

export { router };
