/**
 * Core Type Definitions for INCLUSA Accessibility Platform
 * WCAG 2.1 AA / AAA Multi-Agent Orchestration Schema
 */

export type DocumentInputType = 'pdf' | 'image' | 'docx' | 'txt' | 'audio' | 'video' | 'url' | 'text';

export type RuleCategory =
  | 'vision'
  | 'cognitive'
  | 'hearing'
  | 'language'
  | 'structure'
  | 'screen_reader';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'passed';

export interface StructuredImageAnalysis {
  contentType: 'comparison' | 'diagram' | 'chart' | 'infographic' | 'logo' | 'photo' | 'poster' | 'image';
  title: string;
  visibleText: string[];
  visualElements: string[];
  layout: string;
  relationships: string[];
  visualMeaning: string;
  keyFacts: string[];
  explicitActions: string[];
  uncertainties: string[];
  colors?: string[];
  altText?: string;
  detailedDescription?: string;
}

export interface ExtractedMultimodalData {
  text: string;
  title: string;
  headings: string[];
  tables: Array<{ headers: string[]; rows: string[][]; summary: string }>;
  imageDescriptions: Array<{ altText: string; detailed: string; isChart: boolean }>;
  confidence: number;
  imageAnalysis?: StructuredImageAnalysis;
}

export type DisabilityCategory = 'vision' | 'hearing' | 'cognitive' | 'language' | 'motor';

export type DocumentStatus =
  | 'uploaded'
  | 'understanding'
  | 'auditing'
  | 'transforming'
  | 'verified'
  | 'completed'
  | 'error'
  | 'pending'
  | 'processing'
  | 'failed';

export type AgentType =
  | 'content_understanding'
  | 'accessibility_audit'
  | 'user_needs'
  | 'transformation_engine'
  | 'verification_engine'
  | 'explanation_agent';

export type AgentStateStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting';

export interface VisionPreferences {
  blind: boolean;
  lowVision: boolean;
  colorVisionDeficiency: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy';
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
  primaryLanguage: string;
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
  name: string;
  userId?: string;
  isDefault?: boolean;
  vision: VisionPreferences;
  hearing: HearingPreferences;
  cognitive: CognitivePreferences;
  language: LanguagePreferences;
  output: OutputPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'image' | 'media' | 'quote' | 'code';
  level?: 1 | 2 | 3 | 4 | 5 | 6 | number;
  text?: string;
  items?: string[];
  pageNumber: number;
  tableId?: string;
  imageId?: string;
  mediaId?: string;
  readingOrder: number;
}

export interface ExtractedImage {
  id: string;
  pageNumber: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
  isChartOrGraph: boolean;
  hasExistingAlt: boolean;
  altText?: string;
  detailedDescription?: string;
  simpleDescription?: string;
  chartDataSummary?: string;
  colorPalette?: string[];
}

export interface ExtractedTable {
  id: string;
  pageNumber: number;
  headers: string[];
  rows: string[][];
  summary: string;
  hasHeaders: boolean;
  isComplex: boolean;
}

export interface ExtractedMedia {
  id?: string;
  type: 'audio' | 'video';
  durationSeconds?: number;
  hasCaptions?: boolean;
  hasAudioDescription?: boolean;
  hasTranscript?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  detectedSpeechLanguage?: string;
  transcript?: string;
  timedCaptions?: Array<{ start: number; end: number; text: string; speaker?: string }>;
  timedCaptionsVtt?: string;
}

export interface DocumentMetadata {
  author?: string;
  creationDate?: string;
  modificationDate?: string;
  readingComplexityFleschKincaid?: number;
  wordCount?: number;
  charCount?: number;
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
  metadata?: DocumentMetadata;
  imageAnalysis?: StructuredImageAnalysis;
  fileDataUrl?: string;
}

export interface AccessibilityIssue {
  id: string;
  ruleId: string;
  category: RuleCategory;
  title: string;
  severity: SeverityLevel;
  location?: string;
  pageNumber?: number;
  elementId?: string;
  description?: string;
  whyItMatters: string;
  whoIsAffected: string;
  recommendation: string;
  confidenceScore: number;
  isFixableWithAi: boolean;
  isResolved?: boolean;
  resolvedByTransformation?: string;
}

export interface CategoryScores {
  vision: number;
  cognitive: number;
  hearing: number;
  language: number;
  structure: number;
  screenReader: number;
}

