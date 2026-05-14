# Setup DNS — Register.it → Vercel + Resend

Questa è la **lista esatta** dei record DNS da aggiungere nel pannello Register.it per portare online `indizicosmici.it`.

## Prerequisiti

- Login Register.it con il tuo account
- Sezione: **I miei domini → indizicosmici.it → DNS / Gestione record / Custom**
- Tempo: 5-10 minuti di configurazione + 5min-1h di propagazione

## 1. Vercel (hosting LP) — 2 record

| Tipo | Nome | Valore | TTL |
|---|---|---|---|
| `A` | `@` (o vuoto) | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com.` | 3600 |

> Nota: il punto finale in `cname.vercel-dns.com.` è importante. Se Register non lo accetta, prova senza.

**Verifica**: una volta propagato, su Vercel dashboard del progetto `indizi-cosmici` → Settings → Domains → `indizicosmici.it` deve essere `Valid Configuration`.

```bash
dig indizicosmici.it +short
# atteso: 76.76.21.21
```

## 2. Resend (email transazionale) — 4 record

⚠️ Generabili solo dopo aver aggiunto il dominio nel pannello Resend (https://resend.com/domains → Add Domain → `indizicosmici.it`). Resend ti mostra i record specifici per il tuo account, copia quelli reali e ignora i placeholder qui sotto.

| Tipo | Nome | Valore (esempio) | TTL |
|---|---|---|---|
| `TXT` | `send` | `"v=spf1 include:amazonses.com ~all"` | 3600 |
| `CNAME` | `resend._domainkey` | `resend._domainkey.resend.com.` | 3600 |
| `MX` | `send` | `feedback-smtp.eu-west-1.amazonses.com` priority `10` | 3600 |
| `TXT` | `_dmarc` | `"v=DMARC1; p=none;"` | 3600 |

**Verifica**:
- Dashboard Resend → status dominio `Verified`
- Invio email di test da Resend → arriva in inbox (non spam) su gmail/libero/hotmail

## 3. Ricezione email su `@indizicosmici.it` (opzionale)

Se vuoi che `ciao@indizicosmici.it` riceva email (utile per risposte utenti):

**Opzione A — Cloudflare Email Routing (gratis, raccomandato)**:
1. Trasferisci i nameserver a Cloudflare (free plan) — operazione separata da fare in Register
2. Configura email routing che inoltra `ciao@indizicosmici.it` → la tua casella personale

**Opzione B — ImprovMX (gratis)**:
1. Su ImprovMX crea forwarder `ciao@indizicosmici.it` → tua casella
2. Aggiungi i loro record MX in Register

**Opzione C — niente**: usi solo `@gmail.com` per supporto, il dominio invia ma non riceve. Per V1 va benissimo.

## 4. Test finale completo

```bash
# DNS
dig indizicosmici.it +short                    # → 76.76.21.21
dig www.indizicosmici.it +short                # → cname.vercel-dns.com / IP Vercel

# HTTPS
curl -sI https://indizicosmici.it | head -1     # → HTTP/2 200

# SSL
echo | openssl s_client -connect indizicosmici.it:443 -servername indizicosmici.it 2>/dev/null | openssl x509 -noout -subject

# Resend domain (dopo verifica nel pannello)
# vai su resend.com/domains → status deve essere Verified
```

## Note

- Tempo di propagazione DNS tipico: **5min - 1h**. Se dopo 2h `dig` ancora restituisce vecchio IP, controlla il TTL del record precedente o flusha la cache DNS locale (`sudo dscacheutil -flushcache` su macOS).
- Vercel emette certificato SSL Let's Encrypt automaticamente dopo che il dominio è collegato.
- `indizicosmici.it` (apex) e `www.indizicosmici.it` devono entrambi puntare a Vercel. Vercel poi gestirà il redirect tra apex e www (configurabile nelle settings del progetto).
