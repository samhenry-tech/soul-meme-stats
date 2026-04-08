import { getMemes } from "@api/memes";
import type { Meme } from "@models/Meme";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

export const MemesPage = () => {
  const memes = getMemes();
  return (
    <section
      id="memes-page"
      className="flex w-full flex-col items-center overflow-hidden p-4"
    >
      <article
        className="flex flex-col justify-center"
        style={{ height: "100%", aspectRatio: 1 / Math.SQRT2 }}
      >
        <RowsPhotoAlbum
          photos={memes.map((m) => m.meme)}
          defaultContainerWidth={1280}
          targetRowHeight={79.3}
          spacing={4}
          render={{
            image: (_, context) => (
              <Item key={context.index} meme={context.photo} />
            ),
          }}
        />
      </article>
    </section>
  );
};

const Item = ({ meme }: { meme: Meme }) => {
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
