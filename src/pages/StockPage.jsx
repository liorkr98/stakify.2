import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { MOCK_STOCKS, MOCK_REPORTS } from "@/lib/mockData";
import TradingViewWidget from "@/components/feed/TradingViewWidget";

const TABS = ["Chart", "Financials", "News", "Reports"];

const FUNDAMENTALS = {
  NVDA: { pe: 42.3, eps: 11.93, marketCap: "2.3T", divYield: "0.03%", beta: 1.72, week52High: 974, week52Low: 402, revenue: "60.9B", revenueGrowth: "+122%", grossMargin: "75.1%", operatingMargin: "54.1%", netIncome: "29.7B", freeCashFlow: "27.0B" },
  AAPL: { pe: 29.1, eps: 6.57, marketCap: "3.1T", divYield: "0.51%", beta: 1.24, week52High: 220, week52Low: 164, revenue: "391B", revenueGrowth: "+2%", grossMargin: "46.2%", operatingMargin: "29.8%", netIncome: "93.7B", freeCashFlow: "99.1B" },
  TSLA: { pe: 55.8, eps: 2.99, marketCap: "680B", divYield: "N/A", beta: 2.31, week52High: 299, week52Low: 138, revenue: "97.7B", revenueGrowth: "+19%", grossMargin: "17.9%", operatingMargin: "5.1%", netIncome: "15.0B", freeCashFlow: "2.0B" },
  MSFT: { pe: 35.4, eps: 13.1, marketCap: "3.0T", divYield: "0.72%", beta: 0.89, week52High: 468, week52Low: 366, revenue: "245B", revenueGrowth: "+16%", grossMargin: "69.4%", operatingMargin: "44.6%", netIncome: "88.1B", freeCashFlow: "74.1B" },
  GOOGL: { pe: 22.7, eps: 7.96, marketCap: "2.1T", divYield: "0.46%", beta: 1.04, week52High: 193, week52Low: 130, revenue: "350B", revenueGrowth: "+14%", grossMargin: "56.9%", operatingMargin: "27.4%", netIncome: "94.0B", freeCashFlow: "72.8B" },
  AMD: { pe: 60.2, eps: 1.41, marketCap: "280B", divYield: "N/A", beta: 1.95, week52High: 227, week52Low: 122, revenue: "25.8B", revenueGrowth: "+13%", grossMargin: "49.1%", operatingMargin: "10.2%", netIncome: "854M", freeCashFlow: "1.6B" },
};

const QUARTERLY_REVENUE = {
  NVDA: [{ q: "Q2'25", rev: 13.5 }, { q: "Q3'25", rev: 18.1 }, { q: "Q4'25", rev: 22.1 }, { q: "Q1'26", rev: 26.0 }],
  AAPL: [{ q: "Q2'25", rev: 85.8 }, { q: "Q3'25", rev: 94.9 }, { q: "Q4'25", rev: 124.3 }, { q: "Q1'26", rev: 90.8 }],
  TSLA: [{ q: "Q2'25", rev: 21.3 }, { q: "Q3'25", rev: 23.4 }, { q: "Q4'25", rev: 25.7 }, { q: "Q1'26", rev: 21.1 }],
  MSFT: [{ q: "Q2'25", rev: 56.5 }, { q: "Q3'25", rev: 65.6 }, { q: "Q4'25", rev: 69.6 }, { q: "Q1'26", rev: 70.1 }],
  GOOGL: [{ q: "Q2'25", rev: 84.7 }, { q: "Q3'25", rev: 88.3 }, { q: "Q4'25", rev: 96.5 }, { q: "Q1'26", rev: 90.2 }],
  AMD: [{ q: "Q2'25", rev: 5.8 }, { q: "Q3'25", rev: 6.8 }, { q: "Q4'25", rev: 7.7 }, { q: "Q1'26", rev: 7.4 }],
};

