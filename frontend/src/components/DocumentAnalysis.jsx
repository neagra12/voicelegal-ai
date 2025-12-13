import React, { useState } from 'react';

const DocumentAnalysis = ({ analysis, filename }) => {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAnalysis = () => {
    const element = document.createElement('a');
    const file = new Blob([analysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}-analysis.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getRiskBadge = (text) => {
    const upperText = text.toUpperCase();
    if (upperText.includes('HIGH RISK')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          HIGH RISK
        </span>
      );
    } else if (upperText.includes('MEDIUM RISK')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          MEDIUM RISK
        </span>
      );
    } else if (upperText.includes('LOW RISK')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          LOW RISK
        </span>
      );
    }
    return null;
  };

  const parseAnalysis = () => {
    const sections = [];
    const lines = analysis.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach((line, index) => {
      // Check for main headers (## or #)
      if (line.match(/^#{1,2}\s/)) {
        // Save previous section
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n')
          });
        }
        
        // Start new section
        const level = (line.match(/^#+/) || [''])[0].length;
        const title = line.replace(/^#{1,2}\s/, '');
        const icon = getIconForSection(title);
        
        currentSection = {
          title,
          level,
          icon,
          hasRisk: title.toUpperCase().includes('RISK')
        };
        currentContent = [];
      } else if (line.trim()) {
        currentContent.push(line);
      }
    });

    // Add last section
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n')
      });
    }

    return sections;
  };

  const getIconForSection = (title) => {
    const upperTitle = title.toUpperCase();
    
    if (upperTitle.includes('SUMMARY')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (upperTitle.includes('KEY TERMS')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
    } else if (upperTitle.includes('RISK')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else if (upperTitle.includes('WARNING')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (upperTitle.includes('HIDDEN') || upperTitle.includes('CLAUSE')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (!line.trim()) return null;

      // Bullet points
      if (line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
        const text = line.replace(/^[\s*\-•]+/, '');
        const hasBold = text.includes('**');
        
        return (
          <li key={i} className="flex items-start gap-3 mb-3">
            <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
            <span className="text-gray-700 leading-relaxed">
              {hasBold ? (
                <>
                  <strong className="font-bold text-gray-900">{text.split('**')[1]}</strong>
                  {text.split('**')[2]}
                </>
              ) : (
                text
              )}
              {getRiskBadge(text) && <span className="ml-2">{getRiskBadge(text)}</span>}
            </span>
          </li>
        );
      }

      // Regular paragraphs
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-3">
          {line}
          {getRiskBadge(line) && <span className="ml-2">{getRiskBadge(line)}</span>}
        </p>
      );
    }).filter(Boolean);
  };

  const sections = parseAnalysis();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Document Analysis Complete</h2>
              </div>
              <p className="text-blue-100 text-lg font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {filename}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors group"
                title="Copy analysis"
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={downloadAnalysis}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                title="Download analysis"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[700px] overflow-y-auto">
          {sections.map((section, index) => {
            const isExpanded = expandedSections[index] !== false;
            const isLongSection = section.content.length > 500;

            return (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      section.hasRisk ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  {isLongSection && (
                    <button
                      onClick={() => toggleSection(index)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className={`${!isExpanded && isLongSection ? 'max-h-40 overflow-hidden relative' : ''}`}>
                  <ul className="space-y-2">
                    {formatContent(section.content)}
                  </ul>
                  {!isExpanded && isLongSection && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-blue-50 border-t border-blue-100 px-8 py-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-blue-900 font-semibold mb-1">Use the Voice Assistant</p>
              <p className="text-blue-700 text-sm">Ask specific questions about any section using the voice assistant below. Try "What are the high-risk clauses?" or "Explain the cancellation policy"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;