import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceRoleClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Indizi Cosmici · Admin',
  description: 'Dashboard interna metriche Indizi Cosmici.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ChannelRow = { channel: string; count: number };
type SegnoRow = { segno: string; count: number };

async function loadMetrics() {
  const supabase = getServiceRoleClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    totalRes,
    todayRes,
    optedRes,
    confirmedRes,
    subscribersForSegniRes,
    shareEventsRes
  ] = await Promise.all([
    supabase.from('subscribers').select('*', { count: 'exact', head: true }),
    supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayIso),
    supabase
      .from('subscribers')
      .select('opt_in_newsletter', { count: 'exact', head: false }),
    supabase
      .from('subscribers')
      .select('confirmed, opt_in_newsletter', { count: 'exact', head: false }),
    supabase.from('subscribers').select('segno'),
    supabase.from('share_events').select('channel')
  ]);

  const totalLeads = totalRes.count ?? 0;
  const todayLeads = todayRes.count ?? 0;

  const optedData = (optedRes.data ?? []) as Array<{ opt_in_newsletter: boolean }>;
  const optedTotal = optedData.length;
  const optedYes = optedData.filter((r) => r.opt_in_newsletter).length;
  const optedPct = optedTotal > 0 ? Math.round((optedYes / optedTotal) * 100) : 0;

  const confirmedData = (confirmedRes.data ?? []) as Array<{
    confirmed: boolean;
    opt_in_newsletter: boolean;
  }>;
  const confirmedCount = confirmedData.filter((r) => r.confirmed).length;
  const optedCountForConf = confirmedData.filter((r) => r.opt_in_newsletter).length;
  const confirmedPct =
    optedCountForConf > 0 ? Math.round((confirmedCount / optedCountForConf) * 100) : 0;

  const segniData = (subscribersForSegniRes.data ?? []) as Array<{ segno: string }>;
  const segniMap = new Map<string, number>();
  for (const row of segniData) {
    const key = row.segno ?? '—';
    segniMap.set(key, (segniMap.get(key) ?? 0) + 1);
  }
  const segniRows: SegnoRow[] = Array.from(segniMap.entries())
    .map(([segno, count]) => ({ segno, count }))
    .sort((a, b) => b.count - a.count);

  const shareData = (shareEventsRes.data ?? []) as Array<{ channel: string }>;
  const channelMap = new Map<string, number>();
  for (const row of shareData) {
    const key = row.channel ?? '—';
    channelMap.set(key, (channelMap.get(key) ?? 0) + 1);
  }
  const channelRows: ChannelRow[] = Array.from(channelMap.entries())
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalLeads,
    todayLeads,
    optedYes,
    optedTotal,
    optedPct,
    confirmedCount,
    optedCountForConf,
    confirmedPct,
    segniRows,
    channelRows
  };
}

export default async function AdminPage() {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
    notFound();
  }

  const data = await loadMetrics();

  return (
    <main className="min-h-screen bg-notte-profonda text-panna-stellare font-mono">
      <div className="max-w-4xl mx-auto px-6 py-[40px] md:px-10">
        <header className="mb-10">
          <h1 className="text-oro-caldo text-xs tracking-[0.35em] uppercase mb-2">
            ✦ Indizi Cosmici · Admin
          </h1>
          <p className="text-rosa-polvere text-sm">
            Snapshot in tempo reale — refresh per aggiornare
          </p>
        </header>

        <section className="space-y-2 mb-12 text-[15px] leading-7">
          <div className="flex justify-between border-b border-oro-caldo/20 py-2">
            <span className="text-oro-caldo uppercase text-xs tracking-[0.2em]">
              Lead totali
            </span>
            <span className="text-panna-stellare">{data.totalLeads}</span>
          </div>
          <div className="flex justify-between border-b border-oro-caldo/20 py-2">
            <span className="text-oro-caldo uppercase text-xs tracking-[0.2em]">
              Lead oggi
            </span>
            <span className="text-panna-stellare">{data.todayLeads}</span>
          </div>
          <div className="flex justify-between border-b border-oro-caldo/20 py-2">
            <span className="text-oro-caldo uppercase text-xs tracking-[0.2em]">
              Opt-in newsletter
            </span>
            <span className="text-panna-stellare">
              {data.optedYes} ({data.optedPct}%)
            </span>
          </div>
          <div className="flex justify-between border-b border-oro-caldo/20 py-2">
            <span className="text-oro-caldo uppercase text-xs tracking-[0.2em]">
              Confermati
            </span>
            <span className="text-panna-stellare">
              {data.confirmedCount} ({data.confirmedPct}% degli opt-in)
            </span>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-oro-caldo uppercase text-xs tracking-[0.2em] mb-4">
            Share events
          </h2>
          {data.channelRows.length === 0 ? (
            <p className="text-rosa-polvere/70 text-sm">Nessun evento di share ancora.</p>
          ) : (
            <table className="w-full text-[15px] border-collapse">
              <thead>
                <tr className="text-oro-caldo uppercase text-xs tracking-[0.2em] text-left">
                  <th className="py-2 border-b border-oro-caldo/30">Channel</th>
                  <th className="py-2 border-b border-oro-caldo/30 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {data.channelRows.map((row) => (
                  <tr key={row.channel} className="border-b border-oro-caldo/10">
                    <td className="py-2 text-panna-stellare">· {row.channel}</td>
                    <td className="py-2 text-right text-panna-stellare">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-oro-caldo uppercase text-xs tracking-[0.2em] mb-4">
            Distribuzione segni
          </h2>
          {data.segniRows.length === 0 ? (
            <p className="text-rosa-polvere/70 text-sm">Nessun iscritto ancora.</p>
          ) : (
            <table className="w-full text-[15px] border-collapse">
              <thead>
                <tr className="text-oro-caldo uppercase text-xs tracking-[0.2em] text-left">
                  <th className="py-2 border-b border-oro-caldo/30">Segno</th>
                  <th className="py-2 border-b border-oro-caldo/30 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {data.segniRows.map((row) => (
                  <tr key={row.segno} className="border-b border-oro-caldo/10">
                    <td className="py-2 text-panna-stellare">· {row.segno}</td>
                    <td className="py-2 text-right text-panna-stellare">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <footer className="pt-8 border-t border-oro-caldo/20 text-rosa-polvere/60 text-xs tracking-[0.15em] uppercase">
          Indizi Cosmici · admin v1
        </footer>
      </div>
    </main>
  );
}
