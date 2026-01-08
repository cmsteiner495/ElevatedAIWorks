import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendAssistantMessage } from '@/lib/aiAssistant';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

interface Message {
  text: string;
  isUser: boolean;
  bullets?: string[];
  cta?: {
    label: string;
    to: string;
  };
}

interface AssistantMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  bullets?: string[];
  cta?: {
    label: string;
    to: string;
  };
}

const STORAGE_KEY = 'eaw_assistant_history';
const DEFAULT_ASSISTANT_MESSAGE: AssistantMessage = {
  role: 'assistant',
  content: "Hi! I'm the Elevated AI Works Assistant. How can I help you today?",
};
const SYSTEM_MESSAGE: AssistantMessage = {
  role: 'system',
  content:
    'You are the Elevated AI Works assistant. Keep responses concise, friendly, and helpful. Never invent prices. You may only mention these ranges exactly: Branding $25–$150 (one-time), Websites $150–$2,000 (one-time), Systems & Docs $50–$500 (one-time), AI Tools $300–$1,000 (one-time), Analytics $50–$500 (one-time), SEO $25–$100/month, Maintenance $25–$200/month. If scope is unclear, provide the correct range and say "final quote after a quick consult." Encourage booking a consultation and ask clarifying questions to move projects forward.',
};

type QuoteCategory =
  | 'Branding'
  | 'Websites'
  | 'Systems & Docs'
  | 'AI Tools'
  | 'SEO'
  | 'Analytics'
  | 'Maintenance';

const QUOTE_DETAILS: Record<
  QuoteCategory,
  {
    range: string;
    bullets: string[];
  }
> = {
  Branding: {
    range: '$25–$150',
    bullets: ['Logo complexity and variations', 'Brand guidelines depth', 'Number of revision rounds'],
  },
  Websites: {
    range: '$150–$2,000',
    bullets: ['Number of pages and sections', 'Integrations (forms, booking, ecommerce)', 'Content readiness'],
  },
  'Systems & Docs': {
    range: '$50–$500',
    bullets: ['Workflow complexity', 'Number of templates or documents', 'Level of automation needed'],
  },
  'AI Tools': {
    range: '$300–$1,000',
    bullets: ['Scope of automation', 'Data sources and integrations', 'Model tuning or prompt complexity'],
  },
  SEO: {
    range: '$25–$100/month',
    bullets: ['Keyword competitiveness', 'Number of pages to optimize', 'Ongoing reporting cadence'],
  },
  Analytics: {
    range: '$50–$500',
    bullets: ['Tracking plan complexity', 'Event and conversion setup', 'Dashboard/reporting needs'],
  },
  Maintenance: {
    range: '$25–$200/month',
    bullets: ['Update frequency', 'Monitoring and backups', 'Support response time'],
  },
};

const QUOTE_INTENT_KEYWORDS = [
  'quote',
  'estimate',
  'pricing',
  'price',
  'how much',
  'cost',
  'budget',
  'start a project',
  'hire',
  'consult',
  'proposal',
];

const CATEGORY_KEYWORDS: Array<{ category: QuoteCategory; keywords: string[] }> = [
  { category: 'Branding', keywords: ['logo', 'brand', 'branding'] },
  { category: 'Websites', keywords: ['website', 'site', 'web page', 'landing page'] },
  { category: 'SEO', keywords: ['seo', 'rank', 'google'] },
  { category: 'Maintenance', keywords: ['maintenance', 'updates', 'ongoing'] },
  { category: 'Systems & Docs', keywords: ['automation', 'templates', 'workflow', 'docs'] },
  { category: 'AI Tools', keywords: ['chatbot', 'ai', 'assistant', 'integration'] },
  { category: 'Analytics', keywords: ['analytics', 'ga4', 'tracking', 'events'] },
];

const CONTACT_CTA = {
  label: 'Go to Contact',
  to: '/contact',
};

const loadHistory = (): AssistantMessage[] => {
  if (typeof window === 'undefined') {
    return [DEFAULT_ASSISTANT_MESSAGE];
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [DEFAULT_ASSISTANT_MESSAGE];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [DEFAULT_ASSISTANT_MESSAGE];
    }
    const sanitized = parsed.filter((message): message is AssistantMessage => {
      if (
        !message ||
        typeof message.content !== 'string' ||
        (message.role !== 'user' && message.role !== 'assistant')
      ) {
        return false;
      }
      if (
        message.bullets &&
        (!Array.isArray(message.bullets) || message.bullets.some((item: unknown) => typeof item !== 'string'))
      ) {
        return false;
      }
      if (
        message.cta &&
        (typeof message.cta !== 'object' ||
          typeof message.cta.label !== 'string' ||
          typeof message.cta.to !== 'string')
      ) {
        return false;
      }
      return true;
    });
    return sanitized.length > 0 ? sanitized : [DEFAULT_ASSISTANT_MESSAGE];
  } catch {
    return [DEFAULT_ASSISTANT_MESSAGE];
  }
};

const normalizeMessage = (message: string) => message.toLowerCase();

