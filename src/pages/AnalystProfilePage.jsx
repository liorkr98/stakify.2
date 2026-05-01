import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, MessageCircle, BarChart3, FileText, Star, Target, Award, Users, Flame, Trophy, TrendingUp, Eye, DollarSign, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ANALYSTS, MOCK_REPORTS } from "@/lib/mockData";
import ReportCard from "@/components/feed/ReportCard";
import AccuracyBreakdown from "@/components/analyst/AccuracyBreakdown";
import { getTwits } from "@/lib/twitsStore";

const ACHIEVEMENTS = [
  { label: "First Report", icon: FileText, earned: true }, { label: "10 Predictions", icon: Target, earned: true },
  { label: "80%+ Accuracy", icon: Award, earned: true }, { label: "100 Followers", icon: Users, earned: true },
  { label: "500 Followers", icon: Users, earned: true }, { label: "First Premium", icon: Star, earned: true },
  { label: "Streak x3", icon: Flame, earned: true }, { label: "Top 10", icon: Trophy, earned: false },
];

function getSubPlans(saved) {
  return [
    { id: "basic", label: "Basic", price: parseFloat(saved?.basicPrice || 9), features: ["All full reports", "Prediction outcomes", "Comment access"], dm: false },
    { id: "pro", label: "Pro + DM", price: parseFloat(saved?.proPrice || 19), features: ["Everything in Basic", "Direct message analyst", "Live Q&A access", "Early report access"], dm: true },
  ];
}

export default function AnalystProfilePage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const analystId = urlParams.get("id") || "a2";
  const baseAnalyst = MOCK_ANALYSTS.find(a => a.id === analystId) || MOCK_ANALYSTS[1];
  const saved = (() => { try { return JSON.parse(localStorage.getItem("stakify_profile")) || {}; } catch { return {}; } })();
  const analyst = analystId === "a1" ? { ...baseAnalyst, ...saved } : baseAnalyst;
  const myReports = MOCK_REPORTS.filter(r => r.author.id === analyst.id);
  const [following, setFollowing] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const twits = analystId === "a1" ? getTwits() : [
    { id: 1, content: `Watching $${analyst.specialties?.[0]?.split(" ")[0] || "NVDA"} closely. Strong momentum into earnings. 📈`, time: "3h ago" },
    { id: 2, content: "Market breadth improving — risk-on sentiment building. Adding exposure selectively.", time: "1d ago" },
  ];
  const SUB_PLANS = getSubPlans(analystId === "a1" ? saved : {});

  const handleSubscribe = (plan) => {
    setSubscriptionPlan(plan);
    setShowSubModal(false);
  };

  const hasDM = subscriptionPlan?.dm;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back</button>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <img src={analyst.avatar} alt={analyst.name} className="w-20 h-20 rounded-2xl border-4 border-card object-cover" />
            <div className="flex gap-2 mb-2 flex-wrap justify-end">
              {subscriptionPlan ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-1 font-semibold">{subscriptionPlan.label} Subscriber ✓</span>
                  {hasDM && (
                    <Button size="sm" onClick={() => navigate(`/dm?analyst=${analyst.id}`)}>
                      <MessageCircle className="w-4 h-4 mr-1" />DM
                    </Button>
                  )}
                </div>
              ) : (
                <Button size="sm" className="bg-primary" onClick={() => setShowSubModal(true)}>
                  Subscribe
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setFollowing(!following)}>
                <UserPlus className="w-4 h-4 mr-1" />{following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1">{analyst.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">{analyst.bio}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(analyst.specialties || []).map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Accuracy", value: `${analyst.accuracy}%`, icon: BarChart3, color: "text-primary" },
              { label: "Yearly Yield", value: `+${analyst.yearlyYield}%`, icon: TrendingUp, color: "text-amber-500" },
              { label: "Followers", value: analyst.followers.toLocaleString(), icon: UserPlus, color: "text-blue-500" },
              { label: "Reports", value: analyst.reports, icon: FileText, color: "text-muted-foreground" },
            ].map(stat => {
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

      {/* Extra insights */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Views", value: "142K", icon: Eye, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Avg. Report Revenue", value: "$312", icon: DollarSign, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
          { label: "Subscribers", value: "142", icon: Users, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.bg}`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Accuracy breakdown */}
      <div className="mb-6"><AccuracyBreakdown analystName={analyst.name} /></div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-bold mb-3">Achievements <span className="text-xs text-muted-foreground font-normal">{ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length}</span></h2>
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map(a => {
            const Icon = a.icon;
            return <div key={a.label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${a.earned ? "bg-primary/5 border-primary/20 text-primary" : "bg-secondary border-border text-muted-foreground opacity-50"}`}><Icon className="w-3.5 h-3.5" />{a.label}</div>;
          })}
        </div>
      </div>

      {/* Twits */}
      {twits.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />Quick Twits
          </h2>
          <div className="space-y-3">
            {twits.slice(0, 5).map(t => (
              <div key={t.id} className="flex gap-2.5 p-3 bg-secondary/50 rounded-lg">
                <img src={analyst.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold">{analyst.name}</span>
                    <span className="text-xs text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{t.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-bold mb-4">Published Reports</h2>
      {myReports.length === 0 ? <p className="text-sm text-muted-foreground">No reports yet.</p> : <div className="space-y-3">{myReports.map(r => <ReportCard key={r.id} report={r} />)}</div>}

      {/* Subscription modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={() => setShowSubModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">Subscribe to {analyst.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">Get full access to reports and predictions.</p>
            <div className="space-y-3 mb-4">
              {SUB_PLANS.map(plan => (
                <button key={plan.id} onClick={() => handleSubscribe(plan)} className="w-full text-left border border-border rounded-xl p-4 hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{plan.label}</span>
                    <span className="font-bold text-primary">${plan.price.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                  </div>
                  <ul className="space-y-0.5">
                    {plan.features.map(f => <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">✓ {f}</li>)}
                  </ul>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSubModal(false)} className="w-full text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}