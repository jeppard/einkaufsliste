const express = require('express');
const db = require('./lib/database/db');
const test = require('./lib/database/test');
const lists = require('./lib/routes/lists');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/static/', express.static('app/pages/'))
app.use('/app/scripts/', express.static('app/scripts/'))
app.use('/app/styles/', express.static('app/styles/'))
app.use('/favicon/', express.static('favicon/'))
app.use('/app/images/', express.static('app/images/'))
app.use('/lists', lists);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/list', (req, res) => {
    res.send('{"list": ["Ich bin das Erste Element", "Ich bin das zweite Element"]}')
})

app.get('/init', async function(req, res) {
    test.initData();
    res.send('Database filled with example data')
});

test.initDatabase();