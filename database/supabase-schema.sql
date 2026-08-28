-- ==========================================================
-- INCLUSA Database Schema for Supabase PostgreSQL
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Accessibility Profiles Table
CREATE TABLE IF NOT EXISTS accessibility_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  vision_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  hearing_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  cognitive_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  language_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  input_type TEXT NOT NULL,
  original_file_name TEXT,
  file_size_bytes BIGINT,
  storage_path TEXT,
  raw_text TEXT,
  detected_language TEXT DEFAULT 'en',
  page_count INT DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Document Analyses Table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES accessibility_profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  initial_score INT NOT NULL,
  final_score INT,
  score_improvement INT DEFAULT 0,
  categories JSONB NOT NULL,
  structured_content JSONB NOT NULL,
  issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  transformations JSONB NOT NULL DEFAULT '[]'::jsonb,
  transformed_output JSONB,
  verification_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Accessibility Issues Table
CREATE TABLE IF NOT EXISTS accessibility_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  severity TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  recommendation TEXT,
  confidence_score INT DEFAULT 95,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  executive_summary TEXT NOT NULL,
  initial_score INT NOT NULL,
  final_score INT NOT NULL,
  score_delta INT NOT NULL,
  report_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE accessibility_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for profiles" ON accessibility_profiles FOR SELECT USING (true);
CREATE POLICY "Public insert access for profiles" ON accessibility_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for profiles" ON accessibility_profiles FOR UPDATE USING (true);

CREATE POLICY "Public read access for documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Public insert access for documents" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for documents" ON documents FOR UPDATE USING (true);

CREATE POLICY "Public read access for analyses" ON analyses FOR SELECT USING (true);
CREATE POLICY "Public insert access for analyses" ON analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for analyses" ON analyses FOR UPDATE USING (true);

CREATE POLICY "Public read access for issues" ON accessibility_issues FOR SELECT USING (true);
CREATE POLICY "Public insert access for issues" ON accessibility_issues FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Public insert access for chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Public insert access for reports" ON reports FOR INSERT WITH CHECK (true);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_documents_input_type ON documents(input_type);
CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_analysis_id ON accessibility_issues(analysis_id);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON accessibility_issues(severity);
CREATE INDEX IF NOT EXISTS idx_chat_document_id ON chat_messages(document_id);
