import dotenv from 'dotenv';
dotenv.config();

export default {
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:5001',
    ANALYZER_SERVICE_URL: process.env.ANALYZER_SERVICE_URL || 'http://localhost:5002',
    REPORT_SERVICE_URL: process.env.REPORT_SERVICE_URL || 'http://localhost:5003',
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5004',
};
