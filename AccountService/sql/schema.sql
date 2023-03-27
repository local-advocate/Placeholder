-- Users (change drop table later)
DROP TABLE IF EXISTS people CASCADE;
CREATE TABLE people(user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), people jsonb);
CREATE UNIQUE INDEX email_idx ON people((people->>'email'));
