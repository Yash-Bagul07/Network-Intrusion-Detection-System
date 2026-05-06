import React from 'react';
import { Target, Server, Database, Code } from 'lucide-react';

const teamMembers = [
  { name: 'Yash Meghanad Bagul', email: 'yashbagul100gmail.com' },
  { name: 'Purvesh Pravin Pawar', email: 'pawarpurvesh@gmail.com' },
  { name: 'Premraj Yuvaraj Masule', email: 'masulepremraj@gmail.com' },
  { name: 'Prashant Mansing Patil', email: 'rajput09prashant@gmail.com' }
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">About NIDS<span className="text-primary-400">.core</span></h1>
        <p className="text-lg text-gray-400">An advanced Real-Time Network Intrusion Detection System built as a comprehensive college project.</p>
      </div>

      <div className="space-y-12">
        <section className="bg-dark-800/40 backdrop-blur-md p-8 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Target className="text-primary-400" /> Project Objective
          </h2>
          <p className="text-gray-300 leading-relaxed">
            The primary goal of this project is to construct a production-grade, end-to-end Real-Time 
            Network Intrusion Detection System capable of identifying malicious traffic directly from the wire.
            We utilized modern machine learning techniques to separate anomalous payloads from benign packets,
            providing immediate threat intelligence to network administrators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 px-2">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-dark-800/30 p-6 rounded-2xl border border-white/5">
                <Database className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ML Engine</h3>
                <p className="text-gray-400 text-sm">XGBoost & Random Forest ensemble trained on modern intrusion datasets.</p>
             </div>
             <div className="bg-dark-800/30 p-6 rounded-2xl border border-white/5">
                <Server className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">FastAPI Backend</h3>
                <p className="text-gray-400 text-sm">High-performance async Python backend processing PCAP streams via WebSockets.</p>
             </div>
             <div className="bg-dark-800/30 p-6 rounded-2xl border border-white/5">
                <Code className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">React UI</h3>
                <p className="text-gray-400 text-sm">Glassmorphic dashboard providing live visualizations with framerate-independent animations.</p>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 px-2">Project Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={member.email + index} className="bg-dark-800/30 p-6 rounded-2xl border border-white/5">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Member {index + 1}</p>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-gray-300 mt-1 break-all">{member.email}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
