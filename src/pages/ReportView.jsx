import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MOCK_REPORTS } from "@/lib/mockData";
import PredictionBadge from "@/components/feed/PredictionBadge";
import TickerTag from "@/components/feed/TickerTag";
import ShareMenu from "@/components/feed/ShareMenu";
import CommentsSection from "@/components/report/CommentsSection";
import FactChecker from "@/components/report/FactChecker";

const FULL_CONTENT = `NVIDIA's dominance in the AI infrastructure market has never been more apparent than in Q1 2026. The H200 chip, featuring 141 GB of HBM3e memory and 3.35 TB/s bandwidth, represents a 3x improvement in memory bandwidth over its predecessor.

Data center revenue grew 427% year-over-year in the latest quarter, far outpacing any comparable period in semiconductor history. The company's CUDA ecosystem — with over 4 million developers — creates an almost unassailable competitive moat that rivals simply cannot replicate in the near term.

Our DCF model, using a 10% discount rate and conservative 5-year growth projections of 30% annually, yields a fair value of approximately $1,050 per share. This assumes no further market share gains and modest margin compression from competition.

Enterprise AI capex is expected to triple by 2027, with hyperscalers like Microsoft, Google, and Amazon already committing multi-billion dollar orders for Blackwell architecture chips.

Catalysts include: the Blackwell ramp in H2 2026, Project DIGITS expansion, and sovereign AI initiatives across Europe and Asia.`;

export default function ReportView() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get("id") || "r1";
  const isPaid = urlParams.get("paid") === "true";
  const report = MOCK_REPORTS.find((r) => r.id === reportId) || MOCK_REPORTS[0];
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(report.likes);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Feed
      </button>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {report.tickers.map((t) => <TickerTag key={t} ticker={t} />)}
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-4 leading-snug">{report.title}</h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={() => navigate(`/analyst?id=${report.author.id}`)} className="flex items-center gap-2">
          <img src={report.author.avatar} alt={report.author.name} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-sm hover:text-primary transition-colors">{report.author.name}</div>
            <div className="text-xs text-gain">{report.author.accuracy}% Acc.</div>
          </div>
        </button>
        <span className="text-muted-foreground text-xs ml-auto">{format(new Date(report.publishedAt), "MMMM d, yyyy · h:mm a")}</span>
        <button onClick={() => { setLiked(!liked); setLikeCount(p => liked ? p - 1 : p + 1); }} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-loss" : "text-muted-foreground"}`}>
          <Heart className={`w-4 h-4 ${liked ? "fill-loss" : ""}`} />{likeCount}
        </button>
        <ShareMenu title={report.title} reportId={report.id} />
      </div>

      <div className="mb-6"><PredictionBadge prediction={report.prediction} /></div>

      <div className="prose prose-sm max-w-none mb-8">
        {(!report.isPremium || isPaid) ? (
          FULL_CONTENT.split("\n\n").map((para, i) => <p key={i} className="text-foreground/90 leading-relaxed mb-4">{para}</p>)
        ) : (
          <>
            <p className="text-foreground/90 leading-relaxed mb-4">{report.excerpt}</p>
            <p className="text-foreground/90 leading-relaxed mb-4 opacity-50 select-none blur-sm">NVIDIA's H200 chip, featuring 141 GB of HBM3e memory, represents a significant leap in memory bandwidth. Data center revenue grew 427% year-over-year in the latest quarter...</p>
            <div className="border border-border rounded-2xl p-8 text-center bg-secondary/30">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-1">This is a Premium Report</h3>
              <p className="text-sm text-muted-foreground mb-4">Unlock the full analysis, DCF model, and detailed catalysts.</p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button onClick={() => navigate(`/pay?mode=report&id=${report.id}&title=${encodeURIComponent(report.title)}&price=4.99`)} className="bg-amber-500 hover:bg-amber-600 text-white">Unlock for $4.99</Button>
                <Button variant="outline" onClick={() => navigate("/pay?mode=subscription")} className="border-primary/30 text-primary">Subscribe $9/mo</Button>
              </div>
            </div>
          </>
        )}
      </div>

      {(!report.isPremium || isPaid) && (
        <div className="mb-8"><FactChecker content={FULL_CONTENT} /></div>
      )}

      <CommentsSection reportId={report.id} />
    </div>
  );
}