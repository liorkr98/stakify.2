import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { MOCK_STOCKS } from "@/lib/mockData";
import { format } from "date-fns";

export default function PredictionBlock({ onPublish }) {
  const [action, setAction] = useState("");
  const [ticker, setTicker] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockData, setLockData] = useState(null);

  const handlePublish = () => {
    const stock = MOCK_STOCKS[ticker.toUpperCase()];
    const lockPrice = stock ? stock.price : parseFloat(targetPrice) * 0.9;
    const data = { action, ticker: ticker.toUpperCase(), targetPrice: parseFloat(targetPrice), timeframe, lockPrice, lockTime: new Date().toISOString() };
    setLockData(data);
    setLocked(true);
    if (onPublish) onPublish(data);
  };

  const isValid = action && ticker && targetPrice && timeframe;
  const ACTION_ICONS = { Long: ArrowUp, Short: ArrowDown, Hold: Minus };
  const ACTION_COLORS = { Long: "text-gain", Short: "text-loss", Hold: "text-amber-600" };

  return (
    <div className="border border-border rounded-xl p-5 bg-secondary/30 my-4">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Prediction Block</h3>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${locked ? "bg-gain/10 text-gain" : "bg-secondary text-muted-foreground"}`}>{locked ? "Locked" : "Required"}</span>
      </div>
      {!locked ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Action</label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent><SelectItem value="Long">Long</SelectItem><SelectItem value="Short">Short</SelectItem><SelectItem value="Hold">Hold</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ticker</label>
              <Input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="e.g. AAPL" className="h-9 font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Target Price</label>
              <Input value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="$0.00" className="h-9 font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 days">3 Days</SelectItem>
                  <SelectItem value="5 days">5 Days</SelectItem>
                  <SelectItem value="1 week">1 Week</SelectItem>
                  <SelectItem value="2 weeks">2 Weeks</SelectItem>
                  <SelectItem value="1 month">1 Month</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="12 months">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handlePublish} disabled={!isValid} className="w-full"><Lock className="w-4 h-4 mr-2" />Publish & Lock Prediction</Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          {lockData && <>
            {React.createElement(ACTION_ICONS[lockData.action], { className: `w-5 h-5 ${ACTION_COLORS[lockData.action]}` })}
            <span className={`font-bold ${ACTION_COLORS[lockData.action]}`}>{lockData.action}</span>
            <span className="font-mono font-bold">${lockData.ticker}</span>
            <span className="text-sm text-muted-foreground">Target: ${lockData.targetPrice} · {lockData.timeframe}</span>
            <span className="ml-auto text-xs text-muted-foreground">{format(new Date(lockData.lockTime), "MMM d, yyyy · HH:mm")}</span>
          </>}
        </div>
      )}
    </div>
  );
}