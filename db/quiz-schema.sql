-- Run this once in Supabase SQL editor
CREATE TABLE IF NOT EXISTS quiz_responses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   TEXT        UNIQUE NOT NULL,
  quiz_version TEXT        NOT NULL DEFAULT 'v1',
  answers      JSONB       NOT NULL DEFAULT '{}',
  email        TEXT,
  first_name   TEXT,
  completed    BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON quiz_responses
  FOR ALL USING (true) WITH CHECK (true);
