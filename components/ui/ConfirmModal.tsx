"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: "danger" | "confirm";
  onClose: () => void;
  onConfirm: () => void;
};

const ANIM_MS = 220; // 200-250ms as requested

export default function ConfirmModal({
  open,
  title = "Please confirm",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  intent = "danger",
  onClose,
  onConfirm,
}: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // small delay to allow element to mount before toggling visible for enter animation
      requestAnimationFrame(() => setVisible(true));
    } else if (mounted) {
      // trigger exit animation
      setVisible(false);
      const t = window.setTimeout(() => setMounted(false), ANIM_MS + 20);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // simple focus trap
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!document.activeElement) return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    if (mounted) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length) focusable[0].focus();
      }, 10);
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (previouslyFocused.current) previouslyFocused.current.focus();
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const backdropClass = visible
    ? "absolute inset-0 bg-black/60 backdrop-blur-sm opacity-100 transition-opacity duration-200 ease-out"
    : "absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-200 ease-in";

  const dialogClass = visible
    ? "relative z-10 w-full max-w-lg mx-4 bg-slate-900 text-slate-100 rounded-2xl shadow-xl transform transition-all duration-200 ease-out scale-100 opacity-100 translate-y-0"
    : "relative z-10 w-full max-w-lg mx-4 bg-slate-900 text-slate-100 rounded-2xl shadow-xl transform transition-all duration-200 ease-in scale-95 opacity-0 -translate-y-2";

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={backdropClass} onClick={onClose} />

      <div ref={containerRef} role="dialog" aria-modal="true" className={dialogClass}>
        <div className="p-6">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="mt-2 text-sm text-slate-300">{description}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-700 text-slate-200 bg-transparent hover:bg-slate-800/50"
            >
              {cancelLabel}
            </button>

            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md text-white ${
                intent === "danger" ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
