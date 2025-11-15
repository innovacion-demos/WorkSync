-- Migration script to add priority and requester columns
-- This script is idempotent and can be run multiple times

-- Add priority column if it doesn't exist (allowing NULL temporarily)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='issues' AND column_name='priority') THEN
        ALTER TABLE issues ADD COLUMN priority VARCHAR(20);
    END IF;
END $$;

-- Update existing rows with default priority value
UPDATE issues SET priority = 'NORMAL' WHERE priority IS NULL;

-- Add NOT NULL constraint if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='issues' AND column_name='priority' AND is_nullable='NO') THEN
        ALTER TABLE issues ALTER COLUMN priority SET NOT NULL;
    END IF;
END $$;

-- Add CHECK constraint if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE table_name='issues' AND constraint_type='CHECK'
                   AND constraint_name='issues_priority_check') THEN
        ALTER TABLE issues ADD CONSTRAINT issues_priority_check
        CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT'));
    END IF;
END $$;

-- Add requester column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='issues' AND column_name='requester') THEN
        ALTER TABLE issues ADD COLUMN requester VARCHAR(100);
    END IF;
END $$;

-- Update existing rows with default requester value
UPDATE issues SET requester = 'Unknown' WHERE requester IS NULL;
