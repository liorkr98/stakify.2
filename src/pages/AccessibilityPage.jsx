import React from "react";
import { Eye } from "lucide-react";

const STANDARDS = [
  { label: "Keyboard Navigation", desc: "All interactive elements are accessible via keyboard. Focus indicators are visible and follow a logical order." },
  { label: "Screen Reader Support", desc: "Content is structured with semantic HTML and ARIA labels to support screen readers including NVDA, JAWS, and VoiceOver." },
  { label: "Color Contrast", desc: "Text and UI elements meet WCAG 2.1 AA minimum contrast ratios of 4.5:1 for normal text and 3:1 for large text." },
  { label: "Responsive Design", desc: "The Platform is fully responsive and usable across desktop, tablet, and mobile devices without loss of content." },
  { label: "Text Resizing", desc: "Users can increase text size up to 200% without loss of content or functionality using browser zoom." },
  { label: "Alternative Text", desc: "Images and non-text content include alternative text descriptions for assistive technology users." },
];

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><Eye className="w-4 h-4" />Accessibility</div>
      <h1 className="text-3xl font-bold mb-1">Accessibility Statement</h1>
      <p className="text-sm text-muted-foreground mb-2">Last updated: April 28, 2026</p>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Stakify is committed to ensuring digital accessibility for people with disabilities. Our goal is to conform to <strong className="text-foreground">WCAG 2.1 Level AA</strong>.</p>
      <h2 className="font-bold mb-4">Our Accessibility Commitments</h2>
      <div className="space-y-3 mb-6">
        {STANDARDS.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div><span className="font-semibold text-sm">{s.label} — </span><span className="text-sm text-muted-foreground">{s.desc}</span></div>
          </div>
        ))}
      </div>
      <div className="bg-secondary/50 border border-border rounded-xl p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Feedback & Contact:</strong> <a href="mailto:accessibility@stakify.com" className="text-primary hover:underline">accessibility@stakify.com</a> — We aim to respond within 5 business days.
      </div>
    </div>
  );
}