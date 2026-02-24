import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Search,
  Loader2,
  XCircle,
  Clock,
  CalendarClock,
  AlertTriangle,
  CheckCircle,
  X as XIcon,
  Ban,
  Star,
  Film,
  Globe,
  User,
  Zap,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { getFilms, updateFilmStatus } from "../../api/films.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}j`;
}

export default function Moderation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    data: filmsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["films", "pending"],
    queryFn: () => getFilms({ status: "PENDING" }),
  });

  const films = filmsData?.data?.films ?? [];

  const approveMutation = useMutation({
    mutationFn: (id) => updateFilmStatus(id, { status: "APPROVED" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["films"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, rejectionReason: reason }) =>
      updateFilmStatus(id, { status: "REJECTED", rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] });
      setRejectModal(null);
      setRejectionReason("");
    },
  });

  const selectionMutation = useMutation({
    mutationFn: (id) =>
      updateFilmStatus(id, { status: "SELECTION_OFFICIELLE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["films"] }),
  });

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: films.length,
      today: films.filter((f) => isToday(f.createdAt)).length,
      critical: films.filter(
        (f) => now - new Date(f.createdAt).getTime() > SEVEN_DAYS_MS
      ).length,
    };
  }, [films]);

  const filtered = useMemo(() => {
    const now = Date.now();
    return films
      .filter((f) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          f.title?.toLowerCase().includes(q) ||
          f.User?.username?.toLowerCase().includes(q) ||
          f.country?.toLowerCase().includes(q)
        );
      })
      .filter((f) => {
        if (priority === "recent")
          return now - new Date(f.createdAt).getTime() <= SEVEN_DAYS_MS;
        if (priority === "old")
          return now - new Date(f.createdAt).getTime() > SEVEN_DAYS_MS;
        return true;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [films, search, priority]);

  const isMutating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    selectionMutation.isPending;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] opacity-50" />
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
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-3">
                Modération
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Validation prioritaire des flux entrants
              </p>
            </div>
            
            <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "Tous" },
                { id: "recent", label: "Récents" },
                { id: "old", label: "Anciens" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPriority(f.id)}
                  className={`whitespace-nowrap px-6 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    priority === f.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {!isPending && !isError && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "En attente", value: stats.total, icon: Clock, color: "text-pink-400", bgColor: "bg-pink-400/10" },
                { label: "Aujourd'hui", value: stats.today, icon: CalendarClock, color: "text-purple-400", bgColor: "bg-purple-400/10" },
                { label: "Critiques (+7j)", value: stats.critical, icon: AlertTriangle, color: "text-red-400", bgColor: "bg-red-400/10" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-all"
                >
                  <div className={`p-3 rounded-xl ${stat.bgColor} border border-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">
                      {stat.label}
                    </div>
                    <div className="text-xl font-black tracking-tight">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="mb-10 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-pink-500 transition-colors pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, identité ou localisation..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
          />
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-pink-500/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scan des priorités...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Échec de synchronisation</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
            <Film className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              Aucun flux en attente de traitement
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((film, index) => (
                <motion.div
                  key={film.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Thumbnail & Info */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="relative shrink-0 group/thumb">
                        <div className="w-32 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-pink-500/30 transition-all">
                          {film.youtubeId ? (
                            <img 
                              src={`https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg`} 
                              alt="" 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                            />
                          ) : (
                            <Film className="w-8 h-8 text-white/20" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40">
                            <Youtube className="w-8 h-8 text-red-500" />
                          </div>
                        </div>
                        
                        {/* Priority indicator */}
                        {Date.now() - new Date(film.createdAt).getTime() > SEVEN_DAYS_MS && (
                          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40 animate-bounce">
                            <AlertTriangle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-white group-hover:text-pink-400 transition-colors truncate mb-2 uppercase tracking-tight">
                          {film.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <User className="w-3 h-3 text-pink-400" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{film.User?.username || "Inconnu"}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <Globe className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{film.country || "International"}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <CalendarClock className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{formatDate(film.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Age badge & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Délai d'attente</span>
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border ${
                          Date.now() - new Date(film.createdAt).getTime() > SEVEN_DAYS_MS
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}>
                          {timeAgo(film.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <a 
                          href={`https://youtube.com/watch?v=${film.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center transition-all group/link"
                        >
                          <ExternalLink className="w-5 h-5 text-white/20 group-hover/link:text-white transition-colors" />
                        </a>
                        
                        <div className="w-px h-8 bg-white/5 mx-1" />

                        <button
                          disabled={isMutating}
                          onClick={() => approveMutation.mutate(film.id)}
                          className="h-12 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-40 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Approuver</span>
                        </button>
                        
                        <button
                          disabled={isMutating}
                          onClick={() => setRejectModal(film)}
                          className="h-12 px-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-40 flex items-center gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          <span className="hidden sm:inline">Rejeter</span>
                        </button>
                        
                        <button
                          disabled={isMutating}
                          onClick={() => selectionMutation.mutate(film.id)}
                          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest hover:from-pink-500/20 hover:to-purple-500/20 transition-all disabled:opacity-40 flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          <span className="hidden sm:inline">Sélection</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Reject modal */}
      <AnimatePresence>
        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 md:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    Interruption
                  </h2>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Protocole de rejet marsAI</p>
                </div>
                <button
                  onClick={() => {
                    setRejectModal(null);
                    setRejectionReason("");
                  }}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <XIcon className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Film concerné</p>
                <p className="text-white font-bold italic truncate">"{rejectModal.title}"</p>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Par {rejectModal.User?.username || "Inconnu"}</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!rejectionReason.trim()) return;
                  rejectMutation.mutate({
                    id: rejectModal.id,
                    rejectionReason: rejectionReason.trim(),
                  });
                }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                    Justification du rejet
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Précisez les motifs de non-conformité..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModal(null);
                      setRejectionReason("");
                    }}
                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={rejectMutation.isPending || !rejectionReason.trim()}
                    className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirmer"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
