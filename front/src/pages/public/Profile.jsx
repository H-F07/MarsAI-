import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  Settings, Share2, Heart, Eye, Film as FilmIcon,
  Trophy, Calendar, MapPin, MoreHorizontal,
  Grid3x3, Bookmark, Check, Pencil // AJOUT DE PENCIL ICI
} from "lucide-react";
import { filmsData } from "../../data/films-data";

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("films");
  const [isFollowing, setIsFollowing] = useState(false);

  // Données utilisateur simulées (à remplacer par l'API)
  const userData = {
    name: "Alex Chen",
    username: "alexchen",
    bio: t("pages.profile.bio"),
    country: t("pages.profile.location"),
    joinDate: t("pages.profile.since"),
    avatar: "AC",
    followers: 12400,
    following: 342,
    totalLikes: 45800,
    totalViews: 287500,
    verified: true,
  };

  const userFilms = filmsData.filter((film) => film.director === userData.name);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const tabs = [
    { id: "films",     label: t("pages.profile.tabs.portfolio"), icon: Grid3x3 },
    { id: "favorites", label: t("pages.profile.tabs.favorites"), icon: Bookmark },
    { id: "about",     label: t("pages.profile.tabs.bio"),       icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen text-foreground pb-32 -mt-[88px] md:-mt-[120px]">
      {/* ── Cover Banner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-48 md:h-72 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#030213] via-purple-900/40 to-background" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#51A2FF]/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Avatar & Actions ── */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 mb-10 relative z-10">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-[#111] p-1.5 border-4 border-[#050505] relative overflow-hidden">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 to-purple-700 flex items-center justify-center text-4xl md:text-5xl font-black shadow-inner">
                {userData.avatar}
              </div>
            </div>
            {userData.verified && (
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-cyan-500 rounded-full p-1.5 md:p-2 border-4 border-[#050505] shadow-xl">
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
              </div>
            )}
          </motion.div>

          {/* Nom + boutons */}
          <div className="flex-1 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 w-full pb-2">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase">
                {userData.name}
              </h1>
              <p className="text-cyan-400 font-bold text-base sm:text-lg mt-1">
                @{userData.username}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 sm:gap-3"
            >
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  isFollowing
                    ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    : "bg-white text-black hover:bg-cyan-400 shadow-xl shadow-white/5"
                }`}
              >
                {isFollowing ? "Abonné" : t("pages.profile.follow")}
              </button>

              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-cyan-400" />
              </button>

              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Bio & Audience ── */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
              {t("pages.profile.biography")}
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed font-light mb-6 italic">
              {userData.bio}
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm font-black uppercase tracking-widest text-white/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-500" />
                {userData.country}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                {userData.joinDate}
              </div>
            </div>
          </div>

          {/* Audience card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6">
              {t("pages.profile.audience")}
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tighter mb-1">
                  {formatNumber(userData.followers)}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {t("pages.profile.subscribers")}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tighter mb-1">
                  {formatNumber(userData.following)}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {t("pages.profile.subscriptions")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 lg:mb-16">
          {[
            {
              icon: FilmIcon,
              value: userFilms.length,
              label: t("pages.profile.stats.films"),
              gradient: "from-cyan-600/20 to-cyan-900/10",
              border: "border-cyan-500/20",
              text: "text-cyan-400",
            },
            {
              icon: Heart,
              value: formatNumber(userData.totalLikes),
              label: t("pages.profile.stats.applause"),
              gradient: "from-pink-600/20 to-pink-900/10",
              border: "border-pink-500/20",
              text: "text-pink-400",
            },
            {
              icon: Eye,
              value: formatNumber(userData.totalViews),
              label: t("pages.profile.stats.views"),
              gradient: "from-purple-600/20 to-purple-900/10",
              border: "border-purple-500/20",
              text: "text-purple-400",
            },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`rounded-[2rem] p-6 sm:p-8 border ${stat.border} bg-gradient-to-br ${stat.gradient} backdrop-blur-xl relative overflow-hidden group`}
            >
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-4 ${stat.text}`} />
              <div className="text-3xl sm:text-4xl font-black tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="mb-10 sm:mb-12">
          <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/10 backdrop-blur-md max-w-xs sm:max-w-md mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-black shadow-xl"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="min-h-[400px] pb-8">
          {/* Portfolio */}
          {activeTab === "films" && userFilms.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {userFilms.map((film, idx) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="aspect-[4/5] relative group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl cursor-pointer"
                >
                  <img
                    src={film.thumbnail}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Bouton d'édition rond dégradé en haut à gauche - AVEC CRAYON */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editor-studio/${film.id}`);
                      }}
                      className="absolute top-4 left-4 w-11 h-11 rounded-full bg-gradient-to-br from-[#A855F7] to-[#51A2FF] flex items-center justify-center text-white shadow-2xl transform scale-90 group-hover:scale-100 hover:scale-110 transition-all duration-300 z-10"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Rank badge */}
                  {film.rank && film.rank <= 10 && (
                    <div className="absolute top-3 right-3 bg-pink-500 rounded-xl px-2 py-1 text-[8px] sm:text-[9px] font-black text-white flex items-center gap-1 shadow-xl">
                      <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      #{film.rank}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Portfolio vide */}
          {activeTab === "films" && userFilms.length === 0 && (
            <div className="text-center py-20 sm:py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <FilmIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tighter uppercase">
                {t("pages.profile.noSubmissions")}
              </h3>
              <button
                onClick={() => navigate("/soumission")}
                className="bg-white text-black font-black uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 rounded-2xl hover:bg-cyan-400 transition-all shadow-xl text-xs"
              >
                Créer un film
              </button>
            </div>
          )}

          {/* Favoris */}
          {activeTab === "favorites" && (
            <div className="text-center py-24 sm:py-32 opacity-40">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-pink-500" strokeWidth={1} />
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Collection vide</h3>
              <p className="text-sm font-medium mt-2">Aimez des films pour les retrouver ici.</p>
            </div>
          )}

          {/* Bio détaillée */}
          {activeTab === "about" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 md:p-16">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 sm:mb-8">
                      Informations
                    </h3>
                    <div className="space-y-5 sm:space-y-6">
                      {[
                        { label: "Localisation", value: userData.country },
                        { label: "Membre depuis", value: userData.joinDate },
                        { label: "Statut", value: userData.verified ? "Vérifié ✓" : "Standard" },
                        { label: "Films publiés", value: userFilms.length },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col border-b border-white/5 pb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">
                            {item.label}
                          </span>
                          <span className="font-bold text-base sm:text-lg">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 sm:mb-8">
                      Bio Détaillée
                    </h3>
                    <p className="text-white/60 leading-relaxed font-light text-base sm:text-lg">
                      {userData.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}