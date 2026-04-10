import { fitCollageRowsLayout } from "~/helpers/collage-rows-layout";
import type { Meme } from "~/models/Meme";
import clsx from "clsx";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

export const CollageDisplay = ({
  className,
  style,
  spacing = 4,
  memes,
  render,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  /**
   * Matches `aspectRatio: 1 / Math.SQRT2` on MemesPage (width/height), so
   * `width = height / √2`, not `height * √2`.
   */
  const allowedWidth = size.height > 0 ? size.height / Math.SQRT2 : 0;

  const layoutWidth =
    allowedWidth > 0 ? Math.min(allowedWidth, size.width) : size.width;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  const { tracks, scale } = useMemo(
    () =>
      fitCollageRowsLayout(
        memes,
        layoutWidth > 0 ? layoutWidth : size.width,
        size.height,
        spacing,
        0
      ),
    [memes, layoutWidth, size.height, size.width, spacing]
  );

  const gap = spacing * scale;
  const contentWidth = (layoutWidth > 0 ? layoutWidth : size.width) * scale;

  const containerStyle: CSSProperties = {
    boxSizing: "border-box",
    ...style,
    ...(allowedWidth > 0 && {
      width: allowedWidth,
      maxWidth: "100%",
    }),
  };

  const canRenderCollage =
    memes.length > 0 &&
    tracks.length > 0 &&
    /**
     * Need non-zero layout box; `items-center` + no stretch used to leave this
     * at 0×0
     */
    size.width > 0 &&
    size.height > 0;

  return (
    <div
      ref={ref}
      style={containerStyle}
      className={clsx(
        className,
        "flex min-h-0 w-full flex-col overflow-hidden"
      )}
    >
      {canRenderCollage && (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto">
          <div
            className="flex flex-col"
            style={{
              width: contentWidth,
              maxWidth: "100%",
              gap,
            }}
          >
            {tracks.map((track, rowIndex) => {
              const rowH = (track.photos[0]?.height ?? 0) * scale;
              return (
                <div
                  key={rowIndex}
                  className="flex flex-row flex-nowrap"
                  style={{
                    gap,
                    height: rowH,
                    minHeight: rowH,
                  }}
                >
                  {track.photos.map((cell) => (
                    <div
                      key={cell.index}
                      className="min-w-0 shrink-0 overflow-hidden rounded-sm"
                      style={{
                        width: cell.width * scale,
                        height: cell.height * scale,
                      }}
                    >
                      {render(cell.photo)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface Props {
  className?: string;
  style?: CSSProperties;
  spacing?: number;
  memes: Meme[];
  render: (meme: Meme) => React.ReactNode;
}
