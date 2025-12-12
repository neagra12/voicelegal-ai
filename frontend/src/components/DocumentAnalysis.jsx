import React from 'react';

const DocumentAnalysis = ({ analysis, filename }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl">
      <div className="border-b-4 border-blue-500 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📄 Document Analysis</h2>
        <p className="text-sm text-gray-600 mt-1">{filename}</p>
      </div>
      
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-lg">{analysis}</pre>
      </div>
    </div>
  );
};

export default DocumentAnalysis;