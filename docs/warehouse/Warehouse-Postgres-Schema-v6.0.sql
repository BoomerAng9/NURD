-- Universal Ecosystem Tool Warehouse v6.0
-- Target database: Neon Postgres or compatible PostgreSQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS warehouse_shelves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shelf_id TEXT UNIQUE NOT NULL,
  shelf_name TEXT NOT NULL,
  purpose TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecosystem_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT UNIQUE NOT NULL,
  canonical_name TEXT NOT NULL,
  description TEXT,
  shelf_id TEXT NOT NULL REFERENCES warehouse_shelves(shelf_id),
  readiness_status TEXT NOT NULL DEFAULT 'raw_material',
  evidence_level TEXT NOT NULL DEFAULT 'none',
  license_type TEXT DEFAULT 'unknown',
  license_name TEXT,
  commercial_use_status TEXT DEFAULT 'unknown',
  license_review_status TEXT DEFAULT 'not_started',
  risk_tier TEXT DEFAULT 'unknown',
  sandbox_required BOOLEAN DEFAULT TRUE,
  network_policy TEXT DEFAULT 'deny_by_default',
  source_homepage_url TEXT,
  source_repo_url TEXT,
  source_docs_url TEXT,
  source_package_url TEXT,
  runtime_type TEXT,
  install_method TEXT,
  install_command TEXT,
  smoke_test_command TEXT,
  health_check_url TEXT,
  pricing_model TEXT DEFAULT 'unknown',
  cost_visibility TEXT DEFAULT 'restricted',
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tool_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT NOT NULL REFERENCES ecosystem_tools(tool_id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  UNIQUE(tool_id, alias)
);

CREATE TABLE IF NOT EXISTS tool_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT NOT NULL REFERENCES ecosystem_tools(tool_id) ON DELETE CASCADE,
  capability_tag TEXT NOT NULL,
  UNIQUE(tool_id, capability_tag)
);

CREATE TABLE IF NOT EXISTS tool_secret_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT NOT NULL REFERENCES ecosystem_tools(tool_id) ON DELETE CASCADE,
  secret_name TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  notes TEXT,
  UNIQUE(tool_id, secret_name)
);

CREATE TABLE IF NOT EXISTS tool_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT NOT NULL REFERENCES ecosystem_tools(tool_id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  evidence_url TEXT,
  evidence_summary TEXT,
  pass_fail_status TEXT NOT NULL,
  created_by_role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stepper_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id TEXT UNIQUE NOT NULL,
  tool_id TEXT REFERENCES ecosystem_tools(tool_id) ON DELETE SET NULL,
  recipe_type TEXT NOT NULL,
  command_sequence JSONB NOT NULL,
  required_secrets JSONB,
  rollback_steps JSONB,
  approval_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS router_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id TEXT UNIQUE NOT NULL,
  intent_tag TEXT NOT NULL,
  required_capability TEXT NOT NULL,
  preferred_tool_id TEXT REFERENCES ecosystem_tools(tool_id) ON DELETE SET NULL,
  fallback_tool_ids TEXT[],
  risk_ceiling TEXT NOT NULL DEFAULT 'medium',
  sandbox_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS openklass_bridge_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_platform TEXT NOT NULL DEFAULT 'nurdscode',
  target_platform TEXT NOT NULL DEFAULT 'openklass_ai',
  project_id TEXT NOT NULL,
  artifact_type TEXT NOT NULL,
  readiness_status TEXT NOT NULL,
  evidence_level TEXT NOT NULL,
  security_status TEXT NOT NULL,
  human_review_required BOOLEAN DEFAULT TRUE,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ecosystem_tools_shelf ON ecosystem_tools(shelf_id);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tools_status ON ecosystem_tools(readiness_status);
CREATE INDEX IF NOT EXISTS idx_ecosystem_tools_risk ON ecosystem_tools(risk_tier);
CREATE INDEX IF NOT EXISTS idx_tool_capabilities_tag ON tool_capabilities(capability_tag);
CREATE INDEX IF NOT EXISTS idx_router_rules_intent ON router_rules(intent_tag);
