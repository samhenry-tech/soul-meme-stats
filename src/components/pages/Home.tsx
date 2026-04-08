import { getMemes } from "@api/memes";
import { Header } from "@components/organisms/Header";

export const Home = () => {
  const memes = getMemes();
  return (
    <>
      <Header />
      <article className="flex w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <div>
          {memes.map((meme, i) => (
            <div
              key={i}
              className="border-white-300 flex gap-2 rounded-md border-2 p-4 whitespace-pre-wrap"
            >
              <div className="rounded-md border-2 border-red-300 p-4">
                {meme?.postedAt}
              </div>
              <div className="rounded-md border-2 border-blue-300 p-4">
                {meme?.author}
              </div>
              <div className="rounded-md border-2 border-yellow-300 p-4">
                {meme?.attachment}
              </div>
              <div className="rounded-md border-2 border-green-300 p-4">
                {meme?.rest}
              </div>
            </div>
          ))}
        </div>
      </article>
    </>
  );
};
