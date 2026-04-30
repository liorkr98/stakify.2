import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { MOCK_STOCKS, MOCK_REPORTS, generateCandlestickData } from "@/lib/mockData";

const TABS = ["Chart", "Fundamentals", "Reports"];
const RANGES = ["1W", "1M", "3M", "6M", "1Y"];
const rangeDays = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };

const FUNDAMENTALS = {
  NVDA: { pe: 42.3, eps: 11.93, marketCap: "2.3T", divYield: "0.03%", beta: 1.72, week52High: 974, week52Low: 402 },
  AAPL: { pe: 29.1, eps: 6.57, marketCap: "3.1T", divYield: "0.51%", beta: 1.24, week52High: 220, week52Low: 164 },
  TSLA: { pe: 55.8, eps: 2.99, marketCap: "680B", divYield: "N/A", beta: 2.31, week52High: 299, week52Low: 138 },
  MSFT: { pe: 35.4, eps: 13.1, marketCap: "3.0T", divYield: "0.72%", beta: 0.89, week52High: 468, week52Low: 366 },
  GOOGL: { pe: 22.7, eps: 7.96, marketCap: "2.1T", divYield: "0.46%", beta: 1.04, week52High: 193, week52Low: 130 },
  AMD: { pe: 60.2, eps: 1.41, marketCap: "280B", divYield: "N/A", beta: 1.95, week52High: 227, week52Low: 122 },
};

function buildPriceHistory(basePrice, days) {
  const data = [];
  let price = basePrice * 0.75;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    price = Math.max(price * (1 + (Math.random() - 0.47) * 0.025), basePrice * 0.5);
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({ date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), price: parseFloat(price.toFixed(2)) });
  }
  data[data.length - 1].price = basePrice;
  return data;
}

export default function StockPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const ticker = urlParams.get("ticker")?.toUpperCase() || "NVDA";
  const stockData = MOCK_STOCKS[ticker];
  const [activeTab, setActiveTab] = useState("Chart");
  const [range, setRange] = useState("3M");
  const priceHistory = useMemo(() => buildPriceHistory(stockData?.price || 500, rangeDays[range]), [ticker, range]);
  const relatedReports = MOCK_REPORTS.filter((r) => r.tickers?.includes(ticker));
  const isUp = stockData?.changePercent >= 0;
  const chartColor = isUp ? "hsl(152,55%,36%)" : "hsl(0,72%,52%)";
  const fundamentals = FUNDAMENTALS[ticker] || FUNDAMENTALS.NVDA;

  if (!stockData) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-muted-foreground mb-4">Stock "{ticker}" not found.</p>
      <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back</button>

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold">{ticker}</h1>
            <Badge variant="secondary">NASDAQ</Badge>
          </div>
          <div className="text-sm text-muted-foreground">{ticker === "NVDA" ? "NVIDIA Corporation" : ticker === "AAPL" ? "Apple Inc." : ticker === "TSLA" ? "Tesla Inc." : ticker === "MSFT" ? "Microsoft Corporation" : `${ticker} Inc.`}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">${stockData.price.toFixed(2)}</div>
          <div className={`flex items-center gap-1 justify-end text-sm font-medium ${isUp ? "text-gain" : "text-loss"}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isUp ? "+" : ""}{stockData.change.toFixed(2)} ({isUp ? "+" : ""}{stockData.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto">
        {TABS.map((t) => <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{t}</button>)}
      </div>

      {activeTab === "Chart" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex gap-1 mb-4">
            {RANGES.map((r) => <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${range === r ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}>{r}</button>)}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceHistory}>
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={chartColor} stopOpacity={0.2} /><stop offset="95%" stopColor={chartColor} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.floor(priceHistory.length / 6)} />
              <YAxis tick={{ fontSize: 10 }} width={60} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, "Price"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill="url(#cg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "Fundamentals" && (
        <div className="bg-card border border-border rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{ label: "P/E Ratio", value: fundamentals.pe }, { label: "EPS", value: `$${fundamentals.eps}` }, { label: "Market Cap", value: fundamentals.marketCap }, { label: "Div Yield", value: fundamentals.divYield }, { label: "Beta", value: fundamentals.beta }, { label: "52W High", value: `$${fundamentals.week52High}` }, { label: "52W Low", value: `$${fundamentals.week52Low}` }].map((item) => (
            <div key={item.label} className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Reports" && (
        <div className="space-y-3">
          {relatedReports.length > 0 ? relatedReports.map((r) => (
            <div key={r.id} onClick={() => navigate(`/report?id=${r.id}`)} className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <img src={r.author.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <span className="text-sm font-medium">{r.author.name}</span>
                <span className="text-xs text-gain">{r.author.accuracy}%</span>
              </div>
              <div className="font-semibold text-sm">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.likes} likes · {r.isPremium ? `$${r.price}` : "Free"}</div>
            </div>
          )) : <p className="text-sm text-muted-foreground">No reports for {ticker} yet.</p>}
        </div>
      )}
    </div>
  );
}