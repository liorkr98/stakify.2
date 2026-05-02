import React, { useState } from "react";
import { Heart, MessageCircle, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import TickerTag from "./TickerTag";
import ShareMenu from "./ShareMenu";

const ACTION_CONFIG = {
  Long: { color: "text-gain", bg: "bg-gain/10 border-gain/20", icon: TrendingUp },
  Short: { color: "text-loss", bg: "bg-loss/10 border-loss/20", icon: TrendingDown },
  Hold: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Minus },
};

export default function ReportCard({ report, compact = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likes);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const actionCfg = ACTION_CONFIG[report.prediction?.action] || ACTION_CONFIG.Hold;
  const ActionIcon = actionCfg.icon;

  return (
    <article onClick={() => navigate(`/report?id=${report.id}`)} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/analyst?id=${report.author.id}`); }} className="flex-shrink-0">
            <img src={report.author.avatar} alt={report.author.name} className="w-9 h-9 rounded-full bg-secondary object-cover" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); navigate(`/analyst?id=${report.author.id}`); }} className="font-semibold text-sm text-foreground hover:text-primary transition-colors">{report.author.name}</button>
              <span className="text-xs text-gain font-medium">{report.author.accuracy}%</span>
              {report.isPremium && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200">Premium</Badge>}
            </div>
            <div className="text-xs text-muted-foreground">{format(new Date(report.publishedAt), "MMM d, yyyy")}</div>
          </div>
        </div>
        {report.prediction && (
          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${actionCfg.bg} ${actionCfg.color}`}>
            <ActionIcon className="w-3 h-3" />{report.prediction.action} ${report.prediction.ticker}
          </div>
        )}
      </div>

      <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">{report.title}</h3>
      {!compact && <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{report.excerpt}</p>}

      <div className="flex flex-wrap gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
        {report.tickers.map((t) => <TickerTag key={t} ticker={t} />)}
      </div>

      {report.prediction && (
        <div className={`sm:hidden flex items-center justify-between text-xs font-medium px-3 py-2 rounded-lg border mb-3 ${actionCfg.bg}`}>
          <span className={actionCfg.color}>{report.prediction.action} · ${report.prediction.ticker} → ${report.prediction.targetPrice}</span>
          <span className="text-muted-foreground">{report.prediction.timeframe}</span>
        </div>
      )}

      {report.prediction?.outcome && (
        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border mb-3 ${report.prediction.outcome === "hit" ? "bg-gain/10 border-gain/20 text-gain" : "bg-loss/10 border-loss/20 text-loss"}`}>
          {report.prediction.outcome === "hit" ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{report.prediction.outcomeNote}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-loss" : "text-muted-foreground hover:text-foreground"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-loss" : ""}`} />{likeCount}
          </button>
          <button onClick={() => navigate(`/report?id=${report.id}#comments`)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-4 h-4" />Comment
          </button>
          {report.isPremium && <span className="text-xs font-semibold text-amber-600">${report.price}</span>}
        </div>
        <div onClick={(e) => e.stopPropagation()}><ShareMenu title={report.title} reportId={report.id} /></div>
      </div>
    </article>
  );
}