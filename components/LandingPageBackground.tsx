"use client";

import DotField from "@/components/DotField";

export function LandingPageBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <DotField
        dotRadius={1.15}
        dotSpacing={18}
        cursorRadius={360}
        bulgeStrength={22}
        dotColor="rgba(255, 255, 255, 0.25)"
        accentColor="rgba(255, 255, 255, 0.35)"
        showGlow={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
