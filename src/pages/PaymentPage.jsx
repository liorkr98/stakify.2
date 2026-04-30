import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PLANS = [
  { key: "basic", label: "Basic", price: 9, description: "For casual investors", features: ["All published reports", "Weekly market digest", "Community comments"], highlight: false },
  { key: "pro", label: "Pro", price: 29, description: "For serious analysts", features: ["Everything in Basic", "Locked predictions access", "Direct analyst DMs", "Weekly live Q&A", "Export reports to PDF"], highlight: true },
];

function PaymentForm({ amount, label, onSuccess }) {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div><label className="text-xs text-muted-foreground block mb-1">Card Number</label><div className="relative"><Input value={card} onChange={(e) => setCard(e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="4242 4242 4242 4242" className="font-mono" /><Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /></div></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground block mb-1">Expiry</label><Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="font-mono" /></div>
        <div><label className="text-xs text-muted-foreground block mb-1">CVC</label><Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" className="font-mono" /></div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Processing..." : `Pay $${amount} — ${label}`}</Button>
      <p className="text-xs text-muted-foreground text-center">🔒 Secured with 256-bit SSL encryption</p>
    </form>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "subscription";
  const reportTitle = urlParams.get("title") || "Premium Report";
  const reportPrice = parseFloat(urlParams.get("price") || "4.99");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [paid, setPaid] = useState(false);

  const handleSuccess = () => {
    setPaid(true);
    toast.success(mode === "report" ? "Report unlocked!" : "Subscription activated!");
    setTimeout(() => navigate(-1), 2500);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"><ArrowLeft className="w-4 h-4" />Back</button>

      {paid ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gain/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-gain" /></div>
          <h2 className="text-xl font-bold mb-2">{mode === "report" ? "Report Unlocked!" : "Subscription Activated!"}</h2>
          <p className="text-sm text-muted-foreground">Redirecting you back...</p>
        </div>
      ) : mode === "report" ? (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-600" /><span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Premium Report</span></div>
            <h1 className="text-lg font-bold mb-1">{reportTitle}</h1>
            <p className="text-sm text-muted-foreground">One-time purchase — yours forever.</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-200/60">
              <span className="text-sm">Report Access</span><span className="font-bold">${reportPrice.toFixed(2)}</span>
            </div>
          </div>
          <PaymentForm amount={reportPrice} label="Report" onSuccess={handleSuccess} />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-1">Unlock Full Access</h1>
          <p className="text-sm text-muted-foreground mb-6">Follow the best analysts and track verified predictions.</p>
          <div className="space-y-3 mb-6">
            {PLANS.map((plan) => (
              <button key={plan.key} onClick={() => setSelectedPlan(plan.key)} className={`w-full text-left rounded-xl border-2 p-5 transition-all ${selectedPlan === plan.key ? plan.highlight ? "border-primary bg-primary/5" : "border-foreground/30 bg-secondary" : "border-border hover:border-border/80"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{plan.label}</span>
                  {plan.highlight && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Popular</span>}
                  <span className="font-bold">${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
                <ul className="space-y-0.5">{plan.features.map((f) => <li key={f} className="flex items-center gap-1.5 text-xs"><Check className="w-3.5 h-3.5 text-gain" />{f}</li>)}</ul>
              </button>
            ))}
          </div>
          <PaymentForm amount={PLANS.find(p => p.key === selectedPlan)?.price} label={`${PLANS.find(p => p.key === selectedPlan)?.label} Plan`} onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
}