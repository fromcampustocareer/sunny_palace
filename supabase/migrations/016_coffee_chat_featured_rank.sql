-- 016_coffee_chat_featured_rank.sql
--
-- Durable "pinned" ordering for the Coffee Chat Network. The board sorts by
-- featured_rank first (ascending, NULLs last), then created_at descending — so
-- pinned profiles always appear first in rank order, and everyone else follows
-- newest-first. This survives new signups (which previously bumped the manual
-- created_at ordering, since the board is newest-first).
--
-- featured_rank: a small integer; lower = higher on the board. NULL = not pinned.
-- It is non-PII, so it's granted to the public read alongside the other
-- non-PII columns from migration 006.

ALTER TABLE coffee_chat_profiles ADD COLUMN IF NOT EXISTS featured_rank int;

GRANT SELECT (featured_rank) ON coffee_chat_profiles TO anon;
