import express from 'express';
import { elementRouter } from './elements';
import { articleRouter } from './articles';
import * as elementProvider from '../database/provider/element';
import * as listProvider from '../database/provider/list';
import { areNumbers } from '../parameter_util';

const router = express.Router();

// route: "/lists/"
router.use('/', express.static('app/pages/liste.html'));

router.use('/elements', elementRouter);
router.use('/articles', articleRouter);

/**
 * Response content of a list
 *
 * Body:
 * listID
 */
router.post('/content', async function (req, res) {
    const body : { listID: number} = req.body;

    if (body && areNumbers([body.listID])) {
        const list = await listProvider.getListById(body.listID);

        if (list != null) {
            list.content = await elementProvider.getAllElementsWithArticles(body.listID);
            res.send(list);
        } else {
            res.status(404).send('No List');
        }
    } else {
        res.status(400).send('Failed');
    }
});

/**
 * Remove list from database
 *
 * Body:
 * listID
 */
router.post('/removeList', async function (req, res) {
    const body: { listID: number } = req.body;

    if (body && areNumbers([body.listID])) {
        const list = await listProvider.getListById(body.listID);

        if (list != null) {
            await listProvider.removeList(body.listID);
            res.send(list);
        } else {
            res.status(404).send('No List');
        }
    } else {
        res.status(400).send('Failed');
    }
});

export { router as listRouter };
