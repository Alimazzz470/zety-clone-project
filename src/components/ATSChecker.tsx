"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import ScoreChart from './ScoreChart';

interface AnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
}

const ATSChecker = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer instanceof ArrayBuffer) {
        if (file.type === 'application/pdf') {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: { str: string }) => item.str).join(' ');
          }
          setResumeText(text);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const result = await mammoth.extractRawText({ arrayBuffer });
          setResumeText(result.value);
        } else if (file.type === 'text/plain') {
          const text = new TextDecoder().decode(arrayBuffer);
          setResumeText(text);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeText, 
          jobDescription, 
          coverLetterText: coverLetterText || undefined 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Error analyzing resume. Please check your OpenAI API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">AI-Powered ATS Resume Checker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Optimize your resume for Applicant Tracking Systems using intelligent analysis. Get instant feedback on your match score, missing keywords, and personalized improvement suggestions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">📄 Your Resume</h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ease-in-out ${
                isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}>
              <input {...getInputProps()} />
              <div className="text-gray-600">
                <svg className="mx-auto h-16 w-16 mb-4 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isDragActive ? (
                  <p className="text-xl font-semibold text-blue-700">Drop your resume here!</p>
                ) : (
                  <div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">Upload your resume</p>
                    <p className="text-sm text-gray-500">Drag & drop or click to select (PDF, DOCX, TXT)</p>
                  </div>
                )}
              </div>
            </div>
            <textarea
              className="w-full h-72 mt-6 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 leading-relaxed"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Alternatively, paste your resume text here..."
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">💼 Job Description</h2>
            <textarea
              className="w-full h-[400px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 leading-relaxed"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
            />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">✉️ Cover Letter (Optional)</h2>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 leading-relaxed"
            value={coverLetterText}
            onChange={(e) => setCoverLetterText(e.target.value)}
            placeholder="Paste your cover letter here (optional)..."
          />
        </div>

        <div className="text-center mb-16">
          <button
            onClick={handleAnalyze}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300"
            disabled={loading || !resumeText || !jobDescription}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Your Resume...
              </span>
            ) : (
              '🚀 Analyze My Resume'
            )}
          </button>
          {(!resumeText || !jobDescription) && (
            <p className="text-sm text-gray-500 mt-4">Please provide both resume and job description to analyze</p>
          )}
        </div>

        {analysis && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">📊 Analysis Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 ATS Score</h3>
                <div className="relative h-56 w-56 mx-auto mb-6">
                  <ScoreChart score={analysis.atsScore} />
                </div>
                <p className="text-5xl font-extrabold text-blue-600">{analysis.atsScore}%</p>
                <p className="text-md text-gray-600 mt-4">
                  {analysis.atsScore >= 80 ? 'Excellent match! Your resume is highly optimized.' :
                   analysis.atsScore >= 60 ? 'Good match. Minor adjustments can improve your score.' :
                   analysis.atsScore >= 40 ? 'Needs improvement. Focus on keywords and relevance.' : 'Poor match. Significant changes recommended.'}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">🔍 Missing Keywords</h3>
                <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {analysis.missingKeywords.map((keyword: string, index: number) => (
                        <span key={index} className="bg-red-100 text-red-800 text-base font-medium px-4 py-2 rounded-full shadow-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-lg">No significant missing keywords found! Great job.</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">💡 Suggestions</h3>
                <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {Array.isArray(analysis.suggestions) ? (
                    <ul className="space-y-4">
                      {analysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-3 flex-shrink-0 mt-1 text-xl">•</span>
                          <span className="text-gray-700 text-base leading-relaxed">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-base leading-relaxed">{analysis.suggestions}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-200">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔒 Your Privacy is Protected</h3>
            <p className="text-md text-gray-700 mb-4 leading-relaxed">
              Your data is processed only in your browser and via OpenAI&apos;s secure API. We don&apos;t store or log any files or text.
              All processing happens client-side or through encrypted API calls, ensuring your information remains confidential.
            </p>
            <div className="text-sm text-gray-600">
              <p>Need your OpenAI API key? Get it from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">OpenAI API Keys</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;
