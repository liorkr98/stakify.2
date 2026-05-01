import React, { useState } from "react";
import { getReports } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import TrendingPanel from "@/components/feed/TrendingPanel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const SECTORS = ["All", "AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Financials", "Crypto & Web3", "Consumer Tech", "E-Commerce", "Healthcare"];
const MARKET_CAPS = ["All", "Mega", "Large", "Mid", "Small", "Micro"];
const SORT_OPTIONS = ["Latest", "Most Liked", "Premium Only", "Free Only"];

export default function HomeFeed() {
  const [activeSector, setActiveSector] = useState("All");
  const [activeMarketCap, setActiveMarketCap] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const reports = getReports();

  const filtered = reports
    .filter(r => activeSector === "All" || r.industry === activeSector)
    .filter(r => activeMarketCap === "All" || (r.marketCap || "").toLowerCase() === activeMarketCap.toLowerCase())
    .filter(r => sortBy === "Premium Only" ? r.isPremium : sortBy === "Free Only" ? !r.isPremium : true)
    .sort((a, b) => sortBy === "Most Liked" ? b.likes - a.likes : new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Sector filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
            {SECTORS.map(sector => (
              <button key={sector} onClick={() => setActiveSector(sector)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeSector === sector ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {sector}
              </button>
            ))}
          </div>

          {/* Market cap filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            <span className="shrink-0 text-xs text-muted-foreground self-center font-medium mr-1">Market Cap:</span>
            {MARKET_CAPS.map(cap => (
              <button key={cap} onClick={() => setActiveMarketCap(cap)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeMarketCap === cap ? "bg-secondary text-foreground border-foreground/30" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {cap}
              </button>
            ))}
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-muted-foreground">{filtered.length} Reports</span>
            <div className="flex gap-1 ml-auto">
              {SORT_OPTIONS.map(s => (
                <button key={s} onClick={() => setSortBy(s)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No reports in this sector yet.</div>
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