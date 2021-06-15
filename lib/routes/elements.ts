import express from 'express';
import * as elementProvider from '../database/provider/element';
import {} from '../database/list';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List element specific stuff');
});

router.post('/add', async function (req, res) {
    if (req.body && req.body.element) {
        const element = req.body.element;

        await elementProvider.addElement(element.listID, element.articleID, element.count, element.unitType);
        res.send('Added Element to list');
        return;
    }

    res.send('Body with elementID doesnt exist');
});

router.post('/remove', async function (req, res) {
    if (req.body && req.body.elementID) {
        await elementProvider.removeElement(req.body.elementID);
        res.send('Element removed');
        return;
    }

    res.send('Body with elementID dont exist');
});

export { router };
