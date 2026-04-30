import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_ANALYSTS } from "@/lib/mockData";
import { format } from "date-fns";

const MOCK_COMMENTS = [
  { id: 1, author: MOCK_ANALYSTS[1], content: "Great analysis! The CUDA moat point is well made. I'd also add the NIMS software stack as a differentiator.", time: "2026-04-10T16:00:00Z", likes: 14 },
  { id: 2, author: MOCK_ANALYSTS[2], content: "Solid DCF model. What's your assumption for gross margin compression in 2027?", time: "2026-04-10T17:30:00Z", likes: 7 },
  { id: 3, author: MOCK_ANALYSTS[3], content: "Worth noting the China export restrictions risk isn't fully priced in here.", time: "2026-04-11T09:00:00Z", likes: 22 },
];

export default function CommentsSection({ reportId }) {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    setComments(prev => [{ id: Date.now(), author: MOCK_ANALYSTS[0], content: text.trim(), time: new Date().toISOString(), likes: 0 }, ...prev]);
    setText("");
  };

  return (
    <div id="comments">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5" />Comments ({comments.length})</h3>
      <div className="flex gap-3 mb-6">
        <img src={MOCK_ANALYSTS[0].avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="mb-2 text-sm resize-none" rows={2} />
          <Button size="sm" onClick={handleSubmit} disabled={!text.trim()}><Send className="w-3.5 h-3.5 mr-1.5" />Post</Button>
        </div>
      </div>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <img src={c.author.avatar} alt={c.author.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 bg-secondary/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{c.author.name}</span>
                <span className="text-xs text-gain">{c.author.accuracy}%</span>
                <span className="text-xs text-muted-foreground ml-auto">{format(new Date(c.time), "MMM d, HH:mm")}</span>
              </div>
              <p className="text-sm text-foreground/90">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}