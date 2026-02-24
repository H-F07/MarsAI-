import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Crown, 
  Trophy, 
  Award, 
  ChevronLeft, 
  Film, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Loader2, 
  XCircle, 
  Medal,
  Zap,
  Star,
  Globe,
  Calendar
} from "lucide-react";
import { getSelectionOfficielle } from "../../api/films.js";
import { getUsers } from "../../api/users.js";

const podiumIcons = [Crown, Trophy, Award];
const podiumGradients = [
  "from-yellow-500/20 via-amber-500/10 to-transparent",
  "from-slate-300/20 via-slate-400/10 to-transparent",
  "from-orange-700/20 via-amber-800/10 to-transparent",
];
const podiumBorders = [
  "border-yellow-500/30",
  "border-slate-400/30",
  "border-orange-700/30",
];
const podiumText = [
  "text-yellow-400",
  "text-slate-300",
  "text-orange-500",
];
const podiumLabels = ["1er Rang", "2ème Rang", "3ème Rang"];

export default function Leaderboard() {
  const navigate = useNavigate();

  const {
    data: filmsData,
    isPending: filmsPending,
    isError: filmsError,
  } = useQuery({
    queryKey: ["selection-officielle"],
    queryFn: getSelectionOfficielle,
  });

  const {
    data: usersData,
    isPending: usersPending,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const films = filmsData?.data ?? [];
  const users = usersData?.data ?? [];

  const sortedFilms = [...films].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const juryUsers = users.filter((u) => u.role === "JURY");
  const totalVotes = juryUsers.reduce((sum, u) => sum + (u.votesCompleted ?? 0), 0);
  const maxPossibleVotes = juryUsers.length * sortedFilms.length;
  const progression = maxPossibleVotes > 0 ? Math.round((totalVotes / maxPossibleVotes) * 100) : 0;

  const getUserForFilm = (userId) => users.find((u) => u.id === userId);

  const isLoading = filmsPending || usersPending;
  const isError = filmsError || usersError;

  const top3 = sortedFilms.slice(0, 3);
  const allRanked = sortedFilms;

  const statCards = [
    { label: "Films Classés", value: sortedFilms.length, icon: Film, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Jurés Actifs", value: juryUsers.length, icon: Users, color: "text-purple-400", bgColor: "bg-purple-400/10" },
    { label: "Total Votes", value: totalVotes, icon: BarChart3, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10" },
    { label: "Progression", value: `${progression}%`, icon: TrendingUp, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="sticky top-0 z-40 bg-[#020202]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all group px-3 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retour au Dashboard</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none">
                  Classement
                </h1>
              </div>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Sélection Officielle marsAI 2026
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Actualisation Temps Réel</span>
            </div>
          </div>

          {!isLoading && !isError && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {statCards.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[32px] p-5 flex items-center gap-5 group hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  <div className={`p-4 rounded-2xl ${stat.bgColor} border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#51A2FF] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#51A2FF]/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Calcul des scores...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[40px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Erreur de synchronisation du classement</p>
          </div>
        ) : sortedFilms.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
            <Trophy className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              Aucune donnée de sélection disponible
            </p>
          </div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-10 ml-2">
                  <Medal className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">Le Podium</h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {top3.map((film, index) => {
                    const Icon = podiumIcons[index];
                    const user = getUserForFilm(film.userId);
                    return (
                      <motion.div
                        key={film.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`relative bg-gradient-to-b ${podiumGradients[index]} border ${podiumBorders[index]} rounded-[40px] p-8 md:p-10 backdrop-blur-xl overflow-hidden group hover:scale-[1.02] transition-all duration-500`}
                      >
                        <Icon className="absolute -top-8 -right-8 w-48 h-48 text-white/[0.03] -rotate-12 transition-transform group-hover:rotate-0 group-hover:text-white/[0.05] duration-1000" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                            <div className={`flex items-center gap-3 ${podiumText[index]}`}>
                              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                <Icon className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-black uppercase tracking-[0.2em]">
                                {podiumLabels[index]}
                              </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              <span className="text-xs font-black text-white/40">#{index + 1}</span>
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 line-clamp-2 leading-none group-hover:text-white transition-colors">
                            {film.title}
                          </h3>

                          <div className="flex flex-wrap gap-2 mb-8">
                            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                              {film.country || "International"}
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                              {film.duration || "0"}s
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-4 pt-6 border-t border-white/5">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-lg">
                                {(user?.username || "?").charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white group-hover:text-[#51A2FF] transition-colors">
                                {user?.username || "Réalisateur"}
                              </p>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                                Soumis le {new Date(film.createdAt).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-10 ml-2">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-[#51A2FF]" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    Liste Complète
                  </h2>
                </div>
                <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                  {allRanked.length} Profils Sélectionnés
                </span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm">
                <div className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  <div className="col-span-1">Rang</div>
                  <div className="col-span-5">Contenu Vidéo</div>
                  <div className="col-span-3 hidden md:block">Réalisateur</div>
                  <div className="col-span-3 text-right">Date d'entrée</div>
                </div>

                <div className="divide-y divide-white/5">
                  {allRanked.map((film, index) => {
                    const user = getUserForFilm(film.userId);
                    const isTop3 = index < 3;
                    return (
                      <motion.div
                        key={film.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.02, 0.2) }}
                        className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-white/[0.03] transition-all items-center group"
                      >
                        <div className="col-span-1 flex items-center">
                          {isTop3 ? (
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                              index === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                              index === 1 ? "bg-slate-400/20 text-slate-300 border border-slate-400/30" :
                              "bg-orange-700/20 text-orange-500 border border-orange-700/30"
                            }`}>
                              {(() => {
                                const Icon = podiumIcons[index];
                                return <Icon className="w-5 h-5" />;
                              })()}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                              <span className="text-xs font-black text-white/30">{index + 1}</span>
                            </div>
                          )}
                        </div>

                        <div className="col-span-5 flex items-center gap-4 min-w-0">
                          <div className="w-16 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 group-hover:border-[#51A2FF]/30 transition-all">
                            {film.youtubeId ? (
                              <img 
                                src={`https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg`} 
                                alt="" 
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-4 h-4 text-white/10" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-sm text-white group-hover:text-[#51A2FF] transition-colors truncate uppercase tracking-tight">{film.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Globe className="w-3 h-3 text-white/20" />
                              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                {film.country || "International"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-3 hidden md:flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-[10px]">
                            {(user?.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-white/50 font-bold group-hover:text-white/80 transition-colors truncate">
                            {user?.username || "Anonyme"}
                          </span>
                        </div>

                        <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                          <Calendar className="w-3.5 h-3.5 text-white/20" />
                          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                            {new Date(film.createdAt).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
