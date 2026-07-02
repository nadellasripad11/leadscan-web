"use client";

import { memo, useEffect, useRef } from "react";

type Dot = {
  ax: number;
  ay: number;
  x: number;
  y: number;
};

export type DotFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Dot diameter in CSS pixels */
  dotRadius?: number;
  /** Gap between dot centers */
  dotSpacing?: number;
  /** Cursor influence radius */
  cursorRadius?: number;
  /** How far dots bulge away from cursor (0–100) */
  bulgeStrength?: number;
  /** Base dot fill */
  dotColor?: string;
  /** Highlight color near cursor */
  accentColor?: string;
  /** Draw subtle radial glow at cursor */
  showGlow?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const DotField = memo(function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 480,
  bulgeStrength = 50,
  dotColor = "rgba(255, 255, 255, 0.18)",
  accentColor = "rgba(192, 132, 252, 0.55)",
  showGlow = true,
  className = "",
  style,
  ...rest
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const engagementRef = useRef(0);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const buildGrid = (width: number, height: number) => {
      const step = dotRadius + dotSpacing;
      const cols = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;
      const padX = (width - (cols - 1) * step) / 2;
      const padY = (height - (rows - 1) * step) / 2;
      const dots: Dot[] = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step;
          const ay = padY + row * step;
          dots.push({ ax, ay, x: ax, y: ay });
        }
      }

      dotsRef.current = dots;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width, height, dpr };
      buildGrid(width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    const draw = () => {
      frameRef.current += 1;
      const { width, height } = sizeRef.current;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const frame = frameRef.current;

      const targetEngagement = mouse.active ? 1 : 0;
      engagementRef.current += (targetEngagement - engagementRef.current) * 0.08;
      const engagement = engagementRef.current;

      ctx.clearRect(0, 0, width, height);

      if (showGlow && engagement > 0.02) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, cursorRadius * 0.45);
        glow.addColorStop(0, `rgba(192, 132, 252, ${0.14 * engagement})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      const radiusSq = cursorRadius * cursorRadius;
      const strength = bulgeStrength * 0.85;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let targetX = dot.ax;
        let targetY = dot.ay;

        if (engagement > 0.01) {
          const dx = mouse.x - dot.ax;
          const dy = mouse.y - dot.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq) || 0.001;
            const influence = 1 - dist / cursorRadius;
            const push = influence * influence * strength * engagement;
            const angle = Math.atan2(dy, dx);
            targetX = dot.ax - Math.cos(angle) * push;
            targetY = dot.ay - Math.sin(angle) * push;
          }
        }

        dot.x += (targetX - dot.x) * 0.14;
        dot.y += (targetY - dot.y) * 0.14;

        const drift = Math.sin(dot.ax * 0.015 + frame * 0.01) * 0.2;
        const drawX = dot.x;
        const drawY = dot.y + drift;

        let alpha = 0.15;
        let radius = dotRadius;
        let proximity = 0;

        if (engagement > 0.05) {
          const mdx = mouse.x - drawX;
          const mdy = mouse.y - drawY;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          proximity = Math.min(1, 1 - md / cursorRadius);
          alpha = 0.12 + proximity * 0.35 * engagement;
          radius = dotRadius * (1 + proximity * 0.3 * engagement);
        }

        const nearCursor = proximity > 0.35;
        ctx.beginPath();
        ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
        ctx.fillStyle = nearCursor
          ? accentColor.replace(/,\s*[\d.]+\)$/, `, ${alpha})`)
          : dotColor.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [dotRadius, dotSpacing, cursorRadius, bulgeStrength, dotColor, accentColor, showGlow]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
      aria-hidden
    />
  );
});

DotField.displayName = "DotField";

export default DotField;
