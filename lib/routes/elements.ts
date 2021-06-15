import express from 'express';
import * as elementProvider from '../database/provider/element';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List element specific stuff');
});

router.post('/add', async function (req, res) {
    if (req.body && req.body.element) {
        try {
            const element = req.body.element;

            await elementProvider.addElement(element.listID, element.articleID, element.count, element.unitType);
            res.status(201).send('Added Element to list');
            return;
        } catch (err) {
            res.status(406).send('Failed to add element with givent object');
            return;
        }
    }
    res.status(400).send('Body with elementID doesnt exist');
});

router.post('/remove', async function (req, res) {
    if (req.body && req.body.elementID) {
        await elementProvider.removeElement(req.body.elementID);
        res.send('Element removed');
        return;
    }

    res.status(400).send('Body with elementID dont exist');
});

export { router };
