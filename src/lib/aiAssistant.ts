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

    if (import.meta.env.DEV) {
      console.log('ai-assistant data', data);
      console.log('ai-assistant error', error);
    }

    if (error) {
      throw new Error(FALLBACK_ERROR);
    }

    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data === 'object') {
      const response = data as { ok?: boolean; error?: string; text?: string; message?: string };

      if (response.ok === false) {
        throw new Error(response.error || 'Assistant error');
      }

      if (typeof response.text === 'string') {
        return response.text;
      }

      if (typeof response.message === 'string') {
        return response.message;
      }
    }

    throw new Error('Unexpected response from assistant');
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
