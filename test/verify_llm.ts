import "dotenv/config";
import { analyzeResumeWithAI } from "../server/lib/ai";

async function verify() {
    const sampleText = `
    Jane Doe
    Software Engineer
    jane.doe@example.com | (555) 123-4567
    
    EXPERIENCE
    Senior Software Engineer | Tech Corp | 2020-2024
    - Developed scalable web applications using React and Node.js
    - Led a team of 5 developers on multiple projects
    - Implemented CI/CD pipelines reducing deployment time by 40%
    
    EDUCATION
    BS in Computer Science | University of Technology
    
    SKILLS
    React, Node.js, TypeScript, SQL, AWS, Docker
  `;

    console.log("Starting AI Analysis Verification...");

    try {
        const analysis = await analyzeResumeWithAI(sampleText, "test_resume.pdf", 250000);
        console.log("Analysis Result:");
        console.log(JSON.stringify(analysis, null, 2));

        if (analysis.overallScore !== undefined && analysis.strengths.length > 0) {
            console.log("Verification SUCCESS: Received valid analysis with score", analysis.overallScore);
        } else {
            console.log("Verification FAILED: Missing essential fields in analysis");
        }
    } catch (error) {
        console.error("Verification ERROR:", error);
        console.log("\nNote: This will fail if OPENAI_API_KEY is not set.");
    }
}

verify();
