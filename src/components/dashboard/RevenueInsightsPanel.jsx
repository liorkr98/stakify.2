import React, { useState } from "react";
import { BarChart3, Eye, DollarSign, TrendingUp, Users, ArrowUpRight, ShoppingCart } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const VIEWS_DATA = [
  { month: "Nov", views: 8200, purchases: 42, revenue: 198 },
  { month: "Dec", views: 11400, purchases: 68, revenue: 312 },
  { month: "Jan", views: 14800, purchases: 95, revenue: 445 },
  { month: "Feb", views: 18200, purchases: 128, revenue: 601 },
  { month: "Mar", views: 22500, purchases: 167, revenue: 784 },
  { month: "Apr", views: 28100, purchases: 213, revenue: 1020 },
];

const STAT_CARDS = [
  { label: "Total Views", value: "28,100", sub: "+25% MoM", icon: Eye, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { label: "Report Purchases", value: "213", sub: "+46 vs last month", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { label: "Revenue (Apr)", value: "$1,020", sub: "+30% MoM", icon: DollarSign, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
  { label: "Conversion Rate", value: "0.76%", sub: "Views → Purchase", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  { label: "Subscribers", value: "142", sub: "$9/mo each", icon: Users, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  { label: "Sub Revenue", value: "$1,278", sub: "/month recurring", icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
];

const TABS = ["Views", "Revenue", "Conversion"];

export default function RevenueInsightsPanel() {
  const [tab, setTab] = useState("Views");

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />Analytics & Revenue
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        {STAT_CARDS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-xl border p-3 ${s.bg}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 mb-3">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>{t}</button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={120}>
        {tab === "Revenue" ? (
          <BarChart data={VIEWS_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} width={40} />
            <Tooltip formatter={v => [`$${v}`, "Revenue"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="revenue" fill="hsl(152,55%,36%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : tab === "Conversion" ? (
          <AreaChart data={VIEWS_DATA.map(d => ({ ...d, rate: ((d.purchases / d.views) * 100).toFixed(2) }))}>
            <defs><linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={40} />
            <Tooltip formatter={v => [`${v}%`, "Conversion"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} fill="url(#convGrad)" />
          </AreaChart>
        ) : (
          <AreaChart data={VIEWS_DATA}>
            <defs><linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={35} />
            <Tooltip formatter={v => [v.toLocaleString(), "Views"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#viewGrad)" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}