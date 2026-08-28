# 🗄️ INCLUSA Database & Storage Layer

This directory contains the database integration and cloud storage services for the **INCLUSA** platform.

---

## 📁 Directory Overview

- **`supabase-schema.sql`**: Complete PostgreSQL DDL schema with 6 relational tables, UUID primary keys, performance indexes, and Row Level Security (RLS) policies.
- **`client.ts`**: Isomorphic Supabase client with auto-reconnection and authentication state.
- **`db.ts`**: Type-safe CRUD operations for documents, analyses, issues, user profiles, chat messages, and reports.

---

## 🗄️ Relational Tables
1. `documents`: Ingested multimodal file metadata and raw text.
2. `analyses`: 6-agent audit results, 0-100 scores, and transformations.
3. `accessibility_profiles`: Individual user accessibility preferences (Vision, Cognitive, Hearing, Language).
4. `accessibility_issues`: Detailed WCAG 2.1 compliance barriers and severity ratings.
5. `chat_messages`: Grounded Q&A conversation history with source citations.
6. `reports`: 10-section executive compliance summaries.

---

## 🚀 Setup Instructions
1. Open your Supabase project's **SQL Editor**.
2. Paste the contents of `supabase-schema.sql` and run it.
3. Add your keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
