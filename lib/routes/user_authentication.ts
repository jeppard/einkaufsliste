import express, { NextFunction, Request, Response } from 'express';
import * as accountProvider from '../database/provider/account';
import * as listProvider from '../database/provider/list';
import * as linkUserListProvider from '../database/provider/link_user_list';
import { areNumbers } from '../parameter_util';

const router = express.Router();

// route: "/auth/"
router.get('/', function (req, res) {
    res.send('Account specific stuff');
});

// Authentication middleware function to check if the user is logged in
export async function checkSignIn (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.session.userID) {
        next();
    } else if (req.method === 'GET') {
        res.redirect('/login');
    } else {
        res.status(401).send('Unauthorized');
    }
}

export async function checkListMember (userID: number, listID: number): Promise<boolean> {
    const list = await listProvider.getListById(listID);
    if (list) {
        const lists = await linkUserListProvider.getListsByUser(userID);
        // eslint-disable-next-line eqeqeq
        const list = lists.find(o => o.id == listID);
        if (list) return true;
        else return false;
    } else return false;
}

export async function checkListMemberMidle (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userID = req.session.userID;
    const body : { listID: number} = req.body;

    if (userID && areNumbers([body.listID])) {
        if (checkListMember(userID, body.listID)) next();
        else res.status(401).send('Unauthorized');
    } else {
        res.status(400).send('No listID given');
    }
}

export async function checkListOwner (userID: number, listID: number): Promise<boolean> {
    const list = await listProvider.getListById(listID);
    if (list) {
        const user = await accountProvider.getAccountByID(list.ownerid);

        // eslint-disable-next-line eqeqeq
        if (user && user.id == userID) return true;
        else return false;
    } else return false;
}

export async function checkListOwnerMidle (req: Request, res: Response, next: NextFunction): Promise<void> {
    const userID = req.session.userID;
    const body : { listID: number} = req.body;

    if (userID && areNumbers([body.listID])) {
        if (checkListOwner(userID, body.listID)) next();
        else res.status(401).send('Unauthorized');
    } else {
        res.status(400).send('No listID given');
    }
}

// Simple test page to show the user its id
router.get('/page', checkSignIn, async function (req, res) {
    res.send('ID: ' + req.session.userID);
});

/**
 * Create new user account and set session parameter
 *
 * route: "/auth/signup"
 *
 * Body:
 * username
 * password
 *
 * return status code if successful
 */
router.post('/signup', async function (req, res) {
    const body: {username: string, password: string} = req.body;

    if (!body || !body.username || !body.password) {
        res.status(400).send('Wrong details');
    } else {
        let user = await accountProvider.getAccountByUsername(body.username);
        if (user) {
            res.status(406).send('This user already exists');
        } else {
            await accountProvider.addAccount(body.username, body.password);
            user = await accountProvider.getAccountByUsername(body.username);

            if (user) {
                req.session.userID = user.id;
                res.status(200).send('Added user and logged in');
            } else {
                res.status(500).send('Something didnt work');
            }
        }
    }
});

/**
 * Set session parameter
 *
 * route: "/auth/signin"
 *
 * Body:
 * username
 * password
 *
 * return status code if successful
 */
router.post('/signin', async function (req, res) {
    const body: {username: string, password: string} = req.body;

    if (!body || !body.username || !body.password) {
        res.status(400).send('Wrong details');
    } else {
        if (await accountProvider.verifyUser(body.username, body.password)) {
            const user = await accountProvider.getAccountByUsername(body.username);

            if (user) {
                req.session.userID = user.id;
                res.status(200).send('loggedin');
            } else {
                res.status(500).send('Something didnt work');
            }
        } else {
            res.status(406).send('Wrong credentials');
        }
    }
});

export { router as authRouter };
