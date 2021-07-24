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
    res.redirect('/dashboard');
});

app.use(express.json());
app.use(session({ secret: 'Your secret Key', resave: true, saveUninitialized: false }));
// Ressources
app.use('/app/scripts/', express.static('app/scripts/'));
app.use('/app/images/', express.static('app/images/'));
app.use('/app/styles/', express.static('app/styles/'));
app.use('/favicon/', express.static('favicon/'));

// API
app.use('/lists', listRouter);
app.use('/auth', authRouter);

// Webpages
app.use('/login', express.static('app/pages/login.html'));
app.use('/register', express.static('app/pages/register.html'));
app.use('/addArticle', express.static('app/pages/addArticle.html'));
app.use('/addElement', express.static('app/pages/addElement.html'));
app.use('/addType', express.static('app/pages/addType.html'));
app.use('/liste', express.static('app/pages/liste.html'));
app.use('/dashboard', express.static('app/pages/dashboard.html'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

test.initDatabase();
