import { SEGNO_GLIFI, COSTELLAZIONI, type Segno } from '@/lib/zodiac';

type Props = {
  segno: Segno;
  size?: number;
  withConstellation?: boolean;
};

export default function Glifo({
  segno,
  size = 96,
  withConstellation = false
}: Props) {
  const glifo = SEGNO_GLIFI[segno];
  const stelle = withConstellation ? COSTELLAZIONI[segno] : [];
  const innerFont = Math.round(size * 0.5);
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        border: '1px solid #D7A86E',
        background: 'rgba(255, 246, 232, 0.04)'
      }}
    >
      <span
        className="text-oro-caldo leading-none"
        style={{ fontSize: innerFont }}
      >
        {glifo}
      </span>
      {withConstellation && stelle.length > 0 ? (
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {stelle.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r / Math.max(size, 1)}
              fill="#D7A86E"
              opacity={0.85}
            />
          ))}
        </svg>
      ) : null}
    </div>
  );
}
