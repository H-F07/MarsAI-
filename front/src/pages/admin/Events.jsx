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
    <div className="min-h-screen bg-[#050505] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />
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

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-none mb-2">
                Gestion des Événements
              </h1>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
                Contrôle du protocole marsAI 2026
              </p>
            </div>

            <button
              onClick={handleAddEvent}
              className="group relative bg-white text-black px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all overflow-hidden"
            >
              <Plus className="w-5 h-5" />
              <span className="font-black text-xs uppercase tracking-widest">
                Créer un événement
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>

          {isPending ? (
            <div className="flex items-center justify-center py-16 gap-3 mt-10">
              <Loader2 className="w-6 h-6 text-[#51A2FF] animate-spin" />
              <span className="text-white/40 text-sm font-black uppercase tracking-widest">
                Chargement...
              </span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 mt-10">
              <XCircle className="w-8 h-8 text-red-400" />
              <p className="text-red-400 font-black uppercase tracking-widest text-sm">
                Erreur lors du chargement des événements
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                {
                  label: "Total Événements",
                  value: stats.total,
                  icon: Calendar,
                  color: "text-[#51A2FF]",
                },
                {
                  label: "À Venir",
                  value: stats.upcoming,
                  icon: Clock,
                  color: "text-purple-500",
                },
                {
                  label: "Billets Vendus",
                  value: stats.totalTickets,
                  icon: Ticket,
                  color: "text-pink-500",
                },
                {
                  label: "Taux Remplissage",
                  value: `${stats.capacity > 0 ? Math.round((stats.totalTickets / stats.capacity) * 100) : 0}%`,
                  icon: Users,
                  color: "text-emerald-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all"
                >
                  <div
                    className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">
                      {stat.label}
                    </div>
                    <div className="text-xl font-black tracking-tight">
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isPending ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#51A2FF] animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 font-black uppercase tracking-widest">
              Impossible de charger les événements
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  "all",
                  "screening",
                  "workshop",
                  "masterclass",
                  "concert",
                  "party",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap border transition-all ${
                      filterType === type
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {type === "all" ? "Tous" : type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative bg-white/[0.02] border border-white/5 rounded-[32px] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer overflow-hidden"
                    >
                      <Icon className="absolute -top-4 -right-4 w-32 h-32 text-white/[0.02] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <div
                            className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(event.status)}`}
                          >
                            {event.status}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id);
                            }}
                            disabled={deleteMutation.isPending}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                          </button>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                            <Icon className="w-3 h-3" />
                            <span>{event.type}</span>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                            {event.title}
                          </h3>
                        </div>

                        <div className="space-y-3 mb-8">
                          <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>
                              {event.startTime} — {event.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location || "Non spécifié"}</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span className="text-white/40">Remplissage</span>
                            <span
                              className={
                                fillPercentage > 90
                                  ? "text-pink-500"
                                  : "text-white/60"
                              }
                            >
                              {event.ticketsSold || 0}/{event.capacity || 0}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${fillPercentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full bg-gradient-to-r ${
                                fillPercentage > 90
                                  ? "from-pink-600 to-pink-400"
                                  : "from-[#51A2FF] to-[#51A2FF]"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="mt-8 flex gap-2">
                          <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest transition-all">
                            Détails
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event.id);
                            }}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-[#51A2FF]/20 hover:border-[#51A2FF]/30 border border-white/10 transition-all text-white/40 hover:text-[#51A2FF]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-white/10" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                  {events.length === 0
                    ? "Aucun événement créé"
                    : "Aucun événement trouvé"}
                </h3>
                <p className="text-white/40 max-w-sm">
                  {events.length === 0
                    ? "Créez votre premier événement en cliquant sur le bouton ci-dessus."
                    : "Désolé, nous n'avons trouvé aucun événement correspondant à vos critères de recherche."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
