const express = require('express');
const { List } = require('../database/list');
const router = express.Router();
const articleProvider = require('../database/provider/articel');
const listProvider = require('../database/provider/list');

router.get('/', function (req, res) {
    res.send('List specific stuff');
});

router.get('/content', async function (req, res) {
    var list = await listProvider.getListById(1);
    console.log(list);
    if (list != null) {
        list.content = await articleProvider.getAllArticleElements(1);
        res.send(list);
    } else {
        res.send('Failed');
    }

});

module.exports = router;