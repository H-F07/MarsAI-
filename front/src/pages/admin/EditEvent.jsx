import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
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
    <div className="min-h-screen bg-[#000000] text-white font-['Arimo',sans-serif] overflow-y-auto pb-32">
      <div className="sticky top-0 z-40 bg-[#000000] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/admin/events")}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                {isEditing ? "Modifier l'Événement" : "Lancer un Événement"}
              </h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                {isEditing ? `ID: ${id}` : "Configuration de la programmation 2026"}
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              disabled={isFormLoading}
              className="px-6 py-3 rounded-[24px] border border-white/5 hover:bg-white/5 transition-all text-white/40 font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isFormLoading || submitAttemptedRef.current}
              className="bg-white text-black px-6 py-3 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              {isEditing ? "Sauvegarder" : "Lancer le protocole"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {isEditing && isLoadingEvent ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#51A2FF] animate-spin" />
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
            {(error || createMutation.isError || updateMutation.isError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm font-bold">
                  {error ||
                    createMutation.error?.response?.data?.message ||
                    updateMutation.error?.response?.data?.message ||
                    "Une erreur est survenue"}
                </p>
              </div>
            )}

            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative h-72 rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center"
            >
              <img
                src={bannerImage}
                alt="Event Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
                onError={() => setBannerImage("")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="size-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <ImageIcon className="size-8 text-white/60" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  Visual Banner 16:9
                </span>
                <button
                  type="button"
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Charger une image
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Détails de l'événement */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-[#51A2FF]/10 rounded-xl flex items-center justify-center border border-[#51A2FF]/20">
                      <Tag className="size-4 text-[#51A2FF]" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                      Détails de l'événement
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                        Titre de l'expérience
                      </label>
                      <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="ex: Odyssey AI: Premiere"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#51A2FF]/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                        Type de session
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-[#51A2FF]/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="screening">Projection Cinema</option>
                        <option value="workshop">Atelier Créatif</option>
                        <option value="masterclass">Conférence Expert</option>
                        <option value="concert">Performance Live</option>
                        <option value="party">Networking / Party</option>
                      </select>
                    </div>

                    {isEditing && (
                      <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                          Statut
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-[#51A2FF]/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="upcoming">À venir</option>
                          <option value="ongoing">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                        Résumé narratif
                      </label>
                      <div className="relative">
                        <AlignLeft className="absolute left-4 top-4 size-4 text-white/20" />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Plongez les spectateurs dans l'univers de cet événement..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#51A2FF]/50 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Chronologie & Lieu */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                      <Calendar className="size-4 text-purple-500" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                      Chronologie & Lieu
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                        Date du protocole
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                          Début
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                          <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                          Fin
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                          <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                        Localisation (Espace)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Sélectionnez un espace..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">
                        Nombre de participants max.
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/20" />
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="ex: 500"
                          min="0"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {isEditing && existingEvent && existingEvent.ticketsSold > 0 && (
              <div className="p-6 bg-pink-600/5 border border-pink-600/10 rounded-[24px] flex items-center gap-4">
                <AlertCircle className="w-5 h-5 text-pink-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-pink-500 uppercase tracking-tight">
                    Zone de danger
                  </h4>
                  <p className="text-xs text-white/40">
                    Toute modification sur un événement ayant des billets vendus (
                    {existingEvent.ticketsSold}) doit être notifiée aux participants.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
              <button
                type="button"
                onClick={() => navigate("/admin/events")}
                className="w-full md:w-auto px-12 py-5 rounded-[24px] border border-white/10 text-white/40 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Sauvegarder en Brouillon
              </button>
              <button
                type="submit"
                disabled={isFormLoading || submitAttemptedRef.current}
                className="w-full md:w-auto bg-[#51A2FF] text-black px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(81,162,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFormLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Rocket className="size-5" />
                )}
                {isEditing ? "Enregistrer les modifications" : "Publier l'événement"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
