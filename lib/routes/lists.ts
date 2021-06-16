import express from 'express';
import * as elementProvider from '../database/provider/element';
import * as listProvider from '../database/provider/list';
import {} from '../database/list';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List specific stuff');
});

router.post('/content', async function (req, res) {
    if (req.body && req.body.ListID) {
        const list = await listProvider.getListById(req.body.ListID);

        if (list != null) {
            list.content = await elementProvider.getAllListArticles(req.body.ListID);
            res.send(list);
            return;
        } else {
            res.status(404).send('No List');
            return;
        }
    }

    res.status(400).send('Failed');
});

router.post('/removeList', async function (req, res) {
    if (req.body && req.body.ListID) {
        const list = await listProvider.getListById(req.body.ListID);

        if (list != null) {
            await listProvider.removeList(req.body.ListID);
            res.send(list);
            return;
        } else {
            res.status(404).send('No List');
            return;
        }
    }

    res.status(400).send('Failed');
});


export { router };
