import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EtsyRank Lab — Etsy SEO research toolkit",
  description:
    "Research Etsy keywords, analyze competitors, and optimize your listing tags. Demo MVP with mock data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
