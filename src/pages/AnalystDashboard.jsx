import React, { useState } from "react";
import { MOCK_ANALYSTS, getReports } from "@/lib/mockData";
const MOCK_REPORTS = getReports();
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Award, FileText, Star, Flame, Trophy, Users, Zap, ArrowUp, ArrowDown, Minus, BookOpen, Rocket, Shield, CheckCircle, Clock, BarChart3, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import TwitsPanel from "@/components/dashboard/TwitsPanel";
import { useNavigate, Link } from "react-router-dom";

const STAT_CARDS = [
  { key: "predictions", label: "Prediction Summary", value: "87.5%", icon: Target, color: "text-green-600", bg: "bg-green-50 border-green-200", sub: "+2.3% vs last quarter" },
  { key: "points", label: "Total Points", value: "8,750", icon: Zap, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", sub: "Top 3% of analysts" },
  { key: "yield", label: "Yearly Yield", value: "+34.2%", icon: TrendingUp, color: "text-primary", bg: "bg-primary/5 border-primary/20", sub: "vs S&P 500: +12.1%" },
  { key: "followers", label: "Followers", value: "12,400", icon: Users, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", sub: "+340 this month" },
];

const ACTION_ICONS = { Long: ArrowUp, Short: ArrowDown, Hold: Minus };

const ACHIEVEMENTS = [
  { label: "First Report", icon: FileText, earned: true }, { label: "10 Predictions", icon: Target, earned: true },
  { label: "80%+ Accuracy", icon: Award, earned: true }, { label: "100 Followers", icon: Users, earned: true },
  { label: "500 Followers", icon: Users, earned: true }, { label: "First Premium Report", icon: Star, earned: true },
  { label: "Streak x3", icon: Flame, earned: true }, { label: "Top 10 Analyst", icon: Trophy, earned: false },
  { label: "1,000 Likes", icon: CheckCircle, earned: false }, { label: "50 Reports", icon: BookOpen, earned: false },
  { label: "90%+ Accuracy", icon: Shield, earned: false }, { label: "Streak x10", icon: Rocket, earned: false },
];

export default function AnalystDashboard() {
  const [tab, setTab] = useState("published");
  const navigate = useNavigate();
  const saved = (() => { try { return JSON.parse(localStorage.getItem("stakify_profile")) || {}; } catch { return {}; } })();
  const analyst = { ...MOCK_ANALYSTS[0], ...saved };
  const myReports = MOCK_REPORTS.filter((r) => r.author.id === analyst.id);
  const drafts = [{ id: "d1", title: "Amazon's Healthcare Pivot: Underappreciated Opportunity", updatedAt: "2026-04-14" }, { id: "d2", title: "Semiconductor Supply Chain Deep Dive", updatedAt: "2026-04-13" }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img src={analyst.avatar} alt={analyst.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{analyst.name}</h1>
          <p className="text-sm text-muted-foreground">{analyst.tagline || "Senior Equity Research Analyst · Tech & AI"}</p>
          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
            <span>{analyst.reports} Reports</span><span>{analyst.followers.toLocaleString()} Followers</span><span>Joined Jan 2025</span>
          </div>
        </div>
        <Link to="/edit-profile"><Button variant="outline" size="sm">Edit Profile</Button></Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <button key={stat.key} onClick={() => navigate(stat.key === "predictions" ? "/predictions" : `/analytics?category=${stat.key}`)} className={`rounded-xl border p-4 text-left hover:shadow-md transition-all ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InsightsPanel />

          {/* Achievements */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-bold mb-3">Achievements <span className="text-xs text-muted-foreground font-normal">{ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length} earned</span></h2>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${a.earned ? "bg-primary/5 border-primary/20 text-primary" : "bg-secondary border-border text-muted-foreground opacity-50"}`}>
                    <Icon className="w-3.5 h-3.5" />{a.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reports Tabs */}
          <div className="bg-card border border-border rounded-xl p-5">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-4"><TabsTrigger value="published">Published ({myReports.length})</TabsTrigger><TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger><TabsTrigger value="subscriptions">Subscribed</TabsTrigger></TabsList>
            </Tabs>
            {tab === "published" && (
              <div className="space-y-3">
                {myReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary/30 cursor-pointer" onClick={() => navigate(`/report?id=${report.id}`)}>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{report.title}</div>
                      <div className="text-xs text-muted-foreground">Published {format(new Date(report.publishedAt), "MMM d, yyyy")} · {report.likes} likes</div>
                    </div>
                    {report.prediction && <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${report.prediction.action === "Long" ? "bg-gain/10 border-gain/20 text-gain" : report.prediction.action === "Short" ? "bg-loss/10 border-loss/20 text-loss" : "bg-amber-50 border-amber-200 text-amber-600"}`}>{React.createElement(ACTION_ICONS[report.prediction.action], { className: "w-3 h-3" })}{report.prediction.action}</div>}
                  </div>
                ))}
              </div>
            )}
            {tab === "drafts" && (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div key={draft.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{draft.title}</div><div className="text-xs text-muted-foreground">Last edited {format(new Date(draft.updatedAt), "MMM d, yyyy")}</div></div>
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                ))}
              </div>
            )}
            {tab === "subscriptions" && (
              <div className="space-y-3">
                {MOCK_ANALYSTS.slice(1, 4).map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex-1"><div className="font-semibold text-sm">{a.name}</div><div className="text-xs text-muted-foreground">{a.followers.toLocaleString()} followers · {a.accuracy}%</div></div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/analyst?id=${a.id}`)}>View</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div><TwitsPanel /></div>
      </div>
    </div>
  );
}