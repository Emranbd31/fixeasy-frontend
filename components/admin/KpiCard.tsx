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
        <div className="card card-hover">
            <div className="flex items-center justify-between rounded-t-2xl p-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white">
                <span data-testid={makeTestId(label)} className="text-sm font-medium">{label}</span>
                {Icon && <Icon className="h-5 w-5 opacity-90" />}
            </div>
            <div className="p-5">
                <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
                {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
            </div>
        </div>
    );
}
