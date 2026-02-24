import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Edit2,
  Trash2,
  Video,
  Mic2,
  Music,
  Ticket,
  ChevronLeft,
  Loader2,
  XCircle,
  Zap,
  Filter,
  MoreVertical,
} from "lucide-react";
import { getEvents, deleteEvent } from "../../api/events.js";

function getEventIcon(type) {
  switch (type) {
    case "screening":
      return Video;
    case "masterclass":
      return Mic2;
    case "workshop":
      return Edit2;
    case "concert":
      return Music;
    case "party":
      return Users;
    default:
      return Calendar;
  }
}

const EVENT_TYPES = [
  { id: "all", label: "Tous" },
  { id: "screening", label: "Projections" },
  { id: "workshop", label: "Ateliers" },
  { id: "masterclass", label: "Masterclass" },
  { id: "concert", label: "Concerts" },
  { id: "party", label: "Networking" },
];

function getStatusStyle(status) {
  switch (status) {
    case "upcoming":
      return "bg-[#51A2FF]/10 border-[#51A2FF]/20 text-[#51A2FF]";
    case "ongoing":
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 animate-pulse";
    case "completed":
      return "bg-white/5 border-white/10 text-white/40";
    case "cancelled":
      return "bg-red-500/10 border-red-500/20 text-red-400";
    default:
      return "bg-white/5 border-white/10 text-white/40";
  }
}

export default function Events() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data, isPending, isError } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const events = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const stats = useMemo(
    () => ({
      total: events.length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      totalTickets: events.reduce((acc, e) => acc + (e.ticketsSold || 0), 0),
      capacity: events.reduce((acc, e) => acc + (e.capacity || 0), 0),
    }),
    [events]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || event.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, filterType]);

  const handleAddEvent = () => {
    navigate("/admin/events/new");
  };

  const handleEditEvent = (eventId) => {
    navigate(`/admin/events/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      deleteMutation.mutate(eventId);
    }
  };

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
                Événements
              </h1>
              <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Programmation physique marsAI 2026
              </p>
            </div>

            <button
              onClick={handleAddEvent}
              className="group relative bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden"
            >
              <Plus className="w-5 h-5 shrink-0" />
              <span className="text-xs">Lancer une session</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {!isPending && !isError && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {[
                { label: "Sessions", value: stats.total, icon: Calendar, color: "text-[#51A2FF]", bgColor: "bg-[#51A2FF]/10" },
                { label: "À Venir", value: stats.upcoming, icon: Clock, color: "text-purple-500", bgColor: "bg-purple-500/10" },
                { label: "Billets", value: stats.totalTickets, icon: Ticket, color: "text-pink-500", bgColor: "bg-pink-500/10" },
                { label: "Remplissage", value: `${stats.capacity > 0 ? Math.round((stats.totalTickets / stats.capacity) * 100) : 0}%`, icon: Users, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
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
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#51A2FF] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#51A2FF]/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Chargement de l'agenda...</span>
          </div>
        ) : isError ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-[40px] p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500/40 mx-auto mb-6" />
            <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Erreur de liaison agenda</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#51A2FF] transition-colors pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, localisation ou mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all shadow-inner"
                />
              </div>

              <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl overflow-x-auto no-scrollbar">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilterType(type.id)}
                    className={`whitespace-nowrap px-6 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filterType === type.id
                        ? "bg-white text-black shadow-lg"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center backdrop-blur-sm">
                <Calendar className="w-16 h-16 text-white/5 mx-auto mb-6" />
                <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                  Aucune session programmée
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredEvents.map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    const fillPercentage =
                      event.capacity > 0
                        ? (event.ticketsSold / event.capacity) * 100
                        : 0;

                    return (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                        className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                      >
                        <Icon className="absolute -top-8 -right-8 w-48 h-48 text-white/[0.02] -rotate-12 transition-transform group-hover:rotate-0 group-hover:text-white/[0.04] duration-1000" />

                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-8">
                            <div
                              className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(event.status)}`}
                            >
                              {event.status === 'upcoming' ? 'À venir' : 
                               event.status === 'ongoing' ? 'En cours' :
                               event.status === 'completed' ? 'Terminé' : 'Annulé'}
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEvent(event.id);
                                }}
                                className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-[#51A2FF]/20 border border-white/10 hover:border-[#51A2FF]/30 transition-all text-white/40 hover:text-[#51A2FF]"
                              >
                                <Edit2 className="w-4 h-4 mx-auto" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(event.id);
                                }}
                                disabled={deleteMutation.isPending}
                                className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-all text-white/40 hover:text-red-400 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </div>
                          </div>

                          <div className="mb-8">
                            <div className="flex items-center gap-2 text-[#51A2FF] text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                              <Icon className="w-3.5 h-3.5" />
                              <span>{event.type}</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-[#51A2FF] transition-colors mb-4">
                              {event.title}
                            </h3>
                            <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">
                              {event.description || "Aucune description fournie pour cet événement."}
                            </p>
                          </div>

                          <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-widest">
                                {new Date(event.date).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-widest">
                                {event.startTime} — {event.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-widest truncate">
                                {event.location || "Localisation non définie"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                              <span className="text-white/20">Capacité Système</span>
                              <span
                                className={
                                  fillPercentage > 90
                                    ? "text-pink-500"
                                    : "text-[#51A2FF]"
                                }
                              >
                                {event.ticketsSold || 0} / {event.capacity || 0}
                              </span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${fillPercentage}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={`h-full rounded-full bg-gradient-to-r ${
                                  fillPercentage > 90
                                    ? "from-pink-600 to-red-500"
                                    : "from-[#51A2FF] to-blue-600"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
