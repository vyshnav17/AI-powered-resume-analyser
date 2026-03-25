// Simulated Database Table
const analyses = new Map();
let currentAnalysisId = 1;

export const ResumeAnalysis = {
    create: async (analysisData) => {
        const id = currentAnalysisId++;
        const analysis = { id, createdAt: new Date(), ...analysisData };
        analyses.set(id, analysis);
        return analysis;
    },
    findById: async (id) => {
        return analyses.get(parseInt(id));
    }
};
