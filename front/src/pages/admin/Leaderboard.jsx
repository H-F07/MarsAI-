import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Crown, Trophy, Award, ArrowLeft, Film, Users, BarChart3, TrendingUp, Loader2, XCircle, Medal } from "lucide-react";
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
const podiumLabels = ["1er", "2ème", "3ème"];

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
    { label: "Films Classés", value: sortedFilms.length, icon: Film, color: "text-emerald-500" },
    { label: "Jurés Total", value: juryUsers.length, icon: Users, color: "text-purple-400" },
    { label: "Total Votes", value: totalVotes, icon: BarChart3, color: "text-[#51A2FF]" },
    { label: "Progression", value: `${progression}%`, icon: TrendingUp, color: "text-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/5 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retour au Dashboard</span>
          </button>

          <div className="flex items-center gap-4 mb-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none">
              Classement Officiel
            </h1>
          </div>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
            Sélection Officielle — marsAI 2026
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-[#51A2FF] animate-spin" />
              <span className="text-white/40 text-sm font-black uppercase tracking-widest">Chargement...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <XCircle className="w-8 h-8 text-red-400" />
              <p className="text-red-400 font-black uppercase tracking-widest text-sm">
                Erreur lors du chargement des données
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {statCards.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all"
                >
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">
                      {stat.label}
                    </div>
                    <div className="text-xl font-black tracking-tight">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#51A2FF] animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 font-black uppercase tracking-widest">
              Impossible de charger le classement
            </p>
          </div>
        ) : sortedFilms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Trophy className="w-16 h-16 text-white/10" />
            <p className="text-white/30 text-sm font-black uppercase tracking-widest text-center">
              Aucun film dans la sélection officielle pour le moment
            </p>
          </div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <Medal className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Podium</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {top3.map((film, index) => {
                    const Icon = podiumIcons[index];
                    const user = getUserForFilm(film.userId);
                    return (
                      <motion.div
                        key={film.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative bg-gradient-to-b ${podiumGradients[index]} border ${podiumBorders[index]} rounded-3xl p-6 md:p-8 backdrop-blur-xl overflow-hidden group hover:scale-[1.02] transition-transform`}
                      >
                        <Icon className="absolute -top-6 -right-6 w-36 h-36 text-white/[0.02] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className={`flex items-center gap-2 ${podiumText[index]}`}>
                              <Icon className="w-6 h-6" />
                              <span className="text-sm font-black uppercase tracking-widest">
                                {podiumLabels[index]}
                              </span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                              #{index + 1}
                            </span>
                          </div>

                          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-2 line-clamp-2">
                            {film.title}
                          </h3>

                          {film.country && (
                            <span className="inline-block px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">
                              {film.country}
                            </span>
                          )}

                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#51A2FF] to-purple-600 flex items-center justify-center font-black text-xs">
                              {(user?.username || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-black text-white/80">
                                {user?.username || "Réalisateur inconnu"}
                              </p>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                {new Date(film.createdAt).toLocaleDateString("fr-FR")}
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
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-[#51A2FF]" />
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Classement Complet
                </h2>
                <span className="ml-auto px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {allRanked.length} film{allRanked.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-xs font-black uppercase tracking-widest text-white/40">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Film</div>
                  <div className="col-span-3 hidden md:block">Réalisateur</div>
                  <div className="col-span-3">Date soumission</div>
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
                        transition={{ delay: index * 0.03 }}
                        className="grid grid-cols-12 gap-4 p-6 hover:bg-white/[0.02] transition-all group"
                      >
                        <div className="col-span-1 flex items-center">
                          {isTop3 ? (
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                              index === 1 ? "bg-slate-400/20 text-slate-300" :
                              "bg-orange-700/20 text-orange-500"
                            }`}>
                              {(() => {
                                const Icon = podiumIcons[index];
                                return <Icon className="w-4 h-4" />;
                              })()}
                            </div>
                          ) : (
                            <span className="text-sm font-black text-white/30 pl-2">{index + 1}</span>
                          )}
                        </div>

                        <div className="col-span-5 flex items-center gap-3">
                          <div>
                            <h3 className="font-black text-sm line-clamp-1">{film.title}</h3>
                            {film.country && (
                              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                {film.country}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-3 hidden md:flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#51A2FF] to-purple-600 flex items-center justify-center font-black text-[10px]">
                            {(user?.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-white/60 font-bold">
                            {user?.username || "—"}
                          </span>
                        </div>

                        <div className="col-span-3 flex items-center text-sm text-white/40">
                          {new Date(film.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
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
