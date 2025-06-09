const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

const Config = require('./config.json');

const port = Config.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});