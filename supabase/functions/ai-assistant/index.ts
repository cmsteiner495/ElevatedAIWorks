import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type AssistantMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type LeadService =
  | 'Branding'
  | 'Websites'
  | 'Systems & Docs'
  | 'AI Tools'
  | 'SEO'
  | 'Analytics'
  | 'Maintenance';

type Lead = {
  name?: string;
  email: string;
  service?: LeadService;
  budget?: string;
  timeline?: string;
  notes?: string;
  source: 'ai-assistant';
  pageUrl?: string;
  createdAt: string;
};

const ALLOWED_ORIGINS = new Set([
  'https://elevatedaiworks.com',
  'https://www.elevatedaiworks.com',
]);

const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
];

const isAllowedOrigin = (origin: string | null): origin is string => {
  if (!origin) {
    return false;
  }

  if (ALLOWED_ORIGINS.has(origin)) {
    return true;
  }

  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
};

const buildCorsHeaders = (
  origin: string | null,
  allowOrigin: boolean,
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };

  if (origin && allowOrigin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
};

const PRICING_TRUTH_MAP: Record<LeadService, string> = {
  Branding: '$25–$150',
  Websites: '$150–$2,000',
  'Systems & Docs': '$50–$500',
  'AI Tools': '$300–$1,000',
  SEO: '$25–$100/month',
  Analytics: '$50–$500',
  Maintenance: '$25–$200/month',
};

const SYSTEM_PROMPT = `You are the Elevated AI Works assistant. Keep responses concise, friendly, and helpful.
Never invent prices. You may ONLY mention the following ranges exactly:
- Branding: ${PRICING_TRUTH_MAP.Branding}
- Websites: ${PRICING_TRUTH_MAP.Websites}
- Systems & Docs: ${PRICING_TRUTH_MAP['Systems & Docs']}
- AI Tools: ${PRICING_TRUTH_MAP['AI Tools']}
- Analytics: ${PRICING_TRUTH_MAP.Analytics}
- SEO: ${PRICING_TRUTH_MAP.SEO}
- Maintenance: ${PRICING_TRUTH_MAP.Maintenance}
If scope is unclear, ask which service card they mean before quoting. If budget is outside the range, respond politely and suggest booking a consult.
If the user provides an email but is missing name/service/budget/timeline, ask follow-up questions (max 2 at a time).`;

const buildMessages = (messages: AssistantMessage[]) => {
  const filtered = messages.filter((message) => message.role !== 'system');
  return [{ role: 'system', content: SYSTEM_PROMPT }, ...filtered];
};

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const QUOTE_INTENT_KEYWORDS = [
  'quote',
  'price',
  'pricing',
  'how much',
  'budget',
  'estimate',
  'get a website',
  'branding',
  'seo',
  'ai tools',
  'analytics',
  'maintenance',
  'systems',
  'docs',
  'website',
  'websites',
];

const SERVICE_KEYWORDS: Record<LeadService, string[]> = {
  Branding: ['branding', 'brand'],
  Websites: ['website', 'web site', 'websites', 'site build'],
  'Systems & Docs': ['systems', 'docs', 'documentation', 'process'],
  'AI Tools': ['ai tool', 'ai tools', 'assistant', 'chatbot', 'automation'],
  SEO: ['seo', 'search'],
  Analytics: ['analytics', 'tracking', 'insights'],
  Maintenance: ['maintenance', 'support', 'updates'],
};

const detectService = (text: string): LeadService | undefined => {
  const lower = text.toLowerCase();
  return (Object.keys(SERVICE_KEYWORDS) as LeadService[]).find((service) =>
    SERVICE_KEYWORDS[service].some((keyword) => lower.includes(keyword)),
  );
};

const extractLabeledValue = (text: string, label: string): string | undefined => {
  const pattern = new RegExp(`${label}\\s*[:=-]\\s*(.+)`, 'i');
  const match = text.match(pattern);
  if (match?.[1]) {
    return match[1].trim();
  }
  return undefined;
};

const extractTimeline = (text: string): string | undefined => {
  const labeled = extractLabeledValue(text, 'timeline');
  if (labeled) {
    return labeled;
  }
  const match = text.match(/(?:in|within)\s+(\d+\s*(?:days?|weeks?|months?))/i);
  return match?.[1]?.trim();
};

