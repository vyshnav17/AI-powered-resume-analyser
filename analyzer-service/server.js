import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzerRoutes from './routes/analyzerRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', analyzerRoutes);

app.get('/health', (req, res) => {
    res.json({ service: 'analyzer-service', status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`Analyzer Service is running on port ${PORT}`);
});
