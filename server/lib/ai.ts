import Groq from "groq-sdk";
import { insertResumeAnalysisSchema } from "@shared/schema";
import PDFDocument from "pdfkit";

/**
 * Generates a professional PDF from the optimized resume text.
 */
export async function generateResumePDF(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    // Styles
    const titleFont = "Helvetica-Bold";
    const bodyFont = "Helvetica";

    // Parse the optimized resume text
    // Assuming the text has headers and bullet points
    const lines = text.split("\n");

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        doc.moveDown();
        return;
      }

      // Check for section headers (capitalized words like PROFESSIONAL SUMMARY)
      if (/^[A-Z\s]{5,}$/.test(trimmedLine) || trimmedLine.endsWith(":")) {
        doc.font(titleFont).fontSize(14).fillColor("#1e40af").text(trimmedLine);
        doc.moveDown(0.5);
        // Add a horizontal line
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke();
        doc.moveDown(0.5);
      }
      // Check for bullet points
      else if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        doc.font(bodyFont).fontSize(11).fillColor("#374151")
          .text(trimmedLine, { indent: 15, paragraphGap: 5 });
      }
      // Normal text
      else {
        doc.font(bodyFont).fontSize(11).fillColor("#374151").text(trimmedLine);
      }
    });

    doc.end();
  });
}

/**
 * Generates a comprehensive PDF report of the resume analysis.
 */
export async function generateReportPDF(analysis: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    // Header
    doc.font("Helvetica-Bold").fontSize(20).fillColor("#1e40af").text("RESUME ANALYSIS REPORT", { align: "center" });
    doc.moveDown();

    doc.font("Helvetica").fontSize(10).fillColor("#6b7280")
      .text(`File: ${analysis.fileName}`)
      .text(`Analysis Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Overall Score
    doc.font("Helvetica-Bold").fontSize(16).fillColor("#111827").text(`Overall Score: ${analysis.overallScore}/100`);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke();
    doc.moveDown();

    // Scores Breakdown
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("DETAILED SCORES");
    doc.moveDown(0.5);
    const scoreItems = [
      { label: "Formatting", value: analysis.scores.formatting },
      { label: "Content", value: analysis.scores.content },
      { label: "Keywords", value: analysis.scores.keywords },
      { label: "Experience", value: analysis.scores.experience },
    ];
    scoreItems.forEach(item => {
      doc.font("Helvetica").fontSize(11).fillColor("#374151").text(`${item.label}: ${item.value}%`);
    });
    doc.moveDown();

    // Strengths
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("STRENGTHS");
    doc.moveDown(0.5);
    analysis.strengths.forEach((s: any) => {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(`• ${s.title}`);
      doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(s.description, { indent: 15 });
      doc.moveDown(0.5);
    });
    doc.moveDown();

    // Recommendations
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("RECOMMENDATIONS");
    doc.moveDown(0.5);
    analysis.recommendations.forEach((r: any) => {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(`• ${r.title}`);
      doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(r.description, { indent: 15 });
      if (r.example) {
        doc.font("Helvetica-Oblique").fontSize(9).fillColor("#6b7280").text(`Example: ${r.example}`, { indent: 15 });
      }
      doc.moveDown(0.5);
    });

    doc.end();
  });
}

// Initialize Groq client lazily
let groq: Groq | null = null;

function getGroqClient() {
  if (groq) return groq;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Please set it in your environment variables or .env file.");
  }

  groq = new Groq({ apiKey });
  return groq;
}

// Use a powerful Llama-3 model
const MODEL = "llama-3.3-70b-versatile";

export async function analyzeResumeWithAI(text: string, fileName: string, fileSize: number) {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and professional resume reviewer.
    Analyze the following resume text and provide a comprehensive evaluation in JSON format.
    
    The output must strictly follow this JSON structure:
    {
      "overallScore": number (0-100),
      "scores": {
        "formatting": number (0-100),
        "content": number (0-100),
        "keywords": number (0-100),
        "experience": number (0-100)
      },
      "strengths": [
        { "title": "string", "description": "string" }
      ],
      "recommendations": [
        { "title": "string", "description": "string", "example": "string" }
      ],
      "sectionAnalysis": {
        "contactInfo": number (0-100),
        "summary": number (0-100),
        "experience": number (0-100),
        "education": number (0-100),
        "skills": number (0-100)
      },
      "atsCompatibility": [
        { "status": "success" | "warning" | "error", "title": "string", "description": "string" }
      ]
    }

    Criteria for scoring:
    - Formatting: Consistency, readability, proper use of sections.
    - Content: Quality of descriptions, use of action verbs, quantified achievements.
    - Keywords: Presence of industry-relevant skills and terminology.
    - Experience: Career progression, relevance, and impact.

    Resume Text:
    ---
    ${text}
    ---
  `;

  try {
    const client = getGroqClient();
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a professional resume analyzer that outputs only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const analysis = JSON.parse(content);

    return {
      fileName,
      fileSize,
      extractedText: text,
      ...analysis
    };
  } catch (error: any) {
    console.error("AI Analysis Error Details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      param: error.param
    });
    throw new Error("Failed to analyze resume with AI. Please check your API key and connection.");
  }
}

export async function generateOptimizedResumeWithAI(analysis: any) {
  const prompt = `
    Based on the following resume analysis, generate an optimized version of the resume.
    Focus on improving the professional summary, enhancing the experience descriptions with better action verbs and metrics, and organizing skills for maximum ATS impact.

    Analysis: ${JSON.stringify(analysis)}

    Resume Text: ${analysis.extractedText}

    Format the output as a professional resume in plain text, with clear section headers and bullet points.
  `;

  try {
    const client = getGroqClient();
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a professional resume optimizer." },
        { role: "user", content: prompt }
      ],
    });

    return response.choices[0].message.content || "Failed to generate optimized resume.";
  } catch (error) {
    console.error("AI Optimization Error:", error);
    throw new Error("Failed to generate optimized resume with AI.");
  }
}
