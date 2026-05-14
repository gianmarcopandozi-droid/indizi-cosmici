#!/usr/bin/env bash
# Smoke test E2E del funnel Indizi Cosmici.
# Eseguilo DOPO aver applicato schema SQL + settato env vars su Vercel + redeploy.
#
# Uso:
#   BASE_URL=https://indizi-cosmici.vercel.app ./scripts/verify-e2e.sh
#   (oppure BASE_URL=http://localhost:3000 per test locale)

set -euo pipefail
BASE_URL="${BASE_URL:-https://indizi-cosmici.vercel.app}"
TEST_EMAIL="${TEST_EMAIL:-gianmarco.pandozi+test-$(date +%s)@gmail.com}"

bold() { printf "\n\033[1m%s\033[0m\n" "$1"; }
ok() { printf "  \033[32m✓\033[0m %s\n" "$1"; }
ko() { printf "  \033[31m✗\033[0m %s\n" "$1"; }
info() { printf "  \033[36mi\033[0m %s\n" "$1"; }

bold "1. LP raggiungibile"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
[ "$STATUS" = "200" ] && ok "GET / → 200" || { ko "GET / → $STATUS"; exit 1; }

bold "2. Pagine statiche"
for path in /privacy /termini /grazie-newsletter; do
  S=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  [ "$S" = "200" ] && ok "GET $path → 200" || ko "GET $path → $S"
done

bold "3. Form submit (POST /api/spirit-guide)"
RESP=$(curl -s -X POST "$BASE_URL/api/spirit-guide" \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Test Gianmarco\",
    \"giorno_nascita\": 4,
    \"mese_nascita\": 11,
    \"email\": \"$TEST_EMAIL\",
    \"opt_in_newsletter\": false,
    \"source\": \"smoke-test\"
  }")
echo "$RESP" | head -c 300; echo
SHARE_ID=$(echo "$RESP" | sed -n 's/.*"shareId":"\([^"]*\)".*/\1/p')
if [ -n "$SHARE_ID" ]; then
  ok "shareId ricevuto: $SHARE_ID"
else
  ko "shareId NON ricevuto. Risposta sopra."
  exit 1
fi

bold "4. Wallpaper PNG generato (1080×1920)"
WURL="$BASE_URL/wallpaper/$SHARE_ID"
WSTATUS=$(curl -s -o /tmp/wallpaper-test.png -w "%{http_code}" "$WURL")
WSIZE=$(wc -c < /tmp/wallpaper-test.png)
if [ "$WSTATUS" = "200" ] && [ "$WSIZE" -gt 5000 ]; then
  ok "GET $WURL → 200, $WSIZE byte"
  info "salvato in /tmp/wallpaper-test.png — aprilo per ispezione visiva"
  if [ "$(uname)" = "Darwin" ]; then open /tmp/wallpaper-test.png; fi
else
  ko "Wallpaper status=$WSTATUS size=$WSIZE (atteso 200 + >5KB)"
fi

bold "5. OG card PNG (1200×630)"
OSTATUS=$(curl -s -o /tmp/og-test.png -w "%{http_code}" "$BASE_URL/og/$SHARE_ID")
OSIZE=$(wc -c < /tmp/og-test.png)
if [ "$OSTATUS" = "200" ] && [ "$OSIZE" -gt 3000 ]; then
  ok "OG card → 200, $OSIZE byte"
else
  ko "OG status=$OSTATUS size=$OSIZE"
fi

bold "6. Share page con OG metatags"
SGURL="$BASE_URL/sg/$SHARE_ID"
SGSTATUS=$(curl -s -o /tmp/sg-test.html -w "%{http_code}" "$SGURL")
[ "$SGSTATUS" = "200" ] && ok "GET $SGURL → 200" || ko "GET $SGURL → $SGSTATUS"
grep -o '<meta property="og:image"[^>]*>' /tmp/sg-test.html | head -1 \
  | grep -q "/og/$SHARE_ID" && ok "og:image punta a /og/$SHARE_ID" || ko "og:image NON contiene /og/$SHARE_ID"

bold "7. Share tracking (POST /api/share)"
TS=$(curl -s -X POST "$BASE_URL/api/share" \
  -H "Content-Type: application/json" \
  -d "{\"shareId\":\"$SHARE_ID\",\"channel\":\"whatsapp\"}")
echo "  $TS"

bold "8. WhatsApp preview check"
info "Per testare l'anteprima WA reale:"
info "  1. Apri WhatsApp Web"
info "  2. Incolla in una chat: $SGURL"
info "  3. Aspetta 2-3 secondi → deve apparire card con immagine + titolo + descrizione"
info "  4. Se la card NON appare: cache OG di WhatsApp lenta — riprova con https://www.opengraph.xyz/url/$(echo -n "$SGURL" | xxd -p | tr -d '\n')"

bold "Riepilogo"
ok "shareId test: $SHARE_ID"
ok "Email test: $TEST_EMAIL"
info "Verifica manuale Supabase:"
info "  https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/editor → subscribers → cerca $TEST_EMAIL"
info "  https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/editor → consent_log → deve avere riga con consent_type=download"
info "  https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/editor → spirit_guides → deve avere share_id=$SHARE_ID"
info "  https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/editor → share_events → deve avere riga channel=whatsapp"
info "Verifica email reale:"
info "  Inbox di $TEST_EMAIL (gmail+ alias)"
info "  Subject: ✦ Test Gianmarco, ecco il tuo Spirito Guida"
info "  Allegato PNG presente?"

bold "Done."
