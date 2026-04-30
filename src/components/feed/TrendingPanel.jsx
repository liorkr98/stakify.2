import React from "react";
import { Flame, TrendingUp } from "lucide-react";
import { MOCK_STOCKS } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

const TRENDING_TICKERS = ["NVDA", "TSLA", "PLTR", "ARM", "AMD"];
const TRENDING_TOPICS = ["AI Infrastructure", "Fed Rate Decision", "Earnings Season", "Robotics & Automation", "Crypto Rally"];

export default function TrendingPanel() {
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" />Trending Now</h3>
      <div className="space-y-2 mb-4">
        {TRENDING_TICKERS.map((ticker, i) => {
          const stock = MOCK_STOCKS[ticker];
          const isUp = stock?.changePercent >= 0;
          return (
            <button key={ticker} onClick={() => navigate(`/stock?ticker=${ticker}`)} className="flex items-center gap-2 w-full hover:bg-secondary rounded-lg p-1.5 -mx-1.5 transition-colors text-left">
              <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
              <div className="flex-1">
                <span className="font-mono font-bold text-sm">${ticker}</span>
              </div>
              {stock && <span className={`text-xs font-semibold ${isUp ? "text-gain" : "text-loss"}`}>{isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%</span>}
            </button>
          );
        })}
      </div>
      <div className="border-t border-border pt-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trending Topics</p>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_TOPICS.map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}