import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.listen(PORT, () => {
    console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});
