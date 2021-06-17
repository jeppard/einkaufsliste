import express from 'express';
import * as elementProvider from '../database/provider/element';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('List element specific stuff');
});

router.post('/add', async function (req, res) {
    const element: { listID: number, articleID: number, count: number, unitType: string} = req.body;

    if (element && areNumbers([element.listID, element.articleID, element.count]) && areNotNullOrEmpty([element.unitType])) {
        await elementProvider.addElement(element.listID, element.articleID, element.count, element.unitType);

        res.status(201).send('Added Element to list');
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

router.post('/remove', async function (req, res) {
    const element: {elementID: number, listID: number} = req.body;

    if (element && areNumbers([element.listID, element.elementID])) {
        await elementProvider.removeElement(element.elementID, element.listID);

        res.status(200).send('Element removed');
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

export { router };
