import React, { useRef, useCallback, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function EditorBlock({ block, index, onChange, onDelete, onKeyDown }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== block.content) {
      ref.current.innerText = block.content || "";
    }
  }, [block.content]);

  const handleInput = useCallback(() => {
    if (ref.current) onChange(index, { ...block, content: ref.current.innerText });
  }, [index, block, onChange]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && block.type !== "bullets") { e.preventDefault(); onKeyDown(index, "enter"); }
    if (e.key === "Backspace" && !block.content && index > 0) { e.preventDefault(); onDelete(index); }
  };

  const BLOCK_STYLES = {
    heading: "text-xl font-bold text-foreground",
    text: "text-sm text-foreground/90 leading-relaxed",
    bullets: "text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap",
    quote: "text-sm text-foreground/80 italic border-l-4 border-primary/40 pl-4",
  };
  const PLACEHOLDERS = {
    heading: "Heading...",
    text: "Write your analysis...",
    bullets: "• Add bullet points...",
    quote: "Add a quote...",
  };

  return (
    <div className="group relative flex gap-2 py-1">
      <button onClick={() => onDelete(index)} className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-0.5 text-muted-foreground hover:text-loss">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={PLACEHOLDERS[block.type]}
        className={`flex-1 outline-none min-h-[1.5rem] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 ${BLOCK_STYLES[block.type] || BLOCK_STYLES.text}`}
      />
    </div>
  );
}