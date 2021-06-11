import express from 'express';
import * as articleProvider from '../database/provider/articel';
import * as listProvider from '../database/provider/list';
import {} from '../database/list';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List specific stuff');
});

router.get('/content', async function (req, res) {
    const list = await listProvider.getListById(1);

    if (list != null) {
        list.content = await articleProvider.getAllListArticles(1);
        res.send(list);
    } else {
        res.send('Failed');
    }
});

export { router };
