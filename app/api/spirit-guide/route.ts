import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { render } from '@react-email/render';
import { getServiceRoleClient } from '@/lib/supabase-server';
import { calcolaSegno, SEGNO_GLIFI, SEGNO_LABEL } from '@/lib/zodiac';
import { selezionaMantra } from '@/lib/mantras';
import { newShareId } from '@/lib/short-id';
import { hashIp, extractIp } from '@/lib/hash';
import { sendTransactional } from '@/lib/email';
import SpiritGuideEmail from '@/emails/spirit-guide';
import NewsletterConfirmEmail from '@/emails/newsletter-confirm';

// route node-runtime (service_role key + react-email render)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONSENT_VERSION = 'v1-2026-05-14';

const BodySchema = z.object({
  nome: z.string().trim().min(1).max(50),
  giorno_nascita: z.number().int().min(1).max(31),
  mese_nascita: z.number().int().min(1).max(12),
  anno_nascita: z.number().int().min(1900).max(2026),
  email: z.string().email().max(200),
  opt_in_newsletter: z.boolean(),
  dedicato_a: z.string().trim().max(50).optional(),
  source: z.string().trim().max(80).optional().default('direct')
});

function genConfirmToken(): string {
  return randomBytes(24).toString('hex');
}

async function fetchWallpaperPng(siteUrl: string, shareId: string): Promise<Buffer | null> {
  try {
    const res = await fetch(`${siteUrl}/wallpaper/${shareId}`, { cache: 'no-store' });
    if (!res.ok) {
      console.warn(`[spirit-guide] wallpaper fetch non OK: ${res.status}`);
      return null;
    }
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } catch (err) {
    console.warn('[spirit-guide] wallpaper fetch fallita:', err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== 'object') {
      return NextResponse.json({ ok: false, error: 'Body JSON non valido' }, { status: 400 });
    }

    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return NextResponse.json(
        { ok: false, error: `Validazione fallita: ${first?.path.join('.')} ${first?.message}` },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const segno = calcolaSegno(data.giorno_nascita, data.mese_nascita);
    const shareId = newShareId();
    const mantra = selezionaMantra(segno, shareId);
    const dedicato_a = data.dedicato_a && data.dedicato_a.length > 0 ? data.dedicato_a : null;

    const supabase = getServiceRoleClient();

    // ---- Subscribers UPSERT su email ----
    const confirmToken = data.opt_in_newsletter ? genConfirmToken() : null;

    const subscriberPayload: Record<string, unknown> = {
      email: data.email.toLowerCase().trim(),
      nome: data.nome,
      giorno_nascita: data.giorno_nascita,
      mese_nascita: data.mese_nascita,
      anno_nascita: data.anno_nascita,
      segno,
      source: data.source ?? 'direct',
      opt_in_newsletter: data.opt_in_newsletter
    };
    if (confirmToken) {
      subscriberPayload.confirm_token = confirmToken;
    }

    const { data: subscriber, error: subErr } = await supabase
      .from('subscribers')
      .upsert(subscriberPayload, { onConflict: 'email' })
      .select('id, unsubscribe_token, confirm_token, opt_in_newsletter, confirmed')
      .single();

    if (subErr || !subscriber) {
      console.error('[spirit-guide] subscriber upsert error:', subErr);
      return NextResponse.json(
        { ok: false, error: 'Errore salvataggio iscrizione' },
        { status: 500 }
      );
    }

    // ---- Consent log ----
    const ip = extractIp(req);
    const ip_hash = hashIp(ip);
    const ua = req.headers.get('user-agent');

    const consentRows: Array<Record<string, unknown>> = [
      {
        subscriber_id: subscriber.id,
        consent_type: 'download',
        consent_version: CONSENT_VERSION,
        ip_hash,
        user_agent: ua
      }
    ];
    if (data.opt_in_newsletter) {
      consentRows.push({
        subscriber_id: subscriber.id,
        consent_type: 'newsletter',
        consent_version: CONSENT_VERSION,
        ip_hash,
        user_agent: ua
      });
    }
    const { error: consentErr } = await supabase.from('consent_log').insert(consentRows);
    if (consentErr) {
      console.error('[spirit-guide] consent_log insert error:', consentErr);
      // non blocco il flusso, ma loggho
    }

    // ---- Spirit guide ----
    const { error: sgErr } = await supabase.from('spirit_guides').insert({
      share_id: shareId,
      subscriber_id: subscriber.id,
      nome_visualizzato: data.nome,
      segno,
      mantra,
      dedicato_a
    });
    if (sgErr) {
      console.error('[spirit-guide] spirit_guides insert error:', sgErr);
      return NextResponse.json(
        { ok: false, error: 'Errore creazione spirito guida' },
        { status: 500 }
      );
    }

    // ---- Email transazionale principale ----
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const unsubscribeToken = subscriber.unsubscribe_token as string;
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe/${unsubscribeToken}`;
    const confirmUrl =
      data.opt_in_newsletter && confirmToken
        ? `${siteUrl}/api/confirm/${confirmToken}`
        : undefined;

    const wallpaperBuffer = await fetchWallpaperPng(siteUrl, shareId);

    const html = await render(
      SpiritGuideEmail({
        nome: data.nome,
        segno,
        segno_label: SEGNO_LABEL[segno],
        glifo: SEGNO_GLIFI[segno],
        mantra,
        shareId,
        opt_in_newsletter: data.opt_in_newsletter,
        confirm_url: confirmUrl,
        dedicato_a: dedicato_a ?? undefined,
        site_url: siteUrl,
        unsubscribe_url: unsubscribeUrl
      })
    );

    const attachments = wallpaperBuffer
      ? [{ filename: 'spirito-guida.png', content: wallpaperBuffer }]
      : undefined;

    try {
      await sendTransactional({
        to: data.email,
        subject: `✦ ${data.nome}, ecco il tuo Spirito Guida`,
        html,
        attachments,
        tags: [
          { name: 'type', value: 'spirit-guide' },
          { name: 'segno', value: segno }
        ]
      });
    } catch (mailErr) {
      console.error('[spirit-guide] sendTransactional spirit-guide error:', mailErr);
      // non blocco la response, il lead è già salvato
    }

    // ---- Email conferma newsletter ----
    if (data.opt_in_newsletter && confirmUrl) {
      try {
        const confirmHtml = await render(
          NewsletterConfirmEmail({
            nome: data.nome,
            confirm_url: confirmUrl,
            site_url: siteUrl,
            unsubscribe_url: unsubscribeUrl
          })
        );
        await sendTransactional({
          to: data.email,
          subject: 'Conferma il tuo posto tra gli Indizi',
          html: confirmHtml,
          tags: [{ name: 'type', value: 'newsletter-confirm' }]
        });
      } catch (mailErr) {
        console.error('[spirit-guide] sendTransactional confirm error:', mailErr);
      }
    }

    return NextResponse.json({ ok: true, shareId, segno }, { status: 200 });
  } catch (err) {
    console.error('[spirit-guide] unhandled:', err);
    return NextResponse.json(
      { ok: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}
