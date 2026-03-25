import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', notificationRoutes);

app.get('/health', (req, res) => {
    res.json({ service: 'notification-service', status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});
