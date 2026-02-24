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
  Youtube,
  Calendar,
  Globe,
  User,
  ExternalLink,
  MoreVertical,
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
  PENDING: { label: "En attente", color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20", icon: Clock },
  APPROVED: { label: "Validé", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20", icon: CheckCircle },
  REJECTED: { label: "Refusé", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/20", icon: XCircle },
  SELECTION_OFFICIELLE: { label: "Sélection", color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/20", icon: Award },
  HORS_COMPETITION: { label: "Hors compét.", color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10", borderColor: "border-[#51A2FF]/20", icon: Film },
};

const REJECTION_REASONS = [
  "Non respect du thème",
  "Problème technique (son/image)",
  "Contenu inapproprié / sensible",
  "Durée non conforme au règlement",
  "Droits d'auteur non respectés",
  "Autre motif spécifique",
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
    const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         film.User?.username?.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/10 rounded-full blur-[150px] opacity-50" />
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
                Soumissions
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Contrôle et modération des flux vidéo
              </p>
            </div>
            
            <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl overflow-x-auto no-scrollbar">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`whitespace-nowrap px-6 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === filter.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {!isPending && !isError && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {[
                { label: "Total", value: stats.total, icon: Film, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10" },
                { label: "En attente", value: stats.pending, icon: Clock, color: "text-purple-400", bgColor: "bg-purple-500/10" },
                { label: "Validés", value: stats.approved, icon: CheckCircle, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
                { label: "Refusés", value: stats.rejected, icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/10" },
                { label: "Sélection", value: stats.selection, icon: Award, color: "text-pink-400", bgColor: "bg-pink-500/10" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-all"
                >
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} border border-white/5 ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
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
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#51A2FF] transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un film par titre ou identité réalisateur..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all shadow-inner"
          />
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#51A2FF] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#51A2FF]/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scan des flux en cours...</span>
          </div>
        ) : isError ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-12 text-center"
          >
            <AlertTriangle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Échec de la liaison avec la base de données</p>
            <button onClick={() => refetch()} className="mt-8 flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:shadow-xl transition-all">
              <RefreshCw className="w-4 h-4" />
              Réinitialiser la connexion
            </button>
          </motion.div>
        ) : filteredFilms.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
            <Film className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              Aucun signal vidéo détecté
            </p>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              <div className="col-span-5">Contenu Vidéo</div>
              <div className="col-span-2 hidden md:block">Réalisateur</div>
              <div className="col-span-2">Statut Flux</div>
              <div className="col-span-3 text-right">Actions Système</div>
            </div>

            <div className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredFilms.map((film, index) => {
                  const badge = STATUS_BADGES[film.status] || STATUS_BADGES.PENDING;
                  const BadgeIcon = badge.icon;
                  return (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(index * 0.02, 0.2) }}
                      className="grid grid-cols-12 gap-4 px-8 py-6 hover:bg-white/[0.03] transition-all items-center group"
                    >
                      <div className="col-span-5 flex items-center gap-5 min-w-0">
                        <div className="relative shrink-0 group/thumb">
                          <div className="w-20 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[#51A2FF]/30 transition-all">
                            {film.youtubeId ? (
                              <img 
                                src={`https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg`} 
                                alt="" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                              />
                            ) : (
                              <Film className="w-5 h-5 text-white/20" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40">
                              <Youtube className="w-6 h-6 text-red-500" />
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-sm text-white group-hover:text-[#51A2FF] transition-colors truncate">{film.title}</h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                              <Globe className="w-3 h-3" />
                              {film.country || "Int."}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                              <Calendar className="w-3 h-3" />
                              {new Date(film.createdAt).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 hidden md:flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-white/40" />
                        </div>
                        <span className="text-sm text-white/50 truncate group-hover:text-white/80 transition-colors">
                          {film.User?.username || "Anonyme"}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${badge.bgColor} ${badge.borderColor} ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <a 
                          href={`https://youtube.com/watch?v=${film.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center transition-all group/link"
                          title="Visionner"
                        >
                          <ExternalLink className="w-4 h-4 text-white/20 group-hover/link:text-white transition-colors" />
                        </a>
                        
                        {film.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => setModal({ film, action: "APPROVED" })}
                              className="px-4 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="hidden xl:inline">Approuver</span>
                            </button>
                            <button
                              onClick={() => setModal({ film, action: "REJECTED" })}
                              className="px-4 h-10 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              <span className="hidden xl:inline">Refuser</span>
                            </button>
                          </>
                        )}
                        
                        <button className="w-10 h-10 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center transition-all">
                          <MoreVertical className="w-4 h-4 text-white/20" />
                        </button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 md:p-10 max-w-md w-full relative shadow-2xl overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${modal.action === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              
              <button
                onClick={() => { setModal(null); setRejectionReason(REJECTION_REASONS[0]); }}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>

              <div className="flex flex-col items-center text-center mb-10">
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 border shadow-2xl ${
                  modal.action === "APPROVED" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {modal.action === "APPROVED" ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2">
                  {modal.action === "APPROVED" ? "Validation Flux" : "Interruption Flux"}
                </h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Protocole de modération marsAI</p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Film sélectionné</p>
                <p className="text-white font-bold italic truncate">"{modal.film.title}"</p>
              </div>

              {modal.action === "REJECTED" && (
                <div className="space-y-4 mb-10">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                    Motif de l'interruption
                  </label>
                  <div className="space-y-2">
                    {REJECTION_REASONS.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setRejectionReason(reason)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          rejectionReason === reason
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-white/[0.02] border-white/5 text-white/30 hover:bg-white/5"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${rejectionReason === reason ? 'border-red-500' : 'border-white/10'}`}>
                          {rejectionReason === reason && <div className="w-2 h-2 rounded-full bg-red-500" />}
                        </div>
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modal.action === "APPROVED" && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 mb-10">
                  <p className="text-emerald-400/70 text-sm leading-relaxed text-center font-medium">
                    L'approbation rendra ce contenu immédiatement visible sur le flux public du festival.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setModal(null); setRejectionReason(REJECTION_REASONS[0]); }}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={mutation.isPending}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-xl ${
                    modal.action === "APPROVED"
                      ? "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "bg-red-600 text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  }`}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirmer"
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
