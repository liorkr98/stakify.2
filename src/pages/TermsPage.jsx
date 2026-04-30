import React from "react";
import { Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing, browsing, or using the Stakify platform ('Platform'), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ('Terms') and our Privacy Policy. If you do not agree to any part of these Terms, you must immediately stop using the Platform. We reserve the right to modify these Terms at any time. Continued use of the Platform after modifications constitutes acceptance of the updated Terms."
  },
  {
    title: "2. CRITICAL DISCLAIMER — Not Financial Advice",
    body: "IMPORTANT LEGAL NOTICE: ALL CONTENT PUBLISHED ON STAKIFY — INCLUDING RESEARCH REPORTS, PREDICTIONS, COMMENTS, ANALYSIS, AND ANY OTHER MATERIALS — IS PROVIDED SOLELY FOR INFORMATIONAL AND EDUCATIONAL PURPOSES. NOTHING ON THIS PLATFORM CONSTITUTES, AND SHALL NOT BE CONSTRUED AS: (a) financial advice; (b) investment advice; (c) trading advice; (d) legal or tax advice; (e) an offer to buy or sell any security; (f) a solicitation or recommendation to buy, sell, or hold any asset.\n\nYOU SHOULD NOT RELY ON ANY INFORMATION ON THIS PLATFORM AS A SUBSTITUTE FOR PROFESSIONAL FINANCIAL ADVICE. ALWAYS CONDUCT YOUR OWN RESEARCH (DYOR) AND CONSULT A QUALIFIED, LICENSED FINANCIAL ADVISOR BEFORE MAKING ANY INVESTMENT DECISION."
  },
  {
    title: "3. Independent Analyst Content",
    body: "Analysts on Stakify are independent third-party content creators. Stakify, Inc. does not: (a) employ or endorse any analyst; (b) verify the accuracy, completeness, or reliability of analyst reports; (c) guarantee any analyst's track record or future performance; (d) provide investment recommendations through analyst content. Each analyst is solely responsible for the content they publish. Stakify's accuracy tracking tools are automated metrics based on historical data and do not constitute endorsement of future performance."
  },
  {
    title: "4. No Securities License or Broker-Dealer Status",
    body: "Stakify, Inc. is not a registered broker-dealer, investment adviser, investment company, futures commission merchant, or commodity trading adviser under the laws of the United States or any other jurisdiction. Stakify does not hold any securities license. No content on the Platform constitutes a securities offering, solicitation, or regulated investment service."
  },
  {
    title: "5. Investment Risk Acknowledgment",
    body: "You acknowledge that investing in financial markets involves substantial risk of loss, including the possible loss of all invested capital. Past performance does not guarantee future results. The accuracy scores, yield metrics, and prediction outcomes displayed on the Platform are historical metrics only and are not predictive of future performance. You assume all risks associated with any investment decisions you make."
  },
  {
    title: "6. User Conduct and Prohibited Activities",
    body: "You agree NOT to: (a) publish false, misleading, or materially inaccurate financial information; (b) engage in market manipulation, pump-and-dump schemes, or coordinated trading activity; (c) impersonate any person, entity, or financial institution; (d) post content that violates applicable securities laws or regulations; (e) use the Platform for insider trading or distribute material non-public information; (f) scrape, harvest, or systematically extract Platform data without written permission; (g) violate any applicable laws or regulations. Violations may result in immediate account termination and may be reported to relevant regulatory authorities."
  },
  {
    title: "7. Analyst Certification and Representations",
    body: "By publishing reports on Stakify, analysts represent that: (a) their content does not constitute regulated investment advice; (b) they do not have material conflicts of interest that are not disclosed; (c) they are not publishing on the basis of material non-public information; (d) their content complies with applicable laws. Analysts are solely responsible for any regulatory obligations applicable to their jurisdiction."
  },
  {
    title: "8. Payments, Subscriptions, and Refunds",
    body: "All payments are processed through secure third-party payment processors. By subscribing, you authorize recurring charges at the stated interval until cancelled. Subscriptions renew automatically unless cancelled at least 24 hours before the renewal date. One-time premium report purchases are non-refundable once access is granted. Stakify takes a 15% platform fee on all analyst revenue. You are responsible for all applicable taxes on your purchases."
  },
  {
    title: "9. Intellectual Property",
    body: "All Platform content, design, technology, trademarks, and branding are owned by Stakify, Inc. Analyst-authored reports remain the intellectual property of the respective analyst, subject to a non-exclusive license granted to Stakify to display and distribute such content on the Platform. You may not reproduce, republish, sell, or redistribute Platform content without prior written permission."
  },
  {
    title: "10. DISCLAIMER OF WARRANTIES",
    body: "THE PLATFORM IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, OR NON-INFRINGEMENT. STAKIFY DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS."
  },
  {
    title: "11. LIMITATION OF LIABILITY",
    body: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STAKIFY, INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR INVESTMENT LOSSES, ARISING FROM: (a) YOUR USE OF OR INABILITY TO USE THE PLATFORM; (b) RELIANCE ON ANY CONTENT OR INFORMATION ON THE PLATFORM; (c) ANY INVESTMENT DECISIONS MADE BASED ON PLATFORM CONTENT. IN NO EVENT SHALL STAKIFY'S TOTAL LIABILITY EXCEED THE GREATER OF $100 OR THE AMOUNT YOU PAID TO STAKIFY IN THE PAST 12 MONTHS."
  },
  {
    title: "12. Indemnification",
    body: "You agree to indemnify, defend, and hold harmless Stakify, Inc. and its affiliates from any claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; (c) your publication of content on the Platform; (d) your violation of any third-party rights."
  },
  {
    title: "13. Governing Law & Dispute Resolution",
    body: "These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions. Any disputes shall be resolved through binding arbitration in San Francisco, California, under the rules of the American Arbitration Association. You waive any right to participate in class action lawsuits against Stakify."
  },
  {
    title: "14. Contact",
    body: "Legal inquiries: legal@stakify.com · Support: support@stakify.com · Stakify, Inc., 548 Market St, San Francisco, CA 94104, USA"
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><Shield className="w-4 h-4" />Legal</div>
      <h1 className="text-3xl font-bold mb-1">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-6">Last updated: April 30, 2026 · Effective immediately</p>
      <div className="bg-loss/10 border border-loss/20 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-loss mb-1">⚠️ NOT FINANCIAL ADVICE</p>
        <p className="text-xs text-foreground/80">All content on Stakify is for informational purposes only. Nothing constitutes financial, investment, legal, or tax advice. Always do your own research and consult a qualified financial professional before making any investment decision.</p>
      </div>
      <div className="space-y-4">
        {SECTIONS.map(s => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}