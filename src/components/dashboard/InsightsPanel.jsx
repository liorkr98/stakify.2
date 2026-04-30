import React from "react";
import { BarChart3, TrendingUp, Zap, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ACCURACY_DATA = [
  { month: "Nov", value: 72 }, { month: "Dec", value: 78 }, { month: "Jan", value: 80 },
  { month: "Feb", value: 83 }, { month: "Mar", value: 85 }, { month: "Apr", value: 87.5 },
];

export default function InsightsPanel() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Accuracy Trend</h3>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={ACCURACY_DATA}>
          <defs>
            <linearGradient id="insightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152,55%,36%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(152,55%,36%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide domain={[65, 95]} />
          <Tooltip formatter={(v) => [`${v}%`, "Accuracy"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          <Area type="monotone" dataKey="value" stroke="hsl(152,55%,36%)" strokeWidth={2} fill="url(#insightGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}