import React from "react";
import { Newspaper } from "lucide-react";

const NEWS = [
  { date: "April 2026", title: "Stakify Launches Community Notes for Financial Reports", body: "Platform rolls out crowd-sourced fact-checking feature, bringing Twitter-style community context to investment research claims.", tag: "Product" },
  { date: "March 2026", title: "Stakify Reaches 50,000 Registered Analysts", body: "The platform's analyst community grows 3x year-over-year as demand for verified, accountable financial research accelerates.", tag: "Milestone" },
  { date: "February 2026", title: "New AI Fact Checker Identifies Misleading Claims Across 10,000 Reports", body: "Stakify's AI model has analyzed over 10,000 published reports and classified more than 80,000 individual claims since launch.", tag: "Product" },
  { date: "January 2026", title: "Stakify Introduces Analyst Subscriptions and Monetization Tools", body: "Top analysts can now earn income directly from their research through one-time report sales and monthly subscription tiers.", tag: "Business" },
  { date: "November 2025", title: "Stakify Raises $8M Seed Round", body: "Led by a group of fintech-focused VCs, the funding will accelerate platform growth and expand the analyst verification program.", tag: "Funding" },
  { date: "September 2025", title: "Stakify Platform Beta Launches with 500 Founding Analysts", body: "After 6 months in closed beta, Stakify opens its doors with a founding cohort of 500 analysts whose predictions have been tracked since Day 1.", tag: "Launch" },
];

const TAG_COLORS = { Product: "bg-blue-50 text-blue-700 border-blue-200", Milestone: "bg-green-50 text-green-700 border-green-200", Business: "bg-amber-50 text-amber-700 border-amber-200", Funding: "bg-purple-50 text-purple-700 border-purple-200", Launch: "bg-primary/10 text-primary border-primary/20" };

export default function NewsroomPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-primary mb-2">Newsroom</p>
        <h1 className="text-3xl font-bold mb-2">Latest from Stakify</h1>
        <p className="text-muted-foreground">Press releases, product updates, and company milestones.</p>
      </div>
      <div className="space-y-4">
        {NEWS.map((item) => (
          <div key={item.title} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${TAG_COLORS[item.tag]}`}>{item.tag}</span>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>
            <h3 className="font-bold text-base mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">Press inquiries: <a href="mailto:press@stakify.com" className="text-primary hover:underline">press@stakify.com</a></p>
    </div>
  );
}