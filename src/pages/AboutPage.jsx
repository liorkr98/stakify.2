import React from "react";
import { Shield, Target, TrendingUp, Users } from "lucide-react";

const PILLARS = [
  { icon: Shield, title: "Verified Predictions", desc: "Every analyst's prediction is timestamped at submission, making it impossible to backdate or alter." },
  { icon: Target, title: "Accuracy Tracking", desc: "We measure every analyst's predictions against real market outcomes to produce a transparent, unbiased accuracy score." },
  { icon: TrendingUp, title: "Skin in the Game", desc: "Analysts build their reputation publicly. High accuracy earns points, followers, and income — bad calls cost rank." },
  { icon: Users, title: "Community Intelligence", desc: "Thousands of investors fact-check, debate, and surface signal from noise through likes, comments, and the leaderboard." },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-primary mb-2">About Stakify</p>
        <h1 className="text-4xl font-bold mb-4">Built for Transparent Finance</h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">Stakify is a platform where financial analysts publish research reports with publicly locked, verifiable predictions — creating a new standard of accountability in investment analysis.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-3">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">The financial media is full of opinions dressed up as expertise. Stakify cuts through the noise by making every prediction public, time-stamped, and tracked against real market outcomes.</p>
        <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-4">Anyone can make a bold call. Only the best analysts can back it up with a proven track record — and on Stakify, that record is completely transparent.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {PILLARS.map((p) => { const Icon = p.icon; return (
          <div key={p.title} className="bg-card border border-border rounded-xl p-5">
            <Icon className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-bold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ); })}
      </div>
      <div className="bg-secondary/50 border border-border rounded-xl p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Not Financial Advice:</strong> All content on Stakify is for informational and educational purposes only. Nothing published constitutes financial, investment, legal, or tax advice. Always conduct your own research and consult a qualified financial advisor before making investment decisions.
      </div>
    </div>
  );
}