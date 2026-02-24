import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Users,
  Type,
  AlignLeft,
  AlertCircle,
  Loader2,
  Tag,
  Rocket,
  Image as ImageIcon,
  Save,
  Zap,
  X,
  Check
} from "lucide-react";
import { getEventById, createEvent, updateEvent } from "../../api/events.js";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1751823886813-0cfc86cb9478?w=1080&q=80";

const EMPTY_EVENT = {
  title: "",
  type: "screening",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  capacity: 0,
  description: "",
  status: "upcoming",
};

export default function EditEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState(EMPTY_EVENT);
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAttemptedRef = useRef(false);

  const { data: eventData, isPending: isLoadingEvent } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && eventData?.data) {
      const event = eventData.data;
      setFormData({
        title: event.title || "",
        type: event.type || "screening",
        date: event.date || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        location: event.location || "",
        capacity: event.capacity || 0,
        description: event.description || "",
        status: event.status || "upcoming",
      });
    }
  }, [isEditing, eventData]);

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      submitAttemptedRef.current = false;
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/admin/events");
    },
    onError: (err) => {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.message ||
          err.message ||
          "Erreur lors de la création de l'événement"
      );
      submitAttemptedRef.current = false;
      setIsSubmitting(false);
    },
    retry: false,
    retryOnMount: false,
    onSettled: () => {
      submitAttemptedRef.current = false;
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateEvent(id, data),
    onSuccess: () => {
      submitAttemptedRef.current = false;
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      navigate("/admin/events");
    },
    onError: (err) => {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.message ||
          err.message ||
          "Erreur lors de la mise à jour de l'événement"
      );
      submitAttemptedRef.current = false;
      setIsSubmitting(false);
    },
    retry: false,
    retryOnMount: false,
    onSettled: () => {
      submitAttemptedRef.current = false;
      setIsSubmitting(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting || isFormLoading || submitAttemptedRef.current) return;

    setError("");
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      setError("Veuillez remplir tous les champs obligatoires (Titre, Date, Horaires)");
      return;
    }

    submitAttemptedRef.current = true;
    setIsSubmitting(true);
    if (isEditing) updateMutation.mutate(formData);
    else createMutation.mutate(formData);
  };

  const isFormLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;
  const existingEvent = eventData?.data;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#51A2FF]/10 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="sticky top-0 z-40 bg-[#020202]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/admin/events")}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
                {isEditing ? "Édition Session" : "Nouvelle Session"}
              </h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                {isEditing ? `ID Système : ${id}` : "Initialisation programmation 2026"}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              disabled={isFormLoading}
              className="px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white/40 font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isFormLoading || submitAttemptedRef.current}
              className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              {isEditing ? "Appliquer" : "Publier"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {isEditing && isLoadingEvent ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#51A2FF] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#51A2FF]/20 animate-pulse" />
            </div>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Récupération des données...</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
              )
                e.preventDefault();
            }}
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 shadow-xl"
              >
                <div className="p-2 rounded-xl bg-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                </div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Banner Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative h-80 rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center backdrop-blur-sm"
            >
              <img
                src={bannerImage}
                alt="Event Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[2000ms]"
                onError={() => setBannerImage("")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="size-20 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[32px] flex items-center justify-center group-hover:bg-white/20 transition-all shadow-2xl">
                  <ImageIcon className="size-8 text-white/60" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 block mb-4">
                    Visuel de couverture 16:9
                  </span>
                  <button
                    type="button"
                    className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    Remplacer l'image
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 space-y-8 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-[#51A2FF]/10 rounded-2xl flex items-center justify-center border border-[#51A2FF]/20">
                      <Tag className="size-5 text-[#51A2FF]" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                      Spécifications de la session
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                        Titre de l'expérience
                      </label>
                      <div className="relative group">
                        <Type className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-[#51A2FF] transition-colors" />
                        <input
                          type="text"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="ex: Odyssey AI: Premiere"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                          Typologie
                        </label>
                        <div className="relative">
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#51A2FF]/50 appearance-none cursor-pointer transition-all shadow-inner"
                          >
                            <option value="screening" className="bg-[#0a0a0a]">Projection Cinema</option>
                            <option value="workshop" className="bg-[#0a0a0a]">Atelier Créatif</option>
                            <option value="masterclass" className="bg-[#0a0a0a]">Conférence Expert</option>
                            <option value="concert" className="bg-[#0a0a0a]">Performance Live</option>
                            <option value="party" className="bg-[#0a0a0a]">Networking / Party</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-white/20 pointer-events-none" />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                            État Système
                          </label>
                          <div className="relative">
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#51A2FF]/50 appearance-none cursor-pointer transition-all shadow-inner"
                            >
                              <option value="upcoming" className="bg-[#0a0a0a]">À venir</option>
                              <option value="ongoing" className="bg-[#0a0a0a]">En cours</option>
                              <option value="completed" className="bg-[#0a0a0a]">Terminé</option>
                              <option value="cancelled" className="bg-[#0a0a0a]">Annulé</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-white/20 pointer-events-none" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                        Résumé Narratif
                      </label>
                      <div className="relative group">
                        <AlignLeft className="absolute left-5 top-6 size-4 text-white/20 group-focus-within:text-[#51A2FF] transition-colors" />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={6}
                          placeholder="Décrivez l'univers et les enjeux de cette session..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] pl-14 pr-8 py-6 text-sm text-white focus:outline-none focus:border-[#51A2FF]/50 focus:bg-white/[0.05] transition-all resize-none shadow-inner leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Time & Location */}
              <div className="lg:col-span-5 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 space-y-8 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                      <Calendar className="size-5 text-purple-400" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                      Chronologie & Lieu
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                        Date du protocole
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                          Ouverture
                        </label>
                        <div className="relative group">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                          <input
                            type="time"
                            name="startTime"
                            required
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                          Clôture
                        </label>
                        <div className="relative group">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                          <input
                            type="time"
                            name="endTime"
                            required
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                        Localisation (Espace)
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Sélectionnez un espace..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">
                        Capacité d'accueil
                      </label>
                      <div className="relative group">
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="ex: 500"
                          min="0"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {isEditing && existingEvent && existingEvent.ticketsSold > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-pink-600/5 border border-pink-600/10 rounded-[32px] flex items-center gap-5 backdrop-blur-sm shadow-xl"
                  >
                    <div className="size-12 rounded-2xl bg-pink-600/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-pink-500 uppercase tracking-tight">
                        Zone de Vigilance
                      </h4>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 leading-relaxed">
                        {existingEvent.ticketsSold} unités d'accès déjà émises. Toute modification impactera les participants.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="pt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="w-full sm:w-auto px-12 py-5 rounded-2xl border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
              >
                Annuler les modifications
              </button>
              <button
                type="submit"
                disabled={isFormLoading || submitAttemptedRef.current}
                className="w-full sm:w-auto bg-white text-black px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFormLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Rocket className="size-5" />
                )}
                <span>{isEditing ? "Mettre à jour le protocole" : "Lancer la session"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
