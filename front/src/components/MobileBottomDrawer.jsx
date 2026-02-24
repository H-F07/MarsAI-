import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export function MobileBottomDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  direction = "bottom",
  maxWidthClassName = "max-w-lg",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <motion.div
          key="drawer-content"
          initial={direction === "right" ? { x: "100%" } : { y: "100%" }}
          animate={direction === "right" ? { x: 0 } : { y: 0 }}
          exit={direction === "right" ? { x: "100%" } : { y: "100%" }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          onClick={(event) => event.stopPropagation()}
          className={
            direction === "right"
              ? "absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/60"
              : `absolute bottom-0 left-0 right-0 mx-auto w-full ${maxWidthClassName} rounded-t-[24px] border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/60`
          }
        >
          {direction === "bottom" ? <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" /> : null}

          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-4">
            <div>
              {title ? <h3 className="text-sm font-black uppercase tracking-widest text-white">{title}</h3> : null}
              {description ? <p className="mt-1 text-xs text-white/50">{description}</p> : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>{children}</div>

          {footer ? <div className="border-t border-white/10 p-4">{footer}</div> : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
