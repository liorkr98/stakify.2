import React from "react";
import { Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Data Controller",
    body: "Stakify, Inc. ('Stakify', 'we', 'us', 'our'), 548 Market St, San Francisco, CA 94104, is the data controller responsible for your personal data. Contact our Data Protection Officer at privacy@stakify.com."
  },
  {
    title: "2. Information We Collect",
    body: "We collect: (a) Account information: name, email address, profile photo, biography, social handles, and professional information you provide; (b) Content data: reports, comments, predictions, and other content you publish; (c) Usage data: pages visited, reports read, time spent, click patterns, and interaction logs; (d) Device data: IP address, browser type, operating system, device identifiers; (e) Payment data: payment method type, last 4 digits, billing address — full card numbers are never stored and are processed by our PCI-compliant payment processor; (f) Communications: any messages you send to us or other users via the Platform."
  },
  {
    title: "3. How We Use Your Information",
    body: "Legal bases under GDPR: (a) Contract performance: providing Platform services, processing payments, maintaining your account; (b) Legitimate interests: fraud prevention, security, improving the Platform, analytics, displaying predictions and accuracy data publicly; (c) Consent: marketing emails (you may withdraw at any time); (d) Legal obligation: responding to legal requests, tax reporting."
  },
  {
    title: "4. Public Data",
    body: "You understand and agree that analyst profiles, published reports, prediction records, accuracy scores, points, and public comments are visible to all Platform users and may be indexed by search engines. Prediction data is intended to be permanently public as part of the Platform's core transparency mission. Even if you delete your account, published predictions may be retained in anonymized form to maintain the integrity of historical accuracy records."
  },
  {
    title: "5. Data Sharing",
    body: "We do not sell your personal data. We share data only with: (a) Payment processors (Stripe, Wix Payments) to process transactions — subject to their own privacy policies; (b) Analytics providers (anonymized/aggregated only); (c) Cloud infrastructure providers under data processing agreements; (d) Legal authorities when required by valid legal process, court order, or to protect our legal rights; (e) Successors in interest in the event of a merger, acquisition, or sale of assets — you will be notified."
  },
  {
    title: "6. International Transfers",
    body: "Stakify is based in the United States. If you are located in the EEA, UK, or other jurisdictions with data transfer restrictions, we transfer your data to the US under appropriate safeguards including Standard Contractual Clauses (SCCs) and adequacy decisions where applicable."
  },
  {
    title: "7. Data Retention",
    body: "We retain account data for as long as your account is active and for up to 3 years after account closure for legal and compliance purposes. Published content may be retained indefinitely in anonymized form. You may request deletion of personal data subject to our legal retention obligations by emailing privacy@stakify.com."
  },
  {
    title: "8. Your Rights",
    body: "Depending on your jurisdiction, you have rights to: (a) Access — request a copy of your personal data; (b) Rectification — correct inaccurate data; (c) Erasure ('right to be forgotten') — request deletion, subject to legal retention requirements; (d) Restriction — limit how we process your data; (e) Portability — receive your data in a machine-readable format; (f) Object — object to processing based on legitimate interests; (g) Withdraw consent — for consent-based processing (e.g. marketing). To exercise your rights, contact: privacy@stakify.com. We respond within 30 days (or 45 with notice)."
  },
  {
    title: "9. Security",
    body: "We implement industry-standard security measures including: TLS/HTTPS encryption in transit, AES-256 encryption at rest for sensitive data, access controls and least-privilege principles, regular security audits and penetration testing, and incident response procedures. In the event of a data breach affecting your rights and freedoms, we will notify you within 72 hours as required by GDPR."
  },
  {
    title: "10. Children's Privacy",
    body: "The Platform is not intended for users under 18 years of age. We do not knowingly collect personal data from minors. If you believe a minor has provided us with their data, contact privacy@stakify.com immediately."
  },
  {
    title: "11. Contact & Supervisory Authority",
    body: "Data Protection Officer: privacy@stakify.com. For EEA users: you have the right to lodge a complaint with your local supervisory authority. For UK users: the Information Commissioner's Office (ico.org.uk). Stakify, Inc., 548 Market St, San Francisco, CA 94104, USA."
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><Shield className="w-4 h-4" />Legal</div>
      <h1 className="text-3xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: April 30, 2026 · GDPR & CCPA compliant</p>
      <div className="space-y-4">
        {SECTIONS.map(s => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}