import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, ArrowLeft, Star, CreditCard, Shield, Zap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PLANS = [
  { key: "basic", label: "Basic", price: 9, description: "For casual investors", features: ["All published reports", "Weekly market digest", "Community comments", "Prediction tracking"], highlight: false },
  { key: "pro", label: "Pro", price: 29, description: "For serious analysts", features: ["Everything in Basic", "Locked predictions access", "Direct analyst DMs", "Weekly live Q&A", "Export reports to PDF", "Early access to reports"], highlight: true },
];

function formatCard(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val) {
  const v = val.replace(/\D/g, "").slice(0, 4);
  return v.length >= 3 ? v.slice(0, 2) + "/" + v.slice(2) : v;
}

function NewsletterAddon({ enabled, onToggle }) {
  return (
    <button onClick={onToggle} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 mb-4 text-left transition-all ${enabled ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${enabled ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
        <Mail className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm flex items-center gap-2">
          Newsletter Add-on
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">Add-on</span>
        </div>
        <p className="text-xs text-muted-foreground">Get email alerts when your followed analysts publish new reports.</p>
      </div>
      <div className="text-right shrink-0">
        <div className="font-bold text-primary">+$4.99<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
        <div className={`text-xs mt-0.5 ${enabled ? "text-primary font-semibold" : "text-muted-foreground"}`}>{enabled ? "✓ Added" : "Add"}</div>
      </div>
    </button>
  );
}

function StripeCardForm({ amount, label, onSuccess }) {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!card || !expiry || !cvc || !name) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <CreditCard className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Payment Details</span>
        <div className="ml-auto flex items-center gap-1.5">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-5 object-contain opacity-60" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Visa_2021.svg" alt="Visa" className="h-4 object-contain opacity-60" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-5 object-contain opacity-60" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">Name on Card</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">Card Number</label>
          <div className="relative">
            <Input value={card} onChange={e => setCard(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" className="font-mono pr-10" maxLength={19} />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Expiry Date</label>
            <Input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" className="font-mono" maxLength={5} />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">CVC / CVV</label>
            <Input value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className="font-mono" />
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</span>
            ) : (
              <span className="flex items-center gap-2"><Lock className="w-4 h-4" />Pay ${amount?.toFixed ? amount.toFixed(2) : amount} — {label}</span>
            )}
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-gain" />
          <span>256-bit SSL encryption · Powered by Stripe</span>
        </div>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "subscription";
  const reportTitle = urlParams.get("title") || "Premium Report";
  const reportPrice = parseFloat(urlParams.get("price") || "4.99");
  const analystName = urlParams.get("analyst") || "";
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [newsletterAddon, setNewsletterAddon] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSuccess = () => {
    setPaid(true);
    toast.success(mode === "report" ? "Report unlocked! Enjoy the full analysis." : "Subscription activated! Welcome to Stakify Pro.");
    setTimeout(() => navigate(-1), 2500);
  };

  const currentPlan = PLANS.find(p => p.key === selectedPlan);

  if (paid) return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-gain/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <Check className="w-10 h-10 text-gain" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{mode === "report" ? "Report Unlocked!" : "Subscription Activated!"}</h2>
      <p className="text-muted-foreground">{mode === "report" ? "Full access to this premium report is now yours." : `You're now on the ${currentPlan?.label} plan. Welcome!`}</p>
      <p className="text-xs text-muted-foreground mt-4">Redirecting you back...</p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back
      </button>

      {mode === "report" ? (
        <div>
          <h1 className="text-xl font-bold mb-1">Unlock Report</h1>
          <p className="text-sm text-muted-foreground mb-5">One-time purchase — yours forever.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Premium Report</span>
            </div>
            <h2 className="font-bold text-base mb-1 leading-snug">{reportTitle}</h2>
            {analystName && <p className="text-xs text-muted-foreground mb-2">by {analystName}</p>}
            <div className="flex items-center justify-between pt-3 border-t border-amber-200/60">
              <span className="text-sm text-muted-foreground">One-time access</span>
              <span className="text-xl font-bold">${reportPrice.toFixed(2)}</span>
            </div>
          </div>
          <StripeCardForm amount={reportPrice} label="Report" onSuccess={handleSuccess} />
          <p className="text-xs text-center text-muted-foreground mt-4">Or <button onClick={() => navigate("/pay?mode=subscription")} className="text-primary hover:underline">subscribe from $9/mo</button> for unlimited access.</p>
        </div>
      ) : mode === "analyst" ? (
        <div>
          <h1 className="text-xl font-bold mb-1">Subscribe to {analystName || "Analyst"}</h1>
          <p className="text-sm text-muted-foreground mb-6">Unlock full reports, predictions, and direct access.</p>
          <div className="space-y-3 mb-6">
            {PLANS.map(plan => (
              <button key={plan.key} onClick={() => setSelectedPlan(plan.key)} className={`w-full text-left rounded-xl border-2 p-4 transition-all ${selectedPlan === plan.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{plan.label}</span>
                    {plan.highlight && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>}
                  </div>
                  <span className="font-bold text-lg">${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
                <ul className="space-y-0.5">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-1.5 text-xs"><Check className="w-3 h-3 text-gain flex-shrink-0" />{f}</li>)}
                </ul>
              </button>
            ))}
          </div>
          <NewsletterAddon enabled={newsletterAddon} onToggle={() => setNewsletterAddon(v => !v)} />
          <StripeCardForm amount={(currentPlan?.price || 0) + (newsletterAddon ? 4.99 : 0)} label={`${currentPlan?.label} Plan/mo`} onSuccess={handleSuccess} />
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Unlock Full Access</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Follow the best analysts and track verified predictions.</p>
          <div className="space-y-3 mb-6">
            {PLANS.map(plan => (
              <button key={plan.key} onClick={() => setSelectedPlan(plan.key)} className={`w-full text-left rounded-xl border-2 p-4 transition-all ${selectedPlan === plan.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{plan.label}</span>
                    {plan.highlight && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>}
                  </div>
                  <span className="font-bold text-lg">${plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{plan.description}</p>
                <ul className="space-y-0.5">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-1.5 text-xs"><Check className="w-3 h-3 text-gain flex-shrink-0" />{f}</li>)}
                </ul>
              </button>
            ))}
          </div>
          <NewsletterAddon enabled={newsletterAddon} onToggle={() => setNewsletterAddon(v => !v)} />
          <StripeCardForm amount={(currentPlan?.price || 0) + (newsletterAddon ? 4.99 : 0)} label={`${currentPlan?.label} Plan/mo`} onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
}