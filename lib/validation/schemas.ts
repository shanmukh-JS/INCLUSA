import { z } from 'zod';

// ─── Analyze API ─────────────────────────────────────────────────────────────

export const analyzeRequestSchema = z.object({
  inputType: z.enum(['pdf', 'image', 'docx', 'txt', 'audio', 'video', 'url', 'text']),
  title: z.string().max(500).optional(),
  fileName: z.string().max(500).optional(),
  rawText: z.string().optional(),
  fileDataUrl: z.string().optional(),
  url: z.string().url('Invalid URL format').optional(),
  fileSizeBytes: z.number().int().nonnegative().optional(),
  profile: z.any().optional(),
});

// ─── Transform API ───────────────────────────────────────────────────────────

export const transformRequestSchema = z.object({
  structuredContent: z.object({}).passthrough().refine((val) => val !== null && val !== undefined, {
    message: 'structuredContent is required',
  }),
  transformations: z.array(z.any()).min(1, 'At least one transformation is required'),
  profile: z.any().optional(),
});

// ─── Chat API ────────────────────────────────────────────────────────────────

export const chatRequestSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(5000, 'Question is too long (max 5000 chars)'),
  documentTitle: z.string().max(500).optional(),
  documentText: z.string().min(1, 'Document text is required for context'),
  chatHistory: z.array(z.object({
    role: z.string().optional(),
    sender: z.string().optional(),
    content: z.string(),
  })).optional(),
});

// ─── Verify API ──────────────────────────────────────────────────────────────

export const verifyRequestSchema = z.object({
  documentId: z.string().min(1, 'documentId is required'),
  initialIssues: z.array(z.any()),
  transformations: z.array(z.any()),
  transformedOutput: z.object({}).passthrough().refine((val) => val !== null && val !== undefined, {
    message: 'transformedOutput is required',
  }),
  profile: z.any().optional(),
});

// ─── TTS API ─────────────────────────────────────────────────────────────────

export const ttsRequestSchema = z.object({
  text: z.string().min(1, 'Text is required for speech synthesis').max(10000, 'Text too long (max 10,000 chars)'),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('alloy'),
  speed: z.number().min(0.25).max(4.0).default(1.0),
});

// ─── Website Audit API ───────────────────────────────────────────────────────

export const websiteAuditRequestSchema = z.object({
  url: z.string().min(1, 'URL is required').refine(
    (val) => {
      try {
        const url = new URL(val.startsWith('http') ? val : `https://${val}`);
        return ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL format. Must be a valid HTTP or HTTPS URL.' }
  ),
});

// ─── Reports API ─────────────────────────────────────────────────────────────

export const createReportRequestSchema = z.object({
  documentId: z.string().min(1, 'documentId is required'),
  title: z.string().min(1).max(500).optional(),
  executiveSummary: z.string().optional(),
  initialScore: z.number().int().min(0).max(100),
  finalScore: z.number().int().min(0).max(100),
  reportPayload: z.object({}).passthrough(),
});

// ─── Profile API ─────────────────────────────────────────────────────────────

export const createProfileRequestSchema = z.object({
  name: z.string().min(1, 'Profile name is required').max(100),
  isDefault: z.boolean().default(false),
  vision: z.object({}).passthrough().optional(),
  hearing: z.object({}).passthrough().optional(),
  cognitive: z.object({}).passthrough().optional(),
  language: z.object({}).passthrough().optional(),
  output: z.object({}).passthrough().optional(),
});

export const updateProfileRequestSchema = createProfileRequestSchema.partial();

// ─── History API ─────────────────────────────────────────────────────────────

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  id: z.string().optional(),
});

// ─── Type exports ────────────────────────────────────────────────────────────

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type TransformRequest = z.infer<typeof transformRequestSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type VerifyRequest = z.infer<typeof verifyRequestSchema>;
export type TtsRequest = z.infer<typeof ttsRequestSchema>;
export type WebsiteAuditRequest = z.infer<typeof websiteAuditRequestSchema>;
export type CreateReportRequest = z.infer<typeof createReportRequestSchema>;
export type CreateProfileRequest = z.infer<typeof createProfileRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type HistoryQuery = z.infer<typeof historyQuerySchema>;
