import type { Meme } from "~/models/Meme";

export const MemeItem = ({ meme }: { meme: Meme }) => {
  if (meme.type === "image") {
    return (
      <img
        src={meme.src}
        alt={meme.type ?? ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  if (meme.type === "video") {
    return (
      <video
        src={meme.src}
        autoPlay
        muted
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        playsInline
      />
    );
  }
  return null;
};
