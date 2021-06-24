import express from 'express';
import { Article } from '../database/types/article';
import * as articleProvider from '../database/provider/articel';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List article specific stuff');
});

/**
 * Adds new article to database
 *
 * Body:
 * userID       - ID of the specific user who owns the article
 * name         - Name of the article
 * description  - description of the article
 * type         - Type number of the article
 */

router.post('/add', async function (req, res) {
    const article: { userID: number, name: string, description: string, type: number } = req.body;

    if (article && areNumbers([article.userID, article.type]) && areNotNullOrEmpty([article.description, article.name])) {
        await articleProvider.addArticle(new Article(0, article.userID, article.name, article.description, article.type));

        res.status(201).send('Added article to list');
    } else {
        res.status(400).send('The given article is not in correct form');
    }
});

/**
 * Get one article from database
 *
 * Body:
 * articleID
 */
router.get('/get', async function (req, res) {
    const body: { articleID: number } = req.body;

    if (body && areNumbers([body.articleID])) {
        const article = await articleProvider.getArticle(body.articleID);

        res.status(200).send(article);
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

export { router as articleRouter };
