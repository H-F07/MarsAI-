import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, CheckCircle, XCircle, Film, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
    setStatus("idle");
    setResult(null);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("video", file);
    if (title) formData.append("title", title);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/videos/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'upload");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setError("Impossible de contacter le serveur");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setTitle("");
    setStatus("idle");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Publier une <span className="text-purple-500">vidéo</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Upload vers S3 · Vérification copyright YouTube
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-[24px] border-2 border-dashed cursor-pointer transition-all
              ${dragOver ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"}`}
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
                <Film className="w-10 h-10 text-purple-400" />
                <p className="text-white font-bold text-sm truncate max-w-[280px]">{file.name}</p>
                <p className="text-white/40 text-xs">{(file.size / 1024 / 1024).toFixed(1)} Mo</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-white/20" />
                <p className="text-white/50 text-sm font-bold uppercase tracking-wider">
                  Glisser une vidéo ici
                </p>
                <p className="text-white/25 text-xs">mp4 · mov · avi · webm — max 500 Mo</p>
              </>
            )}
          </div>

          {/* Title input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre (optionnel)"
              className="w-full px-5 py-3.5 rounded-[16px] bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm font-medium outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!file || status === "uploading"}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-[16px] bg-gradient-to-r from-purple-600 to-[#51A2FF] text-white font-black uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
          >
            {status === "uploading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Publier la vidéo
              </>
            )}
          </button>
        </form>

        {/* Result */}
        <AnimatePresence>
          {status === "success" && result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-6 rounded-[20px] bg-white/[0.03] border border-green-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <p className="text-green-400 font-bold text-sm uppercase tracking-wider">
                  Vidéo publiée avec succès
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {result.youtubeVideoId && (
                  <div className="flex gap-2">
                    <span className="text-white/30 shrink-0">YouTube ID</span>
                    <span className="text-white/70 break-all">{result.youtubeVideoId}</span>
                  </div>
                )}
                {result.key && (
                  <div className="flex gap-2">
                    <span className="text-white/30 shrink-0">S3 Key</span>
                    <span className="text-white/70 break-all">{result.key}</span>
                  </div>
                )}
                {result.s3Url && (
                  <div className="flex gap-2">
                    <span className="text-white/30 shrink-0">URL</span>
                    <a
                      href={result.s3Url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#51A2FF] break-all hover:underline"
                    >
                      {result.s3Url}
                    </a>
                  </div>
                )}
              </div>

              <p className="mt-4 text-white/30 text-xs">
                Vérification copyright YouTube en cours en arrière-plan.
              </p>

              <button
                onClick={reset}
                className="mt-4 w-full py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-white/60 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Uploader une autre vidéo
              </button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-6 rounded-[20px] bg-white/[0.03] border border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                <p className="text-red-400 font-bold text-sm uppercase tracking-wider">Erreur</p>
              </div>
              <p className="text-white/60 text-sm">{error}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 w-full py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-white/60 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Réessayer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
