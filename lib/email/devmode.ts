import { promises as fs } from 'fs';
import { join } from 'path';
import type { SendArgs } from './index';

/** Scrive l'email come HTML in tmp/emails/<timestamp>.html — usato quando RESEND_API_KEY è mancante */
export async function writeDevEmail(args: SendArgs): Promise<string> {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const id = `dev-${ts}`;
  const dir = join(process.cwd(), 'tmp', 'emails');
  await fs.mkdir(dir, { recursive: true });

  const wrapper = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${args.subject}</title>
<style>body{font-family:system-ui,sans-serif;background:#18122B;color:#FFF6E8;padding:24px;}
.meta{background:#2A1E4A;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;}
.body{background:#FFF6E8;color:#18122B;padding:24px;border-radius:8px;}
.attachments{margin-top:16px;font-size:12px;opacity:.7;}</style>
</head><body>
<div class="meta">
  <strong>To:</strong> ${args.to}<br>
  <strong>Subject:</strong> ${args.subject}<br>
  <strong>Dev mode</strong> — Resend non configurato, salvato in <code>tmp/emails/${id}.html</code>
</div>
<div class="body">${args.html}</div>
${args.attachments?.length ? `<div class="attachments">Allegati: ${args.attachments.map(a => a.filename).join(', ')}</div>` : ''}
</body></html>`;

  await fs.writeFile(join(dir, `${id}.html`), wrapper, 'utf-8');
  console.log(`[email/devmode] scritto tmp/emails/${id}.html → ${args.to} (${args.subject})`);
  return id;
}
