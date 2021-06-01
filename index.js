const express = require('express');
const db = require('./lib/database/db');
const test = require('./lib/database/test');
const lists = require('./lib/routes/lists');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/static', express.static('app/pages/index.html'))
app.use('/app/scripts/index.js', express.static('app/scripts/index.js'))
app.use('/lists', lists);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/list', (req, res) => {
    res.send('{"list": ["Ich bin das Erste Element", "Ich bin das zweite Element"]}')
})

app.get('/init', async function (req, res) {
    test.initDatabase();
});
