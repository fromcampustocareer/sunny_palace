-- 013_opportunities_location_pay.sql
--
-- The Opportunity Board submission form collects `location` and `pay`, and the
-- submit-form edge function + the card renderer both reference them, but the
-- columns were never added to the `opportunities` table (schema drift). Without
-- them, every opportunity submission through submit-form fails with
-- "column opportunities.location does not exist". Add the columns so submissions
-- succeed and the location filter / pay display work.
--
-- anon already has table-level SELECT on opportunities, so the new columns are
-- publicly readable with the rest of the row (no PII — they're free-text job
-- metadata). Length caps mirror the MED-3 free-text constraints (NOT VALID).

ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS pay text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_location_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_location_len_chk
      CHECK (location IS NULL OR char_length(location) <= 500) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_pay_len_chk') THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_pay_len_chk
      CHECK (pay IS NULL OR char_length(pay) <= 500) NOT VALID;
  END IF;
END $$;
