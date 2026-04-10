import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { getDayWithMostMemes, getFirstMeme, getMemes } from "~/api/memes";
import { MemeBarChart } from "~/components/organisms/MemeBarChart";
import { isHidden, revealDate } from "~/constants";
import { getWeekday } from "~/helpers/util";
import Skeleton from "react-loading-skeleton";
import { StatCard } from "../atoms/StatCard";
import { StatsSection } from "../atoms/StatsSection";
import "react-loading-skeleton/dist/skeleton.css";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

export const StatsPage = () => {
  const memes = getMemes();
  const firstMeme = getFirstMeme();
  const dayWithMostMemes = getDayWithMostMemes();

  const dayOfWeekWithMostMemes = dayWithMostMemes
    ? getWeekday(dayWithMostMemes.day)
    : null;

  return (
    <>
      <section className="flex w-full max-w-7xl flex-col items-center px-4 pb-8 sm:px-6 lg:px-8">
        {revealDate > new Date() && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            Results will be shown in:
            <FlipClockCountdown
              to={revealDate}
              daysInHours={true}
              className="text-sm"
              digitBlockStyle={{ width: 20, height: 30, fontSize: 15 }}
              separatorStyle={{ size: 2 }}
            />
          </div>
        )}
        <StatsSection>
          <StatCard className="border-red-300">
            <h2 className="text-2xl font-bold">Total Meme Count</h2>
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
            <p>
              {!isHidden ? (
                `${dayOfWeekWithMostMemes}: ${dayWithMostMemes?.count} memes`
              ) : (
                <Skeleton />
              )}
            </p>
          </StatCard>
        </StatsSection>
        <MemeBarChart />

        <h3 className="mb-8 text-2xl font-bold">Stats coming next year</h3>
        <StatsSection>
          <StatCard className="border-yellow-300">
            <h2 className="text-2xl font-bold">
              {!isHidden ? "Funniest meme" : <Skeleton />}
            </h2>
          </StatCard>
          <StatCard className="border-purple-300">
            <h2 className="text-2xl font-bold">
              {!isHidden ? (
                "Who posted the most messages without a meme?"
              ) : (
                <Skeleton count={3} />
              )}
            </h2>
          </StatCard>
          <StatCard className="border-orange-300">
            <h2 className="text-2xl font-bold">
              {!isHidden ? "Latest meme of the night" : <Skeleton count={2} />}
            </h2>
          </StatCard>
        </StatsSection>
      </section>
    </>
  );
};
