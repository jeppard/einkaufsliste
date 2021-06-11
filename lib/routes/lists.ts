import express from 'express';
import * as articleProvider from '../database/provider/articel';
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
            list.content = await articleProvider.getAllListArticles(req.body.ListID);
            res.send(list);
            return;
        } else {
            res.send('No List');
            return;
        }
    }

    res.send('Failed');
});

export { router };
