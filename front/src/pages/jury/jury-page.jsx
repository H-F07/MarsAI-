import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  X, ChevronLeft, ChevronRight, Play, Pause,
  Volume2, VolumeX, Maximize, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";
import { fetchSelectionOfficielle } from "../../api/films";
import {
  fetchMyRatingForFilm,
  submitRating as apiSubmitRating,
} from "../../api/juryRating";

// Options de notation (4 étapes)
const ratingOptions = [
  { value: "TRES_BIEN", emoji: "❤️", label: "Très bien",  color: "from-pink-500 to-red-500" },
  { value: "BIEN",      emoji: "🙂", label: "Bien",       color: "from-blue-500 to-cyan-500" },
  { value: "BOF",       emoji: "😐", label: "Bof",        color: "from-gray-500 to-gray-600" },
  { value: "JAIME_PAS", emoji: "😕", label: "J'aime pas", color: "from-orange-500 to-red-600" },
];

const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const mapFilm = (film) => ({
  id: film.id,
  title: film.title,
  director: film.User?.username ?? "—",
  description: film.description,
  thumbnail: film.posterPath,
  country: film.country,
  duration: formatDuration(film.duration),
  youtubeId: film.youtubeId,
  aiTools: Object.values(film.aiIdentity || {}).filter(Boolean),
});

// Cache local (fallback si API indisponible / non connecté)
const votesCache = {};

const getVoteLocal = (filmId) => {
  const key = String(filmId);
  if (votesCache[key]) return votesCache[key];
  try {
    const raw = localStorage.getItem(`jury_vote_film_${key}`);
    if (raw) { votesCache[key] = JSON.parse(raw); return votesCache[key]; }
  } catch {}
  return null;
};

const saveVoteLocal = (filmId, score, internalComment) => {
  const key = String(filmId);
  const data = { score, internalComment };
  votesCache[key] = data;
  try { localStorage.setItem(`jury_vote_film_${key}`, JSON.stringify(data)); } catch {}
};

/**
 * Wrapper — key={filmId} force le remontage complet à chaque film
 */
export default function JuryVotePageWrapper() {
  const { filmId } = useParams();
  return <JuryVotePage key={filmId} filmId={filmId} />;
}

