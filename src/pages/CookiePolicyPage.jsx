import React from "react";

const COOKIE_TYPES = [
  { name: "Strictly Necessary", required: true, desc: "Essential for the Platform to function. Enable core features like login sessions and security tokens. These cannot be disabled." },
  { name: "Analytics & Performance", required: false, desc: "We use analytics cookies to understand how users interact with the Platform. No personally identifiable data is shared with third parties." },
  { name: "Functionality", required: false, desc: "These remember your preferences such as display settings and feed filters to provide a personalised experience." },
  { name: "Marketing & Advertising", required: false, desc: "Stakify does not currently serve third-party advertising. We may use first-party tracking to measure our own promotional campaigns." },
];

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-sm text-muted-foreground mb-2">Legal</div>
      <h1 className="text-3xl font-bold mb-1">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: April 28, 2026</p>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Stakify uses cookies to operate the Platform, analyse usage, and improve your experience.</p>
      <div className="space-y-4 mb-6">
        {COOKIE_TYPES.map((c) => (
          <div key={c.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{c.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${c.required ? "bg-gain/10 text-gain border-gain/20" : "bg-secondary text-muted-foreground border-border"}`}>{c.required ? "Always Active" : "Optional"}</span>
            </div>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-secondary/50 border border-border rounded-xl p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">How to manage cookies:</strong> You can control and delete cookies through your browser settings. Disabling certain cookies may affect Platform functionality.
        <br /><br />Contact: <a href="mailto:privacy@stakify.com" className="text-primary hover:underline">privacy@stakify.com</a>
      </div>
    </div>
  );
}