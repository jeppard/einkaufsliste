import express from 'express';
import * as elementProvider from '../database/provider/element';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';

const router = express.Router();

// route: "/lists/elements/"
router.get('/', function (req, res) {
    res.send('List element specific stuff');
});

/**
 * Adds new element to database
 *
 * route: "/lists/elements/add"
 *
 * Body:
 * listID       - ID of the list where the element is located
 * articleID    - ID of the article for the given elment
 * count        - Count of the article for the unit type
 * unitType     - Specific type for the count of the article
 */

router.post('/add', async function (req, res) {
    const element: { listID: number, articleID: number, count: number, unitType: string} = req.body;

    if (element && areNumbers([element.listID, element.articleID, element.count]) && areNotNullOrEmpty([element.unitType])) {
        await elementProvider.addElement(element.listID, element.articleID, element.count, element.unitType);

        res.status(201).send('Added Element to list');
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

/**
 * Remove element from database
 *
 * route: "/lists/elements/remove"
 *
 * Body:
 * elementID
 * listID
 */

router.post('/remove', async function (req, res) {
    const element: {elementID: number, listID: number} = req.body;

    if (element && areNumbers([element.listID, element.elementID])) {
        await elementProvider.removeElement(element.elementID, element.listID);

        res.status(200).send('Element removed');
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

/**
 * Update element in database
 *
 * route: "/lists/elements/update"
 *
 * Body:
 * elementID
 * listID
 * articleID
 * count
 * unitType
 */

router.post('/update', async function (req, res) {
    const element: { elementID: number, listID: number, articleID: number, count: number, unitType: string} = req.body;

    if (element && areNumbers([element.elementID, element.listID, element.articleID, element.count]) && areNotNullOrEmpty([element.unitType])) {
        await elementProvider.updateElement(element.elementID, element.listID, element.articleID, element.count, element.unitType);
        const e = await elementProvider.getElement(element.listID, element.elementID);

        if (e) res.status(201).send(e);
        else res.status(500).send('Something wen\'t wrong');
    } else {
        res.status(400).send('Element iformations are not given');
    }
});

/**
 * Get one element from database
 *
 * route: "/lists/elements/get"
 *
 * Body:
 * elementID
 * listID
 */
router.post('/get', async function (req, res) {
    const body: {elementID: number, listID: number} = req.body;

    if (body && areNumbers([body.listID, body.elementID])) {
        const element = await elementProvider.getElement(body.listID, body.elementID);

        if (element) {
            res.status(200).send(element);
        } else {
            res.status(400).send('Element not found');
        }
    } else {
        res.status(400).send('Element informations are not given');
    }
});

/**
 * Get all elements from database of a specific list
 *
 * route: "/lists/elements/getAll"
 *
 * Body:
 * listID
 */
router.get('/getAll', async function (req, res) {
    const body: {listID: number} = req.body;

    if (body && areNumbers([body.listID])) {
        const elements = await elementProvider.getAllElementsWithArticles(body.listID);

        if (elements && elements.length > 0) {
            res.status(200).send(elements);
        } else {
            res.status(400).send('Elements not found');
        }
    } else {
        res.status(400).send('ListID is not given');
    }
});

export { router as elementRouter };
