import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendAssistantMessage } from '@/lib/aiAssistant';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

interface Message {
  text: string;
  isUser: boolean;
}

interface AssistantMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'eaw_assistant_history';
const LEAD_SUBMITTED_KEY = 'eaw_chat_lead_submitted';
const DEFAULT_ASSISTANT_MESSAGE: AssistantMessage = {
  role: 'assistant',
  content: "Hi! I'm the Elevated AI Works Assistant. How can I help you today?",
};
const SYSTEM_MESSAGE: AssistantMessage = {
  role: 'system',
  content:
    'You are the Elevated AI Works assistant. Keep responses concise, friendly, and helpful. Never invent prices. You may only mention these ranges exactly: Branding $25–$150 (one-time), Websites $150–$2,000 (one-time), Systems & Docs $50–$500 (one-time), AI Tools $300–$1,000 (one-time), Analytics $50–$500 (one-time), SEO $25–$100/month, Maintenance $25–$200/month. If scope is unclear, provide the correct range and say "final quote after a quick consult." Encourage booking a consultation and ask clarifying questions to move projects forward.',
};

type LeadCapture = {
  name: string;
  email: string;
  business: string;
  service_interest: string;
  estimated_range: string;
  timeline: string;
  notes: string;
};

const LEAD_CAPTURE_MARKER = 'LEAD_CAPTURE:';
const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_CHAT_LEADS_ENDPOINT;

const extractLeadCapture = (text: string) => {
  const markerIndex = text.indexOf(LEAD_CAPTURE_MARKER);
  if (markerIndex === -1) {
    return { displayText: text.trim(), lead: null as LeadCapture | null };
  }

  const displayText = text.slice(0, markerIndex).trim();
  const leadBlock = text.slice(markerIndex + LEAD_CAPTURE_MARKER.length).trim();
  const lead: Partial<LeadCapture> = {};

  leadBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [rawKey, ...rest] = line.split('=');
      if (!rawKey || rest.length === 0) {
        return;
      }
      const key = rawKey.trim();
      const value = rest.join('=').trim();
      if (
        key === 'name' ||
        key === 'email' ||
        key === 'business' ||
        key === 'service_interest' ||
        key === 'estimated_range' ||
        key === 'timeline' ||
        key === 'notes'
      ) {
        lead[key] = value;
      }
    });

  const normalizedLead: LeadCapture = {
    name: lead.name ?? '',
    email: lead.email ?? '',
    business: lead.business ?? '',
    service_interest: lead.service_interest ?? '',
    estimated_range: lead.estimated_range ?? '',
    timeline: lead.timeline ?? '',
    notes: lead.notes ?? '',
  };

  return {
    displayText: displayText || 'Thanks! I have the details I need.',
    lead: normalizedLead,
  };
};

const submitLeadCapture = async (lead: LeadCapture) => {
  if (typeof window === 'undefined') {
    return 'failed';
  }

  if (sessionStorage.getItem(LEAD_SUBMITTED_KEY) === '1') {
    return 'skipped';
  }

  if (!formspreeEndpoint) {
    return 'failed';
  }

  try {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: 'EAW Chat Lead — Quote Request',
        _replyto: lead.email,
        type: 'chat_lead',
        name: lead.name,
        email: lead.email,
        business: lead.business,
        service_interest: lead.service_interest,
        estimated_range: lead.estimated_range,
        timeline: lead.timeline,
        notes: lead.notes,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      return 'failed';
    }

    sessionStorage.setItem(LEAD_SUBMITTED_KEY, '1');
    return 'success';
  } catch {
    return 'failed';
  }
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
    const sanitized = parsed.filter(
      (message): message is AssistantMessage =>
        message &&
        typeof message.content === 'string' &&
        (message.role === 'user' || message.role === 'assistant'),
    );
    return sanitized.length > 0 ? sanitized : [DEFAULT_ASSISTANT_MESSAGE];
  } catch {
    return [DEFAULT_ASSISTANT_MESSAGE];
  }
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<AssistantMessage[]>(() => loadHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantUnavailable = !isSupabaseConfigured;
  const messages: Message[] = history
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      text: message.content,
      isUser: message.role === 'user',
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

    if (assistantUnavailable) {
      setErrorMessage('Assistant unavailable right now.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    const nextHistory = [...history, { role: 'user', content: userMessage }];
    setHistory(nextHistory);

    try {
      const assistantResponse = await sendAssistantMessage([SYSTEM_MESSAGE, ...nextHistory]);
      const { displayText, lead } = extractLeadCapture(assistantResponse);
      setHistory((prev) => [...prev, { role: 'assistant', content: displayText }]);

      if (lead) {
        const leadResult = await submitLeadCapture(lead);
        if (leadResult === 'success') {
          setHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Thanks! Your details are in—our team will follow up shortly.',
            },
          ]);
        } else if (leadResult === 'failed') {
          setHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Couldn’t submit right now—please use the Contact page.',
            },
          ]);
        }
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
                  {message.text}
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
