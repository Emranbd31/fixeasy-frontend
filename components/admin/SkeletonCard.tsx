"use client";
import React from "react";

export default function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={
        `animate-pulse bg-white/50 dark:bg-slate-700/40 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-800 ${
          className ?? ""
        }`
      }
      role="status"
      aria-busy="true"
    >
      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-full mb-3" />
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded w-1/3" />
        <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded w-1/4" />
        <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded w-1/6" />
      </div>
    </div>
  );
}
