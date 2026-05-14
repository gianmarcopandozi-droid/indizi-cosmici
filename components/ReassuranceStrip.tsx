type Pillar = {
  symbol: string;
  label: string;
  description: string;
};

const PILLARS: Pillar[] = [
  {
    symbol: '✦',
    label: 'GRATIS',
    description: 'Nessun pagamento, nessun trucco.'
  },
  {
    symbol: '◐',
    label: 'PERSONALE',
    description: 'Costruito sul tuo nome e sulla tua data.'
  },
  {
    symbol: '⚡',
    label: 'IMMEDIATO',
    description: 'Arriva nella tua email in pochi secondi.'
  },
  {
    symbol: '📱',
    label: 'DA PORTARE',
    description: 'Uno sfondo per il tuo telefono.'
  },
  {
    symbol: '♡',
    label: 'DA DEDICARE',
    description: 'Un piccolo gesto per chi ami.'
  },
  {
    symbol: '↗',
    label: 'DA CONDIVIDERE',
    description: 'Un segno che si manda con un tap.'
  }
];

export default function ReassuranceStrip() {
  return (
    <section className="bg-notte-profonda px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.label} className="flex flex-col items-start gap-2">
              <span
                className="text-oro-caldo"
                style={{ fontSize: 22, lineHeight: 1 }}
                aria-hidden
              >
                {p.symbol}
              </span>
              <span
                className="text-panna-stellare"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                {p.label}
              </span>
              <span
                className="text-rosa-polvere/80"
                style={{ fontSize: 14, lineHeight: 1.4 }}
              >
                {p.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
