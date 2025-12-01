import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb, #06b6d4)",
          color: "white",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 1,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        FX
      </div>
    ),
    size
  );
}
