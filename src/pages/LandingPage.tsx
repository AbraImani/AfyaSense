import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Stethoscope, 
  Bell, 
  Image as ImageIcon, 
  ArrowRight, 
  AlertTriangle,
  Users,
  Zap,
  X
} from 'lucide-react';
import { auth } from '../lib/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const handleGoogleLogin = async () => {
    // Éviter les requêtes multiples
    if (isAuthenticating) return;

    setAuthError(null);
    setIsAuthenticating(true);

    try {
      const provider = new GoogleAuthProvider();
      // Force le choix du compte pour éviter certains bugs de popup
      provider.setCustomParameters({ prompt: 'select_account' });
      
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      if (error.code === 'auth/popup-blocked') {
        setAuthError("Le navigateur a bloqué la fenêtre de connexion. Veuillez autoriser les popups pour ce site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError("Une demande de connexion est déjà en cours ou a été annulée. Veuillez réessayer.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("La fenêtre de connexion a été fermée avant la fin de l'opération.");
      } else {
        setAuthError("Une erreur inattendue est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Messages d'erreur d'authentification */}
      <AnimatePresence>
        {authError && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-xl flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-800 mb-1">Erreur de connexion</p>
                <p className="text-xs text-rose-700 leading-relaxed">{authError}</p>
              </div>
              <button onClick={() => setAuthError(null)} className="text-rose-400 hover:text-rose-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">A</div>
          <span className="text-xl font-bold tracking-tight uppercase">AFYASENSE <span className="text-blue-600 italic">AI</span></span>
        </div>
        <button 
          onClick={handleGoogleLogin}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          Se connecter
        </button>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            L'IA au service de la santé communautaire
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Plateforme intelligente de <br />
            <span className="text-blue-600">diagnostic assisté</span> et d'alerte.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            AfyaSense AI permet aux agents de santé communautaires de détecter les maladies critiques 
            plus rapidement et de prévenir les épidémies grâce à l'intelligence artificielle de pointe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGoogleLogin}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              Se connecter avec Google
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats/Problem Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Le Problème</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="text-rose-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-rose-400">24 Heures</h4>
                    <p className="text-slate-400">C'est le temps qu'il faut à un enfant pour mourir d'une pneumonie ou d'un paludisme non soigné en zone rurale.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-orange-400">1 Agent de Santé</h4>
                    <p className="text-slate-400">Pour des milliers d'habitants. Le diagnostic manuel est lent, complexe et sujet à l'erreur.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">La Solution AfyaSense</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Nous combinons l'expertise locale des agents de santé communautaires avec la puissance de l'IA Gemini. 
                Notre outil transforme un simple smartphone en un laboratoire de diagnostic mobile capable d'orienter les cas critiques instantanément.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-500">
                <span>IA Gemini</span>
                <span>•</span>
                <span>Cloud Santé</span>
                <span>•</span>
                <span>Impact Rural</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités Clés</h2>
          <p className="text-slate-500">Une suite d'outils conçue pour l'efficacité sur le terrain.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Diagnostic Assisté</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Saisie intelligente des symptômes et analyse instantanée par IA pour orienter le triage médical.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Alertes Épidémiques</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Détection automatique des clusters anormaux et notification immédiate des autorités sanitaires.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Analyse d'Image</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Détection visuelle assistée par IA pour la malnutrition et d'autres signes pathologiques externes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-slate-400">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-bold text-sm tracking-tight uppercase">AfyaSense AI © 2026</span>
        </div>
        <p className="text-xs text-slate-400">Développé pour l'IA au service de la santé communautaire.</p>
      </footer>
    </div>
  );
}
