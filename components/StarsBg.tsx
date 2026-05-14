import type { CSSProperties } from 'react';

type Star = {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity: number;
};

const COLORS = ['#D7A86E', '#FFF6E8', '#F1D8C9'];

function seededRng(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(seed: string, count = 40): Star[] {
  const rng = seededRng(seed);
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      cx: rng() * 100,
      cy: rng() * 100,
      r: 1 + rng() * 3,
      fill: COLORS[Math.floor(rng() * COLORS.length)],
      opacity: 0.45 + rng() * 0.55
    });
  }
  return out;
}

export default function StarsBg({ seed = 'lp' }: { seed?: string }) {
  const stars = buildStars(seed, 40);
  const containerStyle: CSSProperties = {
    background:
      'linear-gradient(180deg, #18122B 0%, #2A1E4A 55%, #5D2C5A 100%)'
  };
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      style={containerStyle}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r / 10}
            fill={s.fill}
            opacity={s.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
