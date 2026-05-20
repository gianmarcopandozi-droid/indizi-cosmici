import type { SendArgs } from './index';

export function isBrevoConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

/** Parsa EMAIL_FROM "Nome <email@dominio>" in { name, email } */
function parseSender(): { name: string; email: string } {
  const raw = process.env.EMAIL_FROM || 'Indizi Cosmici <noreply@indizicosmici.it>';
  const m = raw.match(/^(.*?)\s*<(.+?)>$/);
  if (m) return { name: m[1].trim() || 'Indizi Cosmici', email: m[2].trim() };
  return { name: 'Indizi Cosmici', email: raw.trim() };
}

function toBase64(content: Buffer | string): string {
  if (Buffer.isBuffer(content)) return content.toString('base64');
  return Buffer.from(content).toString('base64');
}

export async function sendViaBrevo(args: SendArgs): Promise<string> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY mancante');

  const sender = parseSender();

  const body: Record<string, unknown> = {
    sender,
    to: [{ email: args.to }],
    subject: args.subject,
    htmlContent: args.html
  };
  if (args.text) body.textContent = args.text;
  if (args.attachments?.length) {
    body.attachment = args.attachments.map((a) => ({
      name: a.filename,
      content: toBase64(a.content)
    }));
  }
  if (args.tags?.length) {
    body.tags = args.tags.map((t) => `${t.name}:${t.value}`);
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Brevo error ${res.status}: ${txt}`);
  }
  const data = (await res.json().catch(() => ({}))) as { messageId?: string };
  return data.messageId ?? '';
}
