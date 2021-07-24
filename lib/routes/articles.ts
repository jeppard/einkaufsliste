import express from 'express';
import { articleTypeRouter } from './article_types';
import * as articleProvider from '../database/provider/articel';
import { areNotNullOrEmpty, areNumbers, areNotNullButEmpty } from '../parameter_util';
import { checkListMember, checkListMemberMidle } from './user_authentication';

const router = express.Router();

// route: "/lists/articles/"
router.get('/', function (req, res) {
    res.send('List article specific stuff');
});

router.use('/types', articleTypeRouter);

/**
 * Adds new article to database
 *
 * route: "/lists/articles/add"
 *
 * Body:
 * listID       - ID of the specific list which owns the article
 * name         - Name of the article
 * description  - description of the article
 * type         - Type number of the article
 */

router.post('/add', checkListMemberMidle, async function (req, res) {
    const article: { listID: number, name: string, description: string, type: number } = req.body;

    if (article && areNumbers([article.listID, article.type]) && areNotNullOrEmpty([article.name]) && areNotNullButEmpty([article.description])) {
        const articleID = await articleProvider.addArticle(article.listID, article.name, article.description, article.type);

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
 * route: "/lists/articles/remove"
 *
 * Body:
 * articleID
 */

router.post('/remove', async function (req, res) {
    const body: {articleID: number} = req.body;
    const userID = req.session.userID;

    if (body && areNumbers([body.articleID])) {
        const article = await articleProvider.getArticle(body.articleID);
        if (userID && article && checkListMember(userID, article.listID)) {
            await articleProvider.removeArticle(body.articleID);

            res.status(200).send('Article removed');
        } else res.status(401).send('Unauthorized');
    } else {
        res.status(400).send('Article is is not given');
    }
});

/**
 * Updates article in database
 *
 * route: "/lists/articles/update"
 *
 * Body:
 * articleID
 * listID
 * name
 * description
 * type
 */

router.post('/update', checkListMemberMidle, async function (req, res) {
    const article: { articleID: number, listID: number, name: string, description: string, type: number } = req.body;

    if (article && areNumbers([article.articleID, article.listID, article.type]) && areNotNullOrEmpty([article.name]) && areNotNullButEmpty([article.description])) {
        await articleProvider.updateArticle(article.articleID, article.listID, article.name, article.description, article.type);
        const a = await articleProvider.getArticle(article.articleID);

        if (a) res.status(201).send(a);
        else res.status(404).send('Article not found');
    } else {
        res.status(400).send('The given article is not in correct form');
    }
});

/**
 * Get one article from database
 *
 * route: "/lists/articles/get"
 *
 * Body:
 * articleID
 *
 * return:
 * article
 */
router.post('/get', async function (req, res) {
    const body: { articleID: number } = req.body;
    const userID = req.session.userID;

    if (body && areNumbers([body.articleID])) {
        const article = await articleProvider.getArticle(body.articleID);

        if (article && userID) {
            if (checkListMember(userID, article.listID)) res.status(200).send(article);
            else res.status(401).send('Unauthorized');
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
 * route: "/lists/articles/getAll"
 *
 * Body:
 * listID
 *
 * return:
 * array of articles
 */
router.post('/getAll', checkListMemberMidle, async function (req, res) {
    const body: { listID: number } = req.body;

    if (body && areNumbers([body.listID])) {
        const articles = await articleProvider.getAllArticles(body.listID);

        if (articles) {
            res.status(200).send(articles);
        } else {
            res.status(404).send('No articles found');
        }
    } else {
        res.status(400).send('Element informations are not given');
    }
});

export { router as articleRouter };
