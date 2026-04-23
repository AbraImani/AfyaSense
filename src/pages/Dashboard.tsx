import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  MapPin, 
  ArrowUpRight,
  Plus,
  Stethoscope,
  TrendingUp,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const data = [
  { name: '08:00', cas: 4 },
  { name: '10:00', cas: 7 },
  { name: '12:00', cas: 12 },
  { name: '14:00', cas: 9 },
  { name: '16:00', cas: 15 },
  { name: '18:00', cas: 8 },
];

const alertData = [
  { name: 'Zone Est', count: 12, color: '#ef4444' }, // red
  { name: 'Zone Nord', count: 8, color: '#f97316' },  // orange
  { name: 'Zone Sud', count: 5, color: '#3b82f6' },   // blue
  { name: 'Zone Ouest', count: 3, color: '#10b981' },  // green
];

function StatCard({ title, value, change, icon: Icon, colorClass, borderClass }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white p-5 rounded-xl border border-slate-200 shadow-sm", borderClass)}
    >
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</p>
      <p className={cn("text-3xl font-bold", colorClass || "text-slate-900")}>{value}</p>
      <p className="text-[10px] text-slate-400 font-medium mt-1">{change}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8 flex-1 overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1 leading-tight">Tableau de Bord</h1>
          <p className="text-slate-500 text-sm">
            District Rural B — État sanitaire actuel et alertes IA.
          </p>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Cas Aujourd'hui" 
          value="124" 
          change="+12% vs hier" 
          colorClass="text-slate-900" 
        />
        <StatCard 
          title="Alertes Actives" 
          value="08" 
          change="4 Districts touchés" 
          colorClass="text-rose-600" 
        />
        <StatCard 
          title="Risque Maximal" 
          value="Kibera" 
          change="Suspicion Pneumonie" 
          borderClass="border-l-4 border-l-orange-500"
        />
        <StatCard 
          title="Analyses IA Vision" 
          value="45" 
          change="Taux de confiance: 98%" 
        />
      </div>

      {/* Main Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Évolution des Cas</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Activités District — 24h</p>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cas" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Sidebar in Dashboard */}
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold mb-4 flex items-center justify-between tracking-tight">
            Alertes Épidémiques
            <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">LIVE</span>
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-rose-500">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">ALERTE ROUGE</p>
              <p className="text-sm font-semibold">Cluster Pneumonie</p>
              <p className="text-[11px] text-slate-400">Kibera — 6 cas signalés en 12h.</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-orange-500">
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">ALERTE ORANGE</p>
              <p className="text-sm font-semibold">Pic de Paludisme</p>
              <p className="text-[11px] text-slate-400">Zone B — Augmentation de +25%.</p>
            </div>
            <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl mt-auto">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Dernière Vision IA</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-md flex items-center justify-center">
                   <ImageIcon className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold">Malnutrition Modérée</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Confiance: 94.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recents Table Simplified */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Derniers Diagnostics</h2>
            <p className="text-sm text-slate-500">Les 5 cas les plus récents</p>
          </div>
          <Link to="/history" className="text-indigo-600 text-sm font-semibold hover:underline">Voir tout</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-4 font-semibold">Patient</th>
                <th className="px-8 py-4 font-semibold">District</th>
                <th className="px-8 py-4 font-semibold">Symptômes</th>
                <th className="px-8 py-4 font-semibold">Gravité</th>
                <th className="px-8 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        P{i}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Patient ID_{i}42</p>
                        <p className="text-xs text-slate-500">Enfant, 4 ans</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-600">Goma Est</td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1">
                      <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">Fièvre</span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">Toux</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      i === 1 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                    )}>
                      {i === 1 ? 'Critique' : 'Élevé'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 text-sm">Il y a 2h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
