import React from "react";
import { Target, Lock, TrendingUp, Zap, CheckCircle2, AlertTriangle, Info, MessageSquareQuote } from "lucide-react";

const SECTIONS = [
  { icon: Target, title: "Accuracy Score", color: "text-green-600", bg: "bg-green-50 border-green-200", content: [{ label: "What it measures", text: "The percentage of predictions that hit their target price within the stated timeframe." }, { label: "Exact hit (within 5%)", text: "100% credit → counts as a fully correct prediction." }, { label: "Near hit (5–15%)", text: "50% credit → counts as a partial prediction." }, { label: "Directionally correct (15–30%)", text: "25% credit → wrong magnitude but right direction." }, { label: "Miss", text: "0% credit. Both directional misses and expired timeframes count as misses." }, { label: "Formula", text: "Accuracy = (Σ prediction credits) ÷ (total predictions) × 100" }] },
  { icon: Lock, title: "Lock Price & Price Target", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", content: [{ label: "Lock Price", text: "The live market price at the exact second the analyst clicks 'Publish'. Cannot be altered." }, { label: "Price Target", text: "The analyst's stated price target for the ticker within the specified timeframe." }, { label: "Long example", text: "Lock $100, Target $130, 6 months. If price hits $128 → near hit (50%). If $135 → exact hit (100%)." }, { label: "Short example", text: "Lock $200, Target $150, 3 months. Credit is awarded if price falls below or near target." }] },
  { icon: Zap, title: "Points System", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", content: [{ label: "Exact prediction hit", text: "+100 points" }, { label: "Near hit (within 15%)", text: "+50 points" }, { label: "Directional hit (within 30%)", text: "+25 points" }, { label: "Publishing a report", text: "+10 points" }, { label: "Prediction miss", text: "−20 points" }, { label: "Streak bonus", text: "3+ correct in a row: +50 bonus points per extension" }] },
  { icon: TrendingUp, title: "Yearly Yield", color: "text-primary", bg: "bg-primary/5 border-primary/20", content: [{ label: "What it measures", text: "The hypothetical portfolio return if you had followed the analyst's Long/Short calls with equal-weight positions." }, { label: "Methodology", text: "Each prediction is treated as a 1-unit trade. Return = (exit − lock price) ÷ lock price × direction." }, { label: "Note", text: "This is a paper trading metric only. It does not account for slippage, fees, or taxes." }] },
];

export default function CalculationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Scoring & Calculations</h1>
        <p className="text-muted-foreground">Full transparency on how every score, point, and yield metric is calculated.</p>
      </div>
      <div className="space-y-6">
        {SECTIONS.map((section) => { const Icon = section.icon; return (
          <div key={section.title} className={`rounded-xl border p-6 ${section.bg}`}>
            <div className={`flex items-center gap-2 mb-4 ${section.color}`}><Icon className="w-5 h-5" /><h2 className="font-bold text-lg">{section.title}</h2></div>
            <div className="space-y-2">
              {section.content.map((item) => (
                <div key={item.label} className="flex gap-2 text-sm">
                  <span className="font-semibold min-w-[180px] shrink-0">{item.label}</span>
                  <span className="text-foreground/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ); })}
      </div>
      <div className="mt-6 bg-secondary/50 border border-border rounded-xl p-4 text-xs text-muted-foreground">
        Important: All metrics are for informational purposes only. Past accuracy does not guarantee future performance.
      </div>
    </div>
  );
}