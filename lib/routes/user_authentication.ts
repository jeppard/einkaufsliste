import express from 'express';
import * as accountProvider from '../database/provider/account';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('Account specific stuff');
});

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

router.post('/signin', async function (req, res) {
    const body: {username: string, password: string} = req.body;

    if (!body || !body.username || !body.password) {
        res.status(400).send('Wrong details');
    } else {
        if (await accountProvider.verifyUser(body.username, body.password)) {
            const user = await accountProvider.getAccountByUsername(body.username);

            if (user) {
                req.session.userID = user.id;
            } else {
                res.status(500).send('Something didnt work');
            }
        } else {
            res.status(406).send('Wrong credentials');
        }
    }
});

export { router };
