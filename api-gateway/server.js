import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gatewayRoutes from './routes/gatewayRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', gatewayRoutes);

app.get('/health', (req, res) => {
    res.json({ service: 'api-gateway', status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
