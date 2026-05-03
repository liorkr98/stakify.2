import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, ArrowLeft, Star, Shield, Zap, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const SUBSCRIPTION_PLANS = [
  { key: "basic", label: "Basic", price: 9, description: "For casual investors", features: ["All published reports", "Weekly market digest", "Community comments", "Prediction tracking"] },
  { key: "pro", label: "Pro", price: 29, description: "For serious analysts", features: ["Everything in Basic", "Locked predictions access", "Direct analyst DMs", "Weekly live Q&A", "Export reports to PDF", "Early access to reports"], highlight: true },
];

async function createCheckoutSession(params) {
  const res = await base44.functions.invoke('stripeCheckout', params);
  return res.data;
}

function SuccessScreen({ mode }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-gain/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-10 h-10 text-gain" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{mode === 'report' ? 'Report Unlocked!' : mode === 'boost' ? 'Boost Activated!' : 'Subscription Active!'}</h2>
      <p className="text-muted-foreground text-sm">Your payment was processed successfully.</p>
      <Button className="mt-6" onClick={() => navigate('/')}>Back to Feed</Button>
    </div>
  );
}

function CheckoutButton({ label, loading, onClick }) {
  return (
    <Button onClick={onClick} disabled={loading} className="w-full h-11 text-base font-semibold mt-4">
      {loading
        ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirecting to Stripe...</>
        : <><Lock className="w-4 h-4 mr-2" />{label}</>}
    </Button>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "subscription";
  const reportTitle = urlParams.get("title") || "Premium Report";
  const reportPrice = parseFloat(urlParams.get("price") || "4.99");
  const reportId = urlParams.get("id") || "";
  const analystName = urlParams.get("analyst") || "";
  const boostPlanId = urlParams.get("boostPlanId") || "";

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);

  // Handle Stripe success/cancel redirects
  if (urlParams.get("success") === "true" || urlParams.get("subscription") === "success" || urlParams.get("analyst_sub") === "success") {
    return <SuccessScreen mode={mode} />;
  }
  if (urlParams.get("boost") === "success") {
    return <SuccessScreen mode="boost" />;
  }

  const handleCheckout = async (checkoutMode, extraParams = {}) => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession({ mode: checkoutMode, ...extraParams });
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not create checkout session. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message || "Payment error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back
      </button>

      {mode === "report" && (
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
          <CheckoutButton label={`Pay $${reportPrice.toFixed(2)} via Stripe`} loading={loading} onClick={() => handleCheckout('report', { price: reportPrice, title: reportTitle, reportId, analystName })} />
          <p className="text-xs text-center text-muted-foreground mt-4">Or <button onClick={() => navigate("/pay?mode=subscription")} className="text-primary hover:underline">subscribe from $9/mo</button> for unlimited access.</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
            <Shield className="w-3.5 h-3.5 text-gain" />256-bit SSL · Powered by Stripe
          </div>
        </div>
      )}

      {mode === "boost" && (
        <div>
          <h1 className="text-xl font-bold mb-1">Boost Report</h1>
          <p className="text-sm text-muted-foreground mb-5">Increase your report's visibility on the feed.</p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
            <h2 className="font-bold text-base mb-1">{reportTitle}</h2>
            <div className="flex items-center justify-between pt-3 border-t border-orange-200/60">
              <span className="text-sm text-muted-foreground">One-time boost</span>
              <span className="text-xl font-bold">${reportPrice.toFixed(2)}</span>
            </div>
          </div>
          <CheckoutButton label={`Pay $${reportPrice.toFixed(2)} via Stripe`} loading={loading} onClick={() => handleCheckout('boost', { price: reportPrice, title: reportTitle, boostPlanId })} />
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
            <Shield className="w-3.5 h-3.5 text-gain" />256-bit SSL · Powered by Stripe
          </div>
        </div>
      )}

      {(mode === "subscription" || mode === "analyst") && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">
              {mode === "analyst" ? `Subscribe to ${analystName || "Analyst"}` : "Unlock Full Access"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Monthly subscription · Cancel anytime.</p>
          <div className="space-y-3 mb-6">
            {SUBSCRIPTION_PLANS.map(plan => (
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
          <CheckoutButton
            label={`Subscribe $${SUBSCRIPTION_PLANS.find(p => p.key === selectedPlan)?.price}/mo via Stripe`}
            loading={loading}
            onClick={() => {
              const plan = SUBSCRIPTION_PLANS.find(p => p.key === selectedPlan);
              if (mode === "subscription" && selectedPlan === "pro") {
                // Use the configured Stripe price ID for the main subscription
                handleCheckout('subscription', {});
              } else {
                // Dynamic pricing for analyst subscriptions or basic plan
                handleCheckout('analyst', { price: plan.price, analystName });
              }
            }}
          />
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
            <Shield className="w-3.5 h-3.5 text-gain" />256-bit SSL · Powered by Stripe · Cancel anytime
          </div>
        </div>
      )}
    </div>
  );
}