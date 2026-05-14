import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token } = await ctx.params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  if (!token || token.length < 16 || token.length > 128) {
    return invalidPage();
  }

  try {
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('subscribers')
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq('confirm_token', token)
      .eq('confirmed', false)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('[confirm] update error:', error);
      return invalidPage();
    }
    if (!data) {
      return invalidPage();
    }

    // Redirect alla thank-you newsletter
    const url = siteUrl ? `${siteUrl}/grazie-newsletter` : '/grazie-newsletter';
    return NextResponse.redirect(url, { status: 302 });
  } catch (err) {
    console.error('[confirm] unhandled:', err);
    return invalidPage();
  }
}

function invalidPage(): Response {
  return new Response(
    `<!doctype html><html lang="it"><head><meta charset="utf-8">
<title>Link non valido — Indizi Cosmici</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body{font-family:system-ui,-apple-system,sans-serif;background:#18122B;color:#FFF6E8;
    min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:24px;}
  .box{max-width:480px;text-align:center;}
  h1{font-family:Georgia,serif;font-weight:400;font-size:28px;color:#D7A86E;margin:0 0 12px;}
  p{opacity:.85;line-height:1.5;}
  a{color:#D7A86E;}
</style></head>
<body><div class="box">
  <h1>Link non valido o gia' usato</h1>
  <p>Questo link di conferma non e' piu' valido. Forse hai gia' confermato la tua iscrizione, oppure il token e' scaduto.</p>
  <p><a href="/">Torna alla home</a></p>
</div></body></html>`,
    { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}
