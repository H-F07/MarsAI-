import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, Download, Bell, ChevronLeft } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [submissionsOpen, setSubmissionsOpen] = useState(true);
  const [finalistsPublic, setFinalistsPublic] = useState(false);
  const [submissionDeadline, setSubmissionDeadline] = useState("2026-03-31");
  const [finalistsDate, setFinalistsDate] = useState("2026-04-15");
  const [notifications, setNotifications] = useState({
    "Email sur nouvelle soumission": true,
    "Email sur nouveau vote jury": true,
    "Email sur demande de correction": true,
    "Alertes sécurité": true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[150px]" />
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
              Configuration
            </h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
              Contrôle du protocole marsAI 2026
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#51A2FF]/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#51A2FF]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Dates Clés
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/30 mb-3 block">
                Fermeture des soumissions
              </label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={submissionDeadline}
                  onChange={(e) => setSubmissionDeadline(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#51A2FF]/50"
                />
                <button
                  onClick={() => setSubmissionsOpen(!submissionsOpen)}
                  className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${
                    submissionsOpen
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-red-500/20 border-red-500/30 text-red-400"
                  }`}
                >
                  {submissionsOpen ? "Ouvert" : "Fermé"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/30 mb-3 block">
                Révélation des finalistes
              </label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={finalistsDate}
                  onChange={(e) => setFinalistsDate(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[#51A2FF]/50"
                />
                <button
                  onClick={() => setFinalistsPublic(!finalistsPublic)}
                  className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${
                    finalistsPublic
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-purple-500/20 border-purple-500/30 text-purple-400"
                  }`}
                >
                  {finalistsPublic ? "Public" : "Privé"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Exports
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Exporter CSV Films",
                desc: "Tous les films soumis",
              },
              {
                title: "Exporter CSV Emails",
                desc: "Pour newsletter",
              },
              {
                title: "Exporter Votes Jury",
                desc: "Détails des évaluations",
              },
              {
                title: "Exporter Classement",
                desc: "Top 50 avec scores",
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => console.log("Export:", item.title)}
                className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                  <div className="text-left">
                    <h3 className="font-black text-sm uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/40">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-pink-400" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([setting, enabled]) => (
              <div
                key={setting}
                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5"
              >
                <span className="font-bold text-sm">{setting}</span>
                <button
                  onClick={() => toggleNotification(setting)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    enabled ? "bg-green-500" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      enabled ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
