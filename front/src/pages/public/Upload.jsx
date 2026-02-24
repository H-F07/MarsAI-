import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, CheckCircle, XCircle, Film, Loader2, Sparkles, ChevronLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CATEGORIES = [
  "Art Numérique",
  "Fiction",
  "Documentaire",
  "Animation",
  "Séducteur",
  "Expérimental",
];

function StepBar({ currentStep }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-[3px] flex-1 rounded-full transition-all duration-500 ${
            step <= currentStep ? "bg-[#51A2FF]" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function UploadPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [duration, setDuration] = useState("");
  const [synopsis, setSynopsis] = useState("");

  // Step 2
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  // Submission
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  // Convertit "01:45" → 105 secondes
  const parseDurationToSeconds = (str) => {
    if (!str) return null;
    const parts = str.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1 && !isNaN(parts[0])) return parts[0];
    return null;
  };

  const handleSubmit = async () => {
    setStatus("uploading");
    setError("");
    setResult(null);

    // ── Étape 1 : upload vidéo + toutes les métadonnées ──────────────
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    if (category) formData.append("category", category);
    if (country)  formData.append("country", country);
    if (duration) formData.append("duration", duration);
    if (synopsis) formData.append("synopsis", synopsis);

    try {
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const uploadRes = await fetch(`${API_URL}/api/videos/upload`, {
        method: "POST",
        headers: authHeader,
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error || "Erreur lors de l'upload");
        setStatus("error");
        return;
      }

      // ── Étape 2 : créer la fiche Film en base (si connecté + youtubeId) ──
      if (token && uploadData.youtubeVideoId) {
        try {
          const filmRes = await fetch(`${API_URL}/api/films`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader,
            },
            body: JSON.stringify({
              title,
              description: synopsis || "",
              youtubeId: uploadData.youtubeVideoId,
              country: country || "FRA",
              duration: parseDurationToSeconds(duration),
              aiIdentity: { scenario: null, image: null, video: null, sound: null, postProduction: null },
            }),
          });

          const filmData = await filmRes.json();
          setResult({ ...uploadData, film: filmData.film });
        } catch {
          // La création de fiche Film a échoué mais la vidéo est bien uploadée
          setResult(uploadData);
        }
      } else {
        setResult(uploadData);
      }

      setStatus("success");
    } catch {
      setError("Impossible de contacter le serveur");
      setStatus("error");
    }
  };

  const reset = () => {
    setStep(1);
    setTitle("");
    setCategory("");
    setCountry("");
    setDuration("");
    setSynopsis("");
    setFile(null);
    setStatus("idle");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen px-6 pb-36">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-[52px] font-black uppercase leading-none tracking-tight"
            style={{
              background: "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.45) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SOUMISSION
          </h1>
          <p className="text-white/35 text-[11px] font-bold uppercase tracking-[0.22em] mt-2">
            Étape {step} sur 3 &nbsp;·&nbsp; Marsai 2026
          </p>
        </div>

        {/* AI Icon */}
        <button className="w-14 h-14 rounded-full bg-[#0e1a35] flex items-center justify-center border border-[#1e3060] shrink-0">
          <Sparkles className="w-6 h-6 text-[#51A2FF]" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <StepBar currentStep={step} />
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1 ─────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {/* Identité de l'œuvre */}
            <div>
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                Identité de l'œuvre
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                    Titre du film
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex : NEURAL ODYSSEY"
                    className="w-full px-6 py-[18px] rounded-[50px] bg-white/[0.03] border border-white/[0.07] text-white placeholder-white/20 text-sm font-medium outline-none focus:border-[#51A2FF]/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                      Catégorie
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-6 py-[18px] rounded-[50px] bg-white/[0.03] border border-white/[0.07] text-white text-sm font-medium outline-none focus:border-[#51A2FF]/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#060606]">
                        Sélectionner...
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#060606]">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                      Pays d'origine
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Ex : FRANCE 🇫🇷"
                      className="w-full px-6 py-[18px] rounded-[50px] bg-white/[0.03] border border-white/[0.07] text-white placeholder-white/20 text-sm font-medium outline-none focus:border-[#51A2FF]/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Détails techniques */}
            <div>
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                Détails techniques
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                    Durée estimée
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ex: 01:45"
                    className="w-full px-6 py-[18px] rounded-[50px] bg-white/[0.03] border border-white/[0.07] text-white placeholder-white/20 text-sm font-medium outline-none focus:border-[#51A2FF]/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/45 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                    Synopsis
                  </label>
                  <textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Racontez votre histoire..."
                    rows={6}
                    className="w-full px-6 py-5 rounded-[36px] bg-white/[0.03] border border-white/[0.07] text-white placeholder-white/20 text-sm font-medium outline-none focus:border-[#51A2FF]/40 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => title && setStep(2)}
              disabled={!title}
              className="w-full py-[18px] rounded-[50px] bg-white/[0.06] border border-white/[0.09] text-white font-black uppercase tracking-[0.2em] text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/[0.10] transition-all"
            >
              Étape suivante
            </button>
          </motion.div>
        )}

        {/* ── STEP 2 ─────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
              Fichier vidéo
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-4 p-14 rounded-[40px] border-2 border-dashed cursor-pointer transition-all ${
                dragOver
                  ? "border-[#51A2FF] bg-[#51A2FF]/8"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file ? (
                <>
                  <Film className="w-12 h-12 text-[#51A2FF]" />
                  <p className="text-white font-bold text-sm truncate max-w-[280px]">{file.name}</p>
                  <p className="text-white/40 text-xs">{(file.size / 1024 / 1024).toFixed(1)} Mo</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-white/20" />
                  <p className="text-white/50 text-sm font-bold uppercase tracking-wider">
                    Glisser une vidéo ici
                  </p>
                  <p className="text-white/25 text-xs">mp4 · mov · avi · webm — max 500 Mo</p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-[18px] rounded-[50px] bg-white/[0.04] border border-white/[0.08] text-white/55 font-black uppercase tracking-[0.18em] text-sm hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
              <button
                onClick={() => file && setStep(3)}
                disabled={!file}
                className="flex-[2] py-[18px] rounded-[50px] bg-white/[0.06] border border-white/[0.09] text-white font-black uppercase tracking-[0.2em] text-sm disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/[0.10] transition-all"
              >
                Étape suivante
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3 ─────────────────────────────────────── */}
        {step === 3 && status !== "success" && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
              Récapitulatif
            </p>

            <div className="space-y-3 p-6 rounded-[28px] bg-white/[0.03] border border-white/[0.07]">
              {[
                { label: "Titre", value: title },
                { label: "Catégorie", value: category },
                { label: "Pays", value: country },
                { label: "Durée", value: duration },
                { label: "Fichier", value: file?.name },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <span className="text-white/35 text-[10px] font-bold uppercase tracking-[0.18em] shrink-0 pt-0.5">
                      {row.label}
                    </span>
                    <span className="text-white text-sm font-medium text-right truncate max-w-[240px]">
                      {row.value}
                    </span>
                  </div>
                ))}
            </div>

            {status === "error" && (
              <div className="flex items-center gap-3 p-4 rounded-[20px] bg-red-500/10 border border-red-500/20">
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                disabled={status === "uploading"}
                className="flex-1 py-[18px] rounded-[50px] bg-white/[0.04] border border-white/[0.08] text-white/55 font-black uppercase tracking-[0.18em] text-sm hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={status === "uploading"}
                className="flex-[2] py-[18px] rounded-[50px] bg-gradient-to-r from-purple-600 to-[#51A2FF] text-white font-black uppercase tracking-[0.2em] text-sm disabled:opacity-40 hover:shadow-[0_0_30px_rgba(81,162,255,0.35)] transition-all flex items-center justify-center gap-2"
              >
                {status === "uploading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Soumettre"
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS ────────────────────────────────────── */}
        {status === "success" && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-5" />
              </motion.div>
              <p className="text-green-400 font-black text-xl uppercase tracking-[0.15em]">
                Soumission réussie
              </p>
              <p className="text-white/35 text-sm mt-3">
                Votre film a été soumis à MARSAI 2026
              </p>
            </div>

            {result.youtubeVideoId && (
              <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/[0.07] space-y-2 text-xs font-mono">
                <div className="flex gap-3">
                  <span className="text-white/30 shrink-0">YouTube ID</span>
                  <span className="text-white/60 break-all">{result.youtubeVideoId}</span>
                </div>
                {result.key && (
                  <div className="flex gap-3">
                    <span className="text-white/30 shrink-0">S3 Key</span>
                    <span className="text-white/60 break-all">{result.key}</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={reset}
              className="w-full py-[18px] rounded-[50px] bg-white/[0.05] border border-white/[0.09] text-white/55 font-black uppercase tracking-[0.2em] text-sm hover:bg-white/[0.09] transition-all"
            >
              Nouvelle soumission
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
