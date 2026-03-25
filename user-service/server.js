import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';

dotenv.config({ path: '../.env' });
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', userRoutes);

app.get('/health', (req, res) => {
    res.json({ service: 'user-service', status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});
