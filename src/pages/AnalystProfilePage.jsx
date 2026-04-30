import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, MessageCircle, BarChart3, FileText, Star, Target, Award, Users, Flame, Trophy, BookOpen, Rocket, Shield, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";

const ACHIEVEMENTS = [
  { label: "First Report", icon: FileText, earned: true }, { label: "10 Predictions", icon: Target, earned: true },
  { label: "80%+ Accuracy", icon: Award, earned: true }, { label: "100 Followers", icon: Users, earned: true },
  { label: "500 Followers", icon: Users, earned: true }, { label: "First Premium", icon: Star, earned: true },
  { label: "Streak x3", icon: Flame, earned: true }, { label: "Top 10", icon: Trophy, earned: false },
];

export default function AnalystProfilePage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const analystId = urlParams.get("id") || "a2";
  const baseAnalyst = MOCK_ANALYSTS.find((a) => a.id === analystId) || MOCK_ANALYSTS[1];
  const saved = (() => { try { return JSON.parse(localStorage.getItem("stakify_profile")) || {}; } catch { return {}; } })();
  const analyst = analystId === "a1" ? { ...baseAnalyst, ...saved } : baseAnalyst;
  const myReports = MOCK_REPORTS.filter((r) => r.author.id === analyst.id);
  const [following, setFollowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back</button>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <img src={analyst.avatar} alt={analyst.name} className="w-20 h-20 rounded-2xl border-4 border-card object-cover" />
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="outline" onClick={() => setSubscribed(!subscribed)}>{subscribed ? "Subscribed ✓" : "Subscribe $9/mo"}</Button>
              <Button size="sm" variant="outline" onClick={() => setFollowing(!following)}><UserPlus className="w-4 h-4 mr-1" />{following ? "Following" : "Follow"}</Button>
              {subscribed && <Button size="sm" variant="outline" onClick={() => navigate(`/dm?analyst=${analyst.id}`)}><MessageCircle className="w-4 h-4" /></Button>}
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1">{analyst.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">{analyst.bio}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(analyst.specialties || []).map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Accuracy", value: `${analyst.accuracy}%`, icon: BarChart3, color: "text-primary" },
              { label: "Yearly Yield", value: `+${analyst.yearlyYield}%`, icon: TrendingUp, color: "text-amber-500" },
              { label: "Followers", value: analyst.followers.toLocaleString(), icon: UserPlus, color: "text-blue-500" },
              { label: "Reports", value: analyst.reports, icon: FileText, color: "text-muted-foreground" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-bold mb-3">Achievements <span className="text-xs text-muted-foreground font-normal">{ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length}</span></h2>
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((a) => {
            const Icon = a.icon;
            return <div key={a.label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${a.earned ? "bg-primary/5 border-primary/20 text-primary" : "bg-secondary border-border text-muted-foreground opacity-50"}`}><Icon className="w-3.5 h-3.5" />{a.label}</div>;
          })}
        </div>
      </div>

      <h2 className="font-bold mb-4">Published Reports</h2>
      {myReports.length === 0 ? <p className="text-sm text-muted-foreground">No reports yet.</p> : <div className="space-y-3">{myReports.map((r) => <ReportCard key={r.id} report={r} />)}</div>}
    </div>
  );
}