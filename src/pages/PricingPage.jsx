import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PLANS = [
  { name: "Free", price: "$0", period: "", desc: "For curious readers and casual investors.", features: ["Browse all public reports", "See locked predictions (no full content)", "Follow analysts", "Basic leaderboard access", "Community comments"], cta: "Get Started", highlight: false },
  { name: "Basic", price: "$9", period: "/month", desc: "For active followers who want full access.", features: ["Everything in Free", "Full premium report access", "Weekly analyst digest email", "Historical prediction outcomes", "Priority comment ranking"], cta: "Start Basic", highlight: false },
  { name: "Pro", price: "$29", period: "/month", desc: "For serious investors tracking the best analysts.", features: ["Everything in Basic", "Locked predictions live feed", "Direct message analysts", "Weekly live Q&A sessions", "Export prediction data (CSV)", "Early access to new features"], cta: "Start Pro", highlight: true, badge: "Most Popular" },
];

const ANALYST_PLANS = [
  { name: "Analyst Free", price: "$0", features: ["Publish unlimited free reports", "Public prediction tracking", "Basic analytics", "Leaderboard visibility"] },
  { name: "Analyst Pro", price: "$19/mo", features: ["Everything in Free", "Monetize reports", "Advanced analytics", "Promote reports", "Verified badge", "Priority support"] },
];

export default function PricingPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
      </div>

      <h2 className="font-bold text-lg mb-4 text-center">For Readers & Investors</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`relative rounded-xl border p-6 ${plan.highlight ? "border-primary shadow-lg shadow-primary/10" : "border-border bg-card"}`}>
            {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-white px-3 py-1 rounded-full font-semibold">{plan.badge}</span>}
            <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
            <div className="text-2xl font-bold mb-1">{plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span></div>
            <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
            <ul className="space-y-1.5 mb-5">
              {plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-gain flex-shrink-0" />{f}</li>)}
            </ul>
            <Button onClick={() => navigate("/pay?mode=subscription")} variant={plan.highlight ? "default" : "outline"} className="w-full">{plan.cta}</Button>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-4 text-center">For Analysts & Content Creators</h2>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
        {ANALYST_PLANS.map((plan) => (
          <div key={plan.name} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-1">{plan.name}</h3>
            <div className="text-xl font-bold text-primary mb-3">{plan.price}</div>
            <ul className="space-y-1.5">
              {plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-gain" />{f}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">All prices in USD. Cancel any time. Stakify takes a 15% platform fee on analyst revenue.</p>
    </div>
  );
}