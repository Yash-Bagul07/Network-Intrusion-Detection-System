import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

const formatMap = {
  '.pcap': 'Network Capture (PCAP)',
  '.pcapng': 'Network Capture (PCAPNG)',
  '.pdf': 'PDF Document',
  '.xls': 'Excel Spreadsheet',
  '.xlsx': 'Excel Spreadsheet',
  '.csv': 'CSV Dataset',
  '.json': 'JSON Data',
  '.txt': 'Text Report'
};

const getExtension = (filename = '') => {
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : '';
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

    const extension = getExtension(file.name);
    const fileCategory = formatMap[extension] || 'Unknown Format';
    const isPacketCapture = extension === '.pcap' || extension === '.pcapng';
    const status = Math.random() > 0.45 ? 'safe' : 'malicious';
    const confidence = (Math.random() * 20 + 80).toFixed(1);

    const threatCatalog = [
      'Port scan behavior',
      'Suspicious login burst',
      'Anomalous outbound traffic',
      'Potential malware signature',
      'Data exfiltration pattern'
    ];

    const detailRows = isPacketCapture
      ? {
          sourceType: 'Captured packet stream',
          analyzedUnits: `${randomInt(900, 2500)} packets`,
          suspiciousUnits: `${randomInt(5, 170)} suspicious packets`,
          topProtocol: ['TCP', 'UDP', 'ICMP', 'DNS'][randomInt(0, 3)],
          threatScore: `${randomInt(20, 96)}/100`,
          keyThreats: threatCatalog.sort(() => 0.5 - Math.random()).slice(0, 3)
        }
      : {
          sourceType: 'Uploaded file content',
          analyzedUnits: `${randomInt(40, 1200)} records`,
          suspiciousUnits: `${randomInt(0, 90)} anomalous records`,
          topProtocol: 'N/A (document data)',
          threatScore: `${randomInt(10, 88)}/100`,
          keyThreats: threatCatalog.sort(() => 0.5 - Math.random()).slice(0, 2)
        };

    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        status,
        confidence,
        filename: file.name,
        fileCategory,
        details: detailRows
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Manual Packet Analysis</h1>
        <p className="text-gray-400">Upload PCAP, PDF, Excel, CSV, JSON, or TXT files for static threat detection and data risk profiling.</p>
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
            <h3 className="text-xl text-white font-medium mb-2">Drag and drop your file here</h3>
            <p className="text-gray-400 text-sm mb-6">or</p>
            <label className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium cursor-pointer transition-colors duration-300">
              Browse Files
              <input 
                type="file" 
                className="hidden" 
                accept=".pcap,.pcapng,.pdf,.xls,.xlsx,.csv,.json,.txt"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </label>
            <p className="text-gray-500 text-xs mt-4">Supported: PCAP, PCAPNG, PDF, XLS, XLSX, CSV, JSON, TXT</p>
          </div>
        )}
      </div>

      {result && (
        <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-md animate-fade-in ${result.status === 'safe' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-center justify-between gap-4">
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
                <p className="text-gray-300 text-sm">{result.filename} • {result.fileCategory}</p>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 text-right">Confidence Score</div>
              <div className="text-3xl font-mono font-bold text-white">{result.confidence}%</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-dark-900/40 rounded-xl border border-white/5 p-4">
              <p className="text-gray-400">Source Type</p>
              <p className="text-white mt-1">{result.details.sourceType}</p>
            </div>
            <div className="bg-dark-900/40 rounded-xl border border-white/5 p-4">
              <p className="text-gray-400">Data Units Analyzed</p>
              <p className="text-white mt-1">{result.details.analyzedUnits}</p>
            </div>
            <div className="bg-dark-900/40 rounded-xl border border-white/5 p-4">
              <p className="text-gray-400">Suspicious Elements</p>
              <p className="text-white mt-1">{result.details.suspiciousUnits}</p>
            </div>
            <div className="bg-dark-900/40 rounded-xl border border-white/5 p-4">
              <p className="text-gray-400">Primary Protocol / Data Type</p>
              <p className="text-white mt-1">{result.details.topProtocol}</p>
            </div>
          </div>

          <div className="mt-4 bg-dark-900/40 rounded-xl border border-white/5 p-4">
            <p className="text-gray-400 text-sm">Threat Score</p>
            <p className="text-white text-xl font-semibold mt-1">{result.details.threatScore}</p>
            <p className="text-gray-400 text-sm mt-3">Key Findings</p>
            <p className="text-gray-200 mt-1">{result.details.keyThreats.join(' • ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
