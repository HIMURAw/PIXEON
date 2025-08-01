import express from 'express';
const Config = require('./config.ts')

const app = express();
const PORT = Config.port || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('PXWebsite API started');
});

app.listen(PORT, () => {
    console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});