const hasQuoteIntent = (message: string) => {
  const normalized = normalizeMessage(message);
  return QUOTE_INTENT_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const classifyCategory = (message: string): QuoteCategory | null => {
  const normalized = normalizeMessage(message);
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return null;
};

const hasPersonalInfo = (message: string) => {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phoneRegex = /(?:\+?\d[\s\-().]*){7,}\d/;
  const addressRegex = /\b\d{1,5}\s+\w+(\s+\w+){0,3}\s+(street|st|road|rd|avenue|ave|boulevard|blvd|drive|dr|lane|ln|court|ct)\b/i;
  return emailRegex.test(message) || phoneRegex.test(message) || addressRegex.test(message);
};

const buildQuoteResponse = (category: QuoteCategory, requestExact: boolean) => {
  const details = QUOTE_DETAILS[category];
  const exactNote = requestExact
    ? 'Exact pricing depends on scope, so the final quote comes after a quick consult.'
    : 'Final pricing comes after a quick consult to confirm scope.';
  return {
    content: `Thanks for reaching out! For ${category}, our rough range is ${details.range}. ${exactNote}`,
    bullets: details.bullets,
  };
};

const isExactPriceRequest = (message: string) => {
  const normalized = normalizeMessage(message);
  return ['exact', 'precise', 'fixed price', 'final price', 'guaranteed'].some((keyword) =>
    normalized.includes(keyword),
  );
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<AssistantMessage[]>(() => loadHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingQuoteCategory, setPendingQuoteCategory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantUnavailable = !isSupabaseConfigured;
  const messages: Message[] = history
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      text: message.content,
      isUser: message.role === 'user',
      bullets: message.bullets,
      cta: message.cta,
    }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    const nextHistory = [...history, { role: 'user', content: userMessage }];
    setHistory(nextHistory);

    if (hasPersonalInfo(userMessage)) {
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'For privacy, please use our Contact form to share personal details.',
          cta: CONTACT_CTA,
        },
      ]);
      setPendingQuoteCategory(false);
      setIsLoading(false);
      return;
    }

    if (pendingQuoteCategory) {
      const category = classifyCategory(userMessage);
      if (category) {
        const response = buildQuoteResponse(category, isExactPriceRequest(userMessage));
        setHistory((prev) => [
          ...prev,
          { role: 'assistant', content: response.content, bullets: response.bullets, cta: CONTACT_CTA },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Thanks! I can share a range once I know the service category. For a precise quote, please use our Contact form.',
            cta: CONTACT_CTA,
          },
        ]);
      }
      setPendingQuoteCategory(false);
      setIsLoading(false);
      return;
    }

    const quoteIntent = hasQuoteIntent(userMessage);
    if (quoteIntent) {
      const category = classifyCategory(userMessage);
      if (category) {
        const response = buildQuoteResponse(category, isExactPriceRequest(userMessage));
        setHistory((prev) => [
          ...prev,
          { role: 'assistant', content: response.content, bullets: response.bullets, cta: CONTACT_CTA },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Which are you looking for — a Website, Branding, SEO, Maintenance, Systems & Docs, AI Tools, or Analytics?',
          },
        ]);
        setPendingQuoteCategory(true);
      }
      setIsLoading(false);
      return;
    }

    if (assistantUnavailable) {
      setErrorMessage('Assistant unavailable right now.');
      setIsLoading(false);
      return;
    }

    try {
      const assistantResponse = await sendAssistantMessage(
        [SYSTEM_MESSAGE, ...nextHistory],
        typeof window !== 'undefined' ? window.location.href : undefined,
      );
      const displayText = assistantResponse.text.trim();
      setHistory((prev) => [...prev, { role: 'assistant', content: displayText }]);

      if (import.meta.env.DEV && assistantResponse.leadSent !== undefined) {
        console.debug('ai-assistant lead status', {
          leadSent: assistantResponse.leadSent,
          leadError: assistantResponse.leadError,
        });
      }

      if (assistantResponse.leadSent === true) {
        setHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              '✅ Got it — I’ve sent your details to Elevated AI Works. We’ll reach out shortly.',
          },
        ]);
      } else if (assistantResponse.leadSent === false && assistantResponse.leadError) {
        setHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I couldn’t send your details automatically. Please use the Contact page.',
          },
        ]);
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Assistant unavailable right now.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 btn-glow ${isOpen ? 'rotate-0' : ''}`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X size={24} className="sm:w-7 sm:h-7" />
        ) : (
          <MessageCircle size={24} className="sm:w-7 sm:h-7" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] h-[60vh] sm:h-[500px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-xl sm:rounded-2xl shadow-2xl flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-secondary/50">
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-foreground text-sm sm:text-base truncate">
                Elevated AI Works Assistant
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs"
              disabled={isLoading}
              onClick={() => {
                setHistory([DEFAULT_ASSISTANT_MESSAGE]);
                setErrorMessage(null);
                setPendingQuoteCategory(false);
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem(STORAGE_KEY);
                }
              }}
            >
              Clear chat
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-secondary-foreground rounded-bl-md'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.bullets && message.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {message.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  {message.cta && !message.isUser && (
                    <div className="mt-3">
                      <Button asChild size="sm" variant="hero">
                        <Link to={message.cta.to}>{message.cta.label}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-border">
            {(assistantUnavailable || errorMessage) && (
              <p className="text-xs text-destructive mb-2">
                {assistantUnavailable ? 'Assistant unavailable right now.' : errorMessage}
              </p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our services..."
                disabled={isLoading || assistantUnavailable}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-secondary border border-border rounded-lg sm:rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                variant="hero"
                className="rounded-lg sm:rounded-xl h-9 w-9 sm:h-10 sm:w-10"
                disabled={isLoading || assistantUnavailable || !input.trim()}
              >
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
