import React, { useState } from "react";
import { MessageCircle, Send, Heart, Reply, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_ANALYSTS } from "@/lib/mockData";
import { format } from "date-fns";

const REACTIONS = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "💡", label: "Insightful" },
  { emoji: "🤔", label: "Skeptical" },
  { emoji: "✅", label: "Agree" },
  { emoji: "❌", label: "Disagree" },
];

const MOCK_COMMENTS = [
  { id: 1, author: MOCK_ANALYSTS[1], content: "Great analysis! The CUDA moat point is well made. I'd also add the NIMS software stack as a differentiator.", time: "2026-04-10T16:00:00Z", likes: 14, reactions: { "🔥": 8, "💡": 6 }, replies: [] },
  { id: 2, author: MOCK_ANALYSTS[2], content: "Solid DCF model. What's your assumption for gross margin compression in 2027?", time: "2026-04-10T17:30:00Z", likes: 7, reactions: { "🤔": 4 }, replies: [{ id: 21, author: MOCK_ANALYSTS[0], content: "Modelling 2.5% compression from H200 → B100 mix shift, but could be more if AMD gains traction.", time: "2026-04-10T18:00:00Z", likes: 5 }] },
  { id: 3, author: MOCK_ANALYSTS[3], content: "Worth noting the China export restrictions risk isn't fully priced in here.", time: "2026-04-11T09:00:00Z", likes: 22, reactions: { "✅": 12, "💡": 10 }, replies: [] },
];

function CommentItem({ comment, onReply }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);
  const [reactions, setReactions] = useState(comment.reactions || {});
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (emoji) => {
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    setShowReactions(false);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    setReplies(prev => [...prev, { id: Date.now(), author: MOCK_ANALYSTS[0], content: replyText.trim(), time: new Date().toISOString(), likes: 0 }]);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="flex gap-3">
      <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="bg-secondary/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-gain">{comment.author.accuracy}%</span>
            <span className="text-xs text-muted-foreground ml-auto">{format(new Date(comment.time), "MMM d, HH:mm")}</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>

          {/* Reactions display */}
          {Object.keys(reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(reactions).map(([emoji, count]) => (
                <button key={emoji} onClick={() => handleReaction(emoji)} className="flex items-center gap-0.5 text-xs bg-card border border-border rounded-full px-2 py-0.5 hover:border-primary/40 transition-colors">
                  {emoji} {count}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1.5 px-1 relative">
          <button onClick={() => { setLiked(!liked); setLikeCount(p => liked ? p - 1 : p + 1); }} className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-loss" : "text-muted-foreground hover:text-foreground"}`}>
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-loss" : ""}`} />{likeCount}
          </button>
          <div className="relative">
            <button onClick={() => setShowReactions(!showReactions)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">React</button>
            {showReactions && (
              <div className="absolute bottom-full mb-1 left-0 bg-card border border-border rounded-xl p-2 flex gap-1 shadow-lg z-10">
                {REACTIONS.map(r => (
                  <button key={r.emoji} title={r.label} onClick={() => handleReaction(r.emoji)} className="text-lg hover:scale-125 transition-transform">{r.emoji}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Reply className="w-3.5 h-3.5" />Reply
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-loss transition-colors ml-auto">
            <Flag className="w-3 h-3" />
          </button>
        </div>

        {showReply && (
          <div className="mt-2 flex gap-2">
            <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={`Reply to ${comment.author.name}…`} className="text-sm resize-none flex-1" rows={2} />
            <Button size="sm" onClick={submitReply} disabled={!replyText.trim()}><Send className="w-3.5 h-3.5" /></Button>
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="mt-2 space-y-2 pl-3 border-l-2 border-border">
            {replies.map(r => (
              <div key={r.id} className="flex gap-2">
                <img src={r.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                <div className="bg-secondary/30 rounded-lg p-2 flex-1">
                  <span className="font-semibold text-xs mr-2">{r.author.name}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(r.time), "MMM d, HH:mm")}</span>
                  <p className="text-xs mt-0.5 text-foreground/90">{r.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentsSection({ reportId }) {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    setComments(prev => [{ id: Date.now(), author: MOCK_ANALYSTS[0], content: text.trim(), time: new Date().toISOString(), likes: 0, reactions: {}, replies: [] }, ...prev]);
    setText("");
  };

  return (
    <div id="comments">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5" />Comments ({comments.length})</h3>
      <div className="flex gap-3 mb-6">
        <img src={MOCK_ANALYSTS[0].avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1">
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." className="mb-2 text-sm resize-none" rows={2} />
          <Button size="sm" onClick={handleSubmit} disabled={!text.trim()}><Send className="w-3.5 h-3.5 mr-1.5" />Post</Button>
        </div>
      </div>
      <div className="space-y-5">
        {comments.map(c => <CommentItem key={c.id} comment={c} />)}
      </div>
    </div>
  );
}