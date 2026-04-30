import React, { useState } from "react";
import { getReports } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import Leaderboard from "@/components/feed/Leaderboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Filter } from "lucide-react";

const INDUSTRIES = ["All", "AI & Semiconductors", "Big Tech", "EV & Clean Energy", "Financials", "Crypto & Web3", "Consumer Tech", "E-Commerce", "Healthcare"];
const SORT_OPTIONS = ["Latest", "Most Liked", "Premium Only", "Free Only"];

export default function HomeFeed() {
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const reports = getReports();

  const filtered = reports
    .filter((r) => activeIndustry === "All" || r.industry === activeIndustry)
    .filter((r) => sortBy === "Premium Only" ? r.isPremium : sortBy === "Free Only" ? !r.isPremium : true)
    .sort((a, b) => sortBy === "Most Liked" ? b.likes - a.likes : new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {INDUSTRIES.map((ind) => (
              <button key={ind} onClick={() => setActiveIndustry(ind)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeIndustry === ind ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {ind}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-muted-foreground">{filtered.length} Reports</h2>
            <div className="flex gap-1">
              {SORT_OPTIONS.map((s) => (
                <button key={s} onClick={() => setSortBy(s)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((report) => <ReportCard key={report.id} report={report} />)}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Stakify</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Transparent financial research with verified, publicly locked predictions.</p>
            <Link to="/editor"><Button className="w-full" size="sm">Write a Report</Button></Link>
          </div>
          <Leaderboard />
        </aside>
      </div>
    </div>
  );
}