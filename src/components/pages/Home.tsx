import { getMemes } from "@api/memes";
import { Header } from "@components/organisms/Header";

export const Home = () => {
  const memes = getMemes();
  return (
    <>
      <Header />
      <article className="flex w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <img src={memes[0]?.meme?.url} alt="Meme" />
        </div>
        <div>
          {memes.map((meme, i) => (
            <div
              key={i}
              className="border-white-300 flex gap-2 rounded-md border-2 p-4 whitespace-pre-wrap"
            >
              <div className="rounded-md border-2 border-red-300 p-4">
                {meme?.postedAt.toISOString()}
              </div>
              <div className="rounded-md border-2 border-blue-300 p-4">
                {meme?.postedBy}
              </div>
              <div className="rounded-md border-2 border-yellow-300 p-4">
                {meme?.meme?.url} | {meme?.meme?.type}
              </div>
              <div className="rounded-md border-2 border-green-300 p-4">
                {meme?.data}
              </div>
            </div>
          ))}
        </div>
      </article>
    </>
  );
};
