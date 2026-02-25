import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { TrendingUp, Eye, Heart, Crown, ChevronRight } from "lucide-react";
import { filmsData } from "../../data/films-data";

export default function Competition() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const topFilms = [...filmsData]
    .filter((film) => film.rank)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, 50);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen text-foreground pb-32 selection:bg-purple-500/30">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-8 md:pt-16 pb-16 px-6 overflow-hidden">
        {/* Ambiance lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-[#51A2FF]/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />
            </span>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-white/60">
              {t("pages.competition.live")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-9xl font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[0.9]"
          >
            {t("pages.competition.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4"
          >
            {t("pages.competition.subtitle")}
          </motion.p>
        </div>
      </div>

      {/* --- PODIUM SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-6 lg:gap-8">
          {/* Rank 2 */}
          <div className="order-2 lg:order-1 w-full flex justify-center">
            <PodiumCard
              film={topFilms[1]}
              rank={2}
              color="silver"
              delay={0.2}
              onClick={() => navigate(`/film/${topFilms[1]?.id}`)}
              formatNumber={formatNumber}
            />
          </div>

          {/* Rank 1 — Winner */}
          <div className="order-1 lg:order-2 w-full flex justify-center">
            <PodiumCard
              film={topFilms[0]}
              rank={1}
              color="gold"
              delay={0.1}
              isWinner
              onClick={() => navigate(`/film/${topFilms[0]?.id}`)}
              formatNumber={formatNumber}
            />
          </div>

          {/* Rank 3 */}
          <div className="order-3 lg:order-3 w-full flex justify-center">
            <PodiumCard
              film={topFilms[2]}
              rank={3}
              color="bronze"
              delay={0.3}
              onClick={() => navigate(`/film/${topFilms[2]?.id}`)}
              formatNumber={formatNumber}
            />
          </div>
        </div>
      </div>

      {/* --- LIST SECTION --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-[16px] border border-white/10">
              <TrendingUp className="text-[#51A2FF] w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter">
              {t("pages.competition.general")}
            </h2>
          </div>
          <div className="hidden sm:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <span>{t("pages.competition.performance")}</span>
          </div>
        </div>

        {/* Rows 4–50 */}
        <div className="grid gap-3 sm:gap-4">
          {topFilms.slice(3).map((film, index) => (
            <RankRow
              key={film.id}
              film={film}
              rank={index + 4}
              onClick={() => navigate(`/film/${film.id}`)}
              formatNumber={formatNumber}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Podium Card ───────────────────────────────────────────── */
function PodiumCard({ film, rank, color, delay, isWinner, onClick, formatNumber }) {
  const themes = {
    gold: "from-[#51A2FF] via-purple-500 to-pink-500",
    silver: "from-white/40 via-white/20 to-white/10",
    bronze: "from-pink-500/40 via-pink-600/20 to-pink-700/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      onClick={onClick}
      className={`relative cursor-pointer group w-full ${
        isWinner ? "max-w-[340px] sm:max-w-[380px] z-20" : "max-w-[260px] sm:max-w-[300px] z-10"
      }`}
    >
      {isWinner && (
        <div className="absolute -inset-8 bg-purple-500/10 blur-[80px] rounded-full animate-pulse" />
      )}

      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:-translate-y-2 group-hover:bg-white/[0.05] shadow-2xl">
        {/* Image */}
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={film?.thumbnail}
            alt={film?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Rank badge */}
          <div
            className={`absolute top-4 left-4 sm:top-6 sm:left-6 w-11 h-11 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] bg-gradient-to-br ${themes[color]} flex items-center justify-center shadow-2xl border border-white/20 transform -rotate-6 group-hover:rotate-0 transition-transform`}
          >
            <span className="text-2xl sm:text-3xl font-black text-white">{rank}</span>
          </div>

          {isWinner && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 backdrop-blur-xl p-2 sm:p-3 rounded-[12px] sm:rounded-[16px] border border-white/20 shadow-2xl">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 fill-purple-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8">
          <h3
            className={`font-black uppercase tracking-tighter leading-none mb-1 truncate ${
              isWinner ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {film?.title}
          </h3>
          <p className="text-[#51A2FF] text-xs sm:text-sm font-black tracking-tight mb-4 sm:mb-6">
            @{film?.directorUsername}
          </p>

          <div className="flex items-center gap-4 sm:gap-6 border-t border-white/5 pt-4 sm:pt-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500 fill-pink-500/20" />
              <span className="text-xs sm:text-sm font-black tracking-tight">
                {formatNumber(film?.likes)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#51A2FF]" />
              <span className="text-xs sm:text-sm font-black tracking-tight">
                {formatNumber(film?.views)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Rank Row ──────────────────────────────────────────────── */
function RankRow({ film, rank, onClick, formatNumber, t }) {
  const isTop10 = rank <= 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group flex items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-[18px] sm:rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#51A2FF]/30 transition-all duration-300 cursor-pointer backdrop-blur-sm"
    >
      {/* Rank number */}
      <div
        className={`w-8 sm:w-10 text-center font-black text-base sm:text-lg shrink-0 transition-colors ${
          isTop10
            ? "text-[#51A2FF] group-hover:text-white"
            : "text-white/20 group-hover:text-[#51A2FF]"
        }`}
      >
        {rank}
      </div>

      {/* Thumbnail */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[12px] sm:rounded-[16px] overflow-hidden flex-shrink-0 border border-white/10 shadow-xl">
        <img
          src={film.thumbnail}
          alt={film.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-sm sm:text-lg truncate group-hover:text-[#51A2FF] transition-colors uppercase tracking-tight leading-none mb-0.5 sm:mb-1">
          {film.title}
        </h4>
        <p className="text-[10px] sm:text-xs font-black text-white/30 uppercase tracking-[0.1em]">
          {t("pages.competition.by")} {film.directorUsername}
        </p>
      </div>

      {/* Stats — desktop only */}
      <div className="hidden md:flex items-center gap-8 lg:gap-10 px-4 lg:px-6">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-base lg:text-lg font-black tracking-tight">
              {formatNumber(film.likes)}
            </span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
          </div>
          <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.15em]">
            {t("pages.competition.applause")}
          </p>
        </div>
        <div className="text-right w-20">
          <div className="flex items-center gap-2 justify-end text-[#51A2FF]">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-base lg:text-lg font-black tracking-tight">
              {formatNumber(film.views)}
            </span>
          </div>
          <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.15em]">
            {t("pages.competition.views")}
          </p>
        </div>
      </div>

      {/* Mobile stats */}
      <div className="flex md:hidden items-center gap-3 shrink-0 text-[10px] text-white/40">
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-500" />
          <span className="font-black text-white">{formatNumber(film.likes)}</span>
        </span>
        <span className="flex items-center gap-1 text-[#51A2FF]">
          <Eye className="w-3 h-3" />
          <span className="font-black text-white">{formatNumber(film.views)}</span>
        </span>
      </div>

      {/* Arrow */}
      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-all group-hover:bg-[#51A2FF] shrink-0">
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
    </motion.div>
  );
}