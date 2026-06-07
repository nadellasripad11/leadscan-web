import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px" }}>
        {/* Hero skeleton */}
        <div style={{ background: "#080f1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 30px", marginBottom: 16, display: "flex", gap: 24 }}>
          <div className="shimmer" style={{ width: 120, height: 120, borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ flex: 1, paddingTop: 6, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="shimmer" style={{ width: 22, height: 22, borderRadius: 5 }} />
              <div className="shimmer" style={{ width: 180, height: 22, borderRadius: 8 }} />
            </div>
            <div className="shimmer" style={{ width: "88%", height: 12, borderRadius: 6 }} />
            <div className="shimmer" style={{ width: "72%", height: 12, borderRadius: 6 }} />
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="shimmer" style={{ width: 110, height: 10, borderRadius: 6 }} />
                  <div className="shimmer" style={{ flex: 1, height: 5, borderRadius: 99 }} />
                  <div className="shimmer" style={{ width: 24, height: 10, borderRadius: 6 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: "#080f1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, marginBottom: 12 }}>
            <div className="shimmer" style={{ height: 10, width: 80, borderRadius: 6, marginBottom: 16 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="shimmer" style={{ height: 12 }} />
              <div className="shimmer" style={{ height: 12, width: "80%" }} />
              <div className="shimmer" style={{ height: 12, width: "65%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
