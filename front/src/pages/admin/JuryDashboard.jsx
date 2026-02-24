import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  CheckCircle, 
  Clock, 
  Play, 
  BarChart3, 
  Loader2, 
  XCircle, 
  Zap, 
  Filter, 
  ChevronRight, 
  Star,
  Globe,
  Calendar,
  Award
} from "lucide-react";
import { getSelectionOfficielle } from "../../api/films.js";

export default function JuryDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const { data, isPending, isError } = useQuery({
    queryKey: ["selection-officielle"],
    queryFn: getSelectionOfficielle,
  });

  const films = data?.data ?? [];

  const finalistsFilms = useMemo(() => {
    return films.map((film) => ({
      ...film,
      hasVoted: false,
      myRating: undefined,
    }));
  }, [films]);

  const evaluatedCount = finalistsFilms.filter((f) => f.hasVoted).length;
  const totalCount = finalistsFilms.length;
  const progressPercent = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;

  const filteredFilms = useMemo(() => {
    let result = [...finalistsFilms];

    if (searchQuery) {
      result = result.filter((f) =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === "evaluated") {
      result = result.filter((f) => f.hasVoted);
    } else if (filterStatus === "pending") {
      result = result.filter((f) => !f.hasVoted);
    }

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [finalistsFilms, searchQuery, filterStatus, sortBy]);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/10 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="sticky top-0 z-40 bg-[#020202]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/[0.03] backdrop-blur-xl border border-purple-500/20 rounded-[24px] flex items-center justify-center shadow-2xl shadow-purple-500/10">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-2">
                  Espace Jury
                </h1>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                  Protocole d'évaluation des finalistes
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Session d'expertise active</span>
            </div>
          </div>

          {!isPending && !isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1">Progression Personnelle</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                      Analyse de <span className="text-purple-400">{evaluatedCount}</span> sur <span className="text-white">{totalCount}</span> unités vidéo
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-white leading-none">{progressPercent}%</div>
                    <p className="text-[9px] text-purple-400/60 font-black uppercase tracking-[0.2em] mt-1">Status : {progressPercent === 100 ? 'Complet' : 'En cours'}</p>
                  </div>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-purple-600 via-[#51A2FF] to-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre ou identité visuelle..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
            />
          </div>
          
          <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "Tous", count: totalCount },
              { id: "pending", label: "À évaluer", count: totalCount - evaluatedCount },
              { id: "evaluated", label: "Évalués", count: evaluatedCount },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === filter.id
                    ? "bg-white text-black shadow-lg"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {filter.label} <span className="ml-2 opacity-40">[{filter.count}]</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-48 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer transition-all"
            >
              <option value="title" className="bg-[#0a0a0a]">Trier par Titre</option>
              <option value="date" className="bg-[#0a0a0a]">Trier par Date</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
          </div>
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scan de la sélection...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Échec de liaison avec la sélection</p>
          </div>
        ) : filteredFilms.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
            <Star className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              Aucun profil vidéo dans cette catégorie
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFilms.map((film, index) => (
                <motion.div
                  key={film.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all backdrop-blur-sm"
                >
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-[#51A2FF]/10 flex items-center justify-center group/thumb">
                    {film.youtubeId ? (
                      <img 
                        src={`https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg`} 
                        alt="" 
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <Play className="w-10 h-10 text-white/10" />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-[2px]">
                      <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 fill-black ml-1" />
                      </div>
                    </div>

                    <div
                      className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl backdrop-blur-md border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                        film.hasVoted
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                      }`}
                    >
                      {film.hasVoted ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Analysé
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          En attente
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="font-black text-lg text-white mb-4 line-clamp-1 tracking-tight uppercase group-hover:text-purple-400 transition-colors">
                      {film.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-white/20" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{film.country || "International"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-white/20" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{film.duration || "0"}s</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {film.aiIdentity && Object.entries(film.aiIdentity)
                          .filter(([, val]) => val)
                          .slice(0, 2)
                          .map(([key, val]) => (
                            <span
                              key={key}
                              className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-[8px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors"
                            >
                              {val}
                            </span>
                          ))
                        }
                      </div>

                      <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                        <span>Lancer l'expertise</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
