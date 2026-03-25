import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', reportRoutes);

app.get('/health', (req, res) => {
    res.json({ service: 'report-service', status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`Report Service is running on port ${PORT}`);
});
