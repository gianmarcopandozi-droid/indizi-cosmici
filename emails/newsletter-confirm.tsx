import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text
} from '@react-email/components';

export interface NewsletterConfirmEmailProps {
  nome: string;
  confirm_url: string;
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

export default function NewsletterConfirmEmail(props: NewsletterConfirmEmailProps) {
  const { nome, confirm_url, unsubscribe_url } = props;

  return (
    <Html lang="it">
      <Head />
      <Preview>Conferma il tuo posto tra gli Indizi.</Preview>
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
                fontSize: 30,
                color: '#2A1E4A',
                margin: '0 0 12px',
                lineHeight: 1.2
              }}
            >
              {nome}, conferma il tuo posto
            </Heading>

            <Text
              style={{
                fontSize: 16,
                color: '#2A1E4A',
                opacity: 0.85,
                margin: '0 0 28px',
                lineHeight: 1.5
              }}
            >
              Hai chiesto di ricevere gli <em>Indizi della settimana</em>. Confermi che e&apos; tu
              questa email? Bastera&apos; un click.
            </Text>

            <Button
              href={confirm_url}
              style={{
                backgroundColor: COLORS.oro,
                color: COLORS.notte,
                padding: '14px 32px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                letterSpacing: '0.03em'
              }}
            >
              Confermo
            </Button>

            <Text
              style={{
                fontSize: 12,
                color: '#2A1E4A',
                opacity: 0.6,
                margin: '24px 0 0',
                lineHeight: 1.5
              }}
            >
              Se il bottone non funziona, copia questo link nel browser:
              <br />
              <Link href={confirm_url} style={{ color: COLORS.viola, wordBreak: 'break-all' }}>
                {confirm_url}
              </Link>
            </Text>
          </Section>

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
              Se non sei stato tu, ignora questa email — non verrai iscritto.
            </Text>
            <Text style={{ margin: '0 0 8px', opacity: 0.7 }}>
              Contenuto a scopo simbolico ed emotivo. Non sostituisce consulenza professionale di
              alcun tipo.
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
