import Glifo from './Glifo';
import { MESI_LABEL, SEGNO_LABEL, type Segno } from '@/lib/zodiac';

type Props = {
  nome: string;
  segno: Segno;
  giorno: number;
  mese: number;
  mantra: string;
  dedicato_a?: string;
};

export default function SpiritGuideCard({
  nome,
  segno,
  giorno,
  mese,
  mantra,
  dedicato_a
}: Props) {
  const meseLabel = MESI_LABEL[mese] ?? '';
  const segnoLabel = SEGNO_LABEL[segno].toUpperCase();
  return (
    <div
      className="relative mx-auto flex w-full flex-col items-center overflow-hidden rounded-2xl px-6 py-8 text-center"
      style={{
        maxWidth: 280,
        aspectRatio: '9 / 16',
        background:
          'linear-gradient(180deg, #18122B 0%, #2A1E4A 70%, #5D2C5A 100%)',
        border: '1px solid #D7A86E'
      }}
    >
      <div
        className="text-oro-caldo"
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase'
        }}
      >
        ★ Il tuo Spirito Guida ★
      </div>

      <div className="mt-6">
        <Glifo segno={segno} size={88} withConstellation />
      </div>

      {dedicato_a ? (
        <div
          className="mt-5 text-rosa-polvere"
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          Dedicato a
        </div>
      ) : null}

      <div
        className="mt-2 text-panna-stellare font-display"
        style={{ fontSize: 32, lineHeight: 1.05 }}
      >
        {dedicato_a ? dedicato_a : nome}
      </div>

      <div
        className="mt-2 text-oro-caldo"
        style={{
          fontSize: 11,
          letterSpacing: '0.24em',
          textTransform: 'uppercase'
        }}
      >
        {segnoLabel} · {giorno} {meseLabel}
      </div>

      <div
        className="my-5 h-px w-12"
        style={{ background: '#D7A86E', opacity: 0.6 }}
      />

      <p
        className="text-panna-stellare font-display italic"
        style={{ fontSize: 16, lineHeight: 1.35 }}
      >
        {mantra}
      </p>

      <div className="mt-auto pt-4">
        <div
          className="text-oro-caldo"
          style={{
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase'
          }}
        >
          ★ Indizi Cosmici ★
        </div>
      </div>
    </div>
  );
}
