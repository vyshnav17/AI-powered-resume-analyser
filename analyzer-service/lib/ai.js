import Groq from "groq-sdk";

// Initialize Groq client lazily
let groq = null;

function getGroqClient() {
    if (groq) return groq;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is missing. Please set it in your environment variables or .env file.");
    }

    groq = new Groq({ apiKey });
    return groq;
}

const MODEL = "llama-3.3-70b-versatile";

export async function analyzeResumeWithAI(text, fileName, fileSize) {
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
    } catch (error) {
        console.error("AI Analysis Error Details:", error);
        throw new Error("Failed to analyze resume with AI. Please check your API key and connection.");
    }
}

export async function generateOptimizedResumeWithAI(analysis) {
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
