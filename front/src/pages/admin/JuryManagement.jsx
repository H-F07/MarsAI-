import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  Zap,
  ChevronRight,
  TrendingUp,
  ChevronLeft,
  Loader2,
  XCircle,
  Shield,
  Award,
  BarChart3,
  Search,
  Settings,
  MoreVertical,
} from "lucide-react";
import { getUsers } from "../../api/users.js";

export default function JuryManagement() {
  const navigate = useNavigate();
  const [isDistributing, setIsDistributing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: usersData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const allUsers = usersData?.data ?? [];
  const juryMembers = allUsers.filter((u) => u.role === "JURY");

  const totalJuryMembers = juryMembers.length;
  const activeJuryMembers = juryMembers.filter(
    (m) => (m.votesCompleted ?? 0) > 0 && (m.votesCompleted ?? 0) < 50
  ).length;
  const completedJuryMembers = juryMembers.filter(
    (m) => (m.votesCompleted ?? 0) >= 50
  ).length;
  const averageProgress =
    totalJuryMembers > 0
      ? Math.round(
          juryMembers.reduce(
            (acc, m) => acc + Math.min(((m.votesCompleted ?? 0) / 50) * 100, 100),
            0
          ) / totalJuryMembers
        )
      : 0;

  const filteredJury = juryMembers.filter(m => 
    (m.username || m.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAutoDistribute = () => {
    setIsDistributing(true);
    setTimeout(() => {
      setIsDistributing(false);
    }, 2000);
  };

  function getMemberStatus(member) {
    const votes = member.votesCompleted ?? 0;
    if (votes >= 50) return "completed";
    if (votes > 0) return "active";
    return "pending";
  }

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
                Jury
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Distribution et suivi des évaluations
              </p>
            </div>
            
            <button
              onClick={handleAutoDistribute}
              disabled={isDistributing || totalJuryMembers === 0}
              className="group relative bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50"
            >
              <Zap className={`w-5 h-5 shrink-0 ${isDistributing ? 'animate-pulse' : ''}`} />
              <span className="text-xs">{isDistributing ? 'Calcul en cours...' : 'Distribution Auto'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {!isPending && !isError && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {[
                { label: "Membres", value: totalJuryMembers, icon: Users, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10" },
                { label: "Actifs", value: activeJuryMembers, icon: TrendingUp, color: "text-purple-400", bgColor: "bg-purple-400/10" },
                { label: "Terminés", value: completedJuryMembers, icon: UserCheck, color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
                { label: "Progression", value: `${averageProgress}%`, icon: BarChart3, color: "text-pink-400", bgColor: "bg-pink-400/10" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/5 rounded-[32px] p-5 flex items-center gap-5 group hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  <div className={`p-4 rounded-2xl ${stat.bgColor} border border-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="mb-10 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un membre du jury par identité..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
          />
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scan du réseau jury...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Échec de synchronisation jury</p>
          </div>
        ) : filteredJury.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
            <Users className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
              Aucun membre du jury détecté
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJury.map((member, index) => {
                const votes = member.votesCompleted ?? 0;
                const progress = Math.min((votes / 50) * 100, 100);
                const status = getMemberStatus(member);
                const initial = (member.username || member.email || "?").charAt(0).toUpperCase();

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden backdrop-blur-sm"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-5 min-w-0">
                          <div className="relative shrink-0">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-black text-2xl transition-all ${
                              status === 'completed' 
                                ? 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'from-purple-500/20 to-purple-500/10 border-purple-500/20 text-purple-400'
                            }`}>
                              {initial}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0a0a0a] ${
                              status === 'completed' ? 'bg-emerald-500' : status === 'active' ? 'bg-orange-500' : 'bg-white/10'
                            }`} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors truncate uppercase tracking-tight">
                              {member.username || "Anonyme"}
                            </h3>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        
                        <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                          <MoreVertical className="w-4 h-4 text-white/20" />
                        </button>
                      </div>

                      <div className="mt-auto space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className={`w-4 h-4 ${status === 'completed' ? 'text-emerald-400' : 'text-purple-400'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              status === 'completed' ? 'text-emerald-400' : status === 'active' ? 'text-orange-400' : 'text-white/20'
                            }`}>
                              {status === 'completed' ? 'Protocole Terminé' : status === 'active' ? 'Évaluation en cours' : 'En attente'}
                            </span>
                          </div>
                          <span className="text-xs font-black text-white/60">{votes} / 50</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                            <span>Progression Évaluation</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${
                                status === 'completed'
                                  ? "from-emerald-600 to-emerald-400"
                                  : "from-purple-600 to-[#51A2FF]"
                              }`}
                            />
                          </div>
                        </div>

                        <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
                          <span>Détails de l'activité</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
