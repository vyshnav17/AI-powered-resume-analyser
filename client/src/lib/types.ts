export interface ResumeAnalysis {
  id: number;
  fileName: string;
  fileSize: number;
  extractedText: string;
  overallScore: number;
  scores: {
    formatting: number;
    content: number;
    keywords: number;
    experience: number;
  };
  strengths: Array<{
    title: string;
    description: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    example: string;
  }>;
  sectionAnalysis: {
    contactInfo: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
  };
  atsCompatibility: Array<{
    status: 'success' | 'warning' | 'error';
    title: string;
    description: string;
  }>;
  createdAt: string;
}

export interface SampleResume {
  id: number;
  title: string;
  description: string;
  icon: string;
}
