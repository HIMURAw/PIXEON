import express from 'express';
import cookieParser from "cookie-parser";
import Config from './config';
import authRoute from './routes/auth';

const app = express();
const PORT = Config.port || 3001;

app.use(cookieParser());
app.use(express.json());

// ROUTERS 
app.use('/auth', authRoute);



app.listen(PORT, () => {
    console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});
