import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createFallbackQuery<T>(data: T | null = null) {
  const result = Promise.resolve({
    data,
    error: {
      message:
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.',
    },
  });

  return {
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
    order: () => createFallbackQuery<T>(data),
    eq: () => createFallbackQuery<T>(data),
    maybeSingle: () => createFallbackQuery<T>(data),
  };
}

function createFallbackSupabaseClient() {
  return {
    from(_table: string) {
      return {
        select: (_columns?: string) => createFallbackQuery(),
        insert: async (_values: Record<string, unknown>) => ({
          error: {
            message:
              'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.',
          },
        }),
      };
    },
  };
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabaseClient();

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
};

export type Exhibition = {
  id: string;
  title: string;
  date: string | null;
  status: string;
  description: string;
};

export type Inquiry = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
