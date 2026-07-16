import { MESI_LABEL, SEGNO_LABEL, type Segno } from '@/lib/zodiac';
import { ANIMALE_LABEL } from '@/lib/animali';

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
  const animaleLabel = ANIMALE_LABEL[segno];

  return (
    <div
      className="relative mx-auto flex w-full flex-col items-center overflow-hidden rounded-2xl text-center"
      style={{
        maxWidth: 280,
        aspectRatio: '9 / 16',
        background: '#18122B',
        border: '1px solid #D7A86E'
      }}
    >
      {/* Illustrazione animale guida a tutta card (stesso asset del wallpaper) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/animali/${segno}.jpg`}
        alt={`Spirito Guida ${SEGNO_LABEL[segno]} — ${animaleLabel}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ objectFit: 'cover' }}
      />

      {/* Gradiente alto: leggibilità del tag */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: '32%',
          background:
            'linear-gradient(180deg, rgba(24,18,43,0.92) 0%, rgba(24,18,43,0.55) 45%, rgba(24,18,43,0) 100%)'
        }}
      />

      {/* Gradiente basso: leggibilità di nome/segno/mantra */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '62%',
          background:
            'linear-gradient(0deg, rgba(24,18,43,0.97) 0%, rgba(24,18,43,0.9) 30%, rgba(24,18,43,0) 100%)'
        }}
      />

      {/* Contenuto sopra l'immagine */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-6 py-8">
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

        <div className="mt-auto flex w-full flex-col items-center">
          {dedicato_a ? (
            <div
              className="text-rosa-polvere"
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
            className="mt-1 text-panna-stellare font-display"
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
            className="mt-1 text-rosa-polvere font-display italic"
            style={{ fontSize: 15 }}
          >
            {animaleLabel}
          </div>

          <div
            className="my-4 h-px w-12"
            style={{ background: '#D7A86E', opacity: 0.6 }}
          />

          <p
            className="text-panna-stellare font-display italic"
            style={{ fontSize: 16, lineHeight: 1.35 }}
          >
            {mantra}
          </p>

          <div
            className="mt-5 text-oro-caldo"
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
    </div>
  );
}
