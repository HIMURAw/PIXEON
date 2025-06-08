const express = require('express');
const app = express();
const Config = require('./config.json');
const port = Config.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});