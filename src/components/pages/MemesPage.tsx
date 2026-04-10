import { getMemes } from "~/api/memes";
import { MemeItem } from "~/components/atoms/MemeItem";
import { RowsPhotoAlbum, type RenderPhotoContext } from "react-photo-album";
import "react-photo-album/rows.css";
import { isHidden } from "~/constants";
import type { Meme } from "~/models/Meme";
import type { CSSProperties } from "react";

export const MemesPage = () => {
  const memes = getMemes();
  return (
    <section
      id="memes-page"
      className="flex w-full flex-col items-center overflow-hidden p-4"
    >
      <article
        className="relative flex flex-col justify-center"
        style={{ height: "100%", aspectRatio: 1 / Math.SQRT2 }}
      >
        <RowsPhotoAlbum
          photos={memes.map((m) => m.meme)}
          defaultContainerWidth={1280}
          targetRowHeight={60}
          spacing={4}
          padding={0}
          render={{
            photo: (_, context) => (
              <div
                key={context.index}
                className="react-photo-album--photo relative overflow-hidden"
                style={
                  {
                    "--react-photo-album--photo-width": context.width,
                    "--react-photo-album--photo-height": context.height,
                  } as CSSProperties
                }
              >
                <HideableMemeItem key={context.index} context={context} />
              </div>
            ),
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[radial-gradient(closest-side,rgba(255,255,255,0.14),rgba(255,255,255,0.06),transparent)] p-4 shadow-xl backdrop-blur-md">
          <img
            src="/memeWhite.png"
            alt="Soul Meme Stats"
            className="mb-1 w-20"
          />
        </div>
      </article>
    </section>
  );
};

const HideableMemeItem = ({
  context,
}: {
  context: RenderPhotoContext<Meme>;
}) => {
  return (
    <>
      <MemeItem meme={context.photo} />
      {isHidden && (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-gray-700 to-gray-900" />
      )}
    </>
  );
};
