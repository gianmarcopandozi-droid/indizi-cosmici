import { useState } from "react";

const SUPABASE_URL = "https://jlrvxarbthgubvjvcjds.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscnZ4YXJidGhndWJ2anZjamRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTcxNjQsImV4cCI6MjA5MDEzMzE2NH0.lccBREI7Yf2qGCv0VtzEGkwYbUYTkkhGIRx8ooEW5OQ";

const SEGNI = [
  { nome: "Capricorno", simbolo: "♑", dal: [12,22], al: [1,19], elemento: "Terra", pianeta: "Saturno",
    teaser: "Costruisci in silenzio mentre gli altri parlano. La tua ambizione non ha bisogno di pubblico — i risultati parlano da soli. Ma c'è un prezzo che paghi ogni giorno e che non ammetteresti mai." },
  { nome: "Acquario", simbolo: "♒", dal: [1,20], al: [2,18], elemento: "Aria", pianeta: "Urano",
    teaser: "Vedi il mondo come dovrebbe essere, non come è. Questo ti rende visionario e, a volte, profondamente solo. Le persone ti ammirano da lontano ma faticano a starti vicino davvero." },
  { nome: "Pesci", simbolo: "♓", dal: [2,19], al: [3,20], elemento: "Acqua", pianeta: "Nettuno",
    teaser: "Assorbi le emozioni degli altri come se fossero tue. Questo è il tuo dono e la tua croce. Sai cose che non ti hanno detto — e spesso preferiresti non saperle." },
  { nome: "Ariete", simbolo: "♈", dal: [3,21], al: [4,19], elemento: "Fuoco", pianeta: "Marte",
    teaser: "Agisci prima di pensare e pensi meglio degli altri anche così. Il tuo istinto quasi non sbaglia — il problema è che lo sai, e questo a volte ti frega." },
  { nome: "Toro", simbolo: "♉", dal: [4,20], al: [5,20], elemento: "Terra", pianeta: "Venere",
    teaser: "Ci vuole tempo per guadagnarti la fiducia, ma chi la ottiene ti ha per sempre. Non sei testardo — hai solo capito che le cose buone si costruiscono con pazienza." },
  { nome: "Gemelli", simbolo: "♊", dal: [5,21], al: [6,20], elemento: "Aria", pianeta: "Mercurio",
    teaser: "Non sei incoerente. Sei complesso. Ci sono almeno due versioni di te che convivono — e quella che le persone vedono dipende da quanto si sono guadagnate la tua vera presenza." },
  { nome: "Cancro", simbolo: "♋", dal: [6,21], al: [7,22], elemento: "Acqua", pianeta: "Luna",
    teaser: "Ti prendi cura di tutti, ma chi si prende cura di te? Hai un'armatura che quasi nessuno ha mai visto sotto. E va bene così — non tutti meritano di saperlo." },
  { nome: "Leone", simbolo: "♌", dal: [7,23], al: [8,22], elemento: "Fuoco", pianeta: "Sole",
    teaser: "Non cerchi l'attenzione per vanità. La cerchi perché sai di avere qualcosa da dare — e fa male quando nessuno lo nota. La tua lealtà è feroce. E la tua delusione, ancora di più." },
  { nome: "Vergine", simbolo: "♍", dal: [8,23], al: [9,22], elemento: "Terra", pianeta: "Mercurio",
    teaser: "Il tuo standard non è perfezionismo — è rispetto per le cose fatte bene. Il problema è che spesso sei l'unico a farlo. E lo sai. E ci convivi, ogni giorno." },
  { nome: "Bilancia", simbolo: "♎", dal: [9,23], al: [10,22], elemento: "Aria", pianeta: "Venere",
    teaser: "Passi la vita a bilanciare gli altri mentre dentro di te c'è una guerra. Nessuno lo vede perché sei bravo a sembrare in pace. Ma tu sai quanto costa." },
  { nome: "Scorpione", simbolo: "♏", dal: [10,23], al: [11,21], elemento: "Acqua", pianeta: "Plutone",
    teaser: "Vedi attraverso le persone. Non è un'impressione — è una capacità reale che spaventa anche te. Non dimentichi niente. Non dimentichi nessuno. E non perdoni facilmente." },
  { nome: "Sagittario", simbolo: "♐", dal: [11,22], al: [12,21], elemento: "Fuoco", pianeta: "Giove",
    teaser: "La libertà non è un lusso per te — è ossigeno. Quando ti senti in gabbia diventi qualcuno che nemmeno tu riconosci. La tua onestà è brutale, ma è il regalo più raro che fai." },
];

