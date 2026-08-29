/**
 * INCLUSA Typed API Client
 *
 * Centralized fetch wrapper for all API endpoints.
 * Auto-attaches auth tokens, handles errors, and provides type-safe responses.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{ path: string; message: string }>;
  message?: string;
  timestamp?: string;
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: any;
};

class InclusaApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  }

  /**
   * Get the auth token from the cookie or localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Try localStorage first
    try {
      const stored = localStorage.getItem('inclusa_verified_session_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) return parsed.token;
      }
    } catch {}

    // Fallback to cookie
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'inclusa_auth_token' && value) {
          return decodeURIComponent(value);
        }
      }
    } catch {}

    return null;
  }

  /**
   * Internal fetch wrapper with auth headers and error handling
   */
  private async request<T = any>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Handle non-JSON responses (e.g., audio from TTS)
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        if (response.ok) {
          const blob = await response.blob();
          return { success: true, data: blob as any };
        }
        return { success: false, error: `Request failed with status ${response.status}` };
      }

      const json = await response.json();
      return json;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error — please check your connection.',
      };
    }
  }

  // ─── Analysis Pipeline ─────────────────────────────────────────

  /**
   * Run accessibility analysis on a document
   */
  async analyze(payload: {
    inputType: string;
    title?: string;
    fileName?: string;
    rawText?: string;
    url?: string;
    fileSizeBytes?: number;
    profile?: any;
  }) {
    return this.request('/api/analyze', { method: 'POST', body: payload });
  }

  /**
   * Transform document based on accessibility requirements
   */
  async transform(payload: {
    structuredContent: any;
    transformations: any[];
    profile?: any;
  }) {
    return this.request('/api/transform', { method: 'POST', body: payload });
  }

  /**
   * Verify transformations and generate explanation
   */
  async verify(payload: {
    documentId: string;
    initialIssues: any[];
    transformations: any[];
    transformedOutput: any;
    profile?: any;
  }) {
    return this.request('/api/verify', { method: 'POST', body: payload });
  }

  // ─── Chat ──────────────────────────────────────────────────────

  /**
   * Ask a question about an analyzed document
   */
  async chat(payload: {
    question: string;
    documentTitle?: string;
    documentText: string;
    chatHistory?: Array<{ sender: string; content: string }>;
  }) {
    return this.request('/api/chat', { method: 'POST', body: payload });
  }

  // ─── Text-to-Speech ────────────────────────────────────────────

  /**
   * Generate speech from text
   */
  async tts(payload: {
    text: string;
    voice?: string;
    speed?: number;
  }) {
    return this.request('/api/tts', { method: 'POST', body: payload });
  }

  // ─── Website Audit ─────────────────────────────────────────────

  /**
   * Audit a website for accessibility issues
   */
  async auditWebsite(url: string) {
    return this.request('/api/website-audit', { method: 'POST', body: { url } });
  }

  // ─── Documents ─────────────────────────────────────────────────

  /**
   * Get all documents for the authenticated user
   */
  async getDocuments() {
    return this.request('/api/documents', { method: 'GET' });
  }

  /**
   * Save a document/analysis
   */
  async saveDocument(doc: any) {
    return this.request('/api/documents', { method: 'POST', body: doc });
  }

  /**
   * Delete a document by ID
   */
  async deleteDocument(id: string) {
    return this.request(`/api/documents?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  // ─── History ───────────────────────────────────────────────────

  /**
   * Get analysis history with pagination
   */
  async getHistory(page: number = 1, limit: number = 10) {
    return this.request(`/api/history?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  /**
   * Get a single analysis by ID
   */
  async getAnalysisById(id: string) {
    return this.request(`/api/history?id=${encodeURIComponent(id)}`, { method: 'GET' });
  }

  // ─── Reports ───────────────────────────────────────────────────

  /**
   * Get all reports
   */
  async getReports() {
    return this.request('/api/reports', { method: 'GET' });
  }

  /**
   * Create a new report
   */
  async createReport(payload: {
    documentId: string;
    title?: string;
    executiveSummary?: string;
    initialScore: number;
    finalScore: number;
    reportPayload: any;
  }) {
    return this.request('/api/reports', { method: 'POST', body: payload });
  }

  /**
   * Delete a report by ID
   */
  async deleteReport(id: string) {
    return this.request(`/api/reports?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  // ─── Profiles ──────────────────────────────────────────────────

  /**
   * Get all accessibility profiles
   */
  async getProfiles() {
    return this.request('/api/profile', { method: 'GET' });
  }

  /**
   * Create a new accessibility profile
   */
  async createProfile(payload: {
    name: string;
    isDefault?: boolean;
    vision?: any;
    hearing?: any;
    cognitive?: any;
    language?: any;
    output?: any;
  }) {
    return this.request('/api/profile', { method: 'POST', body: payload });
  }

  /**
   * Delete a profile by ID
   */
  async deleteProfile(id: string) {
    return this.request(`/api/profile?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
}

// Export singleton
export const api = new InclusaApiClient();
