import { motion, AnimatePresence } from "motion/react";
import { Search, Home, Trophy, Calendar, User, UserPlus, Menu, X, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { NotificationDropdown } from "../components/NotificationDropdown.jsx";

export function TopBar() {
  /* Etat pour gerer l'ouverture et la fermeture du menu mobile */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  /* Navigation et location pour gerer les redirection et l'etat actif des liens bleu ou pas bleu */
  const navigate = useNavigate();
  const location = useLocation();

  /* Vérifier l'authentification au chargement et lors des changements */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!token);
    setUsername(storedUsername || "");
  }, [location.pathname]);

  /* Fonction de déconnexion */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUsername("");
    setIsMenuOpen(false);
    navigate("/auth/login");
  };
  /* matrix de navigation */
  const navItems = [
    { path: '/discover', icon: Search, label: 'Découvrir' },
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/competition', icon: Trophy, label: 'Concours' },
    { path: '/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  /* Fonction pour gerer ls navigation et la fermeture du menu mobile lors de. la navigation = chhagenment de page / hamburgers */
  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  /* Fonction pour determiner si le lien est actif (bleu) ou pas */
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 py-4 md:px-8 md:py-6 pointer-events-none"
      >
        <div className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-full h-[56px] md:h-[72px] flex items-center justify-between px-4 md:px-8 gap-2 md:gap-6 shadow-2xl shadow-black/60 pointer-events-auto w-full max-w-[1400px] relative overflow-visible">
          {/* Specular Highlight (Top Edge) */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
          
          {/* Inner Refraction Border */}
          <div className="absolute inset-[1px] rounded-full border border-white/[0.05] pointer-events-none" />
          
          {/* Logo marsAI */}
          <button 
            onClick={() => handleNav('/')}
            className="flex items-baseline gap-1 group whitespace-nowrap cursor-pointer"
          >
            <span className="text-base md:text-2xl font-black uppercase tracking-tighter text-white">MARS</span>
            <span className="text-base md:text-2xl font-black uppercase tracking-tighter text-purple-500 group-hover:scale-110 transition-transform">AI</span>
          </button>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button 
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="relative flex flex-col items-center justify-center px-4 py-2 rounded-full hover:bg-white/10 transition-all group cursor-pointer"
                title={item.label}
              >
                <item.icon className={`w-5 h-5 transition-all ${isActive(item.path) ? 'text-[#51A2FF]' : 'text-white/40 group-hover:text-white'}`} />
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute -bottom-1 w-1.5 h-1.5 bg-[#51A2FF] rounded-full shadow-[0_0_12px_#51A2FF]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                {username && (
                  <span className="text-white/60 text-sm font-bold uppercase tracking-wider hidden lg:inline">
                    {username}
                  </span>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold uppercase tracking-wider hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNav('/auth/login')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm font-bold uppercase tracking-wider hover:bg-white/10 hover:border-[#51A2FF]/30 hover:text-white transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Connexion</span>
                </button>
                
                <button 
                  onClick={() => handleNav('/auth/register')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-[#51A2FF] text-white text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Inscription</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile: notifications + burger menu */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated ? <NotificationDropdown /> : null}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-white/50 hover:text-white transition-colors cursor-pointer bg-white/5 rounded-full border border-white/5"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.div>

      {/* Mobile Menu - Clean and Simple */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-4 right-4 z-[90] md:hidden"
          >
            <div className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[24px] shadow-2xl shadow-black/60 overflow-hidden">
              {/* Navigation Items */}
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button 
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-[16px] transition-all ${
                      isActive(item.path) 
                        ? 'bg-white/10 border border-[#51A2FF]/30 text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-[#51A2FF]' : ''}`} />
                    <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto w-2 h-2 bg-[#51A2FF] rounded-full shadow-[0_0_12px_#51A2FF]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="border-t border-white/10 p-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {username && (
                      <div className="px-4 py-2 text-white/60 text-sm font-bold uppercase tracking-wider text-center">
                        {username}
                      </div>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[16px] bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm uppercase tracking-wider hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleNav('/auth/login')}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[16px] bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <LogIn className="w-5 h-5" />
                      Connexion
                    </button>
                    
                    <button 
                      onClick={() => handleNav('/auth/register')}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[16px] bg-gradient-to-r from-purple-600 to-[#51A2FF] text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                    >
                      <UserPlus className="w-5 h-5" />
                      Inscription
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}