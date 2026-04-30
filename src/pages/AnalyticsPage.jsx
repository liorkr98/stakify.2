import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Target, Zap, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ACCURACY_DATA = [{ month: "Nov", value: 72 }, { month: "Dec", value: 78 }, { month: "Jan", value: 80 }, { month: "Feb", value: 83 }, { month: "Mar", value: 85 }, { month: "Apr", value: 87.5 }];
const POINTS_DATA = [{ month: "Nov", value: 6200 }, { month: "Dec", value: 6900 }, { month: "Jan", value: 7300 }, { month: "Feb", value: 7800 }, { month: "Mar", value: 8200 }, { month: "Apr", value: 8750 }];
const YIELD_DATA = [{ month: "Nov", value: 18 }, { month: "Dec", value: 21 }, { month: "Jan", value: 25 }, { month: "Feb", value: 28 }, { month: "Mar", value: 31 }, { month: "Apr", value: 34.2 }];
const FOLLOWERS_DATA = [{ month: "Nov", value: 8400 }, { month: "Dec", value: 9100 }, { month: "Jan", value: 10200 }, { month: "Feb", value: 10900 }, { month: "Mar", value: 11700 }, { month: "Apr", value: 12400 }];

const CONFIGS = {
  accuracy: { title: "Accuracy Score", icon: Target, value: "87.5%", color: "#22c55e", data: ACCURACY_DATA, unit: "%" },
  points: { title: "Total Points", icon: Zap, value: "8,750", color: "#f59e0b", data: POINTS_DATA, unit: " pts" },
  yield: { title: "Yearly Yield", icon: TrendingUp, value: "+34.2%", color: "#10b981", data: YIELD_DATA, unit: "%" },
  followers: { title: "Followers", icon: Users, value: "12,400", color: "#3b82f6", data: FOLLOWERS_DATA, unit: "" },
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const category = new URLSearchParams(window.location.search).get("category") || "accuracy";
  const config = CONFIGS[category] || CONFIGS.accuracy;
  const Icon = config.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back to Dashboard</button>

      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6" style={{ color: config.color }} />
        <div><h1 className="text-2xl font-bold">{config.title} Analytics</h1><p className="text-sm text-muted-foreground">Current: {config.value}</p></div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6">
        {Object.entries(CONFIGS).map(([key, cfg]) => {
          const CIcon = cfg.icon;
          return (
            <button key={key} onClick={() => navigate(`/analytics?category=${key}`)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${category === key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
              <CIcon className="w-3.5 h-3.5" />{cfg.title}
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4">6-Month Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={config.data}>
            <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={config.color} stopOpacity={0.2} /><stop offset="95%" stopColor={config.color} stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}${config.unit.replace(" pts", "K")}`} />
            <Tooltip formatter={(v) => [`${v}${config.unit}`, config.title]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="value" stroke={config.color} strokeWidth={2} fill="url(#ag)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}