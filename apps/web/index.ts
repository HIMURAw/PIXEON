import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('PXWebsite API started');
});

app.listen(PORT, () => {
    console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});
