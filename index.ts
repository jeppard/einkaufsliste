import express from 'express';
import session from 'express-session';
import { listRouter } from './lib/routes/lists';
import { authRouter } from './lib/routes/user_authentication';
import * as test from './lib/database/test';
declare module 'express-session' {
    interface SessionData {
        views: number;
        userID: number;
    }
}

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.redirect('/lists');
});

app.use(express.json());
app.use(session({ secret: 'Your secret Key', resave: true, saveUninitialized: false }));
app.use('/static/', express.static('app/pages/'));
app.use('/app/scripts/', express.static('app/scripts/'));
app.use('/app/images/', express.static('app/images/'));
app.use('/app/styles/', express.static('app/styles/'));
app.use('/favicon/', express.static('favicon/'));
app.use('/lists', listRouter);
app.use('/auth', authRouter);

app.use('/login', express.static('app/pages/test.html'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/list', (req, res) => {
    res.send('{"list": ["Ich bin das Erste Element", "Ich bin das zweite Element"]}');
});

app.get('/init', async function (req, res) {
    test.initData();
    res.send('Database filled with example data');
});

test.initDatabase();
