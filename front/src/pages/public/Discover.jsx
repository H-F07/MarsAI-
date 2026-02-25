import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Search, Heart, Eye, Play, Trophy, Grid3x3, LayoutList, MessageCircle } from "lucide-react";
import { filmsData, categories } from "../../data/films-data";

const categoryToKey = {
  "Tous": "all",
  "Sci-Fi": "scifi",
  "Art Numérique": "digitalArt",
  "Animation": "animation",
  "Expérimental": "experimental",
  "Romance": "romance",
  "Drame": "drama",
  "Comédie": "comedy",
  "Thriller": "thriller",
  "Philosophique": "philosophical",
  "Documentaire": "documentary",
};

export default function Discover() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const filteredFilms = filmsData.filter(film => {
    const matchesCategory = selectedCategory === "Tous" || film.category === selectedCategory;
    const matchesSearch =
      film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.director.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getCategoryGradient = (category) => {
    const colors = {
      "Sci-Fi": "from-purple-500/80 to-purple-700/80",
      "Art Numérique": "from-fuchsia-500/80 to-purple-600/80",
      "Animation": "from-pink-500/80 to-pink-700/80",
      "Expérimental": "from-orange-500/80 to-amber-600/80",
      "Romance": "from-pink-400/80 to-rose-600/80",
      "Drame": "from-[#51A2FF]/80 to-blue-700/80",
      "Comédie": "from-yellow-400/80 to-amber-500/80",
      "Thriller": "from-slate-500/80 to-zinc-700/80",
      "Philosophique": "from-violet-500/80 to-indigo-700/80",
      "Documentaire": "from-emerald-500/80 to-emerald-700/80",
    };
    return colors[category] || "from-[#51A2FF]/80 to-[#51A2FF]/60";
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      "Sci-Fi": "text-purple-400",
      "Art Numérique": "text-fuchsia-400",
      "Animation": "text-pink-400",
      "Expérimental": "text-orange-400",
      "Romance": "text-pink-400",
      "Drame": "text-[#51A2FF]",
      "Comédie": "text-yellow-400",
      "Thriller": "text-slate-400",
      "Philosophique": "text-violet-400",
      "Documentaire": "text-emerald-400",
    };
    return colors[category] || "text-[#51A2FF]";
  };

  return (
    <div className="min-h-screen text-foreground pb-10 pt-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto px-4 sm:px-6 space-y-6">
        {/* Title & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 uppercase">
              {t("pages.discover.title")}
            </h1>
            <p className="text-white/40 text-xs sm:text-sm font-bold uppercase tracking-wider mt-1">
              {filteredFilms.length} {t("pages.discover.worksCount").toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                viewMode === "list" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("pages.discover.search")}
            className="w-full bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-full py-3 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-[#51A2FF]/30 transition-all"
          />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-[#51A2FF] text-white shadow-lg"
                  : "bg-white/[0.03] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
              }`}
            >
              {t(`pages.discover.categories.${categoryToKey[category]}`)}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredFilms.map((film, index) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/film/${film.id}`)}
                  className="cursor-pointer group bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[14px] sm:rounded-[18px] overflow-hidden hover:border-[#51A2FF]/30 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                    <img
                      src={film.thumbnail}
                      alt={film.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Rank Badge */}
                    {film.rank && film.rank <= 50 && (
                      <span className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-sm text-[8px] sm:text-[9px] font-bold text-amber-400">
                        <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        #{film.rank}
                      </span>
                    )}

                    {/* Category Badge */}
                    <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${getCategoryGradient(film.category)}`}>
                      {t(`pages.discover.categories.${categoryToKey[film.category]}`)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-2.5 sm:p-3.5">
                    <p className="text-white font-bold text-[10px] sm:text-xs truncate uppercase tracking-tight">
                      {film.title}
                    </p>
                    <p className="text-white/30 text-[9px] sm:text-[10px] mt-0.5">
                      {t("pages.discover.by")}{" "}
                      <span className={getCategoryTextColor(film.category)}>
                        {film.directorUsername}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-white/40 text-[9px] sm:text-[10px]">
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-500" />
                        {formatNumber(film.likes)}
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                        {formatNumber(film.views)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredFilms.map((film, index) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/film/${film.id}`)}
                  className="flex gap-3 sm:gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-3 sm:p-4 hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 sm:w-24 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 relative border border-white/10 aspect-[3/4]">
                    <img
                      src={film.thumbnail}
                      alt={film.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {film.rank && (
                      <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md rounded p-0.5 border border-white/10">
                        <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <h3 className={`font-black text-sm sm:text-xl tracking-tighter uppercase group-hover:${getCategoryTextColor(film.category)} transition-colors truncate`}>
                          {film.title}
                        </h3>
                        <p className={`text-[10px] sm:text-xs ${getCategoryTextColor(film.category)} font-bold`}>
                          @{film.directorUsername}
                        </p>
                      </div>
                      <span className={`hidden sm:inline-flex shrink-0 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${getCategoryTextColor(film.category)}`}>
                        {t(`pages.discover.categories.${categoryToKey[film.category]}`)}
                      </span>
                    </div>

                    <p className="text-white/40 text-[10px] sm:text-sm line-clamp-2 leading-relaxed font-light hidden sm:block mb-2">
                      {film.description}
                    </p>

                    <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <span className="text-white font-black">{formatNumber(film.likes)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span className="text-white font-black">{formatNumber(film.views)}</span>
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-white font-black">{formatNumber(film.comments)}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredFilms.length === 0 && (
            <div className="text-center py-20 sm:py-32">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Search className="w-7 h-7 sm:w-10 sm:h-10 text-white/10" />
              </div>
              <h3 className="text-xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tighter uppercase">
                {t("pages.discover.noResults")}
              </h3>
              <p className="text-white/40 mb-6 sm:mb-10 max-w-xs mx-auto font-medium text-sm">
                {t("pages.discover.noResultsDesc")}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}
                className="bg-white text-black font-black uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 rounded-2xl hover:bg-cyan-400 transition-all text-xs sm:text-sm"
              >
                {t("pages.discover.reset")}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}