import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/config';
import { formatDate } from '../lib/utils';
import { History, Search, Filter, ArrowRight } from 'lucide-react';
import { HealthCase } from '../types';
import { cn } from '../lib/utils';

export default function CaseHistory() {
  const [cases, setCases] = useState<HealthCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'healthCases'), orderBy('createdAt', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedCases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setCases(fetchedCases);
      } catch (error) {
        console.error("Erreur fetch cases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Historique des Cas</h1>
          <p className="text-slate-500 text-lg">Retrouvez tous les diagnostics enregistrés par les agents du district.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input placeholder="Rechercher un patient..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none w-64" />
           </div>
        </div>
      </header>
      
      {loading ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
           <p className="text-slate-500">Chargement de l'historique...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Aucun cas enregistré</h3>
          <p className="text-slate-500 max-w-sm">Les diagnostics apparaîtront ici une fois que les agents commenceront leurs tournées.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-semibold">Patient</th>
                  <th className="px-8 py-4 font-semibold">Diagnostic (Suspect)</th>
                  <th className="px-8 py-4 font-semibold">Symptômes</th>
                  <th className="px-8 py-4 font-semibold">Gravité</th>
                  <th className="px-8 py-4 font-semibold">Date</th>
                  <th className="px-8 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-semibold text-slate-900">{item.patientName}</p>
                        <p className="text-xs text-slate-500">{item.age} ans, {item.sex}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-700 font-medium">
                      {item.probableCondition}
                    </td>
                    <td className="px-8 py-6 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-slate-500 text-sm">
                      {item.symptoms}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        item.severity === 'Critique' ? "bg-red-50 text-red-600 border-red-100" : 
                        item.severity === 'Élevé' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      )}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 text-sm">
                      {/* @ts-ignore */}
                      {item.createdAt?.seconds ? formatDate(new Date(item.createdAt.seconds * 1000)) : 'Récemment'}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                          <ArrowRight className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
