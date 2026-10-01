CREATE TABLE IF NOT EXISTS sage_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  review_id TEXT NOT NULL DEFAULT '',
  event_type TEXT NOT NULL,
  stage_id TEXT NOT NULL DEFAULT '',
  section_index INTEGER,
  referrer_host TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  device TEXT NOT NULL DEFAULT '',
  source_tag TEXT NOT NULL DEFAULT '',
  share_channel TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sage_event_dedupe
ON sage_events (
  session_id,
  review_id,
  event_type,
  stage_id,
  share_channel
);

CREATE INDEX IF NOT EXISTS idx_sage_event_type
ON sage_events (event_type);

CREATE INDEX IF NOT EXISTS idx_sage_event_created
ON sage_events (created_at);

CREATE INDEX IF NOT EXISTS idx_sage_event_location
ON sage_events (country, region);
