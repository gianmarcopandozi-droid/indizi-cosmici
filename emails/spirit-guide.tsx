import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button
} from '@react-email/components';

export interface SpiritGuideEmailProps {
  nome: string;
  segno: string;
  segno_label: string;
  glifo: string;
  mantra: string;
  shareId: string;
  opt_in_newsletter: boolean;
  confirm_url?: string;
  dedicato_a?: string;
  site_url: string;
  unsubscribe_url: string;
}

const COLORS = {
  notte: '#18122B',
  viola: '#2A1E4A',
  oro: '#D7A86E',
  rosa: '#F1D8C9',
  panna: '#FFF6E8'
};

export default function SpiritGuideEmail(props: SpiritGuideEmailProps) {
  const {
    nome,
    segno_label,
    glifo,
    mantra,
    shareId,
    opt_in_newsletter,
    confirm_url,
    dedicato_a,
    site_url,
    unsubscribe_url
  } = props;

  const wallpaperUrl = `${site_url}/wallpaper/${shareId}`;
  const sharePageUrl = `${site_url}/sg/${shareId}`;
  const dedicaUrl = `${site_url}/dedica?ref=${shareId}`;

  const previewText = `${nome}, custodisci questo piccolo segno. O dedicalo a chi ami.`;

  return (
    <Html lang="it">
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: COLORS.notte,
          color: COLORS.panna,
          fontFamily: 'Manrope, system-ui, -apple-system, Helvetica, Arial, sans-serif',
          margin: 0,
          padding: 0
        }}
      >
        <Container
          style={{
            maxWidth: 600,
            margin: '0 auto',
            backgroundColor: COLORS.notte
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: COLORS.notte,
              padding: '32px 24px 16px',
              textAlign: 'center'
            }}
          >
            <Text
              style={{
                color: COLORS.oro,
                letterSpacing: '0.35em',
                fontSize: 12,
                margin: 0,
                fontWeight: 600
              }}
            >
              ✦ INDIZI COSMICI ✦
            </Text>
          </Section>

          {/* Body panna */}
          <Section
            style={{
              backgroundColor: COLORS.panna,
              color: COLORS.notte,
              padding: '40px 32px',
              textAlign: 'center'
            }}
          >
            <Heading
              as="h1"
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontWeight: 400,
                fontSize: 32,
                color: '#2A1E4A',
                margin: '0 0 8px',
                lineHeight: 1.2
              }}
            >
              Ecco il tuo Spirito Guida
            </Heading>
            <Text
              style={{
                fontSize: 15,
                color: '#2A1E4A',
                opacity: 0.85,
                margin: '0 0 24px',
                lineHeight: 1.5
              }}
            >
              {nome}, custodisci questo piccolo segno. O dedicalo a chi ami.
            </Text>

            {/* Preview wallpaper */}
            <div style={{ margin: '0 auto 24px', textAlign: 'center' }}>
              <Img
                src={wallpaperUrl}
                width="200"
                alt={`Spirito Guida ${segno_label}`}
                style={{
                  display: 'inline-block',
                  border: `2px solid ${COLORS.oro}`,
                  borderRadius: 16,
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </div>

            <Text
              style={{
                fontSize: 22,
                color: COLORS.oro,
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                margin: '0 0 6px',
                fontStyle: 'italic'
              }}
            >
              {glifo} {segno_label}
            </Text>
            <Text
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 20,
                color: '#2A1E4A',
                margin: '0 0 24px',
                lineHeight: 1.5
              }}
            >
              &laquo; {mantra} &raquo;
            </Text>

            {dedicato_a ? (
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.oro,
                  letterSpacing: '0.2em',
                  margin: '0 0 24px'
                }}
              >
                DEDICATO A {dedicato_a.toUpperCase()}
              </Text>
            ) : null}

            <Text
              style={{
                fontSize: 14,
                color: '#2A1E4A',
                opacity: 0.75,
                margin: '0 0 32px',
                lineHeight: 1.55
              }}
            >
              Il tuo Spirito Guida e&apos; allegato a questa email come immagine 1080×1920 — la
              dimensione perfetta per impostarlo come sfondo del telefono.
            </Text>

            {/* CTA primary */}
            <Button
              href={dedicaUrl}
              style={{
                backgroundColor: COLORS.oro,
                color: COLORS.notte,
                padding: '14px 28px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                letterSpacing: '0.03em'
              }}
            >
              🎁 Dedicalo a una persona cara
            </Button>

            <div style={{ marginTop: 16 }}>
              <Link
                href={sharePageUrl}
                style={{
                  color: COLORS.viola,
                  fontSize: 14,
                  textDecoration: 'underline'
                }}
              >
                Salva e condividi su WhatsApp →
              </Link>
            </div>

            {opt_in_newsletter && confirm_url ? (
              <>
                <Hr
                  style={{
                    borderTop: `1px solid ${COLORS.oro}`,
                    opacity: 0.3,
                    margin: '32px 0 16px'
                  }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: '#2A1E4A',
                    opacity: 0.85,
                    margin: 0,
                    lineHeight: 1.5
                  }}
                >
                  <strong>P.S.</strong> Per ricevere gli Indizi della settimana,{' '}
                  <Link
                    href={confirm_url}
                    style={{ color: COLORS.viola, fontWeight: 600 }}
                  >
                    conferma qui
                  </Link>
                  .
                </Text>
              </>
            ) : null}
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: COLORS.viola,
              color: COLORS.rosa,
              padding: '24px',
              textAlign: 'center',
              fontSize: 12,
              lineHeight: 1.55
            }}
          >
            <Text style={{ margin: '0 0 8px', opacity: 0.85 }}>
              Contenuto a scopo simbolico ed emotivo. Non sostituisce consulenza professionale di
              alcun tipo.
            </Text>
            <Text style={{ margin: '0 0 8px', opacity: 0.7 }}>
              Hai ricevuto questa email perche&apos; hai creato il tuo Spirito Guida su
              indizicosmici.it
            </Text>
            <Link
              href={unsubscribe_url}
              style={{ color: COLORS.rosa, opacity: 0.7, fontSize: 11 }}
            >
              Disiscriviti
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
