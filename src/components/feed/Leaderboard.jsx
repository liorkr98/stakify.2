import React from "react";
import { MOCK_ANALYSTS } from "@/lib/mockData";
import { Trophy, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const RANK_COLORS = ["text-amber-500", "text-slate-400", "text-orange-400"];
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" />Top Analysts</h3>
      <div className="space-y-3">
        {MOCK_ANALYSTS.slice(0, 8).map((analyst, index) => (
          <button key={analyst.id} onClick={() => navigate(`/analyst?id=${analyst.id}`)} className="flex items-center gap-3 w-full text-left hover:bg-secondary rounded-lg p-1 -m-1 transition-colors">
            <span className={`text-xs font-bold w-5 text-center ${RANK_COLORS[index] || "text-muted-foreground"}`}>{index + 1}</span>
            <img src={analyst.avatar} alt={analyst.name} className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{analyst.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-gain font-medium">{analyst.accuracy}%</span>
                <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{analyst.yearlyYield}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}