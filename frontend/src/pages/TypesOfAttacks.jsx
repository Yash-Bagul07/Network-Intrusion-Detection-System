import React from 'react';
import { Skull, RefreshCcw, Lock, Box, Cpu } from 'lucide-react';

const attacks = [
  {
    name: 'DDoS (Distributed Denial of Service)',
    icon: RefreshCcw,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    description: 'An attempt to maliciously disrupt normal traffic of a targeted server, service or network by overwhelming the target or its surrounding infrastructure with a flood of Internet traffic.',
  },
  {
    name: 'Brute Force',
    icon: Lock,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    description: 'A trial-and-error method used by application programs to decode encrypted data such as passwords or Data Encryption Standard (DES) keys, through exhaustive effort.',
  },
  {
    name: 'Malware / Ransomware',
    icon: Skull,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    description: 'Software intentionally designed to cause disruption to a computer, server, client, or computer network, leak private information, gain unauthorized access to information or systems.',
  },
  {
    name: 'Botnet Activity',
    icon: Cpu,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'A number of Internet-connected devices, each of which is running one or more bots. Botnets can be used to perform distributed denial-of-service attack (DDoS attack), steal data, send spam, and allows the attacker to access the device and its connection.',
  },
  {
    name: 'Port Scanning',
    icon: Box,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    description: 'A method of determining which ports on a network are open and could be receiving or sending data. It is a process for sending packets to specific ports on a host and analyzing the responses.',
  }
];

export default function TypesOfAttacks() {
  return (
    <div className="py-8 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Database</h1>
        <p className="text-gray-400">Signatures and behavioral markers for common network attack vectors our system detects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attacks.map((attack, i) => (
          <div key={i} className="group p-6 rounded-2xl bg-dark-800/40 backdrop-blur-md border border-white/5 hover:bg-dark-800/60 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-xl ${attack.bg} ${attack.border} border group-hover:scale-110 transition-transform duration-300`}>
                <attack.icon className={`w-6 h-6 ${attack.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2 group-hover:text-white transition-colors">{attack.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{attack.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
