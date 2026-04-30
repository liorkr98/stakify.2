import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { generateCandlestickData, MOCK_STOCKS } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";
import { Pencil, Eraser, Trash2, Minus } from "lucide-react";

const TOOLS = [
  { id: "line", icon: Minus, label: "Trend Line" },
  { id: "arrow", icon: Pencil, label: "Draw" },
  { id: "erase", icon: Eraser, label: "Erase" },
];

export default function DrawableChartBlock() {
  const [ticker, setTicker] = useState("AAPL");
  const [activeTool, setActiveTool] = useState("line");
  const [drawings, setDrawings] = useState([]);
  const [drawing, setDrawing] = useState(null);
  const svgRef = useRef(null);
  const stock = MOCK_STOCKS[ticker.toUpperCase()];
  const data = useMemo(() => generateCandlestickData(ticker, 30), [ticker]);
  const isUp = stock ? stock.changePercent >= 0 : true;
  const strokeColor = isUp ? "hsl(152,55%,36%)" : "hsl(0,72%,52%)";

  const getPos = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onMouseDown = useCallback((e) => {
    if (activeTool === "erase") return;
    const pos = getPos(e);
    setDrawing({ tool: activeTool, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, points: [pos] });
  }, [activeTool]);

  const onMouseMove = useCallback((e) => {
    if (!drawing) return;
    const pos = getPos(e);
    if (drawing.tool === "line") {
      setDrawing(prev => ({ ...prev, x2: pos.x, y2: pos.y }));
    } else {
      setDrawing(prev => ({ ...prev, points: [...prev.points, pos], x2: pos.x, y2: pos.y }));
    }
  }, [drawing]);

  const onMouseUp = useCallback(() => {
    if (!drawing) return;
    setDrawings(prev => [...prev, drawing]);
    setDrawing(null);
  }, [drawing]);

  const eraseNear = (e) => {
    if (activeTool !== "erase") return;
    const pos = getPos(e);
    setDrawings(prev => prev.filter(d => {
      const dx = d.x1 - pos.x; const dy = d.y1 - pos.y;
      return Math.sqrt(dx * dx + dy * dy) > 20;
    }));
  };

  const pointsToPath = (points) => {
    if (!points || points.length < 2) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  };

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 my-2 select-none">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <Input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="Ticker…" className="w-24 h-7 text-xs font-mono" />
        {stock && (
          <span className={`text-xs font-semibold ${isUp ? "text-gain" : "text-loss"}`}>
            ${stock.price.toFixed(2)} {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </span>
        )}
        <div className="flex gap-1 ml-auto">
          {TOOLS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} title={t.label} onClick={() => setActiveTool(t.id)} className={`p-1.5 rounded-lg border text-xs transition-all ${activeTool === t.id ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
          <button title="Clear all" onClick={() => setDrawings([])} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-loss hover:border-loss/40 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="drawGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={Math.floor(data.length / 5)} />
            <YAxis tick={{ fontSize: 9 }} width={50} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={v => [`$${v}`, "Price"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Area type="monotone" dataKey="close" stroke={strokeColor} strokeWidth={2} fill="url(#drawGrad)" />
          </AreaChart>
        </ResponsiveContainer>

        {/* Drawing SVG overlay */}
        <svg
          ref={svgRef}
          className={`absolute inset-0 w-full h-full ${activeTool === "erase" ? "cursor-cell" : "cursor-crosshair"}`}
          style={{ pointerEvents: "all" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={eraseNear}
        >
          {drawings.map((d, i) => (
            d.tool === "line" ? (
              <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" />
            ) : (
              <path key={i} d={pointsToPath(d.points)} stroke="#3b82f6" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )
          ))}
          {drawing && (
            drawing.tool === "line" ? (
              <line x1={drawing.x1} y1={drawing.y1} x2={drawing.x2} y2={drawing.y2} stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeDasharray="4 2" />
            ) : (
              <path d={pointsToPath(drawing.points)} stroke="#3b82f6" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )
          )}
        </svg>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        {activeTool === "line" ? "Click & drag to draw trend lines (amber)" : activeTool === "arrow" ? "Freehand draw annotations (blue)" : "Click near a line to erase it"}
      </p>
    </div>
  );
}