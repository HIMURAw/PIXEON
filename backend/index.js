const express = require('express');
const cors = require('cors');

const DB = require('./src/DB/connect.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from PXDevelopment Backend!');
});

app.listen(port, () => {
    console.log(`[BACKEND] Backend server running at http://localhost:${port}`);
});