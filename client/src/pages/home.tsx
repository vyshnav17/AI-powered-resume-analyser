import { useState } from "react";
import { UploadSection } from "@/components/upload-section";
import { ResultsDashboard } from "@/components/results-dashboard";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import type { ResumeAnalysis } from "@/lib/types";

export default function Home() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleAnalysisComplete = (newAnalysis: ResumeAnalysis) => {
    setAnalysis(newAnalysis);
    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Resume Grader</h1>
                <p className="text-sm text-gray-600">AI-Powered Resume Analysis</p>
              </div>
            </div>
            <Button 
              onClick={handleNewAnalysis}
              className="bg-primary hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {analysis ? (
          <ResultsDashboard 
            analysis={analysis} 
            onNewAnalysis={handleNewAnalysis}
          />
        ) : (
          <UploadSection onAnalysisComplete={handleAnalysisComplete} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Resume Grader</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered resume analysis to help you land your dream job.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Resume Analysis</a></li>
                <li><a href="#" className="hover:text-primary">Resume Builder</a></li>
                <li><a href="#" className="hover:text-primary">Career Tips</a></li>
                <li><a href="#" className="hover:text-primary">Industry Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Resume Templates</a></li>
                <li><a href="#" className="hover:text-primary">Writing Guide</a></li>
                <li><a href="#" className="hover:text-primary">Interview Prep</a></li>
                <li><a href="#" className="hover:text-primary">Job Search Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2024 Resume Grader. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
