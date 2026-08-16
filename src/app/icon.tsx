import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        background: "#080a09",
      }}
    >
      <div
        style={{
          width: 29,
          height: 29,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(45deg)",
          border: "2px solid #b8ff65",
          background: "#1b2613",
          boxShadow: "7px 7px 0 #11180d",
        }}
      >
        <div style={{ width: 10, height: 10, background: "#b8ff65" }} />
      </div>
    </div>,
    size,
  );
}
