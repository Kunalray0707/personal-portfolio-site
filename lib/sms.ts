import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM;

const client = accountSid && authToken ? Twilio(accountSid, authToken) : null;

export async function sendSms(to: string, body: string) {
  if (!client) {
    console.warn('Twilio not configured — skipping SMS. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to enable SMS.');
    return;
  }
  await client.messages.create({ body, from: fromNumber || undefined, to });
}
