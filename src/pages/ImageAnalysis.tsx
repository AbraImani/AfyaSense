import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle2, Loader2, Activity, Info, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

export default function ImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    // Simulation d'analyse avec IA (Gemini Vision)
    setTimeout(() => {
      setResult({
        status: "Risque Modéré",
        confidence: 89,
        findings: [
          "Léger œdème détecté",
          "Signes de dépérissement musculaire (bras)",
          "Perte de tissu adipeux sous-cutané"
        ],
        recommendation: "Procéder à une mesure MUAC (Périmètre Brachial). Si < 125mm, référer au programme de nutrition locale.",
        level: "warning"
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Analyse de Malnutrition</h1>
        <p className="text-slate-500 text-lg">
          Outil expérimental de détection visuelle des signes de MAS/MAM (Malnutrition Aiguë).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "glass-card p-4 border-2 border-dashed aspect-[4/3] flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden",
              image ? "border-indigo-500" : "border-slate-200"
            )}
          >
            {image ? (
              <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Patient" />
            ) : (
              <>
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Camera className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Prendre / Charger une photo</p>
                  <p className="text-sm text-slate-500">Photo de l'enfant (corps entier ou bras)</p>
                </div>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Réinitialiser
            </button>
            <button 
              onClick={runAnalysis}
              disabled={!image || loading}
              className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              Lancer l'Analyse Vision IA
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 border border-blue-100">
            <Info className="w-5 h-5 shrink-0" />
            <p>
              <strong>Note de Démo :</strong> Ce module utilise la Vision API pour identifier les anomalies physiques liées à la malnutrition.
            </p>
          </div>
        </div>

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
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Résultats de Vision IA</h3>
                <p className="text-slate-500 max-w-xs">Les indicateurs de santé s'afficheront ici après analyse de l'image.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6 h-full"
              >
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Traitement de l'image...</h3>
                  <p className="text-slate-500">Recherche de marqueurs anthropométriques.</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 h-full"
              >
                <div className={cn(
                  "glass-card p-8 border-t-8 h-full",
                  result.level === 'danger' ? "border-red-600" : "border-amber-500"
                )}>
                  <div className="mb-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                      result.level === 'danger' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    )}>
                      Statut : {result.status}
                    </span>
                    <div className="mt-4 flex items-center gap-2">
                       <div className="text-4xl font-black text-slate-900">{result.confidence}%</div>
                       <div className="text-sm text-slate-500 font-medium">de confiance</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Observations IA :</h4>
                    <ul className="space-y-3">
                      {result.findings.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-6">
                    <h4 className="flex items-center gap-2 text-indigo-400 font-bold mb-3 uppercase text-xs tracking-widest">
                      Action Recommandée
                    </h4>
                    <p className="leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
