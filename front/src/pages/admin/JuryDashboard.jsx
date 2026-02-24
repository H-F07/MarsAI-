import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, CheckCircle, Clock, Play, BarChart3, Loader2 } from "lucide-react";
import { fetchSelectionOfficielle } from "../../api/films";
import { fetchMyRatings } from "../../api/juryRating";

// Formate les secondes en "MM:SS"
const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// Transforme un film API en objet utilisable dans le dashboard
const mapFilm = (film) => ({
  id: film.id,
  title: film.title,
  director: film.User?.username ?? "—",
  description: film.description,
  thumbnail: film.posterPath,
  country: film.country,
  duration: formatDuration(film.duration),
  aiTools: Object.values(film.aiIdentity || {}).filter(Boolean),
  hasVoted: false,
  myRating: undefined,
});

export default function JuryDashboard() {
  const navigate = useNavigate();
  const [searchQuery,   setSearchQuery]   = useState("");
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [sortBy,        setSortBy]        = useState("title");
  const [films,         setFilms]         = useState([]);
  const [apiRatings,    setApiRatings]    = useState(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState(null);

  // Chargement en parallèle : films + votes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [filmsRes, ratingsRes] = await Promise.allSettled([
          fetchSelectionOfficielle(),
          fetchMyRatings(),
        ]);

        if (filmsRes.status === "fulfilled") {
          setFilms(filmsRes.value.data.map(mapFilm));
        } else {
          setError("Impossible de charger les films. Vérifiez que le serveur est démarré.");
        }

        if (ratingsRes.status === "fulfilled") {
          setApiRatings(ratingsRes.value.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Fusion films + votes
  const finalistsFilms = useMemo(() => {
    return films.map((film) => {
      if (apiRatings !== null) {
        const found = apiRatings.find((r) => (r.filmId ?? r.film_id) === film.id);
        return found
          ? { ...film, hasVoted: true,  myRating: found.score }
          : { ...film, hasVoted: false, myRating: undefined };
      }
      return film;
    });
  }, [films, apiRatings]);

  const evaluatedCount  = finalistsFilms.filter((f) => f.hasVoted).length;
  const totalCount      = finalistsFilms.length;
  const progressPercent = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;

  const filteredFilms = useMemo(() => {
    let list = [...finalistsFilms];
    if (searchQuery) {
      list = list.filter((f) => f.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterStatus === "evaluated") list = list.filter((f) => f.hasVoted);
    else if (filterStatus === "pending") list = list.filter((f) => !f.hasVoted);
    if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "duration") list.sort((a, b) => a.duration.localeCompare(b.duration));
    return list;
  }, [finalistsFilms, searchQuery, filterStatus, sortBy]);

  const getRatingEmoji = (rating) => {
    const map = { TRES_BIEN: "❤️", BIEN: "🙂", BOF: "😐", JAIME_PAS: "😕" };
    return map[rating] ?? null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#51a2ff] animate-spin" />
          <p className="text-white/40 text-sm uppercase tracking-widest font-black">Chargement des films...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-white text-black font-black uppercase tracking-widest py-3 px-6 rounded-2xl">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ad46ff]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#51a2ff]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-[#ff2b7f]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050505]/60 backdrop-blur-3xl border-b border-[#51a2ff]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white/[0.04] backdrop-blur-xl border border-[#ad46ff]/20 rounded-[24px] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#ad46ff]" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">Espace Jury</h1>
                <p className="text-[#51a2ff]/60 text-xs md:text-sm font-medium uppercase tracking-[0.2em]">
                  Évaluation des finalistes
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="bg-white/[0.03] backdrop-blur-2xl border border-[#51a2ff]/10 rounded-[24px] p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-1">Votre Progression</h3>
                <p className="text-white/40 text-sm">
                  Vous avez évalué <span className="text-[#51a2ff] font-black">{evaluatedCount}/{totalCount}</span> films
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{progressPercent}%</div>
                <p className="text-[10px] text-[#51a2ff]/40 uppercase tracking-widest">Complété</p>
              </div>
            </div>
            <div className="relative h-3 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#51a2ff]/30 to-[#ad46ff]/30 rounded-full shadow-[0_0_20px_rgba(81,162,255,0.4)]"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ad46ff]/30" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un film..."
                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[24px] pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ad46ff]/30 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {[
                { id: "all",       label: "Tous",      count: totalCount,                  color: "#51a2ff" },
                { id: "pending",   label: "À évaluer", count: totalCount - evaluatedCount, color: "#ff9500" },
                { id: "evaluated", label: "Évalués",   count: evaluatedCount,              color: "#30d158" },
              ].map((f) => (
                <button
                  key={f.id} onClick={() => setFilterStatus(f.id)}
                  style={{
                    borderColor: filterStatus === f.id ? `${f.color}40` : "rgba(255,255,255,0.08)",
                    boxShadow:   filterStatus === f.id ? `0 0 20px ${f.color}20` : "none",
                  }}
                  className={`flex-1 px-4 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all border backdrop-blur-xl ${
                    filterStatus === f.id ? "bg-white/10 text-white" : "bg-white/[0.02] text-white/40 hover:border-white/15"
                  }`}
                >
                  {f.label}
                  <span className={`ml-2 ${filterStatus === f.id ? "text-white/60" : "text-white/20"}`}>({f.count})</span>
                </button>
              ))}
            </div>
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[24px] px-4 py-3.5 text-sm text-white focus:outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="title"    className="bg-[#0a0a0a]">Trier par Titre</option>
              <option value="duration" className="bg-[#0a0a0a]">Trier par Durée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFilms.map((film, index) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
              onClick={() => navigate(`/jury/${film.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all">
                <div className="aspect-[4/5] relative overflow-hidden">
                  {film.thumbnail ? (
                    <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl backdrop-blur-md border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    film.hasVoted ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-white/10 border-white/20 text-white/60"
                  }`}>
                    {film.hasVoted ? <><CheckCircle className="w-3 h-3" /> Évalué</> : <><Clock className="w-3 h-3" /> À évaluer</>}
                  </div>
                  {film.hasVoted && film.myRating && (
                    <div className="absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-xl">
                      {getRatingEmoji(film.myRating)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-base mb-1 line-clamp-1 tracking-tight uppercase group-hover:text-blue-400 transition-colors">{film.title}</h3>
                  <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                    <span className="font-medium">{film.director}</span>
                    <span className="font-black">{film.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {film.aiTools.slice(0, 2).map((tool) => (
                      <span key={tool} className="bg-white/5 px-2 py-1 rounded-lg text-[9px] font-bold text-white/60 uppercase tracking-wider">{tool}</span>
                    ))}
                    {film.aiTools.length > 2 && (
                      <span className="bg-white/5 px-2 py-1 rounded-lg text-[9px] font-bold text-white/60">+{film.aiTools.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFilms.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-2xl font-black mb-3 tracking-tighter uppercase">Aucun film trouvé</h3>
            <p className="text-white/40 mb-8 max-w-sm mx-auto">Aucun film ne correspond à vos critères.</p>
            <button
              onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}
              className="bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-2xl hover:bg-blue-400 transition-all"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
