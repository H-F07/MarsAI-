import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Image as ImageIcon, 
  Save, 
  Eye, 
  ChevronLeft, 
  Layout, 
  Plus, 
  Trash2, 
  Globe, 
  Zap,
  Check,
  MoreVertical
} from "lucide-react";

export default function CMS() {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("appel");
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState({
    appel: "Rejoignez le Festival marsAI 2026...",
    reglement: "Article 1: Conditions de participation...",
    apropos: "marsAI est le premier festival...",
  });

  const pages = [
    { id: "appel", label: "Appel à Projet", icon: Zap, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
    { id: "reglement", label: "Règlement", icon: Shield, color: "text-purple-400", bgColor: "bg-purple-400/10" },
    { id: "apropos", label: "À Propos", icon: Globe, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10" },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handlePreview = () => {
    console.log("Preview page:", selectedPage);
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
                Contenu
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Gestion des interfaces et médias (CMS)
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="group relative bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest py-4 px-6 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <Eye className="w-5 h-5 text-white/60" />
                <span className="text-xs">Aperçu</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group relative bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span className="text-xs">{isSaving ? 'Publication...' : 'Publier'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-4 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 ml-4">Pages Système</p>
              <div className="space-y-2">
                {pages.map((page) => {
                  const Icon = page.icon || FileText;
                  const isActive = selectedPage === page.id;
                  return (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border group ${
                        isActive
                          ? "bg-white text-black border-white shadow-xl"
                          : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-white/20 group-hover:text-white/60'}`} />
                      <span className="font-black text-xs uppercase tracking-widest">
                        {page.label}
                      </span>
                      {isActive && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/5 rounded-[32px] p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-sm font-black uppercase tracking-tight mb-2">Aide au balisage</h4>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
                  Utilisez le format Markdown pour structurer vos textes. Les modifications sont appliquées en temps réel après publication.
                </p>
              </div>
              <Layout className="absolute -bottom-4 -right-4 w-24 h-24 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-9 space-y-8">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-[80px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pages.find(p => p.id === selectedPage)?.bgColor} ${pages.find(p => p.id === selectedPage)?.borderColor}`}>
                      {(() => {
                        const Icon = pages.find(p => p.id === selectedPage)?.icon || FileText;
                        return <Icon className={`w-6 h-6 ${pages.find(p => p.id === selectedPage)?.color}`} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">
                        Édition : {pages.find((p) => p.id === selectedPage)?.label}
                      </h2>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Dernière modification : il y a 2h</p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#51A2FF]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Mode Édition</span>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    value={content[selectedPage]}
                    onChange={(e) =>
                      setContent({ ...content, [selectedPage]: e.target.value })
                    }
                    rows={18}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] px-8 py-8 text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all resize-none font-mono text-sm leading-relaxed shadow-inner"
                    placeholder="Initialisation du contenu source..."
                  />
                  <div className="absolute bottom-6 right-8 flex items-center gap-4 pointer-events-none">
                    <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">
                      {content[selectedPage].length} Caractères
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Media Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20">
                    <ImageIcon className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Partenaires</h2>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Gestion des logos et sponsors</p>
                  </div>
                </div>
                
                <button
                  onClick={() => console.log("Add sponsor logo")}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
                >
                  <Plus className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="group relative aspect-square bg-white/[0.03] border border-white/5 rounded-[24px] flex items-center justify-center hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer overflow-hidden"
                  >
                    <ImageIcon className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-all group-hover:scale-110" />
                    
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-all">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => console.log("Add sponsor logo")}
                  className="aspect-square border-2 border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-white/[0.02] hover:border-white/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-white/20 group-hover:text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40">Ajouter</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
