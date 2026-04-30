import React from "react";
import { Shield } from "lucide-react";

const SECTIONS = [
  { title: "1. Information We Collect", body: "Account information (name, email, profile data), usage data (pages visited, reports read), payment information processed securely by third parties, and device/technical data." },
  { title: "2. How We Use Your Information", body: "We use your data to provide and improve the Platform, process payments, send transactional emails, personalize your experience, detect fraud, and comply with legal obligations." },
  { title: "3. Sharing Your Information", body: "We do not sell your personal data. We share data only with payment processors, analytics providers, and legal authorities when required by law. Analyst public profiles and prediction records are visible to all users by design." },
  { title: "4. Data Retention", body: "We retain account data for as long as your account is active, plus up to 3 years after closure for legal compliance. You may request deletion by emailing privacy@stakify.com." },
  { title: "5. Your Rights (GDPR / CCPA)", body: "Depending on your jurisdiction: access your personal data, correct inaccurate data, request deletion, object to processing, data portability. Contact: privacy@stakify.com." },
  { title: "6. Security", body: "We implement industry-standard security including TLS encryption in transit and encrypted storage for sensitive data. In the event of a breach, we will notify you as required by law." },
  { title: "7. Contact", body: "privacy@stakify.com · Stakify, Inc., 548 Market St, San Francisco, CA 94104, USA" },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><Shield className="w-4 h-4" />Legal</div>
      <h1 className="text-3xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: April 28, 2026</p>
      <div className="space-y-4">
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