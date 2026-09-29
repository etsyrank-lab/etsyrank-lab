import Link from "next/link";
import { Button } from "../ui";

const LINKS = [
  { href: "#tools", label: "Tools" },
  { href: "#how", label: "How it works" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-black text-white shadow-soft">
            ER
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            EtsyRank <span className="text-brand-600">Lab</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-brand-700"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Link href="/dashboard">
          <Button className="px-5">Open dashboard</Button>
        </Link>
      </div>
    </header>
  );
}
