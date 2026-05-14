import { Resend } from 'resend';
import type { SendArgs } from './index';

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendViaResend(args: SendArgs): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY mancante');
  const from = process.env.EMAIL_FROM || 'Indizi Cosmici <onboarding@resend.dev>';

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    attachments: args.attachments?.map(a => ({
      filename: a.filename,
      content: typeof a.content === 'string' ? a.content : a.content
    })),
    tags: args.tags
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return data?.id ?? '';
}
