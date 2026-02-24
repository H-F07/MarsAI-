import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
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
} from "lucide-react";
import { getUsers } from "../../api/users.js";

export default function JuryManagement() {
  const navigate = useNavigate();
  const [isDistributing, setIsDistributing] = useState(false);

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

  const handleAutoDistribute = () => {
    setIsDistributing(true);
    console.log("Distribution automatique lancée");
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

  function getMemberColor(member) {
    const status = getMemberStatus(member);
    if (status === "completed") return "from-emerald-500 to-emerald-600";
    return "from-slate-500 to-slate-600";
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px]" />
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

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-2">
              Distribution & Jury
            </h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-8">
              Contrôle du protocole marsAI 2026
            </p>
          </motion.div>

          {isPending ? (
            <div className="flex items-center justify-center py-8 gap-3">
              <Loader2 className="w-6 h-6 text-[#51A2FF] animate-spin" />
              <span className="text-white/40 text-sm font-black uppercase tracking-widest">
                Chargement...
              </span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <XCircle className="w-8 h-8 text-red-400" />
              <p className="text-red-400 font-black uppercase tracking-widest text-sm">
                Erreur lors du chargement des données
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#51A2FF]/10 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#51A2FF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {totalJuryMembers}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">
                      Jurés Total
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {activeJuryMembers}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">
                      Actifs
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {completedJuryMembers}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">
                      Terminés
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {averageProgress}%
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">
                      Progression
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {isPending ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#51A2FF] animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 font-black uppercase tracking-widest">
              Impossible de charger les données du jury
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#51A2FF] to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-[#51A2FF]/20">
                  <Zap className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
                    Distribution Automatique
                  </h2>
                  <p className="text-white/60 text-sm md:text-base mb-6 max-w-2xl leading-relaxed">
                    L'algorithme répartit les films entre les jurés actifs.
                    Chaque film sera assigné à exactement 2 membres pour
                    garantir une double évaluation.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAutoDistribute}
                      disabled={isDistributing}
                      className="bg-gradient-to-r from-[#51A2FF] to-purple-600 text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:shadow-2xl hover:shadow-[#51A2FF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isDistributing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Attribution en cours...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Lancer l'attribution
                        </>
                      )}
                    </button>

                    <button className="bg-white/[0.05] border border-white/20 text-white/80 font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all">
                      Mode Manuel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {juryMembers.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center">
                <p className="text-white/30 text-sm font-black uppercase tracking-widest">
                  Aucun membre du jury trouvé
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {juryMembers.map((member, index) => {
                  const votes = member.votesCompleted ?? 0;
                  const progress = Math.min((votes / 50) * 100, 100);
                  const status = getMemberStatus(member);
                  const color = getMemberColor(member);
                  const initial = (
                    member.username ||
                    member.email ||
                    "?"
                  )
                    .charAt(0)
                    .toUpperCase();

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="group bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-3xl p-6 transition-all hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-1">
                          <div
                            className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-3xl font-black text-white uppercase">
                              {initial}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                              {member.username || member.email}
                            </h3>
                            <p className="text-sm text-white/40">
                              Statut :{" "}
                              <span
                                className={
                                  status === "completed"
                                    ? "text-emerald-400"
                                    : status === "active"
                                      ? "text-orange-400"
                                      : "text-white/30"
                                }
                              >
                                {status === "completed"
                                  ? "Terminé"
                                  : status === "active"
                                    ? "En cours"
                                    : "En attente"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="w-64 hidden md:block">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                                {Math.round(progress)}%
                              </span>
                              <span className="text-xs font-black uppercase tracking-widest text-white/40">
                                {votes}/50 films
                              </span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{
                                  duration: 1,
                                  delay: 0.5 + index * 0.1,
                                }}
                                className={`h-full rounded-full ${
                                  status === "completed"
                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                    : "bg-gradient-to-r from-[#51A2FF] to-purple-600"
                                }`}
                              />
                            </div>
                          </div>

                          <button className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
                            <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 md:hidden">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase tracking-widest text-white/80">
                            {Math.round(progress)}%
                          </span>
                          <span className="text-xs font-black uppercase tracking-widest text-white/40">
                            {votes}/50 films
                          </span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + index * 0.1,
                            }}
                            className={`h-full rounded-full ${
                              status === "completed"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                : "bg-gradient-to-r from-[#51A2FF] to-purple-600"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
