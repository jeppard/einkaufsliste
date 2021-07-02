import express from 'express';
import * as articleTypeProvider from '../database/provider/article_type';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('articleType specific stuff');
});

/**
 * Adds new article-type to database
 *
 * route: "/lists/articles/types/add"
 *
 * Body:
 * name
 * color
 */

router.post('/add', async function (req, res) {
    const body: { name: string, color: string } = req.body;

    if (body && areNotNullOrEmpty([body.name, body.color])) {
        await articleTypeProvider.addType(body.name, body.color);

        res.status(201).send('Added article-type to database');
    } else {
        res.status(400).send('The given informations are not in a correct form');
    }
});

/**
 * Remove article-type from database
 *
 * route: "/lists/articles/types/remove"
 *
 * Body:
 * typeID
 */

router.post('/remove', async function (req, res) {
    const body: {typeID: number} = req.body;

    if (body && areNumbers([body.typeID])) {
        await articleTypeProvider.removeType(body.typeID);

        res.status(200).send('Article-type removed');
    } else {
        res.status(400).send('Article-type id is is not given');
    }
});

/**
 * Get one article-type from database
 *
 * route: "/lists/articles/types/get"
 *
 * Body:
 * typeID
 */
router.get('/get', async function (req, res) {
    const body: { typeID: number } = req.body;

    if (body && areNumbers([body.typeID])) {
        const type = await articleTypeProvider.getType(body.typeID);

        if (type) {
            res.status(200).send(type);
        } else {
            res.status(404).send('Article-type not found');
        }
    } else {
        res.status(400).send('Article-type iformations are not given');
    }
});

/**
 * Get all article-types from database
 *
 * route: "/lists/articles/types/getAll"
 */
router.get('/getAll', async function (req, res) {
    const types = await articleTypeProvider.getAllTypes();

    if (types) {
        res.status(200).send(types);
    } else {
        res.status(404).send('No articles-types found');
    }
});

export { router as articleTypeRouter };
