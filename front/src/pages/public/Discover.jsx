import { useTranslation } from "react-i18next";
import { Search, Heart, Eye, Trophy, LayoutGrid, List, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const categoryKeys = [
  "all", "scifi", "digitalArt", "animation", "experimental",
  "romance", "drama", "comedy", "thriller", "philosophical"
];

const categoryColors = {
  scifi: "from-blue-500/80 to-cyan-500/80",
  digitalArt: "from-purple-500/80 to-fuchsia-500/80",
  animation: "from-green-500/80 to-emerald-500/80",
  experimental: "from-orange-500/80 to-amber-500/80",
  romance: "from-pink-500/80 to-rose-500/80",
  drama: "from-red-500/80 to-orange-500/80",
  comedy: "from-yellow-500/80 to-amber-500/80",
  thriller: "from-slate-500/80 to-zinc-500/80",
  philosophical: "from-violet-500/80 to-indigo-500/80",
};

const worksData = [
  { id: 1, title: "NEURAL ODYSSEY", user: "@emmar", category: "digitalArt", rank: 3, hearts: "15.7K", views: "127.5K" },
  { id: 2, title: "LE DERNIER HUMAIN", user: "@alexchen", category: "scifi", rank: 1, hearts: "21.3K", views: "189.2K" },
  { id: 3, title: "ALGORITHMES D'AMOUR", user: "@mariel", category: "romance", rank: 2, hearts: "18.5K", views: "156.8K" },
  { id: 4, title: "L'ÉVEIL NUMÉRIQUE", user: "@sophiem", category: "philosophical", rank: null, hearts: "12.4K", views: "98.7K" },
  { id: 5, title: "RÊVES SYNTHÉTIQUES", user: "@thomast", category: "experimental", rank: 15, hearts: "8.9K", views: "76.5K" },
  { id: 6, title: "PIXEL PERFECT", user: "@lucasb", category: "animation", rank: 12, hearts: "9.5K", views: "82.3K" },
  { id: 7, title: "MÉMOIRES VIRTUELLES", user: "@yukitan", category: "drama", rank: 4, hearts: "16.8K", views: "142.3K" },
  { id: 8, title: "CODE QUANTIQUE", user: "@jameswil", category: "thriller", rank: 5, hearts: "24.6K", views: "203.4K" },
];

export default function Discover() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = worksData.filter((w) => {
    const matchCategory = activeCategory === "all" || w.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 pb-40 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("pages.discover.title").toUpperCase()}
          </h1>
          <p className="text-white/40 text-xs sm:text-sm font-bold uppercase tracking-wider mt-1">
            {filtered.length} {t("pages.discover.worksCount").toUpperCase()}
          </p>
        </div>
        {/* View toggle - desktop only */}
        <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("pages.discover.search")}
            className="w-full bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-full py-3 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#51A2FF]/30 transition-all"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categoryKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === key
                ? "bg-gradient-to-r from-[#A855F7] to-[#51A2FF] text-white shadow-lg"
                : "bg-white/[0.03] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
            }`}
          >
            {t(`pages.discover.categories.${key}`)}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {filtered.map((work, i) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
            className="bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[14px] sm:rounded-[18px] overflow-hidden group cursor-pointer hover:border-[#51A2FF]/30 transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-[#1a103d] via-[#0f1a3a] to-[#0a0a1a] flex items-center justify-center">
              {/* Category badge */}
              <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${categoryColors[work.category] || "from-gray-500/80 to-gray-600/80"}`}>
                {t(`pages.discover.categories.${work.category}`)}
              </span>

              {/* Rank badge */}
              {work.rank && (
                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-sm text-[8px] sm:text-[9px] font-bold text-amber-400">
                  <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  #{work.rank}
                </span>
              )}

              {/* Play button */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
              </div>
            </div>

            {/* Info */}
            <div className="p-2.5 sm:p-3.5">
              <p className="text-white font-bold text-[10px] sm:text-xs truncate">{work.title}</p>
              <p className="text-white/30 text-[9px] sm:text-[10px] mt-0.5">
                {t("pages.discover.by")} <span className="text-[#51A2FF]/60">{work.user}</span>
              </p>
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-white/30 text-[9px] sm:text-[10px]">
                <span className="flex items-center gap-0.5 sm:gap-1">
                  <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-500/50" />
                  {work.hearts}
                </span>
                <span className="flex items-center gap-0.5 sm:gap-1">
                  <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400/50" />
                  {work.views}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