const extractBudget = (text: string): string | undefined => {
  const labeled = extractLabeledValue(text, 'budget');
  if (labeled) {
    return labeled;
  }
  const match = text.match(/\$\s?\d[\d,]*(?:\.\d{1,2})?/);
  return match?.[0]?.replace(/\s+/g, '');
};

const extractName = (text: string): string | undefined => {
  const labeled = extractLabeledValue(text, 'name');
  if (labeled) {
    return labeled;
  }
  const match = text.match(/(?:i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  return match?.[1]?.trim();
};

const hasQuoteIntent = (text: string): boolean => {
  const lower = text.toLowerCase();
  return QUOTE_INTENT_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const extractDetails = (text: string): string | undefined => {
  return (
    extractLabeledValue(text, 'details') ??
    extractLabeledValue(text, 'message') ??
    extractLabeledValue(text, 'notes')
  );
};

const extractLeadFromMessages = (messages: AssistantMessage[]): Lead | null => {
  const userMessages = messages.filter((message) => message.role === 'user');
  const combined = userMessages.map((message) => message.content).join(' ');
  const emailMatch = combined.match(EMAIL_REGEX);
  if (!emailMatch) {
    return null;
  }

  let name: string | undefined;
  let service: LeadService | undefined;
  let budget: string | undefined;
  let timeline: string | undefined;
  let notes: string | undefined;

  for (const message of userMessages) {
    const text = message.content;
    name = extractName(text) ?? name;
    service = detectService(text) ?? service;
    budget = extractBudget(text) ?? budget;
    timeline = extractTimeline(text) ?? timeline;
    notes = extractDetails(text) ?? notes;
  }

  const hasLeadSignals =
    Boolean(name || service || budget || timeline || notes) || hasQuoteIntent(combined);

  if (!hasLeadSignals) {
    return null;
  }

  return {
    name,
    email: emailMatch[0],
    service,
    budget,
    timeline,
    notes,
    source: 'ai-assistant',
    createdAt: new Date().toISOString(),
  };
};

serve(async (req) => {
  const origin = req.headers.get('Origin');
  console.log('ai-assistant origin', origin);
  const allowOrigin = isAllowedOrigin(origin);
  const corsHeaders = buildCorsHeaders(origin, allowOrigin);

  if (req.method === 'OPTIONS') {
    if (origin && !allowOrigin) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  if (origin && !allowOrigin) {
    return new Response('Forbidden', { status: 403, headers: corsHeaders });
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
    const pageUrl = typeof body?.pageUrl === 'string' ? body.pageUrl : undefined;
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
    const lead = extractLeadFromMessages(messages);
    const formspreeEndpoint = Deno.env.get('FORMSPREE_ENDPOINT');
    const isDev =
      Deno.env.get('SUPABASE_ENV') === 'local' || Deno.env.get('DENO_ENV') === 'development';
    let leadSent: boolean | undefined;
    let leadError: string | undefined;

    if (lead) {
      if (isDev) {
        console.log('ai-assistant lead detected', { email: lead.email, service: lead.service });
      }

      if (!formspreeEndpoint) {
        leadSent = false;
        leadError = 'Missing Formspree endpoint.';
      } else {
        try {
          const combinedUserText = messages
            .filter((message) => message.role === 'user')
            .map((message) => message.content)
            .join(' ')
            .trim();
          const payload = {
            name: lead.name,
            email: lead.email,
            service_interest: lead.service ?? 'General',
            budget: lead.budget,
            timeline: lead.timeline,
            message: lead.notes ?? combinedUserText,
            source: lead.source,
            page_url: pageUrl,
          };
          const leadResponse = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!leadResponse.ok) {
            const errorText = await leadResponse.text();
            leadSent = false;
            leadError = errorText ? errorText.slice(0, 120) : 'Formspree rejected the submission.';
          } else {
            leadSent = true;
          }
        } catch (error) {
          leadSent = false;
          leadError = error instanceof Error ? error.message : 'Formspree request failed.';
        }
      }

      if (isDev) {
        console.log('ai-assistant lead submission result', { leadSent, leadError });
      }
    }

    return Response.json(
      { ok: true, text, leadSent, leadError },
      { headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    return Response.json({ ok: false, error: message }, { status: 500, headers: corsHeaders });
  }
});
