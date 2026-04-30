import React from "react";
import { Link } from "react-router-dom";

const FOOTER_COLS = [
  { label: "Platform", links: [{ label: "About Us", path: "/about" }, { label: "Features", path: "/features" }, { label: "Pricing", path: "/pricing" }, { label: "Newsroom", path: "/newsroom" }, { label: "How It Works", path: "/how-it-works" }, { label: "Scoring & Calculations", path: "/calculations" }] },
  { label: "Legal", links: [{ label: "Terms & Conditions", path: "/terms" }, { label: "Privacy Policy", path: "/privacy" }, { label: "Cookie Policy", path: "/cookies" }, { label: "Accessibility", path: "/accessibility" }] },
];

export default function AppFooter() {
  return (
    <footer className="hidden md:block border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="font-bold text-lg mb-2"><span className="text-primary">S</span>takify</div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Transparent financial research with verified, publicly locked predictions. Not financial advice.</p>
        </div>
        {FOOTER_COLS.map((col) => (
          <div key={col.label}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{col.label}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => <li key={link.path}><Link to={link.path} className="text-sm text-foreground/70 hover:text-primary transition-colors">{link.label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border"><div className="max-w-7xl mx-auto px-4 py-4 text-xs text-muted-foreground text-center">© {new Date().getFullYear()} Stakify, Inc. All rights reserved. Not financial advice.</div></div>
    </footer>
  );
}