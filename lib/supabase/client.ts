/**
 * INCLUSA Supabase Production Client & Auth Provider
 * Lightweight, zero-external-dependency direct implementation of the Supabase Auth & PostgREST API.
 */

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  created_at?: string;
  app_metadata?: Record<string, any>;
  aud?: string;
  role?: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: SupabaseUser;
}

export interface SupabaseAuthResponse<T = any> {
  data: T | null;
  error: { message: string; status?: number } | null;
}

export class SupabaseRestClient {
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url.replace(/\/+$/, '');
    this.anonKey = anonKey;
  }

  public get auth() {
    return {
      signUp: async (credentials: {
        email: string;
        password?: string;
        options?: { data?: { full_name?: string } };
      }): Promise<SupabaseAuthResponse<{ user: SupabaseUser | null; session: SupabaseSession | null }>> => {
        try {
          const res = await fetch(`${this.url}/auth/v1/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: this.anonKey,
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              data: credentials.options?.data || {},
            }),
          });

          const json = await res.json();
          if (!res.ok) {
            return { data: null, error: { message: json.msg || json.error_description || json.message || 'Signup failed', status: res.status } };
          }

          return {
            data: {
              user: json.user || json,
              session: json.access_token
                ? {
                    access_token: json.access_token,
                    refresh_token: json.refresh_token,
                    expires_in: json.expires_in,
                    expires_at: Date.now() + (json.expires_in || 3600) * 1000,
                    user: json.user || json,
                  }
                : null,
            },
            error: null,
          };
        } catch (err: any) {
          return { data: null, error: { message: err.message || 'Network error during signup' } };
        }
      },

      signInWithPassword: async (credentials: {
        email: string;
        password?: string;
      }): Promise<SupabaseAuthResponse<{ user: SupabaseUser; session: SupabaseSession }>> => {
        try {
          const res = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: this.anonKey,
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const json = await res.json();
          if (!res.ok) {
            return {
              data: null,
              error: {
                message: json.error_description || json.msg || json.message || 'Invalid email or password',
                status: res.status,
              },
            };
          }

          const session: SupabaseSession = {
            access_token: json.access_token,
            refresh_token: json.refresh_token,
            expires_in: json.expires_in,
            expires_at: Date.now() + (json.expires_in || 3600) * 1000,
            user: json.user,
          };

          return {
            data: {
              user: json.user,
              session,
            },
            error: null,
          };
        } catch (err: any) {
          return { data: null, error: { message: err.message || 'Network error during sign in' } };
        }
      },

      resend: async (params: { type: string; email: string }): Promise<SupabaseAuthResponse<{ message?: string }>> => {
        try {
          const res = await fetch(`${this.url}/auth/v1/resend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: this.anonKey,
            },
            body: JSON.stringify({
              type: params.type || 'signup',
              email: params.email,
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            return {
              data: null,
              error: {
                message: json.error_description || json.msg || json.message || 'Failed to resend confirmation email',
                status: res.status,
              },
            };
          }
          return { data: { message: 'Confirmation email resent successfully' }, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message || 'Network error during resend' } };
        }
      },

      getUser: async (jwtToken?: string): Promise<SupabaseAuthResponse<{ user: SupabaseUser | null }>> => {
        if (!jwtToken) return { data: { user: null }, error: null };
        try {
          const res = await fetch(`${this.url}/auth/v1/user`, {
            method: 'GET',
            headers: {
              apikey: this.anonKey,
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          if (!res.ok) {
            return { data: { user: null }, error: { message: 'Invalid or expired token', status: res.status } };
          }

          const user = await res.json();
          return { data: { user }, error: null };
        } catch (err: any) {
          return { data: { user: null }, error: { message: err.message } };
        }
      },

      signOut: async (jwtToken?: string): Promise<SupabaseAuthResponse<void>> => {
        try {
          if (jwtToken) {
            await fetch(`${this.url}/auth/v1/logout`, {
              method: 'POST',
              headers: {
                apikey: this.anonKey,
                Authorization: `Bearer ${jwtToken}`,
              },
            });
          }
          return { data: undefined, error: null };
        } catch {
          return { data: undefined, error: null };
        }
      },

      resetPasswordForEmail: async (email: string): Promise<SupabaseAuthResponse<void>> => {
        try {
          const res = await fetch(`${this.url}/auth/v1/recover`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: this.anonKey,
            },
            body: JSON.stringify({ email }),
          });

          const json = await res.json();
          if (!res.ok) {
            return { data: null, error: { message: json.msg || json.message || 'Password reset request failed' } };
          }
          return { data: undefined, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err.message || 'Password reset error' } };
        }
      },
    };
  }

  public get storage() {
    return {
      from: (bucket: string) => ({
        upload: async (filePath: string, fileBlob: any, options?: any) => {
          try {
            const formData = new FormData();
            formData.append('file', fileBlob);
            const res = await fetch(`${this.url}/storage/v1/object/${bucket}/${filePath}`, {
              method: 'POST',
              headers: {
                apikey: this.anonKey,
                Authorization: `Bearer ${this.anonKey}`,
                ...(options?.contentType ? { 'Content-Type': options.contentType } : {}),
              },
              body: fileBlob,
            });
            const data = await res.json();
            return { data: { path: filePath, ...data }, error: res.ok ? null : data };
          } catch (err: any) {
            return { data: null, error: err };
          }
        },
        getPublicUrl: (filePath: string) => {
          return {
            data: {
              publicUrl: `${this.url}/storage/v1/object/public/${bucket}/${filePath}`,
            },
          };
        },
      }),
    };
  }

  public from(table: string) {
    const executeQuery = async (queryUrl: string) => {
      try {
        const res = await fetch(queryUrl, {
          headers: {
            apikey: this.anonKey,
            Authorization: `Bearer ${this.anonKey}`,
          },
        });
        const data = await res.json();
        return { data: Array.isArray(data) ? data : [], error: null };
      } catch (err: any) {
        return { data: [], error: err };
      }
    };

    return {
      select: (columns: string = '*') => {
        let currentUrl = `${this.url}/rest/v1/${table}?select=${encodeURIComponent(columns)}`;

        const builder: any = {
          then: (onfulfilled: any, onrejected: any) => {
            return executeQuery(currentUrl).then(onfulfilled, onrejected);
          },
          eq: (column: string, value: any) => {
            currentUrl += `&${column}=eq.${encodeURIComponent(value)}`;
            return builder;
          },
          order: (column: string, opts?: { ascending?: boolean }) => {
            const asc = opts?.ascending === false ? 'desc' : 'asc';
            currentUrl += `&order=${column}.${asc}`;
            return builder;
          },
          limit: (num: number) => {
            currentUrl += `&limit=${num}`;
            return builder;
          },
        };

        return builder;
      },

      insert: async (payload: any) => {
        try {
          const res = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: this.anonKey,
              Authorization: `Bearer ${this.anonKey}`,
              Prefer: 'return=representation',
            },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          return { data, error: res.ok ? null : data };
        } catch (err: any) {
          return { data: null, error: err };
        }
      },

      upsert: async (payload: any) => {
        try {
          const res = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: this.anonKey,
              Authorization: `Bearer ${this.anonKey}`,
              Prefer: 'resolution=merge-duplicates,return=representation',
            },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          return { data, error: res.ok ? null : data };
        } catch (err: any) {
          return { data: null, error: err };
        }
      },

      delete: () => ({
        eq: async (column: string, value: any) => {
          try {
            const res = await fetch(`${this.url}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`, {
              method: 'DELETE',
              headers: {
                apikey: this.anonKey,
                Authorization: `Bearer ${this.anonKey}`,
              },
            });
            return { error: res.ok ? null : { message: 'Delete failed' } };
          } catch (err: any) {
            return { error: err };
          }
        },
      }),
    };
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let clientSingleton: SupabaseRestClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
}

export function getSupabaseClient(): SupabaseRestClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientSingleton) {
    clientSingleton = new SupabaseRestClient(supabaseUrl, supabaseAnonKey);
  }
  return clientSingleton;
}

export function getSupabaseAdminClient(): SupabaseRestClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!supabaseUrl || !serviceKey || !supabaseUrl.startsWith('https://')) {
    return null;
  }
  return new SupabaseRestClient(supabaseUrl, serviceKey);
}
