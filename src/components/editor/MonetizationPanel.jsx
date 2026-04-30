import React, { useState } from "react";
import { DollarSign, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function MonetizationPanel() {
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("4.99");

  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Monetization</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Premium Report</div>
            <div className="text-xs text-muted-foreground">Charge a one-time fee to unlock</div>
          </div>
          <Switch checked={isPremium} onCheckedChange={setIsPremium} />
        </div>
        {isPremium && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} className="pl-6 h-9" placeholder="4.99" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Stakify takes 15%. You keep ${(parseFloat(price || 0) * 0.85).toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}