import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Correction de l'import
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, ChevronLeft, Hash, AlignLeft, CheckCircle, 
  Loader2, Cpu, Video, Image as ImageIcon, 
  Mic, Music, FileText, Upload, Image as ImagePlus,
  Globe, Lock, Eye
} from "lucide-react";

// ATTENTION : Assure-toi que ce fichier existe bien dans src/data/films-data.js
// Si l'erreur persiste, commente la ligne suivante pour tester l'interface.
import { filmsData } from "../../data/films-data";

export default function EditorStudio() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState("");

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAI, setSelectedAI] = useState([]); // RÉACTIVÉ ICI
  const [activeAICategory, setActiveAICategory] = useState("Vidéo");
  const [visibility, setVisibility] = useState("Public");
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const grad = "linear-gradient(135deg, #A855F7 0%, #51A2FF 100%)";

  const aiCategories = [
    { id: "Vidéo", icon: Video, label: "Vidéo" },
    { id: "Image", icon: ImageIcon, label: "Image" },
    { id: "Audio", icon: Mic, label: "Audio" },
    { id: "Musique", icon: Music, label: "Musique" },
    { id: "Script", icon: FileText, label: "Script" },
  ];

  const aiTools = [
    { name: "OpenAI Sora (OpenIA)", type: "Vidéo" },
    { name: "Runway Gen-3 Alpha (RunwayML)", type: "Vidéo" },
    { name: "Luma Dream Machine (Luma Labs)", type: "Vidéo" },
    { name: "Kling AI (Kuaishou Technology)", type: "Vidéo" },
    { name: "Midjourney v7 (Midjourney Inc)", type: "Image" },
    { name: "DALL-E 3 (OpenAI)", type: "Image" },
    { name: "Stable Diffusion 3.5 (Stability AI)", type: "Image" },
    { name: "ElevenLabs (ElevenLabs)", type: "Audio" },
    { name: "Suno v4 (Suno AI)", type: "Musique" },
    { name: "Udio Pro (Uncharted Labs)", type: "Musique" },
    { name: "Gemini 3 Flash (Google)", type: "Script" },
    { name: "ChatGPT o1 (OpenAI)", type: "Script" },
    { name: "Claude 3.5 Sonnet (Antropic)", type: "Script" }
  ];

  useEffect(() => {
    const loadFilmData = () => {
      setLoading(true);
      // On vérifie si filmsData existe avant de chercher dedans
      if (typeof filmsData !== 'undefined' && filmsData.length > 0) {
        const film = filmsData.find(f => f.id === parseInt(id) || f.id === id);
        if (film) {
          setTitle(film.title || "");
          setSynopsis(film.description || film.synopsis || "");
          setSelectedTags(film.tags || []);
          setSelectedAI(film.aiStack || []);
          setPreviewImage(film.poster || null);
          setVisibility(film.status || "Public");
        }
      }
      setLoading(false);
    };
    loadFilmData();
  }, [id]);

  const handleFile = (file) => {
    setFileError("");
    const maxSize = 5 * 1024 * 1024; 

    if (file) {
      if (!file.type.startsWith('image/')) {
        setFileError("Format d'image non supporté");
        return;
      }
      if (file.size > maxSize) {
        setFileError("L'image trop volumineuse (Max 5Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleSelection = (item, state, setState) => {
    setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-4 z-50">
      <Loader2 className="w-8 h-8 text-[#51A2FF] animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">SYNCHRONISATION DU STUDIO...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pb-32 font-sans selection:bg-[#51A2FF]/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8 mb-16">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: grad }}
              className="group flex items-center gap-3 px-6 py-2.5 rounded-full text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Quitter le Studio
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Projet ID: {id}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">Editor Studio</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 ml-1">Édition & Post-Production IA</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Zone Upload */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current.click()}
              className={`relative h-[450px] rounded-[48px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${
                isDragging ? "border-[#A855F7] bg-[#A855F7]/10 scale-[0.99]" : fileError ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
              }`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
              
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Poster" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <div className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-white">Changer le poster</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6 text-center p-8">
                  <div className={`w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center border transition-all duration-500 ${fileError ? "border-red-500" : "border-white/10 group-hover:border-[#51A2FF]"}`}>
                    <ImagePlus className={`w-10 h-10 transition-all ${fileError ? "text-red-500" : "text-white/10 group-hover:text-[#51A2FF] group-hover:scale-110"}`} />
                  </div>
                  <div className="space-y-2">
                    <p className={`text-xs font-black uppercase tracking-[0.3em] ${fileError ? "text-red-500" : ""}`}>
                      {fileError || "Drop ton Poster ici"}
                    </p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Format recommandé: 16:9 ou Vertical</p>
                  </div>
                </div>
              )}
            </div>

            {/* Inputs Textes */}
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[48px] space-y-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <AlignLeft className="w-4 h-4 text-[#51A2FF]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Métadonnées du film</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Titre de l'œuvre</label>
                  <input 
                    type="text" value={title} placeholder="Nom du film..." onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-[24px] outline-none font-bold text-2xl focus:border-[#51A2FF] transition-all hover:bg-white/[0.06]" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Synopsis & Vision</label>
                  <textarea 
                    rows={6} value={synopsis} placeholder="Raconte l'histoire de ton court-métrage..." onChange={(e) => setSynopsis(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-[24px] outline-none text-base leading-relaxed focus:border-[#51A2FF] transition-all hover:bg-white/[0.06] resize-none" 
                  />
                </div>
              </div>
            </div>

            {/* AI Stack */}
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[48px] backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-[#51A2FF]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Intelligence Artificielle</h2>
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[9px] font-bold text-[#51A2FF] uppercase tracking-widest">{selectedAI.length} Outils</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-12 bg-white/5 p-2 rounded-[2rem] w-fit">
                {aiCategories.map((cat) => (
                  <button
                    key={cat.id} type="button" onClick={() => setActiveAICategory(cat.id)}
                    style={activeAICategory === cat.id ? { background: grad } : {}}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all duration-500 ${
                      activeAICategory === cat.id ? "text-white shadow-xl shadow-purple-500/20" : "text-white/40 hover:text-white"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {aiTools.filter(tool => tool.type === activeAICategory).map((ai) => {
                    const isSelected = selectedAI.includes(ai.name);
                    return (
                      <motion.button
                        layout key={ai.name} type="button"
                        onClick={() => toggleSelection(ai.name, selectedAI, setSelectedAI)}
                        style={isSelected ? { background: grad } : {}}
                        className={`flex items-center justify-between p-5 rounded-[2.5rem] border transition-all duration-500 ${
                          isSelected ? "border-transparent text-white shadow-2xl shadow-purple-500/10 scale-105" : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/20"
                        }`}
                      >
                        <span className="text-xs font-bold truncate mr-2">{ai.name}</span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-white shrink-0" strokeWidth={3} />}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-8">
                <Hash className="w-4 h-4 text-[#51A2FF]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Genres</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {["Action", "Sci-Fi", "Drame", "Horreur", "Animation", "Expérimental", "Cyberpunk", "Docu"].map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button 
                      key={tag} type="button" onClick={() => toggleSelection(tag, selectedTags, setSelectedTags)}
                      style={isSelected ? { background: grad } : {}}
                      className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 border ${
                        isSelected ? "border-transparent text-white shadow-lg" : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-8">
                <Eye className="w-4 h-4 text-[#51A2FF]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Visibilité</h2>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { id: "Public", icon: Globe, label: "Public", desc: "Visible par tous" },
                  { id: "Brouillon", icon: Lock, label: "Brouillon", desc: "Uniquement toi" }
                ].map((status) => (
                  <button
                    key={status.id} type="button" onClick={() => setVisibility(status.id)}
                    style={visibility === status.id ? { background: grad } : {}}
                    className={`flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-500 text-left ${
                      visibility === status.id ? "border-transparent text-white shadow-xl" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    <status.icon className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-black uppercase">{status.label}</p>
                      <p className="text-[9px] opacity-60 uppercase font-medium">{status.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" disabled={isSaving} style={{ background: grad }}
              className="w-full h-24 text-white rounded-[40px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center transition-all hover:brightness-110 active:scale-95 shadow-2xl shadow-purple-500/30 group relative"
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synchronisation...</span>
                  </motion.div>
                ) : success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>Modifications appliquées</span>
                  </motion.div>
                ) : (
                  <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    <span>Mettre à jour le film</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}