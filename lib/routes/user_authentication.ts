import express, { NextFunction, Request, Response } from 'express';
import * as accountProvider from '../database/provider/account';

const router = express.Router();

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
 * Create new user account and set session parameter
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
            } else {
                res.status(500).send('Something didnt work');
            }
        }
    }
});

/**
 * Set session parameter
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
