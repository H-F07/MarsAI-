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
    <div className="min-h-screen bg-[#050505] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Retour au Dashboard
            </span>
          </button>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-2">
            Modération
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-8">
            Films en attente de validation
          </p>

          {/* Stats */}
          {isPending ? (
            <div className="flex items-center justify-center py-6 gap-3">
              <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
              <span className="text-white/40 text-sm font-black uppercase tracking-widest">
                Chargement...
              </span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-6 gap-4">
              <XCircle className="w-8 h-8 text-red-400" />
              <p className="text-red-400 font-black uppercase tracking-widest text-sm">
                Erreur lors du chargement
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  {
                    label: "Total en attente",
                    value: stats.total,
                    icon: Clock,
                    color: "text-pink-400",
                  },
                  {
                    label: "Films aujourd'hui",
                    value: stats.today,
                    icon: CalendarClock,
                    color: "text-purple-400",
                  },
                  {
                    label: "Critiques (+7j)",
                    value: stats.critical,
                    icon: AlertTriangle,
                    color: "text-red-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all"
                  >
                    <div
                      className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">
                        {stat.label}
                      </div>
                      <div className="text-xl font-black tracking-tight">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search & filters */}
              <div className="grid md:grid-cols-12 gap-4">
                <div className="md:col-span-7 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un film, réalisateur, pays..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
                <div className="md:col-span-5 flex gap-2">
                  {[
                    { id: "all", label: "Tous" },
                    { id: "recent", label: "Récents" },
                    { id: "old", label: "Anciens" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setPriority(f.id)}
                      className={`flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                        priority === f.id
                          ? "bg-white text-black border-white"
                          : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Film list */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {isPending ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 font-black uppercase tracking-widest">
              Impossible de charger les films
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-16 text-center">
            <Film className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm font-black uppercase tracking-widest">
              {films.length === 0
                ? "Aucun film en attente de modération"
                : "Aucun résultat pour cette recherche"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((film, index) => (
                <motion.div
                  key={film.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden backdrop-blur-sm"
                >
                  <Film className="absolute -top-4 -right-4 w-32 h-32 text-white/[0.02] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Film info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/20 rounded-2xl flex items-center justify-center shrink-0">
                        <Film className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-white truncate mb-1">
                          {film.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {film.User?.username || "Inconnu"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarClock className="w-3 h-3" />
                            {formatDate(film.createdAt)}
                          </span>
                          {film.country && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {film.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Age badge */}
                    <div className="shrink-0 hidden lg:block">
                      {Date.now() - new Date(film.createdAt).getTime() >
                      SEVEN_DAYS_MS ? (
                        <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                          {timeAgo(film.createdAt)}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10">
                          {timeAgo(film.createdAt)}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={isMutating}
                        onClick={() => approveMutation.mutate(film.id)}
                        className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all disabled:opacity-40 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        disabled={isMutating}
                        onClick={() => setRejectModal(film)}
                        className="px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-40 flex items-center gap-2"
                      >
                        <Ban className="w-4 h-4" />
                        Rejeter
                      </button>
                      <button
                        disabled={isMutating}
                        onClick={() => selectionMutation.mutate(film.id)}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest hover:from-pink-500/20 hover:to-purple-500/20 transition-all disabled:opacity-40 flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Sélection
                      </button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Rejeter le film
                </h2>
                <button
                  onClick={() => {
                    setRejectModal(null);
                    setRejectionReason("");
                  }}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <XIcon className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <p className="text-sm text-white/50 mb-1">
                Film :{" "}
                <span className="text-white font-bold italic">
                  "{rejectModal.title}"
                </span>
              </p>
              <p className="text-sm text-white/50 mb-6">
                Soumis par{" "}
                <span className="text-white font-bold">
                  {rejectModal.User?.username || "Inconnu"}
                </span>
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!rejectionReason.trim()) return;
                  rejectMutation.mutate({
                    id: rejectModal.id,
                    rejectionReason: rejectionReason.trim(),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-white/50 mb-2">
                    Raison du rejet
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Décrivez la raison du rejet..."
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModal(null);
                      setRejectionReason("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-white/80 font-bold uppercase text-sm hover:bg-white/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={rejectMutation.isPending || !rejectionReason.trim()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold uppercase text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirmer le rejet"
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
