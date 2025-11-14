"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import Pagination from "@/components/admin/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/ToastProvider";

type Pro = {
  id: string;
  full_name?: string;
  email?: string;
  status?: string;
};

export default function ProfessionalsPage() {
  const [items, setItems] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/admin/professionals")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setItems(data.professionals ?? data ?? []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const doApprove = async (proId: string) => {
    // invoked after modal confirm
    setLoadingById((s) => ({ ...s, [proId]: true }));
    setItems((prev) => prev.map((p) => (p.id === proId ? { ...p, status: "approved" } : p)));
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proId }),
      });
      if (!res.ok) throw new Error("failed");
      showToast({ type: "success", title: "Professional approved", message: "" });
    } catch (err) {
      console.error(err);
      // revert
      setItems((prev) => prev.map((p) => (p.id === proId ? { ...p, status: "pending" } : p)));
      showToast({ type: "error", title: "Action failed", message: "Could not approve professional" });
    } finally {
      setLoadingById((s) => ({ ...s, [proId]: false }));
    }
  };

  const [confirmState, setConfirmState] = useState<{ open: boolean; id?: string | null }>({ open: false, id: null });
  const { showToast } = useToast();

  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div>
      <h2 className="text-lg font-semibold">Professionals</h2>

      <AdminTable>
        <thead className="sticky top-0 bg-slate-900/80">
          <tr>
            <th className="text-left px-4 py-3 text-sm text-slate-300">Name</th>
            <th className="text-left px-4 py-3 text-sm text-slate-300">Email</th>
            <th className="text-left px-4 py-3 text-sm text-slate-300">Status</th>
            <th className="text-right px-4 py-3 text-sm text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading...</td>
            </tr>
          ) : pageItems.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No professionals</td>
            </tr>
          ) : (
            pageItems.map((p) => (
              <tr
                key={p.id}
                data-selected={selectedId === p.id}
                onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                className="even:bg-slate-900/50 hover:bg-slate-800/60 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm">{p.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{p.email ?? "—"}</td>
                <td className="px-4 py-3 text-sm">
                  {p.status === "approved" ? (
                    <span className="badge badge-approved">Approved</span>
                  ) : p.status === "pending" ? (
                    <span className="badge badge-pending">Pending</span>
                  ) : (
                    <span className="badge badge-blocked">{p.status ?? "Blocked"}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    {p.status !== "approved" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmState({ open: true, id: p.id });
                        }}
                        disabled={!!loadingById[p.id]}
                        className="rounded-md px-3 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm border border-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingById[p.id] ? (
                          <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        ) : (
                          "Approve"
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>

      <ConfirmModal
        open={confirmState.open}
        title="Approve professional"
        description="This will approve the professional and make their profile visible."
        confirmLabel="Approve"
        intent="confirm"
        onClose={() => setConfirmState({ open: false, id: null })}
        onConfirm={() => {
          const id = confirmState.id;
          if (id) doApprove(id);
          setConfirmState({ open: false, id: null });
        }}
      />

      <Pagination totalItems={items.length} pageSize={pageSize} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
