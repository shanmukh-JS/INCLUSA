export type DisabilityCategory = 'vision' | 'hearing' | 'cognitive' | 'language' | 'motor';

export interface VisionPreferences {
  blind: boolean;
  lowVision: boolean;
  colorVisionDeficiency: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochromacy';
  highContrast: boolean;
  screenReaderUser: boolean;
  largeText: boolean;
}

export interface HearingPreferences {
  deaf: boolean;
  hardOfHearing: boolean;
  preferCaptions: boolean;
  preferTranscripts: boolean;
  preferVisualCues: boolean;
}

export interface CognitivePreferences {
  readingDifficulty: boolean;
  dyslexiaFriendly: boolean;
  simplifiedLanguage: boolean;
  shortSummaries: boolean;
  stepByStepExplanations: boolean;
  reduceClutter: boolean;
}

export interface LanguagePreferences {
  primaryLanguage: string; // e.g. 'en', 'te', 'hi', 'ta', 'kn', 'ml', 'bn', 'mr', 'es'
  secondaryLanguage?: string;
  autoTranslate: boolean;
  preserveTechnicalTerms: boolean;
}

export interface OutputPreferences {
  audioDescriptions: boolean;
  textSummaries: boolean;
  accessiblePdf: boolean;
  screenReaderOptimized: boolean;
  dyslexiaFormatted: boolean;
  includeCaptions: boolean;
}

export interface AccessibilityProfile {
  id: string;
  userId?: string;
  name: string;
  isDefault: boolean;
  vision: VisionPreferences;
  hearing: HearingPreferences;
  cognitive: CognitivePreferences;
  language: LanguagePreferences;
  output: OutputPreferences;
  createdAt: string;
  updatedAt: string;
}

export type DocumentInputType = 'pdf' | 'image' | 'docx' | 'txt' | 'audio' | 'video' | 'url' | 'text';

export type DocumentStatus = 'uploaded' | 'understanding' | 'auditing' | 'transforming' | 'verified' | 'completed' | 'error';

export interface ExtractedImage {
  id: string;
  pageNumber?: number;
  originalUrl?: string;
  altText?: string;
  detailedDescription?: string;
  simpleDescription?: string;
  screenReaderDescription?: string;
  isChartOrGraph: boolean;
  chartDataSummary?: string;
  hasExistingAlt: boolean;
}

export interface ExtractedTable {
  id: string;
  pageNumber?: number;
  headers: string[];
  rows: string[][];
  summary: string;
  hasHeaders: boolean;
  isComplex: boolean;
}

export interface ExtractedMedia {
  id: string;
  type: 'audio' | 'video';
  durationSeconds?: number;
  hasAudio: boolean;
  hasVideo: boolean;
  detectedSpeechLanguage?: string;
  transcript?: string;
  timedCaptions?: Array<{ start: number; end: number; text: string; speaker?: string }>;
}

export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'table' | 'code' | 'quote' | 'media';
  level?: number; // for headings 1..6
  text?: string;
  items?: string[]; // for lists
  imageId?: string;
  tableId?: string;
  mediaId?: string;
  pageNumber?: number;
  readingOrder: number;
}

export interface StructuredContent {
  id: string;
  inputType: DocumentInputType;
  title: string;
  originalFileName?: string;
  fileSizeBytes?: number;
  rawText: string;
  blocks: ContentBlock[];
  images: ExtractedImage[];
  tables: ExtractedTable[];
  media?: ExtractedMedia;
  pageCount: number;
  detectedLanguage: string;
  hasScannedPages: boolean;
  metadata: {
    author?: string;
    creationDate?: string;
    readingComplexityFleschKincaid?: number;
    wordCount: number;
    charCount: number;
  };
}

export type RuleCategory = 'vision' | 'hearing' | 'cognitive' | 'language' | 'structure' | 'screen_reader';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'passed';

export interface AccessibilityIssue {
  id: string;
  ruleId: string;
  category: RuleCategory;
  title: string;
  severity: SeverityLevel;
  location: string; // e.g. "Page 3, Image 2" or "Section 4"
  description: string;
  whyItMatters: string;
  whoIsAffected: string;
  recommendation: string;
  confidenceScore: number; // 0..100
  isFixableWithAi: boolean;
  isResolved?: boolean;
  resolvedByTransformation?: string;
}

export interface CategoryScores {
  vision: number; // 0..100
  hearing: number; // 0..100
  cognitive: number; // 0..100
  language: number; // 0..100
  structure: number; // 0..100
  screenReader: number; // 0..100
}

