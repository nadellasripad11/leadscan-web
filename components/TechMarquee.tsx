"use client";

const TECH_LIST = [
  "Stripe", "React", "Next.js", "TypeScript", "Vercel",
  "Shopify", "AWS", "PostgreSQL", "Tailwind", "Node.js",
  "Vue.js", "Angular", "Python", "GraphQL", "Docker",
  "Kubernetes", "Firebase", "Supabase", "MongoDB", "Redis",
  "Git", "GitHub", "GitLab", "Figma", "Notion",
];

export default function TechMarquee() {
  return (
    <div style={{
      width: "100%",
      overflow: "hidden",
      background: "rgba(255,255,255,0.02)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "20px 0",
    }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        margin: "0 0 16px 40px",
      }}>
        Detects 40+ technologies
      </p>

      <div style={{
        display: "flex",
        gap: 12,
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .tech-scroll {
            animation: scroll 20s linear infinite;
            display: flex;
            gap: 12px;
            min-width: fit-content;
          }
          .tech-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="tech-scroll" style={{ paddingRight: 12 }}>
          {[...TECH_LIST, ...TECH_LIST].map((tech, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 99,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#93c5fd",
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              • {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
