import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import router from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT;

connectDB();

app.use('/api', router);

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