export interface AccessibilityScoreResult {
  overallScore: number;
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
    | 'translate'
    | 'screen_reader_structure'
    | 'audio_transcript'
    | 'video_captions'
    | 'linearize_tables'
    | 'dyslexia_font'
    | 'high_contrast';
  title: string;
  description: string;
  targetLanguage?: string;
  selected: boolean;
  isRecommended?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface TransformedOutput {
  id: string;
  documentId: string;
  accessibleText: string;
  simplifiedVersion?: string;
  stepByStepGuide?: string[];
  summary?: string;
  whatThisIs?: string;
  whatToKnow?: string[];
  keyFacts?: string[];
  visualMeaning?: string;
  translations: Record<string, { title: string; content: string; languageName: string; simpleSummary?: string }>;
  imageDescriptions: Array<{
    id?: string;
    altText: string;
    detailed: string;
    simple: string;
    screenReader: string;
  }>;
  screenReaderHtml: string;
  tableRepresentations: Array<{
    id: string;
    accessibleHtml: string;
    plainExplanation: string;
  }>;
  audioTranscript?: string;
  timedCaptionsVtt?: string;
  remediatedAt: string;
}

export interface VerificationResult {
  documentId: string;
  beforeScore: AccessibilityScoreResult;
  afterScore: AccessibilityScoreResult;
  scoreImprovement: number;
  totalIssuesDetected: number;
  issuesResolved: number;
  issuesRemaining: number;
  resolvedIssues: AccessibilityIssue[];
  remainingIssues: AccessibilityIssue[];
  verificationTimestamp: string;
}

export interface AgentStep {
  agentType:
    | 'content_understanding'
    | 'accessibility_audit'
    | 'user_needs'
    | 'transformation_engine'
    | 'verification_engine'
    | 'explanation_agent';
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting';
  currentTask: string;
  progressPercent: number;
  findings?: string;
  durationMs?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface AgentPipelineResult {
  documentId: string;
  agentSteps: AgentStep[];
  structuredContent: StructuredContent;
  initialIssues: AccessibilityIssue[];
  initialScore: AccessibilityScoreResult;
  personalizedRequirements: string[];
  transformations: TransformationItem[];
  transformedOutput: TransformedOutput;
  verification: VerificationResult;
  explanation: {
    summary: string;
    keyRemediations: string[];
    benefitingUserGroups: string[];
  };
  isLiveAi: boolean;
  engineName: string;
}

export interface DocumentAnalysis {
  id: string;
  userId?: string;
  title: string;
  inputType: DocumentInputType;
  fileName?: string;
  fileSizeBytes?: number;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  profileUsed?: AccessibilityProfile;
  initialScore: AccessibilityScoreResult;
  finalScore?: AccessibilityScoreResult;
  structuredContent: StructuredContent;
  issues: AccessibilityIssue[];
  transformations: TransformationItem[];
  transformedOutput?: TransformedOutput;
  verification?: VerificationResult;
  pipelineResult?: AgentPipelineResult;
}

export interface DashboardStats {
  totalAnalyses: number;
  averageScore?: number;
  averageInitialScore?: number;
  averageFinalScore?: number;
  averageImprovement: number;
  issuesDetectedTotal?: number;
  issuesResolvedTotal?: number;
  totalIssuesResolved?: number;
  documentsImprovedCount?: number;
  highSeverityResolvedCount?: number;
  mostCommonBarrier?: string;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  role?: 'user' | 'assistant' | 'system';
  sender?: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Array<{
    pageNumber?: number;
    section?: string;
    snippet: string;
  }>;
}

export interface AccessibilityReport {
  id: string;
  documentId: string;
  documentTitle?: string;
  generatedAt: string;
  createdAt?: string;
  summary: string;
  executiveSummary?: string;
  beforeScore: AccessibilityScoreResult;
  afterScore: AccessibilityScoreResult;
  initialScore?: AccessibilityScoreResult;
  finalScore?: AccessibilityScoreResult;
  scoreImprovement?: number;
  issuesSummary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  remediations: string[];
}

export interface AccessibilityToolbarSettings {
  textSize: number;
  highContrast: 'normal' | 'high' | 'yellow-black' | 'yellow-on-black' | 'inverted' | string;
  dyslexiaFont: boolean;
  lineSpacing: number;
  letterSpacing: number;
  focusMode: boolean;
  reducedMotion: boolean;
  screenReaderGuide: boolean;
}
