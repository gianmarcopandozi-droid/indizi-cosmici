export default function Privacy() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#06060f",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      color: "#e8dcc8",
      padding: "48px 20px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        * { box-sizing: border-box; }
        h2 { color: #c9a96e; font-size: 16px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin: 32px 0 12px; }
        p { font-size: 15px; line-height: 1.8; color: #e8dcc8; opacity: 0.8; margin-bottom: 12px; }
        ul { padding-left: 20px; margin-bottom: 12px; }
        li { font-size: 15px; line-height: 1.8; color: #e8dcc8; opacity: 0.8; margin-bottom: 6px; }
        a { color: #c9a96e; text-decoration: none; }
        hr { border: none; border-top: 1px solid #c9a96e15; margin: 32px 0; }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 13, letterSpacing: 6, color: "#c9a96e", opacity: .6, marginBottom: 12, textTransform: "uppercase" }}>
            indizi cosmici
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: "#e8dcc8", marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: "#e8dcc8", opacity: .4, letterSpacing: 1 }}>
            Ultimo aggiornamento: marzo 2026
          </p>
        </div>

        <div style={{ background: "#0d0d1e", border: "1px solid #c9a96e1a", borderRadius: 16, padding: "40px 36px" }}>

          <p>
            La presente Privacy Policy descrive come <strong style={{ color: "#c9a96e" }}>Indizi Cosmici</strong> raccoglie, utilizza e protegge i dati personali degli utenti che accedono al sito <strong style={{ color: "#c9a96e" }}>indizicosmici.it</strong>, in conformità con il Regolamento UE 2016/679 (GDPR) e il D.Lgs. 196/2003.
          </p>

          <hr />

          <h2>1. Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento dei dati è <strong style={{ color: "#c9a96e" }}>Indizi Cosmici</strong>.<br />
            Per qualsiasi richiesta relativa ai tuoi dati scrivi a: <a href="mailto:privacy@indizicosmici.it">privacy@indizicosmici.it</a>
          </p>

          <hr />

          <h2>2. Dati raccolti</h2>
          <p>Attraverso il form presente sul sito raccogliamo i seguenti dati:</p>
          <ul>
            <li><strong style={{ color: "#c9a96e" }}>Data di nascita</strong> — obbligatoria per il calcolo astrologico</li>
            <li><strong style={{ color: "#c9a96e" }}>Luogo di nascita</strong> — obbligatorio per il calcolo astrologico</li>
            <li><strong style={{ color: "#c9a96e" }}>Ora di nascita</strong> — opzionale, migliora la precisione dell'analisi</li>
            <li><strong style={{ color: "#c9a96e" }}>Nome</strong> — opzionale</li>
            <li><strong style={{ color: "#c9a96e" }}>Indirizzo email</strong> — opzionale, necessario per ricevere comunicazioni</li>
          </ul>

          <hr />

          <h2>3. Finalità del trattamento</h2>
          <p>I dati vengono trattati per le seguenti finalità:</p>
          <ul>
            <li>Calcolo e restituzione del segno solare e dell'analisi astrologica personalizzata</li>
            <li>Invio di contenuti personalizzati, aggiornamenti e offerte via email (solo previo consenso esplicito)</li>
            <li>Miglioramento del servizio offerto</li>
          </ul>

          <hr />

          <h2>4. Base giuridica</h2>
          <p>
            Il trattamento dei dati si basa sul <strong style={{ color: "#c9a96e" }}>consenso esplicito</strong> dell'interessato, espresso attraverso l'apposita casella di spunta presente nel form di raccolta dati (art. 6, par. 1, lett. a del GDPR).
          </p>
          <p>
            Il consenso al trattamento per finalità di marketing è separato e facoltativo.
          </p>

          <hr />

          <h2>5. Conservazione dei dati</h2>
          <p>
            I dati vengono conservati per un periodo massimo di <strong style={{ color: "#c9a96e" }}>24 mesi</strong> dalla data di raccolta, salvo diversa richiesta dell'utente o obblighi di legge.
          </p>

          <hr />

          <h2>6. Condivisione con terze parti</h2>
          <p>I tuoi dati non vengono venduti né ceduti a terzi. Vengono trattati da:</p>
          <ul>
            <li><strong style={{ color: "#c9a96e" }}>Supabase Inc.</strong> — archiviazione sicura del database (server in Europa)</li>
            <li><strong style={{ color: "#c9a96e" }}>Vercel Inc.</strong> — hosting del sito web</li>
            <li><strong style={{ color: "#c9a96e" }}>Anthropic PBC</strong> — elaborazione AI per le interpretazioni astrologiche</li>
          </ul>
          <p>Tutti i fornitori operano in conformità con il GDPR.</p>

          <hr />

          <h2>7. I tuoi diritti</h2>
          <p>In qualsiasi momento puoi esercitare i seguenti diritti:</p>
          <ul>
            <li><strong style={{ color: "#c9a96e" }}>Accesso</strong> — richiedere copia dei dati che ti riguardano</li>
            <li><strong style={{ color: "#c9a96e" }}>Rettifica</strong> — correggere dati inesatti</li>
            <li><strong style={{ color: "#c9a96e" }}>Cancellazione</strong> — richiedere la rimozione dei tuoi dati</li>
            <li><strong style={{ color: "#c9a96e" }}>Portabilità</strong> — ricevere i tuoi dati in formato leggibile</li>
            <li><strong style={{ color: "#c9a96e" }}>Revoca del consenso</strong> — in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente</li>
            <li><strong style={{ color: "#c9a96e" }}>Opposizione</strong> — opporsi al trattamento per finalità di marketing</li>
          </ul>
          <p>
            Per esercitare questi diritti scrivi a <a href="mailto:privacy@indizicosmici.it">privacy@indizicosmici.it</a>. Risponderemo entro 30 giorni.
          </p>

          <hr />

          <h2>8. Cookie</h2>
          <p>
            Il sito non utilizza cookie di profilazione. Potrebbero essere presenti cookie tecnici strettamente necessari al funzionamento del sito.
          </p>

          <hr />

          <h2>9. Sicurezza</h2>
          <p>
            I dati sono archiviati in database protetti con crittografia e accesso limitato. Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati da accessi non autorizzati.
          </p>

          <hr />

          <h2>10. Modifiche alla Privacy Policy</h2>
          <p>
            Ci riserviamo il diritto di aggiornare questa Privacy Policy. Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. Ti invitiamo a consultarla periodicamente.
          </p>

          <hr />

          <h2>11. Reclami</h2>
          <p>
            Hai il diritto di proporre reclamo al <strong style={{ color: "#c9a96e" }}>Garante per la protezione dei dati personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).
          </p>

        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a href="/" style={{ color: "#c9a96e", opacity: .6, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
            ← Torna alla home
          </a>
        </div>

      </div>
    </div>
  );
}
