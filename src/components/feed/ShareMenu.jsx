import React from "react";
import { Share2, Twitter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const PLATFORMS = [
  { label: "X (Twitter)", icon: Twitter, color: "text-sky-500", getUrl: (title, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
  { label: "LinkedIn", emoji: "💼", color: "text-blue-700", getUrl: (title, url) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { label: "Reddit", emoji: "🤖", color: "text-orange-500", getUrl: (title, url) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
];

export default function ShareMenu({ title, reportId }) {
  const reportUrl = `${window.location.origin}/report?id=${reportId}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <Share2 className="w-4 h-4" /> Share
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PLATFORMS.map((p, i) => (
          <React.Fragment key={p.label}>
            {i === 2 && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => window.open(p.getUrl(title, reportUrl), "_blank", "noopener,width=600,height=500")} className="cursor-pointer gap-2">
              {p.icon ? <p.icon className={`w-4 h-4 ${p.color}`} /> : <span>{p.emoji}</span>}
              {p.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}