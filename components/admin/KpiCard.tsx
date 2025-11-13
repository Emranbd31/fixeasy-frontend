"use client";
import React from "react";

type Props = {
    label: string;
    value: string | number;
    hint?: string;
    Icon?: React.ComponentType<{ className?: string }>;
};

export default function KpiCard({ label, value, hint, Icon }: Props) {
    const makeTestId = (s: string) =>
        `kpi-label-${s.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase()}`;
    return (
        <div className="card card-hover bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-white/5 shadow-lg">
            <div className="flex items-center justify-between rounded-t-2xl p-3 bg-gradient-to-r from-[#0ea5e9] via-[#7c3aed] to-[#ec4899] text-white">
                <span data-testid={makeTestId(label)} className="text-sm font-medium tracking-wide">{label}</span>
                {Icon && <Icon className="h-5 w-5 opacity-90" />}
            </div>
            <div className="p-5">
                <div className="mt-2 text-4xl md:text-5xl font-extrabold text-white leading-tight">{value}</div>
                {hint && <div className="mt-2 text-sm text-slate-300">{hint}</div>}
            </div>
        </div>
    );
}
