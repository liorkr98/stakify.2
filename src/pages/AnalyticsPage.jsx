import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Target, Zap, Users, Globe, FileText, Loader2, AlertCircle, RefreshCw, Eye, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { base44 } from "@/api/base44Client";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseYearMonth(ym) {
  // ym = "202503" => "Mar"
  const m = parseInt(ym.slice(4), 10) - 1;
  return MONTHS[m] || ym;
}

function metricVal(row, idx) {
  return parseFloat(row.metricValues?.[idx]?.value || 0);
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('getGAData', {});
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Derived data from GA response
  const monthlyTrend = data?.monthlyTrend?.rows?.map(row => ({
    month: parseYearMonth(row.dimensionValues?.[0]?.value || ""),
    users: metricVal(row, 0),
    sessions: metricVal(row, 1),
    pageviews: metricVal(row, 2),
    newUsers: metricVal(row, 5),
  })) || [];

  const totalsRow = data?.totals?.rows?.[0];
  const totalUsers = totalsRow ? Math.round(metricVal(totalsRow, 0)).toLocaleString() : "—";
  const totalSessions = totalsRow ? Math.round(metricVal(totalsRow, 1)).toLocaleString() : "—";
  const totalPageviews = totalsRow ? Math.round(metricVal(totalsRow, 2)).toLocaleString() : "—";
  const bounceRate = totalsRow ? `${(metricVal(totalsRow, 3) * 100).toFixed(1)}%` : "—";
  const newUsers = totalsRow ? Math.round(metricVal(totalsRow, 4)).toLocaleString() : "—";

  const topPages = data?.topPages?.rows?.map(row => ({
    path: row.dimensionValues?.[0]?.value || "/",
    views: Math.round(metricVal(row, 0)),
    users: Math.round(metricVal(row, 1)),
  })) || [];

  const STAT_CARDS = [
    { label: "Active Users (30d)", value: totalUsers, icon: Users, color: "#3b82f6" },
    { label: "Sessions (30d)", value: totalSessions, icon: Globe, color: "#8b5cf6" },
    { label: "Page Views (30d)", value: totalPageviews, icon: Eye, color: "#22c55e" },
    { label: "Bounce Rate (30d)", value: bounceRate, icon: TrendingUp, color: "#f59e0b" },
    { label: "New Users (30d)", value: newUsers, icon: Zap, color: "#10b981" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to Dashboard
        </button>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {data?.propertyName ? `Google Analytics · ${data.propertyName}` : "Powered by Google Analytics 4"}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-loss/10 border border-loss/20 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-loss flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-loss">Failed to load analytics</p>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            <button onClick={fetchData} className="text-xs text-primary hover:underline mt-2">Try again</button>
          </div>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {STAT_CARDS.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-card border border-border rounded-xl p-4">
                  <Icon className="w-4 h-4 mb-2" style={{ color: card.color }} />
                  <div className="text-xl font-bold">{card.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                </div>
              );
            })}
          </div>

          {/* Users trend chart */}
          {monthlyTrend.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-sm mb-4">Active Users — 6-Month Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [v.toLocaleString(), "Users"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#usersGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sessions + Pageviews bars */}
          {monthlyTrend.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-sm mb-4">Sessions & Page Views — 6-Month Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="sessions" fill="#8b5cf6" radius={[4,4,0,0]} name="Sessions" />
                  <Bar dataKey="pageviews" fill="#22c55e" radius={[4,4,0,0]} name="Page Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top pages */}
          {topPages.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />Top Pages (30 days)</h3>
              <div className="space-y-2">
                {topPages.map((page, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                    <span className="flex-1 text-sm font-mono truncate text-foreground/80">{page.path}</span>
                    <span className="text-xs font-semibold text-foreground">{page.views.toLocaleString()} views</span>
                    <span className="text-xs text-muted-foreground">{page.users.toLocaleString()} users</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}