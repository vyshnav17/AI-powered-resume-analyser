import { generateReportPDF, generateResumePDF } from '../lib/reportGenerator.js';

const ANALYZER_SERVICE_URL = process.env.ANALYZER_SERVICE_URL || 'http://localhost:5002';

export const downloadAnalysisReport = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch analysis from analyzer-service
        const response = await fetch(`${ANALYZER_SERVICE_URL}/analysis/${id}`);

        if (!response.ok) {
            if (response.status === 404) return res.status(404).json({ error: "Analysis not found" });
            throw new Error('Failed to fetch analysis from Analyzer Service');
        }
        const analysis = await response.json();

        // Generate PDF report
        const pdfBuffer = await generateReportPDF(analysis);

        // Set headers for download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=resume-analysis-${analysis.fileName.replace(".pdf", "")}.pdf`
        );
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Download report error:", error);
        res.status(500).json({ error: error.message || "Failed to download analysis report" });
    }
};

export const downloadOptimizedResume = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch optimized resume text from analyzer service
        const response = await fetch(`${ANALYZER_SERVICE_URL}/generate-optimized-resume/${id}`, {
            method: 'POST'
        });

        if (!response.ok) {
            if (response.status === 404) return res.status(404).json({ error: "Analysis not found" });
            throw new Error('Failed to fetch optimized resume from Analyzer Service');
        }
        const data = await response.json();
        const optimizedResumeText = data.optimizedResume;

        // Generate PDF
        const pdfBuffer = await generateResumePDF(optimizedResumeText);

        // Set headers for download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=optimized-resume.pdf`
        );
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Download optimized resume error:", error);
        res.status(500).json({ error: error.message || "Failed to download optimized resume" });
    }
};
