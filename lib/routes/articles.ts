import express from 'express';
import { articleTypeRouter } from './article_types';
import { Article } from '../database/types/article';
import * as articleProvider from '../database/provider/articel';
import { areNotNullOrEmpty, areNumbers, areNotNullButEmpty } from '../parameter_util';

const router = express.Router();

// route: "/lists/articles/"
router.get('/', function (req, res) {
    res.send('List article specific stuff');
});

router.use('/types', articleTypeRouter);

/**
 * Adds new article to database
 *
 * Body:
 * listID       - ID of the specific list which owns the article
 * name         - Name of the article
 * description  - description of the article
 * type         - Type number of the article
 */

router.post('/add', async function (req, res) {
    const article: { listID: number, name: string, description: string, type: number } = req.body;

    if (article && areNumbers([article.listID, article.type]) && areNotNullOrEmpty([article.name]) && areNotNullButEmpty([article.description])) {
        const articleID = await articleProvider.addArticle(new Article(0, article.listID, article.name, article.description, article.type));

        if (articleID) {
            const newArticle = await articleProvider.getArticle(articleID);
            res.status(200).send(newArticle);
        } else res.status(500).send('Failed to add article');
    } else {
        res.status(400).send('The given article is not in correct form');
    }
});

/**
 * Remove article from database
 *
 * Body:
 * articleID
 */

router.post('/remove', async function (req, res) {
    const body: {articleID: number} = req.body;

    if (body && areNumbers([body.articleID])) {
        await articleProvider.removeArticle(body.articleID);

        res.status(200).send('Article removed');
    } else {
        res.status(400).send('Article is is not given');
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

        if (article) {
            res.status(200).send(article);
        } else {
            res.status(404).send('Article not found');
        }
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

/**
 * Get all article from database of a specific list
 *
 * Body:
 * listID
 */
router.get('/getAll', async function (req, res) {
    const body: { listID: number } = req.body;

    if (body && areNumbers([body.listID])) {
        const articles = await articleProvider.getAllArticles(body.listID);

        if (articles) {
            res.status(200).send(articles);
        } else {
            res.status(404).send('No articles found');
        }
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

export { router as articleRouter };
