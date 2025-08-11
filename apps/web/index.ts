import express from 'express';
import cookieParser from "cookie-parser";
import Config from './config';
import { auth } from './routes/auth';

const app = express();
const PORT = Config.port || 3001;

// CORS ayarları
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(cookieParser());
app.use(express.json());


app.all("/auth/(.*)", async (req, res) => {
    const url = `http://localhost:${PORT}${req.originalUrl}`;
    const request = new Request(url, {
        method: req.method,
        headers: req.headers as any,
        body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    const response = await auth.handler(request);

    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    res.status(response.status);
    const text = await response.text();
    res.send(text);
});


app.listen(PORT, () => {
    console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});
