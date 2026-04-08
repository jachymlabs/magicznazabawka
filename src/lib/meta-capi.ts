/**
 * Meta Conversions API (server-side) helper.
 * Sends events to Meta's Graph API for server-side tracking.
 *
 * IMPORTANT: META_CAPI_ACCESS_TOKEN must NEVER be exposed to the client.
 */

interface CAPIUserData {
  client_ip_address?: string;
  client_user_agent?: string;
  em?: string[]; // SHA-256 hashed email(s)
  ph?: string[]; // SHA-256 hashed phone(s)
}

interface CAPIEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: 'website';
  user_data: CAPIUserData;
  custom_data?: Record<string, any>;
}

/**
 * Hash a string with SHA-256 (for email/phone in user_data).
 * Normalizes: lowercase, trim whitespace.
 */
export async function sha256Hash(value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Send a single event to Meta Conversions API.
 * Silently fails if credentials are not configured.
 */
export async function sendCAPIEvent(event: CAPIEvent): Promise<void> {
  const token = (import.meta.env.META_CAPI_ACCESS_TOKEN || '').trim();
  const datasetId = (import.meta.env.META_DATASET_ID || '').trim();

  if (!token || !datasetId) return;

  try {
    await fetch(`https://graph.facebook.com/v21.0/${datasetId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [event],
        access_token: token,
      }),
    });
  } catch (err) {
    // Silently fail — do not block checkout/page render
    // Avoid logging full error object (may contain config details in PM2 logs)
  }
}

/**
 * Extract user data from Astro request for CAPI events.
 */
export function extractUserData(request: Request): Pick<CAPIUserData, 'client_ip_address' | 'client_user_agent'> {
  return {
    client_ip_address:
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      undefined,
    client_user_agent: request.headers.get('user-agent') || undefined,
  };
}
