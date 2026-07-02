"use client";

import DotField from "@/components/DotField";

export function LandingPageBackground() {
  return (
    <DotField
      dotRadius={1.4}
      dotSpacing={18}
      cursorRadius={360}
      bulgeStrength={22}
      dotColor="rgba(255, 255, 255, 0.45)"
      accentColor="rgba(255, 255, 255, 0.65)"
      showGlow={false}
    />
  );
}
