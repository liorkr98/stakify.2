import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Info, MessageSquareQuote, Loader2, ThumbsDown, MessageCircle, X, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

const TYPE_CONFIG = {
  Fact: { icon: CheckCircle2, color: "text-gain", bg: "bg-gain/10 border-gain/20" },
  Opinion: { icon: MessageSquareQuote, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  Misleading: { icon: AlertTriangle, color: "text-loss", bg: "bg-loss/10 border-loss/20" },
  Unverified: { icon: Info, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

function CommunityNotes({ claimText, claimType }) {
  const [notes, setNotes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    setNotes(prev => [...prev, { id: Date.now(), text: text.trim(), author: "You", time: "just now", votes: 0 }]);
    setText("");
    setShowAdd(false);
  };

  return (
    <div className="mt-2 text-xs border-t border-border/50 pt-2">
      {notes.length > 0 && (
        <div className="space-y-1.5 mb-2">
          <span className="font-semibold text-muted-foreground">Community Notes</span>
          {(showAll ? notes : notes.slice(0, 1)).map(n => (
            <div key={n.id} className="bg-card border border-border rounded-lg p-2 flex gap-2">
              <MessageCircle className="w-3 h-3 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1"><span className="font-medium">{n.author}</span>: {n.text}</div>
            </div>
          ))}
          {notes.length > 1 && !showAll && <button className="text-primary hover:underline" onClick={() => setShowAll(true)}>+{notes.length - 1} more notes</button>}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => setShowAdd(!showAdd)} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <MessageCircle className="w-3 h-3" />Add Note
        </button>
      </div>
      {showAdd && (
        <div className="mt-2 flex gap-1">
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add context or correction…" className="text-xs resize-none flex-1" rows={2} />
          <div className="flex flex-col gap-1">
            <button onClick={submit} disabled={!text.trim()} className="p-1.5 bg-primary text-white rounded-lg disabled:opacity-40"><Send className="w-3 h-3" /></button>
            <button onClick={() => setShowAdd(false)} className="p-1.5 border border-border rounded-lg text-muted-foreground"><X className="w-3 h-3" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function AIErrorReport({ claim }) {
  const [reported, setReported] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");

  if (reported) return <p className="text-xs text-muted-foreground mt-1">Thanks for the feedback! Our team will review this claim.</p>;
  if (claim.type === "Opinion") return null;

  return (
    <div className="mt-1">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsDown className="w-3 h-3" />AI made a mistake?
        </button>
      ) : (
        <div className="mt-1 space-y-1">
          <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="What's incorrect? Provide the true fact…" className="text-xs resize-none" rows={2} />
          <div className="flex gap-1">
            <Button size="sm" className="text-xs h-7" onClick={() => { setReported(true); setShowForm(false); }} disabled={!reason.trim()}>Submit</Button>
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FactChecker({ content }) {
  const cacheKey = `factcheck_${btoa(content?.slice(0, 200) || "").slice(0, 40)}`;
  const cached = (() => { try { const v = localStorage.getItem(cacheKey); return v ? JSON.parse(v) : null; } catch { return null; } })();

  const [results, setResults] = useState(cached);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a financial fact-checker. Analyze this report excerpt and identify 4-6 key claims. For each claim, classify it as: Fact, Opinion, Misleading, or Unverified.\n\nFor Unverified claims, provide a "trueContext" field explaining what is known or unknown.\nFor Misleading claims, provide a "correction" field with the accurate information.\n\nReport excerpt: "${content?.slice(0, 1000)}"\n\nReturn JSON with claims array.`,
      response_json_schema: {
        type: "object",
        properties: {
          claims: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                type: { type: "string", enum: ["Fact", "Opinion", "Misleading", "Unverified"] },
                note: { type: "string" },
                trueContext: { type: "string" },
                correction: { type: "string" }
              }
            }
          }
        }
      },
      model: "claude_sonnet_4_6",
    });
    const claims = res.claims || [];
    setResults(claims);
    try { localStorage.setItem(cacheKey, JSON.stringify(claims)); } catch {}
    setLoading(false);
  };

  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">AI Fact Checker</h3>
        </div>
        {!results && (
          <Button size="sm" variant="outline" onClick={runCheck} disabled={loading}>
            {loading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Checking...</> : <><Sparkles className="w-3.5 h-3.5 mr-1.5" />Run Check</>}
          </Button>
        )}
        {results && <button onClick={() => setResults(null)} className="text-xs text-muted-foreground hover:text-foreground">Re-run</button>}
      </div>

      {!results && !loading && (
        <p className="text-xs text-muted-foreground">AI will classify each claim as Fact, Opinion, Misleading, or Unverified — with context for disputed claims.</p>
      )}

      {results && (
        <div className="space-y-2">
          {results.map((claim, i) => {
            const cfg = TYPE_CONFIG[claim.type] || TYPE_CONFIG.Unverified;
            const Icon = cfg.icon;
            return (
              <div key={i} className={`p-3 rounded-lg border text-sm ${cfg.bg}`}>
                <div className="flex gap-2 items-start">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <span className={`font-semibold mr-1 ${cfg.color}`}>{claim.type}:</span>
                    {claim.text}
                    {claim.note && <div className="text-xs text-muted-foreground mt-1 italic">{claim.note}</div>}
                    {claim.trueContext && (
                      <div className="mt-1.5 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2">
                        <span className="font-semibold text-amber-700">Why unverified: </span>
                        <span className="text-amber-800">{claim.trueContext}</span>
                      </div>
                    )}
                    {claim.correction && (
                      <div className="mt-1.5 text-xs bg-loss/10 border border-loss/20 rounded-lg p-2">
                        <span className="font-semibold text-loss">Correction: </span>
                        <span className="text-foreground/80">{claim.correction}</span>
                      </div>
                    )}
                    <AIErrorReport claim={claim} />
                    {(claim.type === "Opinion" || claim.type === "Misleading" || claim.type === "Unverified") && (
                      <CommunityNotes claimText={claim.text} claimType={claim.type} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}