import { getMemes } from "@api/memes";
import { Header } from "@components/organisms/Header";
import type { Meme } from "@models/Meme";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

export const Home = () => {
  const memes = getMemes();
  return (
    <>
      <Header />
      <section className="flex w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <article className="flex flex-col items-center rounded-lg border-2 border-red-300 p-4">
            <h2 className="text-2xl font-bold">Total Memes</h2>
            <p>{memes.length}</p>
          </article>
        </section>
        <RowsPhotoAlbum
          photos={memes.map((m) => m.meme)}
          defaultContainerWidth={1280}
          spacing={8}
          render={{
            image: (_, context) => (
              <RenderItem key={context.index} meme={context.photo} />
            ),
          }}
        />
      </section>
    </>
  );
};

const RenderItem = ({ meme }: { meme: Meme }) => {
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
