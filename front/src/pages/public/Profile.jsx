import { useTranslation } from "react-i18next";
import { Eye, Heart, Film, Share2, Settings, MapPin, Clock, Users, Play, BadgeCheck, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// TODO: Remplacer par un appel API (ex: useQuery)
const user = null;
const submissions = [];

export default function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("portfolio");

  const tabs = [
    { key: "portfolio", label: t("pages.profile.tabs.portfolio") },
    { key: "favorites", label: t("pages.profile.tabs.favorites") },
    { key: "bio", label: t("pages.profile.tabs.bio") },
  ];

  // Données avec fallback
  const displayName = user?.name ?? "—";
  const username = user?.username ? `@${user.username}` : "—";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : null;
  const bio = user?.bio ?? t("pages.profile.bio");
  const location = user?.location ?? null;
  const joinedAt = user?.joinedAt ?? null;
  const isVerified = user?.verified ?? false;
  const subscribersCount = user?.subscribers ?? 0;
  const subscriptionsCount = user?.subscriptions ?? 0;
  const filmsCount = user?.films ?? 0;
  const applauseCount = user?.applause ?? 0;
  const viewsCount = user?.views ?? 0;

  const formatNumber = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div className="max-w-4xl mx-auto pb-40 space-y-5">
      {/* Cover / Banner */}
      <div className="relative h-40 sm:h-48 md:h-56 rounded-b-[24px] md:rounded-b-[32px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a103d] via-[#0f1a3a] to-[#0a0a1a]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#51A2FF]/10 to-transparent" />
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 60" preserveAspectRatio="none">
          <path d="M0,60 Q100,10 200,35 T400,20 L400,60 Z" fill="rgba(81,162,255,0.08)" />
          <path d="M0,60 Q150,25 250,45 T400,30 L400,60 Z" fill="rgba(168,85,247,0.06)" />
        </svg>
      </div>

      {/* Avatar + Nom + Actions */}
      <div className="px-4 -mt-14 sm:-mt-16 relative z-10">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-br from-[#A855F7] to-[#51A2FF]">
              <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : initials ? (
                  <span className="text-2xl sm:text-3xl font-black text-white">{initials}</span>
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
                )}
              </div>
            </div>
            {isVerified && (
              <div className="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#51A2FF] flex items-center justify-center border-2 border-[#1a1a2e]">
                <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </div>

          {/* Nom + username */}
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-black tracking-tight">{displayName}</h2>
            <p className="text-[#51A2FF] text-xs sm:text-sm font-semibold">{username}</p>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#51A2FF] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer">
              {t("pages.profile.follow")}
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 sm:space-y-5">
        {/* Biographie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <h3 className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3">
            {t("pages.profile.biography")}
          </h3>
          <p className="text-white/70 text-xs sm:text-sm italic leading-relaxed">{bio}</p>
          {(location || joinedAt) && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-white/40 text-[10px] sm:text-xs">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {location}
                </span>
              )}
              {joinedAt && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {joinedAt}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Audience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <h3 className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {t("pages.profile.audience")}
          </h3>
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="text-white text-lg sm:text-xl font-black">{formatNumber(subscribersCount)}</span>
              <span className="text-white/40 text-[10px] sm:text-xs ml-1 sm:ml-1.5">{t("pages.profile.subscribers")}</span>
            </div>
            <div className="w-px h-5 sm:h-6 bg-white/10" />
            <div>
              <span className="text-white text-lg sm:text-xl font-black">{formatNumber(subscriptionsCount)}</span>
              <span className="text-white/40 text-[10px] sm:text-xs ml-1 sm:ml-1.5">{t("pages.profile.subscriptions")}</span>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
        >
          <div className="relative rounded-[12px] sm:rounded-[16px] p-3 sm:p-4 overflow-hidden bg-gradient-to-br from-[#2a1a4e] to-[#1a1035] border border-purple-500/20 flex items-center gap-3 sm:block">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 sm:hidden">
              <Film className="w-5 h-5 text-purple-400/60" />
            </div>
            <Film className="absolute -bottom-2 -right-2 w-16 h-16 text-purple-500/10 hidden sm:block" />
            <div>
              <p className="text-white text-lg sm:text-2xl font-black">{formatNumber(filmsCount)}</p>
              <p className="text-white/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 sm:mt-1 leading-tight">
                {t("pages.profile.stats.films")}
              </p>
            </div>
          </div>

          <div className="relative rounded-[12px] sm:rounded-[16px] p-3 sm:p-4 overflow-hidden bg-gradient-to-br from-[#3a1a3e] to-[#2a1030] border border-pink-500/20 flex items-center gap-3 sm:block">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0 sm:hidden">
              <Heart className="w-5 h-5 text-pink-400/60" />
            </div>
            <Heart className="absolute -bottom-2 -right-2 w-16 h-16 text-pink-500/10 hidden sm:block" />
            <div>
              <p className="text-white text-lg sm:text-2xl font-black">{formatNumber(applauseCount)}</p>
              <p className="text-white/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 sm:mt-1 leading-tight">
                {t("pages.profile.stats.applause")}
              </p>
            </div>
          </div>

          <div className="relative rounded-[12px] sm:rounded-[16px] p-3 sm:p-4 overflow-hidden bg-gradient-to-br from-[#1a2a4e] to-[#101a35] border border-blue-500/20 flex items-center gap-3 sm:block">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 sm:hidden">
              <Eye className="w-5 h-5 text-blue-400/60" />
            </div>
            <Eye className="absolute -bottom-2 -right-2 w-16 h-16 text-blue-500/10 hidden sm:block" />
            <div>
              <p className="text-white text-lg sm:text-2xl font-black">{formatNumber(viewsCount)}</p>
              <p className="text-white/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 sm:mt-1 leading-tight">
                {t("pages.profile.stats.views")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Onglets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-1 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-[#A855F7] to-[#51A2FF] text-white shadow-lg"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contenu Portfolio */}
        {activeTab === "portfolio" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submissions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[16px] sm:rounded-[20px] overflow-hidden group cursor-pointer hover:border-[#51A2FF]/30 transition-all"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-[#2a1a4e] via-[#1a2a4e] to-[#0a0a1a] flex items-center justify-center">
                      {sub.thumbnail && (
                        <img src={sub.thumbnail} alt={sub.title} className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-white font-bold text-xs sm:text-sm truncate">{sub.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 sm:mt-2 text-white/40 text-[10px] sm:text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {formatNumber(sub.likes ?? 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {formatNumber(sub.views ?? 0)} {t("pages.profile.views")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <Film className="w-10 h-10 sm:w-12 sm:h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-xs sm:text-sm">{t("pages.profile.noSubmissions")}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
