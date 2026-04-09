import { getFirstMeme, getMemes } from "~/api/memes";
import { MemeBarChart } from "~/components/organisms/MemeBarChart";
import { isHidden } from "~/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { StatCard } from "../atoms/StatCard";
import { StatsSection } from "../atoms/StatsSection";

export const StatsPage = () => {
  const memes = getMemes();

  const firstMeme = getFirstMeme();

  return (
    <>
      <section className="flex w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <StatsSection>
          <StatCard className="border-red-300">
            <h2 className="text-2xl font-bold">Current Meme Count</h2>
            <p>{!isHidden ? memes.length : <Skeleton />}</p>
          </StatCard>
          <StatCard className="border-green-300">
            <h2 className="text-2xl font-bold">
              Who posted the first meme this year?
            </h2>
            <p>{!isHidden ? firstMeme?.postedBy : <Skeleton />}</p>
          </StatCard>
          <StatCard className="border-blue-300">
            <h2 className="text-2xl font-bold">Day with the most memes</h2>
            <p>{!isHidden ? firstMeme?.postedBy : <Skeleton />}</p>
          </StatCard>
        </StatsSection>
        <MemeBarChart />

        <h3 className="mb-8 text-2xl font-bold">Stats coming next year</h3>
        <StatsSection>
          <StatCard className="border-yellow-300">
            <h2 className="text-2xl font-bold">Funniest meme</h2>
          </StatCard>
          <StatCard className="border-purple-300">
            <h2 className="text-2xl font-bold">
              Who posted the most messages without a meme?
            </h2>
          </StatCard>
          <StatCard className="border-orange-300">
            <h2 className="text-2xl font-bold">Latest meme of the night</h2>
          </StatCard>
        </StatsSection>
      </section>
    </>
  );
};
