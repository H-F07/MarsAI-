import { useTranslation } from "react-i18next";
import { Heart, Eye, Crown, BarChart3, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// Ordre desktop: 2, 1, 3 (podium classique). Mobile: 1, 2, 3 (vertical)
const podiumData = [
  { rank: 2, title: "Synthèse Astrale", user: "@sophiem", hearts: "18.5K", views: "156.3K" },
  { rank: 1, title: "Le Dernier Humain", user: "@alexchen", hearts: "21.3K", views: "189.2K" },
  { rank: 3, title: "Neural Odyssey", user: "@emmar", hearts: "15.7K", views: "127.5K" },
];

const podiumMobileOrder = [
  { rank: 1, title: "Le Dernier Humain", user: "@alexchen", hearts: "21.3K", views: "189.2K" },
  { rank: 2, title: "Synthèse Astrale", user: "@sophiem", hearts: "18.5K", views: "156.3K" },
  { rank: 3, title: "Neural Odyssey", user: "@emmar", hearts: "15.7K", views: "127.5K" },
];

const rankingData = [
  { rank: 4, title: "MÉMOIRES VIRTUELLES", user: "@yodan", hearts: "16.8K", views: "142.3K" },
  { rank: 5, title: "CODE QUANTIQUE", user: "@lumicast", hearts: "24.6K", views: "203.4K" },
  { rank: 6, title: "L'ÉVEIL NUMÉRIQUE", user: "@sophiem", hearts: "12.4K", views: "98.7K" },
  { rank: 7, title: "PIXEL PERFECT", user: "@lucas", hearts: "9.5K", views: "82.3K" },
  { rank: 8, title: "RÊVES SYNTHÉTIQUES", user: "@thomast", hearts: "8.9K", views: "76.5K" },
];

export default function Competition() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("film");

  return (
    <div className="max-w-4xl mx-auto px-4 pb-40 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        {/* Glow orange/rouge en arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-orange-500/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative">
          {/* Badge live */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
              {t("pages.competition.live")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("pages.competition.title")}
          </h1>
          <p className="text-white/50 text-sm max-w-lg mx-auto mt-3 leading-relaxed">
            {t("pages.competition.subtitle")}
          </p>
        </div>
      </motion.div>

      {/* Podium - Top 3 : Mobile (vertical) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3 sm:hidden"
      >
        {podiumMobileOrder.map((item) => {
          const isFirst = item.rank === 1;
          return (
            <div
              key={item.rank}
              className={`bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[16px] overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all ${
                isFirst ? "border-orange-500/20" : ""
              }`}
            >
              <div className="relative aspect-video bg-gradient-to-br from-[#2a1a0e] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
                <div className={`absolute top-3 left-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white shadow-lg ${isFirst ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs"}`}>
                  {item.rank}
                </div>
                {isFirst && (
                  <Crown className="absolute top-3 right-3 w-5 h-5 text-orange-400" />
                )}
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-white font-bold text-sm">{item.title}</p>
                <p className="text-orange-400/70 text-xs mt-0.5">{item.user}</p>
                <div className="flex items-center gap-3 mt-2 text-white/40 text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {item.hearts}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.views}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Podium - Top 3 : Desktop (grille 3 colonnes) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden sm:grid grid-cols-3 gap-4 items-end"
      >
        {podiumData.map((item) => {
          const isFirst = item.rank === 1;
          return (
            <div
              key={item.rank}
              className={`flex flex-col items-center ${isFirst ? "order-2" : item.rank === 2 ? "order-1" : "order-3"}`}
            >
              <div
                className={`w-full bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[20px] overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all ${
                  isFirst ? "border-orange-500/20" : ""
                }`}
              >
                <div className="relative bg-gradient-to-br from-[#2a1a0e] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center aspect-[3/4]">
                  <div className={`absolute top-3 left-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white shadow-lg ${isFirst ? "w-10 h-10 text-base" : "w-8 h-8 text-sm"}`}>
                    {item.rank}
                  </div>
                  {isFirst && (
                    <Crown className="absolute top-3 right-3 w-6 h-6 text-orange-400" />
                  )}
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white font-bold text-sm truncate">{item.title}</p>
                  <p className="text-orange-400/70 text-xs mt-0.5">{item.user}</p>
                  <div className="flex items-center gap-3 mt-2 text-white/40 text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {item.hearts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {item.views}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Compétition Générale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Header + Filtres */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base md:text-lg flex items-center gap-2">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            {t("pages.competition.general")}
          </h2>
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-0.5">
            {["film", "performance"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t(`pages.competition.${filter}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des classements */}
        <div className="space-y-2">
          {rankingData.map((item) => (
            <motion.div
              key={item.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * item.rank }}
              className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[14px] md:rounded-[16px] p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:border-orange-500/20 transition-all cursor-pointer group"
            >
              {/* Rang */}
              <span className="text-white/20 font-black text-lg md:text-xl w-6 md:w-8 text-center shrink-0">
                {item.rank}
              </span>

              {/* Mini thumbnail */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[10px] bg-gradient-to-br from-[#2a1a0e] to-[#1a1a2e] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Play className="w-3 h-3 md:w-4 md:h-4 text-white/50 ml-0.5" />
              </div>

              {/* Titre + User */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs md:text-sm truncate">{item.title}</p>
                <p className="text-white/30 text-[10px] md:text-xs">
                  {t("pages.competition.by")} <span className="text-orange-400/60">{item.user}</span>
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <span className="flex items-center gap-1 text-white/30 text-[10px] md:text-xs">
                  <Heart className="w-3 h-3 text-pink-500/40" />
                  {item.hearts}
                </span>
                <span className="flex items-center gap-1 text-white/30 text-[10px] md:text-xs">
                  <Eye className="w-3 h-3 text-blue-400/40" />
                  {item.views}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
