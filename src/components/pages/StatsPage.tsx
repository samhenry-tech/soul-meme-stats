import {
  getAuthorWithMostMessagesWithoutMemes,
  getFirstMeme,
  getMemes,
} from "@api/memes";
import { MemeBarChart } from "@components/organisms/MemeBarChart";

export const StatsPage = () => {
  const memes = getMemes();

  const firstMeme = getFirstMeme();

  const authorWithMostMessagesWithoutMemes =
    getAuthorWithMostMessagesWithoutMemes();

  return (
    <>
      <section className="flex w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex gap-4 text-center">
          <article className="flex flex-col items-center rounded-lg border-2 border-red-300 p-4">
            <h2 className="text-2xl font-bold">Current Meme Count</h2>
            <p>{memes.length}</p>
          </article>
          <article className="flex flex-col items-center rounded-lg border-2 border-green-300 p-4">
            <h2 className="text-2xl font-bold">Who posted the first meme?</h2>
            <p>{firstMeme?.postedBy}</p>
          </article>
          <article className="flex flex-col items-center rounded-lg border-2 border-blue-300 p-4">
            <h2 className="text-2xl font-bold">
              Who posted the most messages without a meme?
            </h2>
            <p>
              {authorWithMostMessagesWithoutMemes.author}:{" "}
              {authorWithMostMessagesWithoutMemes.count}
            </p>
          </article>
        </section>
        <MemeBarChart />
      </section>
    </>
  );
};
