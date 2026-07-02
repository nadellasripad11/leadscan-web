"use client";

import DotField from "@/components/DotField";

export function LandingPageBackground() {
  return (
    <DotField
      dotRadius={1.15}
      dotSpacing={18}
      cursorRadius={360}
      bulgeStrength={22}
      dotColor="rgba(255, 255, 255, 0.25)"
      accentColor="rgba(255, 255, 255, 0.35)"
      showGlow={false}
    />
  );
}
