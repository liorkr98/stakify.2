import React from "react";
import { Shield } from "lucide-react";

const SECTIONS = [
  { title: "1. Acceptance of Terms", body: "By accessing or using Stakify, you agree to be bound by these Terms and Conditions. These Terms constitute a legally binding agreement between you and Stakify, Inc." },
  { title: "2. Not Financial Advice — Critical Disclaimer", body: "IMPORTANT: ALL CONTENT ON STAKIFY IS FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. NOTHING ON THIS PLATFORM CONSTITUTES FINANCIAL, INVESTMENT, LEGAL, TAX, OR TRADING ADVICE. Analyst reports and predictions represent personal views of individual registered analysts and do not constitute recommendations to buy, sell, or hold any security." },
  { title: "3. Analyst Content and Accuracy", body: "Analysts on Stakify are independent content creators. The Company does not verify, endorse, or guarantee the accuracy of any analyst's research, predictions, or opinions. Analysts are solely responsible for the accuracy and legality of their content." },
  { title: "4. No Securities License", body: "Stakify is not a registered broker-dealer, investment adviser, or securities exchange. No content on the Platform should be construed as a securities offering or solicitation." },
  { title: "5. User Conduct", body: "You agree not to use the Platform to spread false or misleading financial information, engage in market manipulation, impersonate any person or entity, or violate any applicable laws or regulations." },
  { title: "6. Payments, Subscriptions, and Refunds", body: "All payments are processed through secure third-party processors. Subscriptions auto-renew unless cancelled. One-time report purchases are non-refundable after access is granted. Stakify takes a 15% platform fee on analyst revenue." },
  { title: "7. Limitation of Liability", body: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, STAKIFY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM OR RELIANCE ON ANY CONTENT." },
  { title: "8. Contact", body: "Legal inquiries: legal@stakify.com · General support: support@stakify.com · Stakify, Inc., 548 Market St, San Francisco, CA 94104, USA" },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><Shield className="w-4 h-4" />Legal</div>
      <h1 className="text-3xl font-bold mb-1">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: April 28, 2026</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">⚠️ Stakify is not a financial advisor. All content is for informational purposes only. Nothing constitutes financial advice.</div>
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}