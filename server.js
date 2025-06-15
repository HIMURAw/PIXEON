const express = require('express');
const path = require('path');
const Config = require('./config.json');

const app = express();

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = Config.port || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});