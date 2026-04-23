import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Image as ImageIcon, 
  Bell, 
  History, 
  Menu, 
  X,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { auth } from './lib/config';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Diagnosis from './pages/Diagnosis';
import ImageAnalysis from './pages/ImageAnalysis';
import AlertCenter from './pages/AlertCenter';
import CaseHistory from './pages/CaseHistory';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Diagnostic IA', href: '/diagnostic', icon: Stethoscope },
  { name: 'Analyse Image', href: '/image', icon: ImageIcon },
  { name: 'Alertes', href: '/alerts', icon: Bell },
  { name: 'Historique', href: '/history', icon: History },
];

interface NavItemProps {
  item: { name: string; href: string; icon: any };
  mobile?: boolean; 
  onClick?: () => void;
  key?: string;
}

function NavItem({ item, mobile, onClick }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
      <span>{item.name}</span>
    </Link>
  );
}

function SiteLayout({ children, user }: { children: React.ReactNode, user: User | null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white sticky top-0 h-screen overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-xl text-white">A</div>
            <span className="text-sm font-bold tracking-tight uppercase">AFYASENSE <span className="text-blue-500 italic">AI</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
              {user.photoURL ? <img src={user.photoURL} alt="" /> : user.displayName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-white">{user.displayName || 'Utilisateur'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">Secteur Rural B</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-rose-400 transition-colors w-full px-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50 shrink-0">
          <div className="flex items-center gap-2 text-slate-900 uppercase font-bold text-sm tracking-tight text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
            <span>AFYASENSE</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Desktop Custom Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Surveillance en Temps Réel — 2026</h2>
          </div>
          <div className="flex gap-3">
            <Link to="/diagnostic" className="btn-primary flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Nouveau Cas
            </Link>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[70] p-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <ShieldCheck className="w-6 h-6" />
                  <span>AFYASENSE</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-2 text-slate-900">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} mobile onClick={() => setIsSidebarOpen(false)} />
                ))}
              </nav>
              
              <div className="mt-auto pt-10 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.displayName || 'Utilisateur'}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Agent Communautaire</p>
                    </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProtectedRoute({ user, children }: { user: User | null, children: React.ReactNode }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <SiteLayout user={user}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/diagnostic" element={<ProtectedRoute user={user}><Diagnosis /></ProtectedRoute>} />
          <Route path="/image" element={<ProtectedRoute user={user}><ImageAnalysis /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute user={user}><AlertCenter /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute user={user}><CaseHistory /></ProtectedRoute>} />
        </Routes>
      </SiteLayout>
    </Router>
  );
}
