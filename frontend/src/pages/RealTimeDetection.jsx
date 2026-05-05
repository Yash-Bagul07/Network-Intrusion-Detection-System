import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Monitor, Server, Database } from 'lucide-react';
import useWebSocketPackage from 'react-use-websocket';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getApiBase, getWsLiveUrl } from '../config/apiConfig';
const useWebSocket = useWebSocketPackage.default || useWebSocketPackage;

const WS_URL = getWsLiveUrl();
const API_BASE = getApiBase().replace(/\/+$/, '');

export default function RealTimeDetection() {
  const DEFAULT_VISIBLE_ALERTS = 8;
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ packets_per_sec: 0, active_flows: 0 });
  const [chartData, setChartData] = useState([]);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => isOnline,
    reconnectInterval: 3000,
  }, isOnline);

  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.type === 'alert') {
        setAlerts(prev => [lastJsonMessage.data, ...prev].slice(0, 50));
      } else if (lastJsonMessage.type === 'stats') {
        setStats(lastJsonMessage.data);
        setChartData(prev => {
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          const newData = [...prev, { time: timeStr, packets: lastJsonMessage.data.packets_per_sec }];
          return newData.slice(-20);
        });
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (!isOnline) return;

    const fetchLiveData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          axios.get(`${API_BASE}/stats`),
          axios.get(`${API_BASE}/alerts`),
        ]);

        const statsData = statsRes.data;
        setStats(statsData);

        setChartData(prev => {
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          const newData = [...prev, { time: timeStr, packets: statsData.packets_per_sec || 0 }];
          return newData.slice(-20);
        });

        if (Array.isArray(alertsRes.data?.alerts)) {
          const latestAlerts = [...alertsRes.data.alerts].reverse().slice(0, 50);
          setAlerts(latestAlerts);
        }
      } catch {
        // Ignore transient fetch errors; websocket or next poll can recover.
      }
    };

    fetchLiveData();
    const intervalId = setInterval(fetchLiveData, 2000);
    return () => clearInterval(intervalId);
  }, [isOnline]);

  const visibleAlerts = showAllAlerts ? alerts : alerts.slice(0, DEFAULT_VISIBLE_ALERTS);
  const formatAlertTime = (timestamp) => {
    if (!timestamp) return '--:--:--';

    // Backend sends naive UTC timestamps; normalize to ISO UTC for correct local display.
    const normalizedTimestamp = /Z$|[+-]\d{2}:\d{2}$/.test(timestamp) ? timestamp : `${timestamp}Z`;
    const date = new Date(normalizedTimestamp);
    return Number.isNaN(date.getTime()) ? '--:--:--' : date.toLocaleTimeString();
  };

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Stat Cards */}
           <StatCard title="Active Flows" value={stats.active_flows} icon={Activity} color="text-blue-400" bgColor="bg-blue-500/10" borderColor="border-blue-500/20" />
           <StatCard title="Packets / Sec" value={stats.packets_per_sec} icon={Server} color="text-green-400" bgColor="bg-green-500/10" borderColor="border-green-500/20" />
           <StatCard title="Critical Alerts" value={alerts.filter(a => a.severity==='CRITICAL').length} icon={ShieldAlert} color="text-red-400" bgColor="bg-red-500/10" borderColor="border-red-500/20" />
        </div>

        {!isOnline && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            Realtime monitoring is paused because there is no network connection.
          </div>
        )}
        
        <div className="bg-dark-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl h-[400px]">
           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-primary-400"/> Live Traffic Overview</h2>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '0.75rem' }}
                   itemStyle={{ color: '#60a5fa' }}
                 />
                 <Line 
                   type="monotone" 
                   dataKey="packets" 
                   name="Packets / Sec"
                   stroke="#3b82f6" 
                   strokeWidth={3} 
                   dot={false}
                   activeDot={{ r: 6, fill: '#60a5fa', stroke: '#1e293b', strokeWidth: 2 }}
                   animationDuration={300}
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="bg-dark-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl flex-1 overflow-hidden flex flex-col">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-400"><Activity className="w-5 h-5"/> Live Threat Feed</h2>
            {alerts.length > DEFAULT_VISIBLE_ALERTS && (
              <button
                type="button"
                onClick={() => setShowAllAlerts(prev => !prev)}
                className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-gray-200 hover:border-white/30 hover:text-white transition-colors"
              >
                {showAllAlerts ? 'Show less' : 'See all'}
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {alerts.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">No recent alerts detected...</div>
            ) : (
              visibleAlerts.map((alert, i) => (
                <div key={i} className={`p-4 rounded-xl border-l-4 bg-dark-900/50 backdrop-blur-sm
                  ${alert.severity === 'CRITICAL' ? 'border-red-500' : 
                    alert.severity === 'HIGH' ? 'border-orange-500' : 'border-yellow-500'}
                  transition-all duration-300 hover:translate-x-1
                `}>
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-mono text-xs text-gray-400">{formatAlertTime(alert.timestamp)}</span>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-opacity-20
                       ${alert.severity === 'CRITICAL' ? 'bg-red-500 text-red-400' : 
                         alert.severity === 'HIGH' ? 'bg-orange-500 text-orange-400' : 'bg-yellow-500 text-yellow-400'}
                     `}>{alert.severity}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-200">{alert.type}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1.5 bg-dark-950 p-1.5 rounded truncate">
                    {alert.src_ip} ➔ {alert.dst_ip}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor, borderColor }) {
  return (
    <div className="bg-dark-800/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between transition-transform duration-300 hover:-translate-y-1">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold font-mono tracking-tight text-white">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${bgColor} border ${borderColor} ${color}`}>
         <Icon className="w-6 h-6" />
      </div>
    </div>
  )
}
