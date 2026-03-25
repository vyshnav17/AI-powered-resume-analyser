import express from 'express';
import { downloadAnalysisReport, downloadOptimizedResume } from '../controllers/reportController.js';

const router = express.Router();

router.get('/download-analysis-report/:id', downloadAnalysisReport);
router.get('/download-optimized-resume/:id', downloadOptimizedResume);

export default router;
