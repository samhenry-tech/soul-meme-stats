import { getMemes } from "~/api/memes";
import { isHidden } from "~/constants";
import type { Meme } from "~/models/Meme";
import { MemeItem } from "../atoms/MemeItem";
import { CollageDisplay } from "../organisms/CollageDisplay";

export const MemesPage = () => {
  const memes = getMemes();
  return (
    <section
      id="memes-page"
      className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden p-4"
    >
      <CollageDisplay
        memes={memes.map((m) => m.meme)}
        spacing={4}
        className="min-h-0 w-full flex-1"
        style={{ height: "100%", aspectRatio: 1 / Math.SQRT2 }}
        render={(meme) => <HideableMemeItem meme={meme} />}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[radial-gradient(closest-side,rgba(255,255,255,0.14),rgba(255,255,255,0.06),transparent)] p-4 shadow-xl backdrop-blur-md">
        <img src="/memeWhite.png" alt="Soul Meme Stats" className="mb-1 w-20" />
      </div>
    </section>
  );
};

const HideableMemeItem = ({ meme }: { meme: Meme }) => {
  if (isHidden) {
    return (
      <div className="pointer-events-none h-full w-full bg-linear-to-b from-gray-700 to-gray-900" />
    );
  }
  return <MemeItem meme={meme} />;
};
