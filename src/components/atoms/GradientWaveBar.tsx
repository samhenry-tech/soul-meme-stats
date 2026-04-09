import { useEffect, useId, useMemo, useState } from "react";

const BLUR = 7;
const BORDER_RADIUS = 10;
const SPEED = 80;
const VARIATION = 0.5;

export const GradientWaveBar = ({ bar }: GradientWaveBarProps) => {
  const uid = useId();
  const maskId = `bar-wave-mask-${uid}`;
  const blurId = `bar-wave-blur-${uid}`;
  const clipId = `bar-wave-clip-${uid}`;
  const base = bar.color;
  const top = lightenHex(base, 0.22);
  const bottom = darkenHex(base, 0.28);

  return (
    <g transform={`translate(${bar.x}, ${bar.y})`}>
      <defs>
        {/* Blur softens the wave edge so it reads like a gradient transition. */}
        <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={BLUR} />
        </filter>
        {/* Clip both layers so rounded corners stay clean. */}
        <clipPath id={clipId}>
          <rect
            width={bar.width}
            height={bar.height}
            rx={BORDER_RADIUS}
            ry={BORDER_RADIUS}
          />
        </clipPath>
      </defs>

      {/* Base fill */}
      <rect
        width={bar.width}
        height={bar.height}
        fill={bottom}
        rx={BORDER_RADIUS}
        ry={BORDER_RADIUS}
      />

      {/* Wavy gradient transition (light layer clipped by a sine mask) */}
      <WaveGradientFill
        width={bar.width}
        height={bar.height}
        topColor={top}
        maskId={maskId}
        blurId={blurId}
        clipId={clipId}
      />
    </g>
  );
};

interface GradientWaveBarProps {
  bar: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    data: {
      index: number;
      indexValue: string | number;
    };
  };
}

const WaveGradientFill = ({
  width,
  height,
  topColor,
  maskId,
  blurId,
  clipId,
}: {
  width: number;
  height: number;
  topColor: string;
  maskId: string;
  blurId: string;
  clipId: string;
}) => {
  const [phase, setPhase] = useState(0);

  const speedPxPerSec = useMemo(() => {
    const variation = VARIATION;
    const randomFactor = 1 + (Math.random() * 2 - 1) * variation;
    return SPEED * randomFactor;
  }, []);

  useEffect(() => {
    if (width <= 0 || height <= 0) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setPhase((p) => p - speedPxPerSec * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [width, height, speedPxPerSec]);

  const yMid = height * 0.5;
  const amplitude = Math.min(10, height * 0.22);
  const wavelength = Math.max(24, width * 0.55);

  // const waveLineD = useMemo(() => {
  //   const step = 6;
  //   const points: [number, number][] = [];
  //   for (let x = 0; x <= width + step; x += step) {
  //     const y =
  //       yMid + amplitude * Math.sin(((x + phase) * 2 * Math.PI) / wavelength);
  //     points.push([x, y]);
  //   }
  //   const [x0, y0] = points[0]!;
  //   return `M ${x0} ${y0} ${points
  //     .slice(1)
  //     .map(([x, y]) => `L ${x} ${y}`)
  //     .join(" ")}`;
  // }, [width, yMid, amplitude, wavelength, phase]);

  // Closed shape: "everything above the sine line" (to reveal the lighter fill).
  const waveMaskD = useMemo(() => {
    // Start top-left, go to top-right, then follow the wave back to the left, then close.
    // This reveals the top color above the wave.
    const step = 6;
    const points: [number, number][] = [];
    for (let x = 0; x <= width + step; x += step) {
      const y =
        yMid + amplitude * Math.sin(((x + phase) * 2 * Math.PI) / wavelength);
      points.push([x, y]);
    }
    const firstX = points[0]![0];
    const firstY = points[0]![1];
    const lastX = points[points.length - 1]![0];
    return [
      `M 0 0`,
      `L ${width} 0`,
      `L ${lastX} ${points[points.length - 1]![1]}`,
      ...points
        .slice(0, -1)
        .reverse()
        .map(([x, y]) => `L ${x} ${y}`),
      `L ${firstX} ${firstY}`,
      `Z`,
    ].join(" ");
  }, [width, yMid, amplitude, wavelength, phase]);

  return (
    <>
      <defs>
        <mask id={maskId}>
          <rect width={width} height={height} fill="black" />
          <path d={waveMaskD} fill="white" filter={`url(#${blurId})`} />
        </mask>
      </defs>

      <rect
        width={width}
        height={height}
        fill={topColor}
        opacity={0.95}
        mask={`url(#${maskId})`}
        clipPath={`url(#${clipId})`}
        style={{ mixBlendMode: "screen" }}
      />
    </>
  );
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "").trim();
  const normalized =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  if (normalized.length !== 6) return null;
  const n = Number.parseInt(normalized, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function lightenHex(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const mix = (c: number) => c + (255 - c) * amount;
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}

function darkenHex(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const mix = (c: number) => c * (1 - amount);
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}
