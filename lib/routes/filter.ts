import express from 'express';
import * as filterProvider from '../database/provider/filter';
import { areNotNullOrEmpty, areNumbers } from '../parameter_util';
import { checkListMemberMidle } from './user_authentication';

const router = express.Router();

// route: "/lists/elements/"
router.get('/', function (req, res) {
    res.send('List Filter specific stuff');
});

/**
 * Endpoint to Create a Filter
 * route: /lists/filter/add
 *
 * body:
 * listID: number
 * name: string
 * color: string
 * tags: string[]
 */
router.post('/add', checkListMemberMidle, async function (req, res) {
    const body: {listID: number, name: string, color: string, tags: string[]} = req.body;
    if (body && areNumbers([body.listID]) && areNotNullOrEmpty([body.name, body.color, body.tags])) {
        const filter = await filterProvider.addFilter(body.listID, body.name, body.color, body.tags);
        if (filter) res.status(201).send(filter);
        else res.status(500).send('Failed to add Filter');
    } else res.status(400).send('Bad Request Filter not in correct form');
});

/**
 * Endpoint to update a Filter
 * route: /lists/filter/update
 *
 * body:
 * filterID: number
 * listID: number
 * name: string
 * color: string
 * tags: string[]
 */
router.post('/update', checkListMemberMidle, async function (req, res) {
    const body: {filterID: number, listID: number, name: string, color: string, tags: string[]} = req.body;
    if (body && areNumbers([body.filterID, body.listID]) && areNotNullOrEmpty([body.name, body.color, body.tags])) {
        await filterProvider.updateFilter(body.filterID, body.listID, body.name, body.color, body.tags);
        const filter = await filterProvider.getFilter(body.filterID);
        if (filter) res.status(201).send(filter);
        else res.status(500).send('Failed to update Filter');
    } else res.status(400).send('Bad Request Filter not in correct form');
});

/**
 * Endpoint to get a Filter
 * route: /lists/filter/get
 *
 * body:
 * filterID: number
 */
router.post('/get', async function (req, res) {
    const body: {filterID: number} = req.body;
    if (body && areNumbers([body.filterID])) {
        const filter = await filterProvider.getFilter(body.filterID);
        if (filter) res.status(200).send(filter);
        else res.status(500).send('Internal Server Error');
    } else res.status(400).send('Bad Request filterID missing');
});

/**
 * Endpoint to get all Filters
 * route: /lists/filter/getAll
 *
 * body:
 * listID: number
 */
router.post('/getAll', checkListMemberMidle, async function (req, res) {
    const body: {listID:number} = req.body;
    if (body && areNumbers([body.listID])) {
        const filters = await filterProvider.getAllFilters(body.listID);
        if (filters) res.status(200).send(filters);
        else res.status(500).send('Internal Server Error while requesting all Filters');
    } else res.status(400).send('Bad Request listID missing');
});

/**
 * Endpoint to remove Filter
 * route: /lists/filter/remove
 */
router.post('/remove', checkListMemberMidle, async function (req, res) {
    const body: {listID: number, filterID:number} = req.body;
    if (body && areNumbers([body.listID, body.filterID])) {
        await filterProvider.removeFilter(body.filterID);
        res.status(200).send('Deleted Filter');
    } else res.send(400).send('Bad Request');
});

export { router as filterRouter };
