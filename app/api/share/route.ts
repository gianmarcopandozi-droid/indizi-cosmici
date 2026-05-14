import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAnonClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  shareId: z.string().trim().min(4).max(32),
  channel: z.enum(['whatsapp', 'copy_link', 'telegram', 'other'])
});

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Payload non valido' }, { status: 400 });
    }
    const { shareId, channel } = parsed.data;

    const supabase = getAnonClient();
    const { data: sg, error: sgErr } = await supabase
      .from('spirit_guides')
      .select('id')
      .eq('share_id', shareId)
      .maybeSingle();

    if (sgErr || !sg) {
      return NextResponse.json({ ok: false, error: 'shareId non trovato' }, { status: 404 });
    }

    const { error: insErr } = await supabase
      .from('share_events')
      .insert({ spirit_guide_id: sg.id, channel });

    if (insErr) {
      console.error('[share] insert error:', insErr);
      return NextResponse.json({ ok: false, error: 'Errore tracciamento' }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[share] unhandled:', err);
    return NextResponse.json({ ok: false, error: 'Errore interno' }, { status: 500 });
  }
}
