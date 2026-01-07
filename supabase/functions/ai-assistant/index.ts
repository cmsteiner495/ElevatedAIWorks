import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type AssistantMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are the Elevated AI Works assistant. Keep responses concise, friendly, and helpful.
Never invent prices. You may ONLY mention the following ranges exactly:
- Branding: $25–$150 (one-time)
- Websites: $150–$2,000 (one-time)
- Systems & Docs: $50–$500 (one-time)
- AI Tools: $300–$1,000 (one-time)
- Analytics: $50–$500 (one-time)
- SEO: $25–$100/month
- Maintenance: $25–$200/month
If scope is unclear, provide the correct range and say "final quote after a quick consult."
When the user wants a quote OR after collecting enough details, append a structured block exactly like:

LEAD_CAPTURE:
name=...
email=...
business=...
service_interest=...
estimated_range=...
timeline=...
notes=...`;

const buildMessages = (messages: AssistantMessage[]) => {
  const filtered = messages.filter((message) => message.role !== 'system');
  return [{ role: 'system', content: SYSTEM_PROMPT }, ...filtered];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAiKey) {
    return Response.json(
      { ok: false, error: 'Missing OPENAI_API_KEY.' },
      { status: 500, headers: corsHeaders },
    );
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? (body.messages as AssistantMessage[]) : [];
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: buildMessages(messages),
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { ok: false, error: errorText || 'OpenAI request failed.' },
        { status: 500, headers: corsHeaders },
      );
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() ?? '';

    return Response.json({ ok: true, text }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    return Response.json({ ok: false, error: message }, { status: 500, headers: corsHeaders });
  }
});
