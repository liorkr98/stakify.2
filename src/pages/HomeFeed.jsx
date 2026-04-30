import React, { useState } from "react";
import { getReports } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import TrendingPanel from "@/components/feed/TrendingPanel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, SlidersHorizontal, X } from "lucide-react";

const INDUSTRIES = ["All", "AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Financials", "Crypto & Web3", "Consumer Tech", "E-Commerce", "Healthcare"];
const MARKET_CAPS = ["All", "Mega Cap (>$200B)", "Large Cap ($10B-$200B)", "Mid Cap ($2B-$10B)", "Small Cap ($300M-$2B)", "Micro Cap (<$300M)"];
const SORT_OPTIONS = ["Latest", "Most Liked", "Premium Only", "Free Only"];
const ACTIONS = ["All", "Long", "Short", "Hold"];

const marketCapKey = { "Mega Cap (>$200B)": "mega", "Large Cap ($10B-$200B)": "large", "Mid Cap ($2B-$10B)": "mid", "Small Cap ($300M-$2B)": "small", "Micro Cap (<$300M)": "micro" };

export default function HomeFeed() {
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [marketCap, setMarketCap] = useState("All");
  const [action, setAction] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const reports = getReports();

  const filtered = reports
    .filter(r => activeIndustry === "All" || r.industry === activeIndustry)
    .filter(r => marketCap === "All" || r.marketCap === marketCapKey[marketCap])
    .filter(r => action === "All" || r.prediction?.action === action)
    .filter(r => sortBy === "Premium Only" ? r.isPremium : sortBy === "Free Only" ? !r.isPremium : true)
    .sort((a, b) => sortBy === "Most Liked" ? b.likes - a.likes : new Date(b.publishedAt) - new Date(a.publishedAt));

  const hasActiveFilters = activeIndustry !== "All" || marketCap !== "All" || action !== "All";

  const clearFilters = () => { setActiveIndustry("All"); setMarketCap("All"); setAction("All"); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Industry filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {INDUSTRIES.map(ind => (
              <button key={ind} onClick={() => setActiveIndustry(ind)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeIndustry === ind ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {ind}
              </button>
            ))}
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              <SlidersHorizontal className="w-3.5 h-3.5" />Filters
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><X className="w-3 h-3" />Clear</button>
            )}
            <span className="text-sm font-semibold text-muted-foreground ml-auto">{filtered.length} Reports</span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map(s => (
                <button key={s} onClick={() => setSortBy(s)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Market Cap</p>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_CAPS.map(cap => (
                    <button key={cap} onClick={() => setMarketCap(cap)} className={`text-xs px-2.5 py-1 rounded-full border transition-all ${marketCap === cap ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{cap}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Prediction Action</p>
                <div className="flex gap-1.5">
                  {ACTIONS.map(a => (
                    <button key={a} onClick={() => setAction(a)} className={`text-xs px-3 py-1 rounded-full border transition-all ${action === a ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No reports match your filters. <button onClick={clearFilters} className="text-primary hover:underline">Clear filters</button></div>
            ) : (
              filtered.map(report => <ReportCard key={report.id} report={report} />)
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Stakify</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Transparent financial research with verified, publicly locked predictions.</p>
            <Link to="/editor"><Button className="w-full" size="sm">Write a Report</Button></Link>
          </div>
          <TrendingPanel />
          <Leaderboard />
        </aside>
      </div>
    </div>
  );
}