const TICKER_NAMES = { NVDA: "NVIDIA Corporation", AAPL: "Apple Inc.", TSLA: "Tesla, Inc.", MSFT: "Microsoft Corporation", GOOGL: "Alphabet Inc.", AMD: "AMD Inc.", META: "Meta Platforms", AMZN: "Amazon.com", NFLX: "Netflix", JPM: "JPMorgan Chase", COIN: "Coinbase Global", PLTR: "Palantir Technologies", RIVN: "Rivian Automotive", SHOP: "Shopify", ARM: "Arm Holdings" };

function generateNews(ticker) {
  const items = [
    { title: `${ticker} beats earnings estimates for Q1 2026 with revenue up 18% YoY`, source: "Bloomberg", time: "2h ago", url: "#", sentiment: "positive" },
    { title: `Analysts raise ${ticker} price targets ahead of product launch`, source: "Reuters", time: "5h ago", url: "#", sentiment: "positive" },
    { title: `${ticker} faces regulatory scrutiny in EU over market dominance`, source: "FT", time: "1d ago", url: "#", sentiment: "negative" },
    { title: `${ticker} announces $5B share buyback program`, source: "WSJ", time: "2d ago", url: "#", sentiment: "positive" },
    { title: `Institutional investors increase ${ticker} positions in Q1`, source: "Barron's", time: "3d ago", url: "#", sentiment: "neutral" },
    { title: `${ticker} CEO speaks at tech conference on AI strategy`, source: "CNBC", time: "4d ago", url: "#", sentiment: "neutral" },
  ];
  return items;
}


export default function StockPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const ticker = urlParams.get("ticker")?.toUpperCase() || "NVDA";
  const stockData = MOCK_STOCKS[ticker];
  const [activeTab, setActiveTab] = useState("Chart");
  const relatedReports = MOCK_REPORTS.filter(r => r.tickers?.includes(ticker));
  const isUp = stockData?.changePercent >= 0;
  const fundamentals = FUNDAMENTALS[ticker] || FUNDAMENTALS.NVDA;
  const quarterlyRev = QUARTERLY_REVENUE[ticker] || QUARTERLY_REVENUE.NVDA;
  const news = generateNews(ticker);

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
          <div className="text-sm text-muted-foreground">{TICKER_NAMES[ticker] || `${ticker} Inc.`}</div>
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
        {TABS.map(t => <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{t}</button>)}
      </div>

      {activeTab === "Chart" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <TradingViewWidget ticker={ticker} height={450} />
        </div>
      )}

      {activeTab === "Financials" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "P/E Ratio", value: fundamentals.pe },
              { label: "EPS (TTM)", value: `$${fundamentals.eps}` },
              { label: "Market Cap", value: fundamentals.marketCap },
              { label: "Revenue (TTM)", value: fundamentals.revenue },
              { label: "Revenue Growth", value: fundamentals.revenueGrowth },
              { label: "Gross Margin", value: fundamentals.grossMargin },
              { label: "Operating Margin", value: fundamentals.operatingMargin },
              { label: "Net Income", value: fundamentals.netIncome },
              { label: "Free Cash Flow", value: fundamentals.freeCashFlow },
              { label: "Div Yield", value: fundamentals.divYield },
              { label: "Beta", value: fundamentals.beta },
              { label: "52W High", value: `$${fundamentals.week52High}` },
              { label: "52W Low", value: `$${fundamentals.week52Low}` },
            ].map(item => (
              <div key={item.label} className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-base font-bold">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">Quarterly Revenue ($B)</h3>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={quarterlyRev}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,92%)" />
                <XAxis dataKey="q" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}B`} width={45} />
                <Tooltip formatter={v => [`$${v}B`, "Revenue"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="rev" fill="hsl(152,55%,36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "News" && (
        <div className="space-y-3">
          {news.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener" className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.sentiment === "positive" ? "bg-gain" : item.sentiment === "negative" ? "bg-loss" : "bg-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">{item.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold">{item.source}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      )}

      {activeTab === "Reports" && (
        <div className="space-y-3">
          {relatedReports.length > 0 ? relatedReports.map(r => (
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