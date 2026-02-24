import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  Calendar, 
  Download, 
  Bell, 
  ChevronLeft, 
  Shield, 
  Globe, 
  Lock, 
  Clock, 
  Save, 
  Database,
  FileText,
  Mail,
  Zap,
  Check
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [submissionsOpen, setSubmissionsOpen] = useState(true);
  const [finalistsPublic, setFinalistsPublic] = useState(false);
  const [submissionDeadline, setSubmissionDeadline] = useState("2026-03-31");
  const [finalistsDate, setFinalistsDate] = useState("2026-04-15");
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    "Email sur nouvelle soumission": true,
    "Email sur nouveau vote jury": true,
    "Email sur demande de correction": true,
    "Alertes sécurité système": true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
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
                Configuration
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Paramètres du protocole marsAI 2026
              </p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group relative bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50"
            >
              {isSaving ? <Zap className="w-5 h-5 animate-pulse" /> : <Save className="w-5 h-5" />}
              <span className="text-xs">{isSaving ? 'Synchronisation...' : 'Sauvegarder'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12 space-y-8">
        {/* Dates Clés Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#51A2FF]/10 rounded-2xl flex items-center justify-center border border-[#51A2FF]/20">
              <Calendar className="w-6 h-6 text-[#51A2FF]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Chronologie</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Gestion des phases temporelles</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                  Clôture Soumissions
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="date"
                      value={submissionDeadline}
                      onChange={(e) => setSubmissionDeadline(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-[#51A2FF]/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setSubmissionsOpen(!submissionsOpen)}
                    className={`px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                      submissionsOpen
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {submissionsOpen ? "Actif" : "Inactif"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">
                  Révélation Finalistes
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="date"
                      value={finalistsDate}
                      onChange={(e) => setFinalistsDate(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setFinalistsPublic(!finalistsPublic)}
                    className={`px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                      finalistsPublic
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                    }`}
                  >
                    {finalistsPublic ? "Public" : "Privé"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Exports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Extraction Données</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Exportation des registres système</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Registre Films", desc: "Base complète des soumissions", icon: FileText },
              { title: "Canaux Emails", desc: "Liste diffusion newsletter", icon: Mail },
              { title: "Évaluations Jury", desc: "Détails des votes et scores", icon: Shield },
              { title: "Classement Final", desc: "Top 50 validé par le système", icon: Award },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => console.log("Export:", item.title)}
                className="flex items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-[24px] transition-all group text-left"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-all">
                    <item.icon className="w-5 h-5 text-white/20 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-white/10 group-hover:text-white transition-all transform group-hover:translate-y-0.5" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20">
              <Bell className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Alertes Système</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Configuration des flux de notification</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(notifications).map(([setting, enabled]) => (
              <button
                key={setting}
                onClick={() => toggleNotification(setting)}
                className="w-full flex items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-[24px] border border-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full transition-all ${enabled ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'bg-white/10'}`} />
                  <span className="font-bold text-sm text-white/70 group-hover:text-white transition-colors">{setting}</span>
                </div>
                
                <div className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${
                  enabled ? "bg-pink-500/20 border-pink-500/30" : "bg-white/5 border-white/10"
                }`}>
                  <motion.div
                    animate={{ x: enabled ? 24 : 2 }}
                    className={`w-4 h-4 rounded-full absolute top-0.5 transition-colors ${
                      enabled ? "bg-pink-500" : "bg-white/20"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-500/[0.02] border border-red-500/10 rounded-[40px] p-8 md:p-10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-red-500">Zone Critique</h2>
              <p className="text-[10px] font-black text-red-500/30 uppercase tracking-widest mt-1">Actions irréversibles sur le système</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 py-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/60 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all">
              Réinitialiser les votes
            </button>
            <button className="flex-1 py-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/60 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all">
              Purger le cache système
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
