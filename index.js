const express = require('express')
const db = require("./lib/database/db")

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/static', express.static('sites/index.html'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
