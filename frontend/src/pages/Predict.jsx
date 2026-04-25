import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Predict() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const analyzeFile = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        status: Math.random() > 0.5 ? 'safe' : 'malicious',
        confidence: (Math.random() * 20 + 80).toFixed(1)
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Manual Packet Analysis</h1>
        <p className="text-gray-400">Upload a PCAP file to run static threat detection against our ML models.</p>
      </div>

      <div 
        className={`bg-dark-800/40 backdrop-blur-md rounded-3xl border-2 border-dashed ${file ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-white/20'} p-12 text-center transition-all duration-300`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="w-20 h-20 mx-auto bg-dark-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-xl">
          <UploadCloud className={`w-10 h-10 ${file ? 'text-primary-400' : 'text-gray-500'}`} />
        </div>
        
        {file ? (
          <div>
            <h3 className="text-xl text-white font-medium mb-2">{file.name}</h3>
            <p className="text-gray-400 text-sm mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              onClick={analyzeFile}
              disabled={isAnalyzing}
              className="px-8 py-3 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing Extracting Features...' : 'Analyze Network Traffic'}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl text-white font-medium mb-2">Drag and drop your PCAP file here</h3>
            <p className="text-gray-400 text-sm mb-6">or</p>
            <label className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium cursor-pointer transition-colors duration-300">
              Browse Files
              <input 
                type="file" 
                className="hidden" 
                accept=".pcap,.pcapng" 
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </label>
          </div>
        )}
      </div>

      {result && (
        <div className={`mt-8 p-6 rounded-2xl border flex items-center justify-between backdrop-blur-md animate-fade-in ${result.status === 'safe' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-center gap-4">
            {result.status === 'safe' ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-400" />
            )}
            <div>
              <h4 className={`text-lg font-bold ${result.status === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                {result.status.toUpperCase()} TRAFFIC DETECTED
              </h4>
              <p className="text-gray-400 text-sm">Our models analyzed 1,244 packets from the upload.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Confidence Score</div>
            <div className="text-3xl font-mono font-bold text-white">{result.confidence}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
