import { ResponsiveBar, type BarDatum } from "@nivo/bar";
import { getMemesByAuthor } from "~/api/memes";
import { GradientWaveBar } from "~/components/atoms/GradientWaveBar";
import { isHidden } from "~/constants";
import { useEffect, useMemo, useState } from "react";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

const BAR_COLORS = [
  "#ff005d", // hot pink
  "#00d4ff", // cyan
  "#7c3aed", // violet
  "#22c55e", // green
  "#f97316", // orange
  "#facc15", // yellow
  "#06b6d4", // teal
  "#e11d48", // rose
] as const;

const chartTheme = {
  background: "transparent",
  axis: {
    domain: {
      line: { stroke: "#6f8287" },
    },
    legend: {
      text: { fill: "#a9b8bc", fontSize: 12 },
    },
    ticks: {
      line: { stroke: "#6f8287", strokeWidth: 1 },
      text: { fill: "#a9b8bc", fontSize: 11 },
    },
  },
  grid: {
    line: {
      stroke: "#2e383d",
      strokeOpacity: 0.6,
    },
  },
  legends: {
    text: {
      fill: "#a9b8bc",
    },
  },
};

export const MemeBarChart = () => {
  const topMemeAuthors = useMemo(() => getMemesByAuthor().slice(0, 4), []);
  const [data, setData] = useState<BarDatum[]>([]);

  const maxCount = Math.max(...topMemeAuthors.map((d) => d.messages.length));

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const next: BarDatum[] = await Promise.all(
        topMemeAuthors.map(async ({ author, messages }) => ({
          author: isHidden ? await getPsudoname(author) : author,
          count: messages.length,
        }))
      );
      if (!cancelled) {
        setData(next);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [topMemeAuthors]);

  const chartData = useMemo(() => [...data].reverse(), [data]);

  return (
    <>
      <h2 className="mt-10 text-2xl font-bold">The Most Memes</h2>
      <div className="h-[min(28rem,70vh)] w-full min-w-0">
        <ResponsiveBar
          layout="horizontal"
          data={chartData}
          theme={chartTheme}
          keys={["count"]}
          indexBy="author"
          colors={(bar: { index: number }) =>
            BAR_COLORS[bar.index % BAR_COLORS.length] ?? BAR_COLORS[0]
          }
          barComponent={isHidden ? (GradientWaveBar as never) : undefined}
          isInteractive={false}
          margin={{ top: 24, right: 32, bottom: 56, left: 110 }}
          padding={0.35}
          innerPadding={2}
          borderRadius={2}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.2]],
          }}
          valueScale={{ type: isHidden ? "symlog" : "linear", max: maxCount }}
          axisBottom={
            isHidden
              ? null
              : {
                  tickSize: 5,
                  tickPadding: 8,
                  tickRotation: 0,
                }
          }
          axisLeft={{
            tickSize: 5,
            tickPadding: 8,
            tickRotation: 0,
          }}
        />
      </div>
    </>
  );
};

const seedAdjustment = 5;

const getPsudoname = async (value: string) => {
  const seed = (await digestStringToSeed(value)) + seedAdjustment;

  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    seed,
    style: "capital",
  });
};

const digestStringToSeed = async (value: string): Promise<number> => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return new DataView(digest).getUint32(0, false);
};
