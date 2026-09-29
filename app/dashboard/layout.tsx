import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server component — safe to read env here (never sent to the client).
  const live = Boolean(process.env.ETSY_API_KEY && process.env.ETSY_SHARED_SECRET);
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
        </main>
        <footer className="border-t border-slate-200/70 px-8 py-5 text-center text-xs text-slate-400">
          {live
            ? "EtsyRank Lab — competition counts live from the Etsy Open API; search volumes are estimates. Not affiliated with or endorsed by Etsy, Inc."
            : "EtsyRank Lab demo — mock data only. Not affiliated with or endorsed by Etsy, Inc."}
        </footer>
      </div>
    </div>
  );
}
