import express from 'express';
import { elementRouter } from './elements';
import { articleRouter } from './articles';
import * as elementProvider from '../database/provider/element';
import * as listProvider from '../database/provider/list';
import * as linkUserListProvider from '../database/provider/link_user_list';
import { areNumbers, areNotNullButEmpty, areNotNullOrEmpty } from '../parameter_util';

const router = express.Router();

// route: "/lists/"
router.use('/', express.static('app/pages/liste.html'));

router.use('/elements', elementRouter);
router.use('/articles', articleRouter);

/**
 * Response content of a list
 *
 * route: "/lists/content"
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
 * route: "/lists/removeList"
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

/**
 * Add list to database
 *
 * route: "/lists/add"
 *
 * Body:
 * name
 * ownerID
 * desription
 *
 * return:
 * listID
 */
router.post('/add', async function (req, res) {
    const body: { name: string, ownerID: number, desription: string } = req.body;

    if (body && areNumbers([body.ownerID]) && areNotNullOrEmpty([body.name]) && areNotNullButEmpty([body.desription])) {
        const listID = await listProvider.addList(body.name, body.ownerID, body.desription);

        if (listID) {
            res.status(200).send(listID);
        } else res.status(500).send('Failed to add list');
    } else {
        res.status(400).send('Incorrect body');
    }
});

/**
 * get list from database
 *
 * route: "/lists/get"
 *
 * Body:
 * listID
 *
 * return:
 * list
 */
router.get('/get', async function (req, res) {
    const body: { listID: number } = req.body;

    if (body && areNumbers([body.listID])) {
        const list = await listProvider.getListById(body.listID);

        if (list) {
            res.status(200).send(list);
        } else res.status(404).send('Failed to get list');
    } else {
        res.status(400).send('Incorrect body');
    }
});

/**
 * get lists of user from database
 *
 * route: "/lists/getListsOfUser"
 *
 * Body:
 * userID
 *
 * return:
 * Array of lists
 */
router.get('/getListsOfUser', async function (req, res) {
    const body: { userID: number } = req.body;

    if (body && areNumbers([body.userID])) {
        const lists = await linkUserListProvider.getListsByUser(body.userID);

        if (lists) {
            res.status(200).send(lists);
        } else res.status(404).send('Failed to get list of user');
    } else {
        res.status(400).send('Incorrect body');
    }
});

/**
 * get users of list from database
 *
 * route: "/lists/getUsersOfList"
 *
 * Body:
 * listID
 *
 * return:
 * Array of Users
 */
router.get('/getUsersOfList', async function (req, res) {
    const body: { listID: number } = req.body;

    if (body && areNumbers([body.listID])) {
        const users = await linkUserListProvider.getUsersByList(body.listID);

        if (users) {
            res.status(200).send(users);
        } else res.status(404).send('Failed to get users of list');
    } else {
        res.status(400).send('Incorrect body');
    }
});

export { router as listRouter };