function JuryVotePage({ filmId }) {
  const navigate = useNavigate();

  const [films,       setFilms]       = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [rating,      setRating]      = useState(() => getVoteLocal(filmId)?.score          ?? null);
  const [comment,     setComment]     = useState(() => getVoteLocal(filmId)?.internalComment ?? "");
  const [isSubmitted, setIsSubmitted] = useState(() => !!getVoteLocal(filmId));
  const [isSaving,    setIsSaving]    = useState(false);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isMuted,     setIsMuted]     = useState(false);

  // 1. Charger la liste des films depuis l'API
  useEffect(() => {
    fetchSelectionOfficielle()
      .then(({ data }) => setFilms(data.map(mapFilm)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // 2. Synchroniser le vote depuis l'API
  useEffect(() => {
    fetchMyRatingForFilm(filmId)
      .then(({ data }) => {
        if (data.rating) {
          const { score, internalComment: apiComment } = data.rating;
          setRating(score);
          setComment(apiComment || "");
          setIsSubmitted(true);
          saveVoteLocal(filmId, score, apiComment || "");
        }
      })
      .catch(() => {});
  }, [filmId]);

  const film         = films.find((f) => f.id === parseInt(filmId));
  const currentIndex = films.findIndex((f) => f.id === parseInt(filmId));
  const hasPrevious  = currentIndex > 0;
  const hasNext      = currentIndex !== -1 && currentIndex < films.length - 1;

  const handlePrevious = () => { if (hasPrevious) navigate(`/jury/${films[currentIndex - 1].id}`); };
  const handleNext     = () => { if (hasNext)     navigate(`/jury/${films[currentIndex + 1].id}`); };
  const handleClose    = () => navigate("/jury-dashboard");

  const handleSubmit = async () => {
    if (rating === null) return;
    setIsSaving(true);
    try { await apiSubmitRating(filmId, rating, comment); } catch {}
    saveVoteLocal(filmId, rating, comment);
    setIsSubmitted(true);
    setIsSaving(false);
  };

  const handleEditVote = () => setIsSubmitted(false);

  // En-tête de navigation (partagé par les deux écrans)
  const NavHeader = () => (
    <div className="sticky top-0 z-50 bg-[#050505]/60 backdrop-blur-3xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <button onClick={handleClose} className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-4 py-2.5 rounded-[24px] transition-all">
          <X className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Retour</span>
        </button>
        {films.length > 0 && currentIndex !== -1 && (
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span className="font-black">{currentIndex + 1}</span>
            <span>/</span>
            <span>{films.length}</span>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={handlePrevious} disabled={!hasPrevious} className="w-10 h-10 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-[16px] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} disabled={!hasNext} className="w-10 h-10 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-[16px] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // ── Chargement ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#51a2ff] animate-spin" />
          <p className="text-white/40 text-sm uppercase tracking-widest font-black">Chargement...</p>
        </div>
      </div>
    );
  }

  // ── Film introuvable ─────────────────────────────────────────────────────────
  if (!film) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Film introuvable</h2>
          <button onClick={handleClose} className="bg-white text-black font-black uppercase tracking-widest py-3 px-6 rounded-2xl">
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Écran récapitulatif ──────────────────────────────────────────────────────
  if (isSubmitted) {
    const selectedOption = ratingOptions.find((o) => o.value === rating);
    return (
      <div className="min-h-screen bg-[#050505] text-white overflow-y-auto pb-20">
        <NavHeader />
        <div className="max-w-lg mx-auto px-6 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase">Vote enregistré</h2>
            <p className="text-white/40 mb-8 text-sm">{film.title}</p>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6 text-left space-y-5">
              <p className="text-xs font-black uppercase tracking-widest text-white/30">Récapitulatif</p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-white/30 w-24 shrink-0">Note</span>
                {selectedOption ? (
                  <span className={`px-4 py-2.5 rounded-xl font-black uppercase bg-gradient-to-r ${selectedOption.color} text-white flex items-center gap-2 text-sm`}>
                    <span className="text-xl">{selectedOption.emoji}</span>
                    {selectedOption.label}
                  </span>
                ) : (
                  <span className="text-white/20 italic text-sm">—</span>
                )}
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-white/30 w-24 shrink-0 pt-1">Note privée</span>
                {comment.trim() ? (
                  <p className="flex-1 text-white/70 text-sm leading-relaxed bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">{comment}</p>
                ) : (
                  <span className="text-white/20 italic text-sm pt-0.5">Aucune</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {hasNext && (
                <button onClick={handleNext} className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Film suivant →
                </button>
              )}
              <button onClick={handleClose} className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] transition-all">
                Retour au dashboard
              </button>
              <button onClick={handleEditVote} className="w-full py-3 text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors">
                ← Modifier mon vote
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Formulaire de vote ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-y-auto pb-20">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/3 rounded-full blur-[100px]" />
      </div>

      <NavHeader />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 group">
              {film.thumbnail ? (
                <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-10 h-10 text-white fill-white" /> : <Play className="w-10 h-10 text-white fill-white ml-1" />}
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-4">
                  <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/30 transition-all">
                    {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                  </button>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-blue-500 rounded-full" />
                  </div>
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/30 transition-all">
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter uppercase">{film.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-6">
                <span className="font-black text-blue-400">{film.director}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>{film.duration}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>{film.country}</span>
              </div>
              <div className="space-y-6">
                {film.description && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">Synopsis</h3>
                    <p className="text-white/70 leading-relaxed">{film.description}</p>
                  </div>
                )}
                {film.aiTools.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">Outils IA Utilisés</h3>
                    <div className="flex flex-wrap gap-2">
                      {film.aiTools.map((tool) => (
                        <span key={tool} className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm font-bold text-white/60 uppercase tracking-wider">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Colonne droite — formulaire */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="sticky top-24 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase">Votre Évaluation</h2>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Notez ce film</p>
                {ratingOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setRating(option.value)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      rating === option.value
                        ? `bg-gradient-to-r ${option.color} border-white/20 shadow-xl`
                        : "bg-white/[0.02] border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="flex-1 text-left">
                      <div className={`font-black uppercase tracking-tight ${rating === option.value ? "text-white" : "text-white/60"}`}>
                        {option.label}
                      </div>
                    </div>
                    {rating === option.value && <CheckCircle className="w-6 h-6 text-white" />}
                  </motion.button>
                ))}
              </div>

              <div className="mb-8">
                <label className="text-xs font-black uppercase tracking-widest text-white/30 mb-3 block">Note privée (Optionnel)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez vos impressions avec les autres jurés..."
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 resize-none transition-all"
                />
              </div>

              {rating === null && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-6">
                  <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-400">
                    <p className="font-bold mb-1">Notation requise</p>
                    <p className="text-orange-400/70">Veuillez sélectionner une note avant de valider.</p>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={rating !== null && !isSaving ? { scale: 1.02 } : {}}
                whileTap={rating !== null && !isSaving ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={rating === null || isSaving}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  rating !== null && !isSaving
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/20"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                }`}
              >
                {isSaving ? "Enregistrement..." : "Valider mon vote"}
              </motion.button>

              {hasNext && (
                <p className="text-center text-xs text-white/30 mt-4">
                  Encore {films.length - currentIndex - 1} film(s) à évaluer
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
