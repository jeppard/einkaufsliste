const express = require('express');
const db = require("./lib/database/db");
const accountProvider = require("./lib/database/account_provider");
accountProvider.initDatabase();
accountProvider.addAccount("Test Person", "1235");

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/static/', express.static('app/pages/'))
app.use('/app/scripts/', express.static('app/scripts/'))
app.use('/app/styles/', express.static('app/styles/'))
app.use('/favicon.ico', express.static('favicon.ico'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/list', (req, res) => {
    res.send('{"list": ["Ich bin das Erste Element", "Ich bin das zweite Element"]}')
})