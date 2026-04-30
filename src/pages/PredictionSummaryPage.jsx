import React, { useState } from "react";
import { MOCK_REPORTS, MOCK_ANALYSTS } from "@/lib/mockData";
import { Target, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format, differenceInDays, parseISO, addMonths } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function getPredictionOutcome(report) {
  const { prediction } = report;
  if (!prediction) return null;
  const months = parseInt(prediction.timeframe) || 6;
  const expiryDate = addMonths(parseISO(prediction.lockTime), months);
  if (expiryDate > new Date()) return { status: "pending", label: "In Progress", daysLeft: differenceInDays(expiryDate, new Date()) };
  const seed = report.id.charCodeAt(report.id.length - 1);
  const currentPrice = prediction.lockPrice * (0.85 + (seed % 30) / 100) + (prediction.targetPrice - prediction.lockPrice) * 0.6;
  const priceDiff = prediction.action === "Short" ? (prediction.lockPrice - currentPrice) / prediction.lockPrice : (currentPrice - prediction.lockPrice) / prediction.lockPrice;
  const targetDiff = prediction.action === "Short" ? (prediction.lockPrice - prediction.targetPrice) / prediction.lockPrice : (prediction.targetPrice - prediction.lockPrice) / prediction.lockPrice;
  const ratio = targetDiff > 0 ? priceDiff / targetDiff : 0;
  if (ratio >= 0.85) return { status: "hit", label: "Exact Hit", credit: 1.0 };
  if (ratio >= 0.5) return { status: "near", label: "Near Hit", credit: 0.5 };
  if (ratio >= 0.15) return { status: "partial", label: "Directional", credit: 0.25 };
  return { status: "miss", label: "Miss", credit: 0 };
}

const STATUS_CONFIG = {
  hit: { color: "text-gain", bg: "bg-gain/10 border-gain/30", icon: CheckCircle2 },
  near: { color: "text-primary", bg: "bg-primary/10 border-primary/30", icon: CheckCircle2 },
  partial: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: TrendingUp },
  miss: { color: "text-loss", bg: "bg-loss/10 border-loss/30", icon: XCircle },
  pending: { color: "text-muted-foreground", bg: "bg-secondary border-border", icon: Clock },
};

const PIE_COLORS = ["hsl(152,55%,36%)", "hsl(152,55%,55%)", "hsl(35,90%,50%)", "hsl(0,72%,52%)", "hsl(215,20%,65%)"];

export default function PredictionSummaryPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const saved = (() => { try { return JSON.parse(localStorage.getItem("stakify_profile")) || {}; } catch { return {}; } })();
  const analyst = { ...MOCK_ANALYSTS[0], ...saved };
  const myReports = MOCK_REPORTS.filter((r) => r.author.id === "a1");
  const predictions = myReports.map((r) => ({ ...r, outcome: getPredictionOutcome(r) }));
  const completed = predictions.filter((p) => p.outcome?.status !== "pending");
  const hits = completed.filter((p) => p.outcome?.status === "hit").length;
  const near = completed.filter((p) => p.outcome?.status === "near").length;
  const partial = completed.filter((p) => p.outcome?.status === "partial").length;
  const misses = completed.filter((p) => p.outcome?.status === "miss").length;
  const pending = predictions.filter((p) => p.outcome?.status === "pending").length;
  const totalCredit = completed.reduce((sum, p) => sum + (p.outcome?.credit || 0), 0);
  const accuracy = completed.length > 0 ? ((totalCredit / completed.length) * 100).toFixed(1) : 0;
  const pieData = [{ name: "Exact Hit", value: hits }, { name: "Near Hit", value: near }, { name: "Directional", value: partial }, { name: "Miss", value: misses }, { name: "Pending", value: pending }].filter(d => d.value > 0);
  const filtered = predictions.filter((p) => filterStatus === "all" || p.outcome?.status === filterStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <img src={analyst.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
        <div><h1 className="text-2xl font-bold">Prediction Summary</h1><p className="text-sm text-muted-foreground">{analyst.name} · All locked predictions</p></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[{ label: "Accuracy", value: `${accuracy}%`, sub: `${completed.length} resolved`, color: "text-primary", bg: "bg-primary/5 border-primary/20" }, { label: "Exact Hits", value: hits, sub: "100% credit", color: "text-gain", bg: "bg-gain/10 border-gain/20" }, { label: "Misses", value: misses, sub: "−20 pts", color: "text-loss", bg: "bg-loss/10 border-loss/20" }, { label: "In Progress", value: pending, sub: "awaiting expiry", color: "text-muted-foreground", bg: "bg-secondary border-border" }].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.bg}`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-medium">{s.label}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-sm mb-3">Outcome Distribution</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>{pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}</Pie><Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 11, borderRadius: 8 }} /></PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {["all", "hit", "near", "partial", "miss", "pending"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${filterStatus === s ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{s === "all" ? "All" : s === "hit" ? "Exact Hit" : s === "near" ? "Near Hit" : s === "partial" ? "Directional" : s === "miss" ? "Miss" : "In Progress"}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((report) => {
          const outcome = report.outcome;
          if (!outcome) return null;
          const cfg = STATUS_CONFIG[outcome.status];
          const Icon = cfg.icon;
          return (
            <div key={report.id} onClick={() => navigate(`/report?id=${report.id}`)} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${cfg.bg}`}>
              <Icon className={`w-5 h-5 flex-shrink-0 ${cfg.color}`} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{report.title}</div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="font-mono">${report.prediction.ticker}</span>
                  <span>{report.prediction.action}</span>
                  <span>Lock: ${report.prediction.lockPrice}</span>
                  <span>Target: ${report.prediction.targetPrice}</span>
                  <span>{report.prediction.timeframe}</span>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className={`font-semibold ${cfg.color}`}>{outcome.label}</div>
                {outcome.status === "pending" && <div className="text-muted-foreground">{outcome.daysLeft}d left</div>}
                {outcome.credit !== undefined && outcome.status !== "pending" && <div className="text-muted-foreground">{(outcome.credit * 100).toFixed(0)}% credit</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}