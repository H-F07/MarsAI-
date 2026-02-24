import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Film, 
  Search, 
  ChevronLeft, 
  Loader2, 
  XCircle, 
  Play, 
  Youtube, 
  Calendar, 
  User, 
  Globe, 
  Clock, 
  ExternalLink,
  MoreVertical,
  Zap,
  Filter
} from "lucide-react";
import { getVideos } from "../../api/videos.js";

export default function Videos() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["listVideos"],
    queryFn: getVideos,
  });

  const videos = data?.data ?? [];

  const filteredVideos = videos.filter(v => 
    (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] opacity-50" />
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
                Vidéothèque
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Archives et flux vidéo du système marsAI
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{videos.length} Unités Détectées</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="mb-12 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans les archives vidéo..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
          />
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scan des archives...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Échec de liaison archives</p>
            <button onClick={() => refetch()} className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-4">Réinitialiser le scan</button>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
            <Film className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              Aucune unité vidéo trouvée
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all backdrop-blur-sm"
                >
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group/thumb">
                    {video.youtubeId ? (
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                        alt="" 
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <Film className="w-10 h-10 text-white/10" />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-[2px]">
                      <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 fill-black ml-1" />
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md border border-white/10 bg-white/5 text-white/40 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="font-black text-lg text-white mb-2 line-clamp-1 tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                      {video.title || "Sans titre"}
                    </h3>
                    <p className="text-white/30 text-xs line-clamp-2 mb-6 leading-relaxed">
                      {video.description || "Aucune description archivée."}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-white/20" />
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            {video.createdAt ? new Date(video.createdAt).toLocaleDateString("fr-FR") : "Date inconnue"}
                          </span>
                        </div>
                        <a 
                          href={video.youtubeId ? `https://youtube.com/watch?v=${video.youtubeId}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">Voir</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
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
