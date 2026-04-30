import React, { useState } from "react";
import { Rocket, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BOOST_PLANS = [
  { id: "basic", label: "Basic Boost", price: 4.99, desc: "Featured in feed for 24h", reach: "~2,000 extra views" },
  { id: "pro", label: "Pro Boost", price: 14.99, desc: "Top of feed for 48h + email digest", reach: "~8,000 extra views" },
  { id: "premium", label: "Premium Boost", price: 29.99, desc: "Homepage feature + newsletter", reach: "~25,000 extra views" },
];

export default function BoostPanel() {
  const [selected, setSelected] = useState(null);
  const [boosted, setBoosted] = useState(false);

  const handleBoost = () => {
    if (!selected) return;
    setBoosted(true);
    toast.success(`Report boosted! ${BOOST_PLANS.find(p => p.id === selected)?.reach}`);
  };

  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-4 h-4 text-orange-500" />
        <h3 className="font-semibold text-sm">Boost Report</h3>
      </div>
      {boosted ? (
        <div className="flex items-center gap-2 text-sm text-gain">
          <Check className="w-4 h-4" />Report is boosted!
        </div>
      ) : (
        <div className="space-y-2">
          {BOOST_PLANS.map(plan => (
            <button key={plan.id} onClick={() => setSelected(plan.id)} className={`w-full text-left border rounded-xl p-3 transition-all ${selected === plan.id ? "border-orange-400 bg-orange-50" : "border-border hover:border-orange-300"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm">{plan.label}</span>
                <span className="text-sm font-bold text-orange-600">${plan.price}</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan.desc}</p>
              <p className="text-xs text-orange-600 font-medium">{plan.reach}</p>
            </button>
          ))}
          <Button onClick={handleBoost} disabled={!selected} className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-1">
            <Rocket className="w-3.5 h-3.5 mr-1.5" />Boost Now
          </Button>
        </div>
      )}
    </div>
  );
}