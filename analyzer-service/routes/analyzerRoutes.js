import express from 'express';
import multer from 'multer';
import { uploadAndAnalyze, getAnalysisById, generateOptimized, getSampleAnalysis } from '../controllers/analyzerController.js';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

router.post('/analyze-resume', upload.single("resume"), uploadAndAnalyze);
router.get('/analysis/:id', getAnalysisById);
router.post('/generate-optimized-resume/:id', generateOptimized);
router.get('/sample-analysis/:sampleId', getSampleAnalysis);

export default router;
