"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Page = "scan" | "how-it-works" | "examples" | "docs";

export default function Navbar({ active }: { active?: Page }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change or resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "How it works", href: "/how-it-works", page: "how-it-works" },
    { label: "Examples",     href: "/examples",     page: "examples"     },
    { label: "Docs",         href: "/docs",         page: "docs"         },
    { label: "GitHub",       href: "https://github.com/nadellasripad11/leadscan", external: true },
  ];

  return (
    <>
      <nav className={`glass-nav${scrolled ? " scrolled" : ""}`} style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.025em", color: "#fafafa" }}>
              LeadScan
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links-group">
            {navLinks.map(({ label, href, page, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={`nav-link${active === page ? " active" : ""}`}
                style={external ? { display: "flex", alignItems: "center", gap: 6 } : undefined}
              >
                {external && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/scan"
            className="nav-cta-btn"
            style={{
              padding: "8px 18px",
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              background: active === "scan" ? "rgba(124,58,237,0.1)" : "#7c3aed",
              color: active === "scan" ? "#a78bfa" : "#fff",
              border: active === "scan" ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(124,58,237,0.6)",
              flexShrink: 0,
              boxShadow: active === "scan" ? "none" : "0 0 16px rgba(124,58,237,0.25)",
            }}
          >
            {active === "scan" ? "Scanner" : "Open Scanner →"}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>

        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map(({ label, href, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="nav-mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link href="/scan" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>
          Open Scanner →
        </Link>
      </div>
    </>
  );
}
