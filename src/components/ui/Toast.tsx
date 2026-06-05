"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none w-full max-w-full sm:max-w-[350px]">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#25D366]" />,
    error: <XCircle className="w-5 h-5 text-[var(--accent-red)]" />,
    info: <Info className="w-5 h-5 text-[var(--accent-gold)]" />,
  };

  const borders = {
    success: "border-[#25D366]",
    error: "border-[var(--accent-red)]",
    info: "border-[var(--accent-gold)]",
  };

  const bgs = {
    success: "bg-[#25D366]",
    error: "bg-[var(--accent-red)]",
    info: "bg-[var(--accent-gold)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 bg-[var(--bg-card)] p-4 rounded-[12px] border-l-[3px] shadow-2xl ${borders[toast.type]} border-y border-y-[rgba(255,255,255,0.05)] border-r border-r-[rgba(255,255,255,0.05)]`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <p className="text-[clamp(12px,2.5vw,14px)] font-[family-name:var(--font-body)] text-[var(--text-primary)] leading-tight flex-1">
        {toast.message}
      </p>
      <button onClick={() => onRemove(toast.id)} className="text-[var(--text-muted)] hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[2px] ${bgs[toast.type]}`}
      />
    </motion.div>
  );
}
