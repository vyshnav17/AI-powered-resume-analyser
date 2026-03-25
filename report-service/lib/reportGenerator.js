import PDFDocument from "pdfkit";

/**
 * Generates a professional PDF from the optimized resume text.
 */
export async function generateResumePDF(text) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        // Styles
        const titleFont = "Helvetica-Bold";
        const bodyFont = "Helvetica";

        // Parse the optimized resume text
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
export async function generateReportPDF(analysis) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

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
        analysis.strengths.forEach((s) => {
            doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(`• ${s.title}`);
            doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(s.description, { indent: 15 });
            doc.moveDown(0.5);
        });
        doc.moveDown();

        // Recommendations
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("RECOMMENDATIONS");
        doc.moveDown(0.5);
        analysis.recommendations.forEach((r) => {
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
