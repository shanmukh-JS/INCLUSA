-- INCLUSA Database Schema for Supabase PostgreSQL (Airtight Row-Level Security)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Accessibility Profiles Table
CREATE TABLE IF NOT EXISTS accessibility_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  citations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  executive_summary TEXT NOT NULL,
  initial_score INT NOT NULL,
  final_score INT NOT NULL,
  score_delta INT NOT NULL,
  report_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE accessibility_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Strict User Isolation Policies (Users can only read, insert, update, delete their own records)
DROP POLICY IF EXISTS "Users can access own profiles" ON accessibility_profiles;
CREATE POLICY "Users can access own profiles" ON accessibility_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own documents" ON documents;
CREATE POLICY "Users can access own documents" ON documents
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own analyses" ON analyses;
CREATE POLICY "Users can access own analyses" ON analyses
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own accessibility_issues" ON accessibility_issues;
CREATE POLICY "Users can access own accessibility_issues" ON accessibility_issues
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own chat_messages" ON chat_messages;
CREATE POLICY "Users can access own chat_messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access own reports" ON reports;
CREATE POLICY "Users can access own reports" ON reports
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
