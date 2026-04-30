import React, { useState } from "react";
import { Target, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

const QUARTERLY_YIELD = [
  { quarter: "Q2 '25", analyst: 8.4, sp500: 3.1, sector: "AI & Semi" },
  { quarter: "Q3 '25", analyst: 12.1, sp500: 2.4, sector: "Big Tech" },
  { quarter: "Q4 '25", analyst: 7.8, sp500: 4.2, sector: "AI & Semi" },
  { quarter: "Q1 '26", analyst: 6.1, sp500: -1.8, sector: "Mixed" },
];

const SECTOR_ACCURACY = [
  { sector: "AI & Semiconductors", accuracy: 91.2, predictions: 18, hits: 16 },
  { sector: "Big Tech", accuracy: 85.4, predictions: 12, hits: 10 },
  { sector: "EV & Energy", accuracy: 72.0, predictions: 8, hits: 6 },
  { sector: "Financials", accuracy: 66.7, predictions: 6, hits: 4 },
];

const PREDICTION_BREAKDOWN = [
  { label: "Exact Hit (≤5%)", count: 18, color: "bg-gain text-white", pct: 40 },
  { label: "Near Hit (5–15%)", count: 11, color: "bg-primary text-white", pct: 24 },
  { label: "Directional (15–30%)", count: 9, color: "bg-amber-500 text-white", pct: 20 },
  { label: "Miss", count: 7, color: "bg-loss text-white", pct: 16 },
];

export default function AccuracyBreakdown({ analystName }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">Accuracy Breakdown & Yield vs S&P 500</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5">
          {/* How accuracy is calculated */}
          <div className="bg-secondary/40 rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-2">How {analystName}'s accuracy is calculated</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PREDICTION_BREAKDOWN.map(b => (
                <div key={b.label} className="text-center">
                  <div className={`rounded-lg py-2 px-1 mb-1 ${b.color}`}>
                    <div className="text-lg font-bold">{b.count}</div>
                    <div className="text-[10px] opacity-80">{b.pct}%</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{b.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector accuracy */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Accuracy by Sector</h4>
            <div className="space-y-1.5">
              {SECTOR_ACCURACY.map(s => (
                <div key={s.sector} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-36 shrink-0">{s.sector}</span>
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${s.accuracy}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-primary w-10 text-right">{s.accuracy}%</span>
                  <span className="text-xs text-muted-foreground">{s.hits}/{s.predictions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quarterly yield vs S&P */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Quarterly Yield vs S&P 500</h4>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={QUARTERLY_YIELD} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
                <XAxis dataKey="quarter" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={35} />
                <Tooltip formatter={(v, n) => [`${v}%`, n === "analyst" ? "Analyst" : "S&P 500"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <ReferenceLine y={0} stroke="hsl(210,20%,80%)" />
                <Bar dataKey="analyst" name="analyst" fill="hsl(152,55%,36%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="sp500" name="sp500" fill="hsl(210,80%,52%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-primary" />Analyst</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-blue-500" />S&P 500</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}