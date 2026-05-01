import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MOCK_ANALYSTS } from "@/lib/mockData";
import { getTwits, saveTwit } from "@/lib/twitsStore";

export default function TwitsPanel() {
  const analyst = MOCK_ANALYSTS[0];
  const [tweet, setTweet] = useState("");
  const [twits, setTwits] = useState(() => getTwits());

  const post = () => {
    if (!tweet.trim()) return;
    const updated = saveTwit(tweet.trim());
    setTwits(updated);
    setTweet("");
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" />Quick Twits</h3>
      <div className="mb-4">
        <Textarea value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder="Share a quick market thought..." className="mb-2 text-sm resize-none" rows={2} />
        <Button size="sm" onClick={post} disabled={!tweet.trim()}><Send className="w-3.5 h-3.5 mr-1.5" />Post</Button>
      </div>
      <div className="space-y-3">
        {twits.map((t) => (
          <div key={t.id} className="flex gap-2.5 p-3 bg-secondary/50 rounded-lg">
            <img src={analyst.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 object-cover" />
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{t.content}</p>
              <span className="text-xs text-muted-foreground">{t.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}