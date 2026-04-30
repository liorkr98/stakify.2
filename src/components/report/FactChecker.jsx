import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Info, MessageSquareQuote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const TYPE_CONFIG = {
  Fact: { icon: CheckCircle2, color: "text-gain", bg: "bg-gain/10 border-gain/20" },
  Opinion: { icon: MessageSquareQuote, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  Misleading: { icon: AlertTriangle, color: "text-loss", bg: "bg-loss/10 border-loss/20" },
  Unverified: { icon: Info, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

export default function FactChecker({ content }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a financial fact-checker. Analyze this report excerpt and identify key claims. For each claim, classify it as: Fact, Opinion, Misleading, or Unverified. Report excerpt: "${content?.slice(0, 1000)}"\n\nReturn JSON with claims array.`,
      response_json_schema: { type: "object", properties: { claims: { type: "array", items: { type: "object", properties: { text: { type: "string" }, type: { type: "string", enum: ["Fact", "Opinion", "Misleading", "Unverified"] }, note: { type: "string" } } } } } },
    });
    setResults(res.claims || []);
    setLoading(false);
  };

  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><h3 className="font-semibold text-sm">AI Fact Checker</h3></div>
        {!results && <Button size="sm" variant="outline" onClick={runCheck} disabled={loading}>{loading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Checking...</> : <><Sparkles className="w-3.5 h-3.5 mr-1.5" />Run Check</>}</Button>}
      </div>
      {!results && !loading && <p className="text-xs text-muted-foreground">AI will analyze each claim in this report and classify it as Fact, Opinion, Misleading, or Unverified.</p>}
      {results && (
        <div className="space-y-2">
          {results.map((claim, i) => {
            const cfg = TYPE_CONFIG[claim.type] || TYPE_CONFIG.Unverified;
            const Icon = cfg.icon;
            return (
              <div key={i} className={`flex gap-2 items-start p-3 rounded-lg border text-sm ${cfg.bg}`}>
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                <div><span className={`font-semibold mr-1 ${cfg.color}`}>{claim.type}:</span>{claim.text}{claim.note && <div className="text-xs text-muted-foreground mt-1">{claim.note}</div>}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}