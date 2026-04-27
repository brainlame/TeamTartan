-- Add max_participants column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'events';
