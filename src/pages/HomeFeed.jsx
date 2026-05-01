import React, { useState } from "react";
import { getReports } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import TrendingPanel from "@/components/feed/TrendingPanel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, SlidersHorizontal, X } from "lucide-react";

const SECTORS = ["All", "AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Financials", "Crypto & Web3", "Consumer Tech", "E-Commerce", "Healthcare"];
const MARKET_CAPS = ["All", "Mega", "Large", "Mid", "Small", "Micro"];
const SORT_OPTIONS = ["Latest", "Most Liked", "Premium Only", "Free Only"];

export default function HomeFeed() {
  const [activeSector, setActiveSector] = useState("All");
  const [activeMarketCap, setActiveMarketCap] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [showFilters, setShowFilters] = useState(false);
  const reports = getReports();

  const filtered = reports
    .filter(r => activeSector === "All" || r.industry === activeSector)
    .filter(r => activeMarketCap === "All" || (r.marketCap || "").toLowerCase() === activeMarketCap.toLowerCase())
    .filter(r => sortBy === "Premium Only" ? r.isPremium : sortBy === "Free Only" ? !r.isPremium : true)
    .sort((a, b) => sortBy === "Most Liked" ? b.likes - a.likes : new Date(b.publishedAt) - new Date(a.publishedAt));

  const activeFilterCount = (activeSector !== "All" ? 1 : 0) + (activeMarketCap !== "All" ? 1 : 0) + (sortBy !== "Latest" ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Controls bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-muted-foreground">{filtered.length} Reports</span>
            <button
              onClick={() => setShowFilters(true)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${activeFilterCount > 0 ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activeSector !== "All" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                  {activeSector}
                  <button onClick={() => setActiveSector("All")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeMarketCap !== "All" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                  {activeMarketCap} Cap
                  <button onClick={() => setActiveMarketCap("All")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {sortBy !== "Latest" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                  {sortBy}
                  <button onClick={() => setSortBy("Latest")}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No reports match these filters.</div>
            ) : (
              filtered.map(report => <ReportCard key={report.id} report={report} />)
            )}
          </div>
        </div>

        {/* Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={() => setShowFilters(false)}>
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg">Filter Reports</h3>
                <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Sector</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SECTORS.map(s => (
                      <button key={s} onClick={() => setActiveSector(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${activeSector === s ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Market Cap</label>
                  <div className="flex flex-wrap gap-1.5">
                    {MARKET_CAPS.map(cap => (
                      <button key={cap} onClick={() => setActiveMarketCap(cap)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${activeMarketCap === cap ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{cap}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Sort By</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SORT_OPTIONS.map(s => (
                      <button key={s} onClick={() => setSortBy(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${sortBy === s ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => { setActiveSector("All"); setActiveMarketCap("All"); setSortBy("Latest"); }}>Clear All</Button>
                <Button className="flex-1" onClick={() => setShowFilters(false)}>Apply</Button>
              </div>
            </div>
          </div>
        )}

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