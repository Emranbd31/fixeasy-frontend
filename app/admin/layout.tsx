import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#020617] text-slate-100`}> 
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8 space-y-6">
            <ToastProvider>
              {children}
            </ToastProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
