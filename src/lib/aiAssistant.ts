import { isSupabaseConfigured, supabase } from './supabaseClient';

type AssistantMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const FALLBACK_ERROR = 'Sorry, the assistant is unavailable right now. Please try again soon.';
const TIMEOUT_ERROR = 'Sorry, the assistant is taking too long. Please try again.';

export async function sendAssistantMessage(messages: AssistantMessage[]): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(FALLBACK_ERROR);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 30000);

  try {
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { messages },
      signal: controller.signal,
    });

    if (error) {
      throw new Error(FALLBACK_ERROR);
    }

    const reply = (data as { reply?: string } | null)?.reply;
    if (!reply) {
      throw new Error(FALLBACK_ERROR);
    }

    return reply;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(TIMEOUT_ERROR);
    }

    if (err instanceof Error && err.message) {
      throw err;
    }

    throw new Error(FALLBACK_ERROR);
  } finally {
    window.clearTimeout(timeoutId);
  }
}
