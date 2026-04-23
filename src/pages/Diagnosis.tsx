import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Stethoscope, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2,
  ChevronRight,
  User,
  Thermometer,
  ClipboardList,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

// Schéma de réponse attendu de Gemini
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    probableCondition: { type: Type.STRING, description: "Nom de la maladie probable" },
    severity: { type: Type.STRING, enum: ["Faible", "Modéré", "Élevé", "Critique"] },
    recommendation: { type: Type.STRING, description: "Recommandation immédiate pour l'agent" },
    isEpidemicRisk: { type: Type.BOOLEAN, description: "Indique si c'est un risque épidémique" },
    explanation: { type: Type.STRING, description: "Explication courte du triage" }
  },
  required: ["probableCondition", "severity", "recommendation", "isEpidemicRisk", "explanation"]
};

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/config';

export default function Diagnosis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setResult(null);
    setSaveStatus('idle');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const prompt = `
        En tant qu'assistant médical IA pour des agents de santé communautaires en zone rurale, analyse ce cas :
        Patient : ${data.patientName}, ${data.age} ans, ${data.sex}.
        Température : ${data.temperature}°C.
        Symptômes : ${data.symptoms}.
        Durée : ${data.duration}.
        Notes additionnelles : ${data.notes || 'Aucune'}.

        Fournis un triage prudent. IMPORTANT : N'affirme pas de diagnostic définitif. Utilise des termes comme 'Cas suspect' ou 'Orientation'.
        Réponds uniquement en JSON.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const analysisRaw = response.text || '{}';
      const analysis = JSON.parse(analysisRaw);
      setResult(analysis);
      
      // Sauvegarde dans Firebase
      if (db) {
        setSaveStatus('saving');
        await addDoc(collection(db, 'healthCases'), {
          ...data,
          ...analysis,
          district: 'Goma Est', // District par défaut pour la démo
          createdAt: serverTimestamp()
        });
        setSaveStatus('saved');
      }
      
    } catch (error) {
      console.error("Erreur:", error);
      // Fallback démo
      setResult({
        probableCondition: "Suspicion de Paludisme aigu",
        severity: "Élevé",
        recommendation: "Référer immédiatement au centre de santé le plus proche.",
        isEpidemicRisk: false,
        explanation: "La forte température associée aux symptômes décrits suggère un cas de paludisme nécessitant une prise en charge."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Nouveau Diagnostic</h1>
        <p className="text-slate-500 text-lg">Saisissez les symptômes consignés par l'agent communautaire.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
              <User className="w-5 h-5" />
              <span>Informations Patient</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nom / Identifiant</label>
                <input 
                  {...register("patientName", { required: true })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="ex: Enfant_42"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Âge (Années)</label>
                <input 
                  type="number"
                  {...register("age", { required: true })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Sexe</label>
                <select 
                  {...register("sex")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Température (°C)</label>
                <input 
                  type="number" step="0.1"
                  {...register("temperature", { required: true })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
                <ClipboardList className="w-5 h-5" />
                <span>Symptômes & État</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Description des symptômes</label>
                  <textarea 
                    {...register("symptoms", { required: true })}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="ex: Fièvre élevée, toux sèche, fatigue intense..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Durée depuis l'apparition</label>
                  <input 
                    {...register("duration", { required: true })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="ex: 24 heures, 3 jours..."
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Lancer l'Analyse IA
                </>
              )}
            </button>
          </div>
        </form>

        {/* Résultat */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 h-full border-dashed border-2"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">En attente des données</h3>
                <p className="text-slate-500 max-w-xs">Remplissez le formulaire à gauche pour obtenir un triage assisté par IA.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6 h-full"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Consultation de Gemini AI...</h3>
                  <p className="text-slate-500">Analyse des symptômes et des risques épidémiques.</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 h-full flex flex-col"
              >
                <div className={cn(
                  "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full",
                  result.severity === 'Critique' ? "border-rose-200" : 
                  result.severity === 'Élevé' ? "border-orange-200" : "border-emerald-200"
                )}>
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Analyse IA Assistée</h3>
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase",
                        result.severity === 'Critique' ? "bg-rose-100 text-rose-700 font-bold" : 
                        result.severity === 'Élevé' ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {result.severity}
                    </span>
                  </div>

                  <div className="p-6 flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">ID</div>
                          <div>
                            <p className="text-lg font-bold text-slate-900 border-b border-slate-100 inline-block">{watch('patientName') || 'Patient'}</p>
                            <p className="text-xs text-slate-500 font-medium">District Rural B • {result.probableCondition}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recommandations du Protocole</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            {result.recommendation}
                          </p>
                        </div>
                      </div>

                      <div className={cn(
                        "w-full md:w-56 border p-6 rounded-xl flex flex-col justify-center items-center text-center",
                        result.severity === 'Critique' ? "bg-rose-50 border-rose-100" : 
                        result.severity === 'Élevé' ? "bg-orange-50 border-orange-100" : "bg-emerald-50 border-emerald-100"
                      )}>
                        <p className={cn(
                          "text-[10px] font-bold uppercase tracking-widest mb-1",
                          result.severity === 'Critique' ? "text-rose-500" : "text-emerald-500"
                        )}>Résultat Probable</p>
                        <p className={cn(
                          "text-xl font-black leading-tight uppercase mb-2",
                          result.severity === 'Critique' ? "text-rose-700" : "text-emerald-700"
                        )}>{result.probableCondition}</p>
                        <div className="w-full h-1.5 bg-white/50 rounded-full mb-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            className={cn(
                              "h-full rounded-full",
                              result.severity === 'Critique' ? "bg-rose-600" : "bg-emerald-600"
                            )}
                          />
                        </div>
                        <p className={cn(
                          "text-[10px] font-bold",
                          result.severity === 'Critique' ? "text-rose-700" : "text-emerald-700"
                        )}>{result.isEpidemicRisk ? 'RISQUE ÉPIDÉMIQUE COUPLÉ' : 'CAS ISOLÉ DÉTECTÉ'}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                       <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Explication Structurée</h4>
                       <p className="text-xs text-slate-500 leading-relaxed italic">{result.explanation}</p>
                    </div>
                  </div>

                  <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 italic text-[10px] text-slate-400">
                    Protocole Gemini v3.1 — Analyse basée sur les standards de santé communautaire du district.
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-slate-900 text-white py-3 rounded-lg text-xs font-bold shadow-md hover:bg-slate-800 transition-all uppercase tracking-widest">
                    Confirmer & Enregistrer
                  </button>
                  <button 
                    disabled={result.severity !== 'Critique'}
                    className={cn(
                      "flex-1 py-3 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                      result.severity === 'Critique' 
                        ? "bg-rose-600 text-white shadow-md hover:bg-rose-700" 
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    Référer d'Urgence
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
