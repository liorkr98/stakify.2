import React from "react";
import { Target, Lock, TrendingUp, Zap, Sparkles, CheckCircle2, AlertTriangle, Info, MessageSquareQuote } from "lucide-react";

const SECTIONS = [
  {
    icon: Target, title: "Accuracy Score", color: "text-green-600", bg: "bg-green-50 border-green-200",
    content: [
      { label: "What it measures", text: "The percentage of predictions that hit their target price within the stated timeframe." },
      { label: "Exact hit (within 5%)", text: "100% credit → counts as a fully correct prediction." },
      { label: "Near hit (5–15%)", text: "50% credit → counts as a partial prediction." },
      { label: "Directionally correct (15–30%)", text: "25% credit → wrong magnitude but right direction." },
      { label: "Miss", text: "0% credit. Both directional misses and expired timeframes count as misses." },
      { label: "Formula", text: "Accuracy = (Σ prediction credits) ÷ (total predictions) × 100" },
    ]
  },
  {
    icon: Lock, title: "Lock Price & Price Target", color: "text-blue-600", bg: "bg-blue-50 border-blue-200",
    content: [
      { label: "Lock Price", text: "The live market price at the exact second the analyst clicks 'Publish'. Cannot be altered." },
      { label: "Price Target", text: "The analyst's stated price target for the ticker within the specified timeframe." },
      { label: "Long example", text: "Lock $100, Target $130, 6 months. If price hits $128 → near hit (50%). If $135 → exact hit (100%)." },
      { label: "Short example", text: "Lock $200, Target $150, 3 months. Credit is awarded if price falls below or near target." },
    ]
  },
  {
    icon: Zap, title: "Points System", color: "text-amber-600", bg: "bg-amber-50 border-amber-200",
    content: [
      { label: "Exact prediction hit", text: "+100 points" },
      { label: "Near hit (within 15%)", text: "+50 points" },
      { label: "Directional hit (within 30%)", text: "+25 points" },
      { label: "Publishing a report", text: "+10 points" },
      { label: "Prediction miss", text: "−20 points" },
      { label: "Streak bonus", text: "3+ correct in a row: +50 bonus points per extension" },
    ]
  },
  {
    icon: TrendingUp, title: "Yearly Yield", color: "text-primary", bg: "bg-primary/5 border-primary/20",
    content: [
      { label: "What it measures", text: "The hypothetical portfolio return if you had followed the analyst's Long/Short calls with equal-weight positions." },
      { label: "Methodology", text: "Each prediction is treated as a 1-unit trade. Return = (exit − lock price) ÷ lock price × direction." },
      { label: "Note", text: "This is a paper trading metric only. It does not account for slippage, fees, or taxes." },
    ]
  },
];

const CLAIM_TYPES = [
  {
    type: "Fact", icon: CheckCircle2, color: "text-gain", bg: "bg-gain/10 border-gain/20",
    definition: "A statement that is verifiable and confirmed by reliable data sources, public filings, regulatory documents, or widely accepted market data.",
    examples: ["'NVIDIA reported $26B in data center revenue in Q1 2026' — verifiable from SEC filings.", "'The Federal Reserve raised rates 11 times between 2022–2023' — verifiable from FOMC minutes."],
    aiMethod: "The AI cross-references the claim against known financial data, SEC filings, and macroeconomic statistics. Claims with specific verifiable numbers are most reliably classified.",
  },
  {
    type: "Opinion", icon: MessageSquareQuote, color: "text-blue-600", bg: "bg-blue-50 border-blue-200",
    definition: "A subjective view, forecast, or interpretation that cannot be objectively verified. Includes price targets, qualitative assessments, and forward-looking statements.",
    examples: ["'NVIDIA is undervalued at current levels' — subjective valuation view.", "'The AI cycle will sustain for another 3 years' — forward-looking, unverifiable."],
    aiMethod: "The AI looks for qualitative language (e.g. 'believe', 'think', 'expect', 'could') or forward-looking statements without objective backing.",
  },
  {
    type: "Misleading", icon: AlertTriangle, color: "text-loss", bg: "bg-loss/10 border-loss/20",
    definition: "A claim that contains factual inaccuracies, cherry-picks data in a misleading way, or creates a false impression even if not technically a lie.",
    examples: ["'Tesla's revenue grew 200% last year' when actual growth was 19% — incorrect data.", "Comparing peak revenue to trough for selective framing."],
    aiMethod: "The AI flags claims where verifiable data contradicts the stated figure, or where cherry-picked metrics create a materially misleading picture.",
  },
  {
    type: "Unverified", icon: Info, color: "text-amber-600", bg: "bg-amber-50 border-amber-200",
    definition: "A claim that may be true but cannot be confirmed with available public data. Includes insider information, unannounced products, or undisclosed partnerships.",
    examples: ["'Apple is in talks to acquire a semiconductor firm' — if unannounced.", "'The CEO told investors privately that guidance will be raised.'"],
    aiMethod: "When a claim appears plausible but Stakify's AI cannot locate a verifiable primary source, it's flagged as Unverified. The AI also explains what is known and suggests where to verify.",
  },
];

export default function CalculationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Scoring & Calculations</h1>
        <p className="text-muted-foreground">Full transparency on how every score, point, yield metric, and AI claim is evaluated.</p>
      </div>

      <div className="space-y-6 mb-12">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title} className={`rounded-xl border p-6 ${section.bg}`}>
              <div className={`flex items-center gap-2 mb-4 ${section.color}`}><Icon className="w-5 h-5" /><h2 className="font-bold text-lg">{section.title}</h2></div>
              <div className="space-y-2">
                {section.content.map(item => (
                  <div key={item.label} className="flex gap-2 text-sm">
                    <span className="font-semibold min-w-[180px] shrink-0">{item.label}</span>
                    <span className="text-foreground/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Fact Checker Definitions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">How AI Fact Checker Defines Claims</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Stakify's AI fact checker analyzes every claim in a report and assigns one of four classifications. Here is exactly how each classification is defined and how the AI makes the determination.
        </p>
        <div className="space-y-4">
          {CLAIM_TYPES.map(ct => {
            const Icon = ct.icon;
            return (
              <div key={ct.type} className={`rounded-xl border p-5 ${ct.bg}`}>
                <div className={`flex items-center gap-2 mb-2 ${ct.color}`}><Icon className="w-4 h-4" /><h3 className="font-bold">{ct.type}</h3></div>
                <p className="text-sm mb-3"><span className="font-semibold">Definition: </span>{ct.definition}</p>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Examples</p>
                  <ul className="space-y-1">{ct.examples.map(e => <li key={e} className="text-xs text-foreground/80 flex gap-1.5"><span className="text-muted-foreground">→</span>{e}</li>)}</ul>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-xs">
                  <span className="font-semibold">How the AI detects it: </span>{ct.aiMethod}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-secondary/50 border border-border rounded-xl p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">AI Limitations:</strong> The AI fact checker is an assistive tool, not a legal or financial authority. It can make mistakes. Users can flag incorrect AI assessments using the "AI made a mistake?" button on any claim, and our team reviews all submitted corrections.
        </div>
      </div>

      <div className="bg-secondary/50 border border-border rounded-xl p-4 text-xs text-muted-foreground">
        Important: All metrics are for informational purposes only. Past accuracy does not guarantee future performance.
      </div>
    </div>
  );
}