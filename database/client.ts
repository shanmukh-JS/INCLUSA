export interface SupabaseClientInterface {
  from(table: string): any;
  storage: {
    from(bucket: string): {
      upload(path: string, file: any, options?: any): Promise<{ data: any; error: any }>;
      getPublicUrl(path: string): { data: { publicUrl: string } };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: any = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
}

export function getSupabaseClient(): SupabaseClientInterface | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      // Dynamic require or import to be resilient across all environments
      const { createClient } = require('@supabase/supabase-js');
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Supabase SDK initialization deferred:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function getSupabaseAdminClient(): SupabaseClientInterface | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!supabaseUrl || !serviceKey || !supabaseUrl.startsWith('https://')) {
    return null;
  }
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    return null;
  }
}
