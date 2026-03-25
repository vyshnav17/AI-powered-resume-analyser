import express from 'express';
import proxy from 'express-http-proxy';
import gatewayConfig from '../config/gatewayConfig.js';

const router = express.Router();

// Route proxies
router.use('/users', proxy(gatewayConfig.USER_SERVICE_URL));
router.use('/analyzer', proxy(gatewayConfig.ANALYZER_SERVICE_URL, {
    parseReqBody: false
}));
router.use('/reports', proxy(gatewayConfig.REPORT_SERVICE_URL));
router.use('/notifications', proxy(gatewayConfig.NOTIFICATION_SERVICE_URL));

export default router;
