import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AlertCenter() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Centre d'Alertes Épidémiques</h1>
      <p className="text-slate-500">Surveillance en temps réel des risques sanitaires dans votre zone.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Suspicion Malaria', zone: 'Zone Est', risk: 'Élevé', cases: 8 },
          { title: 'Toux Aiguë Habituelle', zone: 'Zone Nord', risk: 'Modéré', cases: 5 },
          { title: 'Diarrhée Hydrique', zone: 'Zone Sud-Est', risk: 'Critique', cases: 12 },
        ].map((alert, i) => (
          <div key={i} className="glass-card p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start mb-4">
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                alert.risk === 'Critique' ? "bg-red-600 text-white" : "bg-orange-100 text-orange-600"
              )}>
                {alert.risk}
              </span>
              <span className="text-xs text-slate-400">Il y a 30 min</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{alert.title}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
              <MapPin className="w-3 h-3" />
              {alert.zone}
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">{alert.cases} cas détectés</span>
              <button className="text-indigo-600 text-sm font-semibold">Détails</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
