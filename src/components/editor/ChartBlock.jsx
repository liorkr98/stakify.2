import React, { useState, useMemo } from "react";
import { generateCandlestickData, MOCK_STOCKS } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";

export default function ChartBlock() {
  const [ticker, setTicker] = useState("AAPL");
  const stock = MOCK_STOCKS[ticker.toUpperCase()];
  const data = useMemo(() => generateCandlestickData(ticker, 30), [ticker]);
  const isUp = stock ? stock.changePercent >= 0 : true;

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 my-2">
      <div className="flex items-center gap-3 mb-3">
        <Input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="Ticker..." className="w-28 h-8 text-sm font-mono" />
        {stock && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">${stock.price.toFixed(2)}</span>
            <span className={isUp ? "text-gain" : "text-loss"}>{isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%</span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isUp ? "hsl(152,55%,36%)" : "hsl(0,72%,52%)"} stopOpacity={0.2} />
              <stop offset="95%" stopColor={isUp ? "hsl(152,55%,36%)" : "hsl(0,72%,52%)"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.floor(data.length / 5)} />
          <YAxis tick={{ fontSize: 10 }} width={55} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => [`$${v}`, "Price"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Area type="monotone" dataKey="close" stroke={isUp ? "hsl(152,55%,36%)" : "hsl(0,72%,52%)"} strokeWidth={2} fill="url(#colorChart)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}