"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import Pagination from "@/components/admin/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/ToastProvider";

type User = {
  id: string;
  full_name?: string;
  email?: string;
  active?: boolean;
};

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setItems(data.clients ?? data ?? []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const doDeactivate = async (userId: string, active: boolean) => {
    // this function will be invoked by the modal confirm
    setLoadingById((s) => ({ ...s, [userId]: true }));
    setItems((prev) => prev.map((p) => (p.id === userId ? { ...p, active } : p)));
    try {
      const res = await fetch("/api/admin/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, active }),
      });
      if (!res.ok) throw new Error("failed");
      // success toast with optional undo for deactivation
      if (!active) {
        showToast({
          type: "success",
          title: "User deactivated",
          message: "",
          action: { label: "Undo", onClick: () => doDeactivate(userId, true) },
          timeout: 4000,
        });
      } else {
        showToast({ type: "success", title: "User activated", message: "" });
      }
    } catch (err) {
      console.error(err);
      // revert optimistic update
      setItems((prev) => prev.map((p) => (p.id === userId ? { ...p, active: !active } : p)));
      showToast({ type: "error", title: "Action failed", message: "Could not update user" });
    } finally {
      setLoadingById((s) => ({ ...s, [userId]: false }));
    }
  };

  // modal state
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    id?: string | null;
    action?: "activate" | "deactivate";
  }>({ open: false, id: null, action: undefined });

  const { showToast } = useToast();

  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div>
      <h2 className="text-lg font-semibold">Users</h2>

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
              <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No users</td>
            </tr>
          ) : (
            pageItems.map((u) => (
              <tr
                key={u.id}
                data-selected={selectedId === u.id}
                onClick={() => setSelectedId(u.id === selectedId ? null : u.id)}
                className="even:bg-slate-900/50 hover:bg-slate-800/60 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm">{u.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{u.email ?? "—"}</td>
                <td className="px-4 py-3 text-sm">
                  {u.active ? (
                    <span className="badge badge-approved">Approved</span>
                  ) : (
                    <span className="badge badge-blocked">Deactivated</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmState({ open: true, id: u.id, action: u.active ? "deactivate" : "activate" });
                      }}
                      disabled={!!loadingById[u.id]}
                      className="rounded-md px-3 py-1 bg-slate-800/60 hover:bg-amber-600/20 text-slate-200 text-sm border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loadingById[u.id] ? (
                        <span className="h-4 w-4 border-2 border-t-transparent border-slate-200 rounded-full animate-spin" />
                      ) : u.active ? (
                        "Deactivate"
                      ) : (
                        "Activate"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.action === "deactivate" ? "Deactivate user" : "Activate user"}
        description={confirmState.action === "deactivate" ? "This will prevent the user from booking." : "This will allow the user to book again."}
        confirmLabel={confirmState.action === "deactivate" ? "Deactivate" : "Activate"}
        intent={confirmState.action === "deactivate" ? "danger" : "confirm"}
        onClose={() => setConfirmState({ open: false, id: null, action: undefined })}
        onConfirm={() => {
          const id = confirmState.id;
          if (id && confirmState.action) {
            doDeactivate(id, confirmState.action === "activate");
          }
          setConfirmState({ open: false, id: null, action: undefined });
        }}
      />

      <Pagination totalItems={items.length} pageSize={pageSize} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
