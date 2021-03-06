import express from 'express';
import * as articleTypeProvider from '../database/provider/article_type';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';
import { checkListMemberMidle } from './user_authentication';

const router = express.Router();

// route: "/lists/articles/types/"
router.get('/', function (req, res) {
    res.send('articleType specific stuff');
});

/**
 * Adds new article-type to database
 *
 * route: "/lists/articles/types/add"
 *
 * Body:
 * listID
 * name
 * color
 */

router.post('/add', checkListMemberMidle, async function (req, res) {
    const body: {listID: number, name: string, color: string } = req.body;

    if (body && areNotNullOrEmpty([body.listID, body.name, body.color])) {
        const typeID = await articleTypeProvider.addType(body.listID, body.name, body.color);

        if (typeID) {
            const type = await articleTypeProvider.getType(typeID);
            if (type) {
                res.status(201).send(type);
                return;
            }
        }
        res.status(500).send('Article type could not be added');
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
        const result = await articleTypeProvider.removeType(body.typeID);
        if (result) res.status(200).send('Article-type removed');
        else res.status(403).send('Article-type is still used');
    } else {
        res.status(400).send('Article-type id is is not given');
    }
});

/**
 * Update article-type in database
 *
 * route: "/lists/articles/types/update"
 *
 * Body:
 * typeID
 * name
 * color
 */

router.post('/update', async function (req, res) {
    const body: {typeID: number, name: string, color: string} = req.body;

    if (body && areNumbers([body.typeID]) && areNotNullOrEmpty([body.name, body.color])) {
        await articleTypeProvider.updateType(body.typeID, body.name, body.color);
        const at = await articleTypeProvider.getType(body.typeID);

        if (at) res.status(200).send(at);
        else res.status(404).send('Article-type not found');
    } else {
        res.status(400).send('Article-type informations not given');
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
router.post('/get', async function (req, res) {
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
 * Get all article-types from list
 *
 * route: "/lists/articles/types/getAll"
 *
 * Body:
 * listID
 */
router.post('/getAll', checkListMemberMidle, async function (req, res) {
    const body: {listID: number} = req.body;
    const types = await articleTypeProvider.getAllTypes(body.listID);

    if (types) {
        res.status(200).send(types);
    } else {
        res.status(404).send('No articles-types found');
    }
});

export { router as articleTypeRouter };
