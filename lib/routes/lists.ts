import express from 'express';
import * as elementProvider from '../database/provider/element';
import * as listProvider from '../database/provider/list';
import {} from '../database/list';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List specific stuff');
});

router.post('/content', async function (req, res) {
    if (req.body && req.body.func == 'get-list-by-id') {
        const list = await listProvider.getListById(req.body.args.id);

        if (list != null) {
            list.content = await elementProvider.getAllListArticles(req.body.args.id);
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
