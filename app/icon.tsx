import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 55%, #a78bfa 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="16" r="2.3" fill="white" />
          <path
            d="M4 11 A5 5 0 0 1 9 16"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M4 6.5 A9.5 9.5 0 0 1 13.5 16"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M4 2 A14 14 0 0 1 18 16"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
