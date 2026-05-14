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
      .update({ opt_in_newsletter: false })
      .eq('unsubscribe_token', token)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('[unsubscribe] update error:', error);
      return invalidPage();
    }
    if (!data) {
      return invalidPage();
    }

    const url = siteUrl ? `${siteUrl}/unsubscribe?ok=1` : '/unsubscribe?ok=1';
    return NextResponse.redirect(url, { status: 302 });
  } catch (err) {
    console.error('[unsubscribe] unhandled:', err);
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
  <h1>Link non valido</h1>
  <p>Questo link di disiscrizione non e' valido. Se vuoi disiscriverti, contattaci.</p>
  <p><a href="/">Torna alla home</a></p>
</div></body></html>`,
    { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

