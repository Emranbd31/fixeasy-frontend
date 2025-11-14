"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type Toast = {
  id: string;
  title?: string;
  message?: string;
  type?: "success" | "error";
  timeout?: number;
  action?: { label: string; onClick: () => void } | null;
};

type InternalToast = {
  id: string;
  toast: Omit<Toast, "id">;
  visible: boolean;
};

type ToastContext = {
  showToast: (t: Omit<Toast, "id">) => string;
  dismissToast: (id: string) => void;
};

const ctx = createContext<ToastContext | null>(null);

export function useToast() {
  const c = useContext(ctx);
  if (!c) throw new Error("useToast must be used within ToastProvider");
  return c;
}

const ANIM_MS = 260; // match request: ~200-300ms

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<InternalToast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const removeToastCompletely = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    // start exit animation
    setToasts((s) => s.map((t) => (t.id === id ? { ...t, visible: false } : t)));
    // remove after animation
    const handle = window.setTimeout(() => removeToastCompletely(id), ANIM_MS);
    timers.current[id] = handle;
  }, [removeToastCompletely]);

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    const item: InternalToast = { id, toast: t, visible: false };
    setToasts((s) => [...s, item]);

    // trigger enter in next tick to animate
    setTimeout(() => {
      setToasts((s) => s.map((x) => (x.id === id ? { ...x, visible: true } : x)));
    }, 20);

    const timeout = t.timeout ?? 2500;
    if (timeout > 0) {
      const handle = window.setTimeout(() => {
        // start exit animation
        setToasts((s) => s.map((x) => (x.id === id ? { ...x, visible: false } : x)));
        const removal = window.setTimeout(() => removeToastCompletely(id), ANIM_MS);
        timers.current[id] = removal;
      }, timeout);
      timers.current[id] = handle;
    }

    return id;
  }, [removeToastCompletely]);

  // aria-live announcement for screen readers
  const [announcement, setAnnouncement] = useState<string | null>(null);
  // when a toast becomes visible, announce it
  React.useEffect(() => {
    const v = toasts.find((t) => t.visible);
    if (v) {
      const text = `${v.toast.title ?? ""} ${v.toast.message ?? ""}`.trim();
      if (text) {
        setAnnouncement(text);
        const clear = window.setTimeout(() => setAnnouncement(null), 1200);
        return () => clearTimeout(clear);
      }
    }
    return;
  }, [toasts]);

  return (
    <ctx.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Toast container */}
      {/* Screen reader live region */}
      <div aria-live="assertive" role="status" className="sr-only">
        {announcement}
      </div>

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((it) => {
          const t = it.toast;
          const base = `max-w-sm w-full rounded-lg p-3 shadow-lg border text-white flex items-start justify-between gap-3 pointer-events-auto`;
          const variant = t.type === "success" ? "bg-emerald-700/90 border-emerald-600" : "bg-red-700/90 border-red-600";
          const anim = it.visible
            ? "opacity-100 translate-y-0 transition-all duration-200 ease-out"
            : "opacity-0 translate-y-2 transition-all duration-200 ease-in";

          return (
            <div key={it.id} role="status" className={`${base} ${variant} ${anim}`}>
              <div>
                {t.title && <div className="font-semibold">{t.title}</div>}
                {t.message && <div className="text-sm mt-1 text-emerald-50/90">{t.message}</div>}
              </div>

              <div className="flex items-center gap-2">
                {t.action && (
                  <button
                    onClick={() => {
                      try {
                        t.action?.onClick();
                      } catch (e) {
                        console.error(e);
                      }
                      dismissToast(it.id);
                    }}
                    className="text-sm underline"
                  >
                    {t.action.label}
                  </button>
                )}
                <button onClick={() => dismissToast(it.id)} aria-label="dismiss" className="opacity-80">
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ctx.Provider>
  );
}
