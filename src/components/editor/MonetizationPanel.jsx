import React, { useState } from "react";
import { DollarSign, Unlock, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MonetizationPanel() {
  const [mode, setMode] = useState("free"); // "free" | "paid"
  const [price, setPrice] = useState("4.99");

  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Report Pricing</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setMode("free")}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${mode === "free" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
        >
          <Unlock className={`w-5 h-5 ${mode === "free" ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`text-xs font-semibold ${mode === "free" ? "text-primary" : "text-muted-foreground"}`}>Free</span>
          <span className="text-[10px] text-muted-foreground text-center">Anyone can read</span>
        </button>
        <button
          onClick={() => setMode("paid")}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${mode === "paid" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
        >
          <Lock className={`w-5 h-5 ${mode === "paid" ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`text-xs font-semibold ${mode === "paid" ? "text-primary" : "text-muted-foreground"}`}>Premium</span>
          <span className="text-[10px] text-muted-foreground text-center">Paid unlock</span>
        </button>
      </div>

      {mode === "paid" && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Price (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} className="pl-6 h-9" placeholder="4.99" type="number" min="0.99" step="0.50" />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5 bg-secondary rounded-lg px-2.5 py-1.5">
            You keep <span className="font-semibold text-foreground">${(parseFloat(price || 0) * 0.85).toFixed(2)}</span> after 15% platform fee
          </div>
        </div>
      )}
    </div>
  );
}