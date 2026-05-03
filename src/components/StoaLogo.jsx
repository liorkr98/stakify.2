import React from "react";

// STOA pillars logo — recreated from brand assets
export default function StoaLogo({ className = "", size = 28, textSize = "text-xl", showText = true, light = false }) {
  const color = light ? "#ffffff" : "#1e3a6e";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Pillars SVG icon */}
      <svg width={size} height={size} viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top architrave */}
        <rect x="2" y="3" width="36" height="3" rx="0.5" fill={color} />
        {/* Top thin cap line */}
        <rect x="2" y="1" width="36" height="1.5" rx="0.5" fill={color} />
        {/* Bottom base */}
        <rect x="2" y="38" width="36" height="3" rx="0.5" fill={color} />
        {/* Pillar 1 */}
        <rect x="5" y="6" width="6" height="32" rx="0.5" fill={color} />
        {/* Pillar 2 */}
        <rect x="17" y="6" width="6" height="32" rx="0.5" fill={color} />
        {/* Pillar 3 */}
        <rect x="29" y="6" width="6" height="32" rx="0.5" fill={color} />
      </svg>
      {showText && (
        <span
          className={`font-bold tracking-widest ${textSize}`}
          style={{ color, fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "0.18em" }}
        >
          STOA
        </span>
      )}
    </span>
  );
}