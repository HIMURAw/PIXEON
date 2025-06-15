const express = require('express');
const path = require('path');
const Config = require('./config.json');
const { createAdminsTable } = require('./private/DB/models/userModel');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/*

ROUTERS

*/

const loginRouter = require('./private/DB/loginRouter');

// Login routes
app.use('/api/auth', loginRouter);

// Admins tablosunu oluştur
createAdminsTable().catch(console.error);

/*

ROUTERS END

*/

const port = Config.port || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});