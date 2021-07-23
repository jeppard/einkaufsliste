import express, { NextFunction, Request, Response } from 'express';
import * as accountProvider from '../database/provider/account';
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

// Simple test page to show the user its id
router.get('/page', checkSignIn, async function (req, res) {
    res.send('ID: ' + req.session.userID);
});

/**
 * Get own UserID
 *
 * route: "/auth/getOwnID"
 *
 * Body:
 * <empty>
 *
 * returns userID if succesfull
 */
router.post('/getOwnID', async function (req, res) {
    if (req.session.userID && areNumbers([req.session.userID])){
        res.status(200).send(req.session.userID.toString());
    }
    else {
        res.status(401).send('Session does not have a userID!');
    }
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
