import { getMemes } from "~/api/memes";
import { MemeItem } from "~/components/atoms/MemeItem";
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
          targetRowHeight={65}
          spacing={4}
          render={{
            image: (_, context) => (
              <MemeItem key={context.index} meme={context.photo} />
            ),
          }}
        />
      </article>
    </section>
  );
};
