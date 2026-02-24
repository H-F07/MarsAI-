import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { FileText, Image, Save, Eye, ChevronLeft } from "lucide-react";

export default function CMS() {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("appel");
  const [content, setContent] = useState({
    appel: "Rejoignez le Festival marsAI 2026...",
    reglement: "Article 1: Conditions de participation...",
    apropos: "marsAI est le premier festival...",
  });

  const pages = [
    { id: "appel", label: "Appel à Projet", icon: FileText },
    { id: "reglement", label: "Règlement", icon: FileText },
    { id: "apropos", label: "À Propos", icon: FileText },
  ];

  const handleSave = () => {
    console.log("Saving content for page:", selectedPage, content[selectedPage]);
  };

  const handlePreview = () => {
    console.log("Preview page:", selectedPage);
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Retour au Dashboard
            </span>
          </button>

          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-2">
              Gestion de Contenu (CMS)
            </h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
              Contrôle du protocole marsAI 2026
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${
                    selectedPage === page.id
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.02] text-white/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-black text-sm uppercase tracking-tight">
                    {page.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {pages.find((p) => p.id === selectedPage)?.label}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreview}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-2xl transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">
                      Aperçu
                    </span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-2xl hover:shadow-xl transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">
                      Sauvegarder
                    </span>
                  </button>
                </div>
              </div>

              <textarea
                value={content[selectedPage]}
                onChange={(e) =>
                  setContent({ ...content, [selectedPage]: e.target.value })
                }
                rows={20}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 resize-none font-mono text-sm leading-relaxed"
                placeholder="Écrivez votre contenu ici..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">
                Partenaires & Sponsors
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <Image className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                ))}
              </div>

              <button
                onClick={() => console.log("Add sponsor logo")}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-black uppercase tracking-widest py-3 rounded-2xl transition-all"
              >
                + Ajouter un Logo
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
