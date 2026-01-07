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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

const extractLeadFromMessages = (messages: AssistantMessage[]): Lead | null => {
  const userMessages = messages.filter((message) => message.role === 'user');
  const combined = userMessages.map((message) => message.content).join(' ');
  const emailMatch = combined.match(EMAIL_REGEX);
  if (!emailMatch || !hasQuoteIntent(combined)) {
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
    notes = extractLabeledValue(text, 'notes') ?? notes;
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
    const lead = extractLeadFromMessages(messages);

    return Response.json({ ok: true, text, lead }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    return Response.json({ ok: false, error: message }, { status: 500, headers: corsHeaders });
  }
});