export interface AccessibilityScoreResult {
  overallScore: number; // 0..100
  status: 'Critical Barriers' | 'Needs Improvement' | 'Acceptable' | 'Highly Accessible';
  categories: CategoryScores;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  passedChecks: number;
  calculatedAt: string;
}

export interface TransformationItem {
  id: string;
  type:
    | 'image_descriptions'
    | 'simplify_language'
    | 'generate_summary'
    | 'screen_reader_structure'
    | 'translate'
    | 'audio_transcript'
    | 'video_captions'
    | 'ocr_reconstruct'
    | 'table_linearize';
  title: string;
  description: string;
  targetLanguage?: string;
  selected: boolean;
  isRecommended: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface TransformedOutput {
  id: string;
  documentId: string;
  accessibleText: string;
  simplifiedVersion: string;
  stepByStepGuide?: string[];
  summary: string;
  translations: Record<string, { title: string; content: string; languageName: string }>;
  imageDescriptions: Array<{ id: string; altText: string; detailed: string; simple: string; screenReader: string }>;
  screenReaderHtml: string;
  tableRepresentations: Array<{ id: string; accessibleHtml: string; plainExplanation: string }>;
  audioTranscript?: string;
  timedCaptionsVtt?: string;
  audioNarrationUrl?: string;
  ocrExtractedText?: string;
  remediatedAt: string;
}

export interface VerificationResult {
  documentId: string;
  beforeScore: AccessibilityScoreResult;
  afterScore: AccessibilityScoreResult;
  scoreImprovement: number; // e.g. +52
  totalIssuesDetected: number;
  issuesResolved: number;
  issuesRemaining: number;
  resolvedIssues: AccessibilityIssue[];
  remainingIssues: AccessibilityIssue[];
  verificationTimestamp: string;
}

export type AgentType =
  | 'content_understanding'
  | 'accessibility_audit'
  | 'user_needs'
  | 'transformation_engine'
  | 'verification_engine'
  | 'explanation_agent';

export type AgentStateStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting';

export interface AgentStep {
  agentType: AgentType;
  name: string;
  status: AgentStateStatus;
  currentTask: string;
  progressPercent: number; // 0..100
  durationMs?: number;
  findings?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface AgentPipelineResult {
  documentId: string;
  agentSteps: AgentStep[];
  structuredContent: StructuredContent;
  initialIssues: AccessibilityIssue[];
  initialScore: AccessibilityScoreResult;
  personalizedRequirements: string[];
  transformations: TransformationItem[];
  transformedOutput?: TransformedOutput;
  verification?: VerificationResult;
  explanation: {
    summary: string;
    keyRemediations: string[];
    benefitingUserGroups: string[];
  };
  isLiveAi: boolean;
  engineName: string;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Array<{
    pageNumber?: number;
    section?: string;
    snippet: string;
  }>;
}

export interface DocumentAnalysis {
  id: string;
  title: string;
  inputType: DocumentInputType;
  fileName?: string;
  fileSizeBytes?: number;
  createdAt: string;
  updatedAt: string;
  status: DocumentStatus;
  profileUsed: AccessibilityProfile;
  initialScore: AccessibilityScoreResult;
  finalScore?: AccessibilityScoreResult;
  structuredContent: StructuredContent;
  issues: AccessibilityIssue[];
  transformations: TransformationItem[];
  transformedOutput?: TransformedOutput;
  verification?: VerificationResult;
  pipelineResult?: AgentPipelineResult;
}

export interface AccessibilityReport {
  id: string;
  documentId: string;
  documentTitle: string;
  createdAt: string;
  executiveSummary: string;
  documentInfo: {
    inputType: DocumentInputType;
    pageCount: number;
    wordCount: number;
    fileName?: string;
  };
  initialScore: AccessibilityScoreResult;
  finalScore: AccessibilityScoreResult;
  scoreImprovement: number;
  detectedBarriers: AccessibilityIssue[];
  appliedTransformations: TransformationItem[];
  remainingIssues: AccessibilityIssue[];
  recommendations: string[];
  userProfileSummary: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  averageScore: number;
  averageImprovement: number;
  issuesDetectedTotal: number;
  issuesResolvedTotal: number;
  documentsImprovedCount: number;
}

export interface AccessibilityToolbarSettings {
  textSize: number; // 100, 115, 130, 150 (%)
  highContrast: 'normal' | 'high-contrast-dark' | 'high-contrast-light' | 'yellow-on-black';
  dyslexiaFont: boolean;
  lineSpacing: number; // 1.0, 1.3, 1.6, 2.0
  letterSpacing: number; // 0, 1, 2, 3 (px)
  focusMode: boolean;
  reducedMotion: boolean;
  screenReaderGuide: boolean;
}
