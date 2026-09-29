import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
        </main>
        <footer className="border-t border-slate-200/70 px-8 py-5 text-center text-xs text-slate-400">
          EtsyRank Lab demo — mock data only. Not affiliated with or endorsed by Etsy, Inc.
        </footer>
      </div>
    </div>
  );
}