function getSegno(dataStr) {
  if (!dataStr) return null;
  const d = new Date(dataStr);
  const m = d.getMonth() + 1;
  const g = d.getDate();
  for (const s of SEGNI) {
    const [dm, dg] = s.dal;
    const [am, ag] = s.al;
    if (dm <= am) {
      if ((m === dm && g >= dg) || (m === am && g <= ag)) return s;
    } else {
      if ((m === dm && g >= dg) || (m === am && g <= ag) || (m === 1 && dm === 12)) return s;
    }
  }
  return SEGNI[0];
}

const STARS = Array.from({ length: 50 }, (_, i) => ({
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  op: Math.random() * 0.5 + 0.1,
  delay: Math.random() * 5,
}));

export default function Landing() {
  const [form, setForm] = useState({
    nome: "", email: "", data_nascita: "", ora_nascita: "",
    luogo_nascita: "", consenso_privacy: false, consenso_marketing: false,
  });
  const [step, setStep] = useState("form"); // form | loading | result | error
  const [segno, setSegno] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.data_nascita || !form.luogo_nascita || !form.consenso_privacy) {
      setErrMsg("Compila i campi obbligatori e accetta la privacy policy.");
      return;
    }
    setErrMsg("");
    setStep("loading");

    const s = getSegno(form.data_nascita);
    setSegno(s);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/utenti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON,
          "Authorization": `Bearer ${SUPABASE_ANON}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          nome: form.nome || null,
          email: form.email || null,
          data_nascita: form.data_nascita,
          ora_nascita: form.ora_nascita || null,
          luogo_nascita: form.luogo_nascita,
          segno_solare: s?.nome || null,
          consenso_privacy: form.consenso_privacy,
          consenso_marketing: form.consenso_marketing,
          fonte: "landing_web",
        }),
      });

      if (!res.ok) throw new Error("Errore salvataggio");
      setTimeout(() => setStep("result"), 800);
    } catch (e) {
      setStep("error");
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    @keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.7} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #06060f; }
    .wrap { min-height: 100vh; background: #06060f; font-family: 'Cormorant Garamond', Georgia, serif; color: #e8dcc8; }
    input[type=text], input[type=email], input[type=date], input[type=time] {
      width: 100%; background: #0d0d1e; border: 1px solid #c9a96e33;
      border-radius: 10px; color: #e8dcc8; padding: 12px 16px;
      font-family: 'Cormorant Garamond', serif; font-size: 16px;
      outline: none; transition: border-color .2s;
    }
    input:focus { border-color: #c9a96e88; }
    input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
    .checkbox-row { display: flex; gap: 12px; align-items: flex-start; cursor: pointer; }
    .checkbox-row input[type=checkbox] { width: 18px; height: 18px; accent-color: #c9a96e; flex-shrink: 0; margin-top: 2px; }
    .btn { width: 100%; background: linear-gradient(135deg, #c9a96e, #a07840);
      border: none; border-radius: 12px; color: #06060f; padding: 16px;
      font-size: 16px; letter-spacing: 3px; text-transform: uppercase;
      font-family: 'Cormorant Garamond', serif; font-weight: 600;
      cursor: pointer; transition: opacity .2s; }
    .btn:disabled { opacity: .4; cursor: not-allowed; }
    .btn:hover:not(:disabled) { opacity: .9; }
    label.lbl { display: block; font-size: 11px; letter-spacing: 3px;
      color: #c9a96e; margin-bottom: 8px; text-transform: uppercase; }
    .field { margin-bottom: 18px; }
    .star { position: absolute; border-radius: 50%; background: #c9a96e; animation: twinkle var(--d) ease-in-out infinite; }
  `;

  return (
    <div className="wrap">
      <style>{css}</style>

      {/* Stars */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {STARS.map((s, i) => (
          <div key={i} className="star" style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            opacity: s.op, "--d": `${2 + s.delay}s`,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp .6s ease" }}>
          <div style={{ fontSize: 13, letterSpacing: 6, color: "#c9a96e", opacity: .6, marginBottom: 12, textTransform: "uppercase" }}>
            indizi cosmici
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 300, color: "#e8dcc8", lineHeight: 1.2, marginBottom: 16 }}>
            Le stelle hanno scritto<br />qualcosa su di te
          </h1>
          <p style={{ fontSize: 16, color: "#e8dcc8", opacity: .55, lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
            Inserisci i tuoi dati di nascita.<br />Ti mostreremo cosa dice davvero la tua carta natale.
          </p>
        </div>

        {/* FORM */}
        {step === "form" && (
          <div style={{ animation: "fadeUp .7s ease" }}>
            <div style={{ background: "#0d0d1e", border: "1px solid #c9a96e1a", borderRadius: 20, padding: "32px 28px" }}>

              {/* Decorative line */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ flex: 1, height: 1, background: "#c9a96e22" }} />
                <span style={{ color: "#c9a96e", opacity: .4, fontSize: 14 }}>✦</span>
                <div style={{ flex: 1, height: 1, background: "#c9a96e22" }} />
              </div>

              <div className="field">
                <label className="lbl">Nome (opzionale)</label>
                <input type="text" placeholder="Il tuo nome" value={form.nome} onChange={e => set("nome", e.target.value)} />
              </div>

              <div className="field">
                <label className="lbl">Email (opzionale)</label>
                <input type="email" placeholder="tu@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div>
                  <label className="lbl">Data di nascita *</label>
                  <input type="date" value={form.data_nascita} onChange={e => set("data_nascita", e.target.value)} />
                </div>
                <div>
                  <label className="lbl">Ora (opz.)</label>
                  <input type="time" value={form.ora_nascita} onChange={e => set("ora_nascita", e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label className="lbl">Luogo di nascita *</label>
                <input type="text" placeholder="es. Roma, Italia" value={form.luogo_nascita} onChange={e => set("luogo_nascita", e.target.value)} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.consenso_privacy} onChange={e => set("consenso_privacy", e.target.checked)} />
                  <span style={{ fontSize: 13, color: "#e8dcc8", opacity: .7, lineHeight: 1.5 }}>
                    Acconsento al trattamento dei dati personali secondo la <span style={{ color: "#c9a96e", cursor: "pointer" }}>privacy policy</span>. *
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.consenso_marketing} onChange={e => set("consenso_marketing", e.target.checked)} />
                  <span style={{ fontSize: 13, color: "#e8dcc8", opacity: .7, lineHeight: 1.5 }}>
                    Voglio ricevere contenuti personalizzati e offerte via email.
                  </span>
                </label>
              </div>

              {errMsg && (
                <div style={{ color: "#c96e6e", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
                  {errMsg}
                </div>
              )}

              <button className="btn" onClick={handleSubmit}>
                ✦ Scopri la tua mappa
              </button>

              <p style={{ fontSize: 11, color: "#e8dcc8", opacity: .3, textAlign: "center", marginTop: 16, letterSpacing: 1 }}>
                * campi obbligatori — i tuoi dati non vengono mai condivisi
              </p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0", animation: "fadeUp .5s ease" }}>
            <div style={{ fontSize: 48, animation: "spin 3s linear infinite", display: "inline-block", marginBottom: 24 }}>
              ✦
            </div>
            <p style={{ color: "#c9a96e", letterSpacing: 3, fontSize: 13, textTransform: "uppercase" }}>
              Lettura in corso...
            </p>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && segno && (
          <div style={{ animation: "fadeUp .8s ease" }}>

            {/* Segno card */}
            <div style={{
              background: "#0d0d1e",
              border: "1px solid #c9a96e33",
              borderRadius: 20,
              padding: "40px 28px",
              textAlign: "center",
              marginBottom: 20,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 200, height: 200, borderRadius: "50%",
                background: "#c9a96e08", pointerEvents: "none",
              }} />

              <div style={{ fontSize: 64, marginBottom: 4, animation: "pulse 3s ease infinite" }}>
                {segno.simbolo}
              </div>
              <div style={{ color: "#c9a96e", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", marginBottom: 6, opacity: .7 }}>
                il tuo segno solare
              </div>
              <div style={{ fontSize: 32, fontWeight: 300, color: "#e8dcc8", marginBottom: 24 }}>
                {segno.nome}
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28 }}>
                {[["Elemento", segno.elemento], ["Pianeta", segno.pianeta]].map(([k, v]) => (
                  <div key={k} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, letterSpacing: 3, color: "#c9a96e", opacity: .5, textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 15, color: "#e8dcc8", opacity: .8 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: "#c9a96e15", marginBottom: 24 }} />

              <p style={{ fontSize: 16, color: "#e8dcc8", opacity: .8, lineHeight: 1.8, fontStyle: "italic" }}>
                "{segno.teaser}"
              </p>
            </div>

            {/* Teaser upsell */}
            <div style={{
              background: "#0d0d1e",
              border: "1px solid #c9a96e22",
              borderRadius: 16,
              padding: "24px 24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>✦</div>
              <p style={{ fontSize: 15, color: "#e8dcc8", opacity: .7, lineHeight: 1.7, marginBottom: 4 }}>
                Questa è solo la superficie.
              </p>
              <p style={{ fontSize: 14, color: "#c9a96e", opacity: .8, letterSpacing: 1 }}>
                La tua carta natale completa sta arrivando.
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUp .5s ease" }}>
            <p style={{ color: "#c96e6e", marginBottom: 20 }}>Qualcosa è andato storto. Riprova.</p>
            <button className="btn" style={{ maxWidth: 200, margin: "0 auto" }} onClick={() => setStep("form")}>
              Riprova
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
