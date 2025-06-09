const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();

// EJS ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Statik dosyalar
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        currentPage: 'home',
        title: 'Ana Sayfa'
    });
});

app.get('/stats', (req, res) => {
    res.render('stats', {
        currentPage: 'stats',
        title: 'İstatistikler'
    });
});

app.get('/shop', (req, res) => {
    res.render('shop', {
        currentPage: 'shop',
        title: 'Mağaza'
    });
});

app.get('/donate', (req, res) => {
    res.render('donate', {
        currentPage: 'donate',
        title: 'Bağış'
    });
});

app.get('/promo', (req, res) => {
    res.render('promo', {
        currentPage: 'promo',
        title: 'Tanıtım'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});