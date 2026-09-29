import Link from "next/link";
import { Button } from "../ui";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">
            ER
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">EtsyRank Lab</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#pricing" className="hover:text-slate-900">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Try it free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
