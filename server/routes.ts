import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import pdf from "pdf-parse";
import natural from "natural";
import { insertResumeAnalysisSchema } from "@shared/schema";

// Configure multer for file uploads
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

import { analyzeResumeWithAI, generateOptimizedResumeWithAI, generateResumePDF, generateReportPDF } from "./lib/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Download analysis report as PDF
  app.get("/api/download-analysis-report/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getResumeAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

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
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to download analysis report"
      });
    }
  });
  // ... (previous routes)

  // Download optimized resume as PDF
  app.get("/api/download-optimized-resume/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getResumeAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      // Generate optimized content
      const optimizedResume = await generateOptimizedResumeWithAI(analysis);

      // Generate PDF
      const pdfBuffer = await generateResumePDF(optimizedResume);

      // Set headers for download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=optimized-resume-${analysis.fileName.replace(".pdf", "")}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Download optimized resume error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to download optimized resume"
      });
    }
  });
  // Upload and analyze resume endpoint
  app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let extractedText = "";

      try {
        // Extract text from PDF
        const pdfData = await pdf(req.file.buffer);
        extractedText = pdfData.text;
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return res.status(400).json({
          error: "Unable to parse PDF file. Please ensure it's a valid PDF with readable text content."
        });
      }

      if (!extractedText.trim()) {
        return res.status(400).json({
          error: "No readable text found in PDF. Please ensure the PDF contains text content and is not image-based."
        });
      }

      // Analyze the resume using AI
      const analysisData = await analyzeResumeWithAI(
        extractedText,
        req.file.originalname,
        req.file.size
      );

      // Validate and store the analysis
      const validatedData = insertResumeAnalysisSchema.parse(analysisData);
      const analysis = await storage.createResumeAnalysis(validatedData);

      res.json(analysis);
    } catch (error) {
      console.error("Resume analysis error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to analyze resume"
      });
    }
  });

  // Get sample resume analysis
  app.get("/api/sample-analysis/:sampleId", async (req, res) => {
    try {
      const sampleId = parseInt(req.params.sampleId);

      // Generate sample analysis based on resume type
      let sampleText = "";
      let fileName = "";

      switch (sampleId) {
        case 1:
          fileName = "software_engineer_resume.pdf";
          sampleText = `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-2024
- Developed scalable web applications using React and Node.js
- Led a team of 5 developers on multiple projects
- Implemented CI/CD pipelines reducing deployment time by 40%

Software Developer | StartupXYZ | 2018-2020
- Built RESTful APIs using Python and Django
- Collaborated with cross-functional teams on product development

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014-2018

SKILLS
JavaScript, Python, React, Node.js, SQL, MongoDB, AWS, Docker`;
          break;
        case 2:
          fileName = "data_scientist_resume.pdf";
          sampleText = `Jane Smith
Data Scientist
jane.smith@email.com | (555) 987-6543

EXPERIENCE
Senior Data Scientist | Analytics Inc | 2021-2024
- Developed machine learning models improving prediction accuracy by 25%
- Analyzed large datasets using Python and SQL
- Created data visualizations and dashboards using Tableau

Data Analyst | Research Corp | 2019-2021
- Performed statistical analysis on customer behavior data
- Built automated reporting systems

EDUCATION
Master of Science in Data Science
Data University | 2017-2019

SKILLS
Python, R, SQL, Machine Learning, Tableau, Pandas, Scikit-learn, Statistics`;
          break;
        case 3:
          fileName = "ux_designer_resume.pdf";
          sampleText = `Alex Johnson
UX Designer
alex.johnson@email.com | (555) 456-7890

EXPERIENCE
Senior UX Designer | Design Studio | 2020-2024
- Led user research and design for mobile applications
- Created wireframes, prototypes, and user journey maps
- Collaborated with product managers and developers

UX Designer | Creative Agency | 2018-2020
- Designed user interfaces for web and mobile platforms
- Conducted user testing and usability studies

EDUCATION
Bachelor of Fine Arts in Graphic Design
Art Institute | 2014-2018

SKILLS
Figma, Sketch, Adobe Creative Suite, Prototyping, User Research, Wireframing`;
          break;
        default:
          return res.status(404).json({ error: "Sample not found" });
      }

      const analysisData = await analyzeResumeWithAI(sampleText, fileName, 250000);
      const validatedData = insertResumeAnalysisSchema.parse(analysisData);
      const analysis = await storage.createResumeAnalysis(validatedData);

      res.json(analysis);
    } catch (error) {
      console.error("Sample analysis error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to generate sample analysis"
      });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getResumeAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to get analysis"
      });
    }
  });

  // Generate optimized resume
  app.post("/api/generate-optimized-resume/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getResumeAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      const optimizedResume = await generateOptimizedResumeWithAI(analysis);
      res.json({ optimizedResume });
    } catch (error) {
      console.error("Generate optimized resume error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to generate optimized resume"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
