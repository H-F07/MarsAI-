import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ChevronLeft,
  Loader2,
  XCircle,
  CheckCircle,
  Film,
  Clock,
  AlertTriangle,
  Award,
  RefreshCw,
  X,
} from "lucide-react";
import { getFilms, updateFilmStatus } from "../../api/films.js";

const STATUS_FILTERS = [
  { id: "ALL", label: "Tous" },
  { id: "PENDING", label: "En attente" },
  { id: "APPROVED", label: "Validés" },
  { id: "REJECTED", label: "Refusés" },
  { id: "SELECTION_OFFICIELLE", label: "Sélection" },
];

const STATUS_BADGES = {
  PENDING: { label: "En attente", color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" },
  APPROVED: { label: "Validé", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  REJECTED: { label: "Refusé", color: "bg-red-500/20 border-red-500/30 text-red-400" },
  SELECTION_OFFICIELLE: { label: "Sélection", color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
  HORS_COMPETITION: { label: "Hors compét.", color: "bg-[#51A2FF]/20 border-[#51A2FF]/30 text-[#51A2FF]" },
};

const REJECTION_REASONS = [
  "Non respect thème",
  "Problème technique",
  "Contenu inapproprié",
  "Durée non conforme",
  "Autre",
];

export default function Submissions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modal, setModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);

  const {
    data: filmsData,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["films"],
    queryFn: () => getFilms({ limit: 1000 }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateFilmStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] });
      setModal(null);
      setRejectionReason(REJECTION_REASONS[0]);
    },
  });

  const films = filmsData?.data?.films ?? [];

  const filteredFilms = films.filter((film) => {
    const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || film.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: films.length,
    pending: films.filter((f) => f.status === "PENDING").length,
    approved: films.filter((f) => f.status === "APPROVED").length,
    rejected: films.filter((f) => f.status === "REJECTED").length,
    selection: films.filter((f) => f.status === "SELECTION_OFFICIELLE").length,
  };

  const handleConfirmAction = () => {
    if (!modal) return;
    const payload = { status: modal.action };
    if (modal.action === "REJECTED") {
      payload.rejectionReason = rejectionReason;
    }
    mutation.mutate({ id: modal.film.id, payload });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/5 rounded-full blur-[150px]" />
      </div>

      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Retour au Dashboard</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-2">
            Gestion des Soumissions
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-8">
            Modération des films soumis
          </p>

          {isPending ? (
            <div className="flex items-center justify-center py-6 gap-3">
              <Loader2 className="w-6 h-6 text-[#51A2FF] animate-spin" />
              <span className="text-white/40 text-sm font-black uppercase tracking-widest">Chargement...</span>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {[
                  { label: "Total", value: stats.total, icon: Film, color: "text-[#51A2FF]" },
                  { label: "En attente", value: stats.pending, icon: Clock, color: "text-yellow-400" },
                  { label: "Validés", value: stats.approved, icon: CheckCircle, color: "text-emerald-400" },
                  { label: "Refusés", value: stats.rejected, icon: XCircle, color: "text-red-400" },
                  { label: "Sélection", value: stats.selection, icon: Award, color: "text-purple-400" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-all"
                  >
                    <div className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">
                        {stat.label}
                      </div>
                      <div className="text-lg font-black tracking-tight">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-12 gap-4">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un film..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#51A2FF]/50 transition-all"
                  />
                </div>

                <div className="md:col-span-7 flex gap-2 flex-wrap">
                  {STATUS_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                        statusFilter === filter.id
                          ? "bg-white text-black border-white"
                          : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {isPending ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#51A2FF] animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 font-black uppercase tracking-widest text-sm">
              Impossible de charger les soumissions
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#51A2FF] to-purple-600 text-white font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-[#51A2FF]/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        ) : filteredFilms.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-16 text-center">
            <Film className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm font-black uppercase tracking-widest">
              Aucun film trouvé
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-xs font-black uppercase tracking-widest text-white/40">
              <div className="col-span-4">Film</div>
              <div className="col-span-2 hidden md:block">Réalisateur</div>
              <div className="col-span-2 hidden md:block">Pays</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredFilms.map((film, index) => {
                  const badge = STATUS_BADGES[film.status] || STATUS_BADGES.PENDING;
                  return (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className="grid grid-cols-12 gap-4 p-6 hover:bg-white/[0.02] transition-all items-center"
                    >
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#51A2FF] to-purple-600 flex items-center justify-center shrink-0">
                          <Film className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-sm truncate">{film.title}</h3>
                          <p className="text-[10px] text-white/30 truncate">
                            {film.youtubeId || "—"} · {new Date(film.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 hidden md:flex items-center text-sm text-white/60">
                        {film.User?.username || "—"}
                      </div>

                      <div className="col-span-2 hidden md:flex items-center text-sm text-white/60">
                        {film.country || "—"}
                      </div>

                      <div className="col-span-2 flex items-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-xl ${badge.color} border text-[10px] font-black uppercase tracking-widest`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {film.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => setModal({ film, action: "APPROVED" })}
                              className="w-8 h-8 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl flex items-center justify-center transition-all"
                              title="Approuver"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </button>
                            <button
                              onClick={() => setModal({ film, action: "REJECTED" })}
                              className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl flex items-center justify-center transition-all"
                              title="Refuser"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => { setModal(null); setRejectionReason(REJECTION_REASONS[0]); }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                {modal.action === "APPROVED" ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    {modal.action === "APPROVED" ? "Approuver le film" : "Refuser le film"}
                  </h2>
                  <p className="text-white/40 text-xs font-bold mt-0.5 truncate max-w-[280px]">
                    {modal.film.title}
                  </p>
                </div>
              </div>

              {modal.action === "REJECTED" && (
                <div className="mb-6">
                  <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                    Motif du refus
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
                  >
                    {REJECTION_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modal.action === "APPROVED" && (
                <p className="text-white/50 text-sm mb-6">
                  Ce film sera marqué comme approuvé et visible publiquement.
                </p>
              )}

              {mutation.isError && (
                <p className="text-sm text-red-400 mb-4">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setModal(null); setRejectionReason(REJECTION_REASONS[0]); }}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-white/80 font-bold uppercase text-sm hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={mutation.isPending}
                  className={`flex-1 py-3 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                    modal.action === "APPROVED"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-xl hover:shadow-emerald-500/20"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl hover:shadow-red-500/20"
                  }`}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : modal.action === "APPROVED" ? (
                    "Approuver"
                  ) : (
                    "Refuser"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
