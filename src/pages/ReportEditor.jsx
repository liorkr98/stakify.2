import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Plus, Type, List, BarChart3, Image, Quote, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import EditorBlock from "@/components/editor/EditorBlock";
import ChartBlock from "@/components/editor/ChartBlock";
import ImageBlock from "@/components/editor/ImageBlock";
import PredictionBlock from "@/components/editor/PredictionBlock";
import AISidebar from "@/components/editor/AISidebar";
import MonetizationPanel from "@/components/editor/MonetizationPanel";
import FactChecker from "@/components/report/FactChecker";

const DYOR_TEXT = "⚠️ Disclaimer: This report is for informational purposes only and does not constitute financial advice. Always do your own research (DYOR) before making any investment decisions.";

export default function ReportEditor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([{ type: "text", content: "", id: 0 }]);
  const nextId = React.useRef(1);
  const [showAI, setShowAI] = useState(false);

  const handleBlockChange = useCallback((index, newBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? newBlock : b)));
  }, []);
  const handleBlockDelete = useCallback((index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const handleBlockKeyDown = useCallback((index, action) => {
    if (action === "enter") {
      setBlocks((prev) => { const n = [...prev]; n.splice(index + 1, 0, { type: "text", content: "", id: nextId.current++ }); return n; });
    }
  }, []);
  const addBlock = (type) => setBlocks((prev) => [...prev, { type, content: "", id: nextId.current++ }]);
  const addDYOR = () => { setBlocks((prev) => [...prev, { type: "text", content: DYOR_TEXT, id: nextId.current++ }]); toast.success("DYOR disclaimer added"); };

  const handleAIGenerate = (template) => {
    setBlocks(template.map((b) => ({ ...b, id: nextId.current++ })));
    toast.success("Template loaded! All blocks are editable.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Write Report</h1>
              <p className="text-sm text-muted-foreground">Create data-driven research for your followers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addDYOR} className="text-xs"><AlertTriangle className="w-3.5 h-3.5 mr-1" />DYOR</Button>
              <Button variant="outline" size="sm" onClick={() => setShowAI(true)} className="border-primary/30 text-primary hover:bg-primary/5"><Sparkles className="w-3.5 h-3.5 mr-1.5" />AI Assist</Button>
            </div>
          </div>

          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled Report..." className="text-3xl font-bold border-none bg-transparent px-0 h-auto py-2 placeholder:text-muted-foreground/30 focus-visible:ring-0 mb-6 text-3xl" />

          <div className="space-y-1 mb-6">
            {blocks.map((block, index) =>
              block.type === "chart" ? <ChartBlock key={block.id} /> :
              block.type === "image" ? <ImageBlock key={block.id} block={block} onDelete={() => handleBlockDelete(index)} /> :
              <EditorBlock key={block.id} block={block} index={index} onChange={handleBlockChange} onDelete={handleBlockDelete} onKeyDown={handleBlockKeyDown} />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Add Block</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addBlock("heading")}><Type className="w-4 h-4 mr-2" />Heading</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock("text")}><Type className="w-4 h-4 mr-2" />Text</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock("bullets")}><List className="w-4 h-4 mr-2" />Bullet List</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock("quote")}><Quote className="w-4 h-4 mr-2" />Quote</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addBlock("chart")}><BarChart3 className="w-4 h-4 mr-2" />Stock Chart</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock("image")}><Image className="w-4 h-4 mr-2" />Image</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mt-8"><PredictionBlock onPublish={(p) => toast.success(`Prediction locked: ${p.action} $${p.ticker}`)} /></div>
          <div className="mt-4"><FactChecker content={[title, ...blocks.map(b => b.content)].filter(Boolean).join("\n\n")} /></div>
        </div>

        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          <MonetizationPanel />
          <div className="bg-card border border-border rounded-xl p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground text-sm mb-2">Tips</p>
            <p>• Use $TICKER notation to reference stocks</p>
            <p>• Add a DYOR disclaimer before publishing</p>
            <p>• Lock a prediction to build credibility</p>
            <p>• Monetize with a premium price or subscription</p>
          </div>
        </aside>
      </div>
      <AISidebar isOpen={showAI} onClose={() => setShowAI(false)} onGenerate={handleAIGenerate} />
    </div>
  );
}