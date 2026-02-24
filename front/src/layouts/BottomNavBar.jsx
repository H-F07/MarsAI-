import { motion } from "motion/react";
import { Home, Search, Trophy, User, PlusCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export function BottomNavigation() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/discover', icon: Search, label: t('nav.discover') },
    { path: '/soumission', icon: PlusCircle, label: t('nav.submit'), isSpecial: true },
    { path: '/competition', icon: Trophy, label: t('nav.competition') },
    { path: '/profile', icon: User, label: t('nav.profile') }
  ];

  const handleNav = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Language Switch (Mobile) */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => i18n.changeLanguage("fr")}
          className={`transition-colors ${
            i18n.language === "fr"
              ? "text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          {t("lang.fr")}
        </button>
        <span className="text-white/20">|</span>
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`transition-colors ${
            i18n.language === "en"
              ? "text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          {t("lang.en")}
        </button>
      </div>

      <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-48px)] max-w-lg">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[40px] p-2 md:p-3 shadow-2xl shadow-black/60 relative overflow-hidden"
        >
          {/* Specular Highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="flex items-center justify-between px-2 md:px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              if (item.isSpecial) {
                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNav(item.path)}
                    className="relative group cursor-pointer"
                    title={item.label}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#A855F7] to-[#51A2FF] rounded-full blur-[8px] opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-[#A855F7] to-[#51A2FF] rounded-full p-4 md:p-5 shadow-2xl border border-white/20">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={3} />
                    </div>
                  </motion.button>
                );
              }
              
              return (
                <motion.button
                  key={item.path}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleNav(item.path)}
                  className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 relative cursor-pointer group"
                  title={item.label}
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.2 : 1,
                    }}
                    className={`transition-colors duration-300 ${
                      active
                        ? 'text-[#51A2FF]'
                        : 'text-white/30 group-hover:text-white/60'
                    }`}
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={active ? 2.5 : 2} />
                  </motion.div>
                  
                  {active && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 w-1.5 h-1.5 bg-[#51A2FF] rounded-full shadow-[0_0_12px_#51A2FF]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}