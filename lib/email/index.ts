/**
 * Email wrapper provider-agnostic.
 * Oggi: Resend.
 * Domani: swappa lib/email/resend.ts con brevo.ts senza toccare i call site.
 */
import { sendViaResend, isResendConfigured } from './resend';
import { writeDevEmail } from './devmode';

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{ filename: string; content: Buffer | string }>;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendResult {
  id: string;
  provider: 'resend' | 'devmode';
}

export async function sendTransactional(args: SendArgs): Promise<SendResult> {
  if (isResendConfigured()) {
    const id = await sendViaResend(args);
    return { id, provider: 'resend' };
  }
  // Fallback: scrivi su file system
  const id = await writeDevEmail(args);
  return { id, provider: 'devmode' };
}
