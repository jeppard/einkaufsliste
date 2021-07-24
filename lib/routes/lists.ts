import express from 'express';
import { elementRouter } from './elements';
import { articleRouter } from './articles';
import * as elementProvider from '../database/provider/element';
import * as listProvider from '../database/provider/list';
import * as linkUserListProvider from '../database/provider/link_user_list';
import * as accountProvider from '../database/provider/account';
import { areNumbers, areNotNullButEmpty, areNotNullOrEmpty } from '../parameter_util';
import { checkListMemberMidle, checkListOwnerMidle } from './user_authentication';

const router = express.Router();

// route: "/lists/"

router.use('/elements', checkListMemberMidle, elementRouter);
router.use('/articles', articleRouter);

/**
 * Response content of a list
 *
 * route: "/lists/content"
 *
 * Body:
 * listID
 */
router.post('/content', checkListMemberMidle, async function (req, res) {
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
router.post('/remove', checkListOwnerMidle, async function (req, res) {
    const body: { listID: number } = req.body;

    if (body && areNumbers([body.listID])) {
        const list = await listProvider.getListById(body.listID);

        const users = await linkUserListProvider.getUsersByList(body.listID);
        for (const user of users) await linkUserListProvider.removeLink(user.id, body.listID);

        if (list) {
            await listProvider.removeList(body.listID);
            res.status(200).send('List removed');
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
 * description
 *
 * return:
 * list object without content
 */
router.post('/add', async function (req, res) {
    const body: { name: string, ownerID: number, description: string } = req.body;

    if (body && areNumbers([body.ownerID]) && areNotNullOrEmpty([body.name]) && areNotNullButEmpty([body.description])) {
        // check for existing user
        const user = await accountProvider.getAccountByID(body.ownerID);
        if (!user) {
            res.send(404).send('This user doesn\'t exist');
            return;
        }

        const listID = await listProvider.addList(body.name, user.id, body.description);

        // check if addition worked and add user list connection
        if (listID) {
            linkUserListProvider.addLink(user.id, listID);

            // return confirmation message and list object without content
            const list = await listProvider.getListById(listID);
            res.status(200).send(list);
        } else res.status(500).send('Failed to add list');
    } else {
        res.status(400).send('Incorrect body');
    }
});

/**
 * Update list in database
 *
 * route: "/lists/update"
 *
 * Body:
 * listID
 * name
 * ownerID
 * description
 *
 */
router.post('/update', checkListOwnerMidle, async function (req, res) {
    const body: { listID: number, name: string, ownerID: number, description: string } = req.body;

    if (body && areNumbers([body.listID, body.ownerID]) && areNotNullOrEmpty([body.name]) && areNotNullButEmpty([body.description])) {
        // check for existing user
        const user = await accountProvider.getAccountByID(body.ownerID);
        if (!user) {
            res.send(404).send('This user doesn\'t exist');
            return;
        }

        await listProvider.updateList(body.listID, body.name, user.id, body.description);

        // return confirmation message and list object without content
        const list = await listProvider.getListById(body.listID);

        if (list) res.status(200).send(list);
        else res.status(404).send('List not found');
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
router.post('/get', checkListMemberMidle, async function (req, res) {
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
router.post('/getListsOfUser', async function (req, res) {
    const userID = req.session.userID;

    if (userID) {
        const lists = await linkUserListProvider.getListsByUser(userID);

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
router.post('/getUsersOfList', checkListMemberMidle, async function (req, res) {
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

/**
 * add user list connection to database
 *
 * route: "/lists/addUserListLink"
 *
 * Body:
 * listID
 * userID
 */
router.post('/addUserListLink', checkListOwnerMidle, async function (req, res) {
    const body: { listID: number, userID: number } = req.body;

    if (body && areNumbers([body.listID, body.userID])) {
        const user = await accountProvider.getAccountByID(body.userID);
        const list = await listProvider.getListById(body.listID);

        if (user && list) {
            await linkUserListProvider.addLink(user.id, list.id);

            res.status(200).send('Added user list link');
        } else {
            res.status(404).send('user or list not found');
        }
    } else {
        res.status(400).send('Incorrect body');
    }
});

/**
 * remove user list connection from database
 *
 * route: "/lists/removeUserListLink"
 *
 * Body:
 * listID
 * userID
 */
router.post('/removeUserListLink', checkListOwnerMidle, async function (req, res) {
    const body: { listID: number, userID: number } = req.body;

    if (body && areNumbers([body.listID, body.userID])) {
        await linkUserListProvider.removeLink(body.userID, body.listID);

        res.status(200).send('Removed user list link');
    } else {
        res.status(400).send('Incorrect body');
    }
});

export { router as listRouter };
