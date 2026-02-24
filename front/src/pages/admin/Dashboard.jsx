import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Users, 
  Film, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Shield, 
  Activity, 
  ArrowRight, 
  Loader2, 
  XCircle, 
  Settings, 
  FileText, 
  Trophy,
  Zap
} from "lucide-react";
import { getFilms } from "../../api/films.js";
import { getUsers } from "../../api/users.js";
import { getEvents } from "../../api/events.js";

function Dashboard() {
  const navigate = useNavigate();

  const { data: filmsData, isPending: filmsPending, isError: filmsError } = useQuery({
    queryKey: ["films"],
    queryFn: () => getFilms({ limit: 1000 }),
  });

  const { data: usersData, isPending: usersPending, isError: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: eventsData, isPending: eventsPending } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const films = filmsData?.data?.films ?? [];
  const users = usersData?.data ?? [];
  const events = eventsData?.data ?? [];

  const stats = {
    totalSubmissions: films.length,
    validatedFilms: films.filter((f) => f.status === "APPROVED").length,
    pendingFilms: films.filter((f) => f.status === "PENDING").length,
    rejectedFilms: films.filter((f) => f.status === "REJECTED").length,
    selectionOfficielle: films.filter((f) => f.status === "SELECTION_OFFICIELLE").length,
    totalUsers: users.length,
    juryUsers: users.filter((u) => u.role === "JURY").length,
    totalEvents: events.length,
    submissionsToday: films.filter((f) => {
      const today = new Date();
      const filmDate = new Date(f.createdAt);
      return (
        filmDate.getDate() === today.getDate() &&
        filmDate.getMonth() === today.getMonth() &&
        filmDate.getFullYear() === today.getFullYear()
      );
    }).length,
  };

  const juryProgress = stats.selectionOfficielle > 0
    ? Math.round((stats.selectionOfficielle / 50) * 100)
    : 0;

  const quickActions = [
    {
      id: "admin-users",
      icon: Users,
      label: "Utilisateurs",
      count: stats.totalUsers,
      color: "text-[#51A2FF]",
      bgColor: "bg-[#51A2FF]/10",
      borderColor: "border-[#51A2FF]/20",
      route: "/admin/users",
    },
    {
      id: "admin-submissions",
      icon: Film,
      label: "Soumissions",
      count: stats.pendingFilms,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      route: "/admin/submissions",
    },
    {
      id: "admin-moderation",
      icon: Shield,
      label: "Modération",
      count: stats.pendingFilms,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      route: "/admin/moderation",
    },
    {
      id: "admin-leaderboard",
      icon: Trophy,
      label: "Classement",
      count: stats.selectionOfficielle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      route: "/admin/leaderboard",
    },
    {
      id: "admin-events",
      icon: Calendar,
      label: "Événements",
      count: stats.totalEvents,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      route: "/admin/events",
    },
    {
      id: "admin-jury",
      icon: BarChart3,
      label: "Jury",
      count: stats.juryUsers,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      route: "/admin/jury",
    },
    {
      id: "admin-cms",
      icon: FileText,
      label: "Contenu CMS",
      count: null,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      route: "/admin/cms",
    },
    {
      id: "admin-settings",
      icon: Settings,
      label: "Configuration",
      count: null,
      color: "text-white/60",
      bgColor: "bg-white/5",
      borderColor: "border-white/10",
      route: "/admin/settings",
    },
  ];

  const recentActivity = films
    .slice(0, 5)
    .map((film) => {
      const user = users.find((u) => u.id === film.userId);
      const createdAt = new Date(film.createdAt);
      const now = new Date();
      const diffMinutes = Math.floor((now - createdAt) / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const timeAgo =
        diffMinutes < 60
          ? `${diffMinutes} min`
          : diffHours < 24
          ? `${diffHours}h`
          : `${Math.floor(diffHours / 24)}j`;

      return {
        id: film.id,
        type: film.status === "PENDING" ? "soumission" : film.status === "APPROVED" ? "validation" : "sélection",
        user: user?.username || "Utilisateur",
        action:
          film.status === "PENDING"
            ? "a soumis un nouveau film"
            : film.status === "APPROVED"
            ? "a été validé"
            : "a rejoint la sélection",
        time: timeAgo,
        film: film.title,
        status: film.status
      };
    });

  const submissionTrend = (() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    return last7Days.map((date) => {
      const count = films.filter((film) => {
        const filmDate = new Date(film.createdAt);
        return (
          filmDate.getDate() === date.getDate() &&
          filmDate.getMonth() === date.getMonth() &&
          filmDate.getFullYear() === date.getFullYear()
        );
      }).length;

      return {
        day: dayNames[date.getDay()],
        count,
      };
    });
  })();

  const maxCount = Math.max(...submissionTrend.map((d) => d.count), 1);

  const isLoading = filmsPending || usersPending || eventsPending;
  const isError = filmsError || usersError;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="sticky top-0 z-40 bg-[#020202]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-3">
                Dashboard
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Système de contrôle marsAI 2026
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Système Opérationnel</span>
            </div>
          </div>

          {!isLoading && !isError && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {[
                { label: "Soumissions", value: stats.totalSubmissions, icon: Film, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10" },
                { label: "Validés", value: stats.validatedFilms, icon: CheckCircle, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
                { label: "En Attente", value: stats.pendingFilms, icon: Clock, color: "text-purple-400", bgColor: "bg-purple-400/10" },
                { label: "Membres", value: stats.totalUsers, icon: Users, color: "text-pink-500", bgColor: "bg-pink-500/10" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[32px] p-5 flex items-center gap-5 group hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  <div className={`p-4 rounded-2xl ${stat.bgColor} border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-[#51A2FF] animate-spin" />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Synchronisation...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[40px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-black uppercase tracking-widest">Erreur de liaison système</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Performance Chart Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#51A2FF]/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-[#51A2FF]" />
                        <h3 className="text-2xl font-black uppercase tracking-tight">Flux Soumissions</h3>
                      </div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Activité des 7 derniers cycles solaires
                      </p>
                    </div>

                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10">
                      <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-white text-black rounded-xl shadow-lg transition-all">
                        7 Jours
                      </button>
                      <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                        30 Jours
                      </button>
                    </div>
                  </div>

                  <div className="mb-12">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                      <span>Progression Sélection Officielle</span>
                      <span className="text-white">{juryProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${juryProgress}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-[#51A2FF] via-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3 md:gap-6 h-48 md:h-64 items-end">
                    {submissionTrend.map((item, i) => (
                      <div key={item.day} className="flex flex-col items-center gap-4 h-full justify-end group">
                        <div className="relative w-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.count / maxCount) * 100}%` }}
                            transition={{ duration: 1.2, delay: 0.5 + i * 0.08, ease: "circOut" }}
                            className="w-full bg-gradient-to-t from-[#51A2FF]/10 to-[#51A2FF] rounded-xl border-t border-white/20 relative group-hover:shadow-[0_0_30px_rgba(81,162,255,0.3)] transition-all"
                          >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black bg-white text-black px-2.5 py-1.5 rounded-lg shadow-xl">
                              {item.count}
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-widest text-white/60 ml-2">Actions Système</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative bg-white/[0.02] border border-white/5 rounded-[32px] p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all overflow-hidden backdrop-blur-md cursor-pointer"
                      onClick={() => navigate(action.route)}
                    >
                      <action.icon className="absolute -top-6 -right-6 w-32 h-32 text-white/[0.02] -rotate-12 transition-transform group-hover:rotate-0 group-hover:text-white/[0.04] duration-700" />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`p-4 rounded-2xl ${action.bgColor} border ${action.borderColor} ${action.color} group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-wider mb-1">
                              {action.label}
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              {action.count !== null ? `${action.count} unités` : "Configuration"}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Activity */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 backdrop-blur-xl h-full">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-pink-500" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Activité</h3>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-pink-500/10 text-pink-400 border border-pink-500/20 animate-pulse">
                    Live
                  </span>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="py-20 text-center">
                    <Activity className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                      Signal plat
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="relative pl-6 border-l border-white/5 group"
                      >
                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#51A2FF] transition-colors" />
                        
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] font-black text-[#51A2FF] uppercase tracking-widest">{activity.user}</span>
                          <span className="text-[9px] font-bold text-white/20 uppercase">{activity.time}</span>
                        </div>
                        
                        <p className="text-xs text-white/60 leading-relaxed">
                          {activity.action} <span className="text-white font-bold italic">"{activity.film}"</span>
                        </p>
                        
                        <div className="mt-2">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                            activity.status === 'PENDING' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                            activity.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            'bg-white/5 border-white/10 text-white/40'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    
                    <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">
                      Voir tout l'historique
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
