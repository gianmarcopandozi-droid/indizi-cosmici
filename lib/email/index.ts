/**
 * Email wrapper provider-agnostic.
 * Priorità: Brevo → Resend → devmode (file system).
 * Swap di provider = solo questo file + l'adapter, zero call site da toccare.
 */
import { sendViaBrevo, isBrevoConfigured } from './brevo';
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
  provider: 'brevo' | 'resend' | 'devmode';
}

export async function sendTransactional(args: SendArgs): Promise<SendResult> {
  if (isBrevoConfigured()) {
    const id = await sendViaBrevo(args);
    return { id, provider: 'brevo' };
  }
  if (isResendConfigured()) {
    const id = await sendViaResend(args);
    return { id, provider: 'resend' };
  }
  // Fallback: scrivi su file system
  const id = await writeDevEmail(args);
  return { id, provider: 'devmode' };
}
