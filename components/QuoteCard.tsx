import type { CSSProperties } from 'react';
import { getQuoteBackground } from '@/lib/assets';

type Props = {
  quote: string;
  bgIndex?: 1 | 2 | 3 | 4;
};

const GRADIENTS: Record<1 | 2 | 3 | 4, string> = {
  1: 'linear-gradient(180deg, #18122B 0%, #2A1E4A 100%)',
  2: 'linear-gradient(180deg, #2A1E4A 0%, #5D2C5A 100%)',
  3: 'linear-gradient(160deg, #18122B 0%, #5D2C5A 100%)',
  4: 'linear-gradient(200deg, #2A1E4A 0%, #18122B 60%, #5D2C5A 100%)'
};

export default function QuoteCard({ quote, bgIndex = 1 }: Props) {
  const asset = getQuoteBackground(bgIndex);
  const style: CSSProperties = asset
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(24,18,43,0.55), rgba(24,18,43,0.65)), url(${asset})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { background: GRADIENTS[bgIndex] };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-2xl px-8 py-10 text-center"
      style={{
        aspectRatio: '1 / 1',
        border: '1px solid rgba(215, 168, 110, 0.35)',
        ...style
      }}
    >
      <p
        className="text-panna-stellare font-display italic"
        style={{ fontSize: 22, lineHeight: 1.35 }}
      >
        {quote}
      </p>
    </div>
  );
}
