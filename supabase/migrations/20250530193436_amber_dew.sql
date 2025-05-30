/*
  # Create search queries tracking table

  1. New Tables
    - `search_queries`
      - `id` (uuid, primary key)
      - `search_phrase` (text)
      - `user_type` (text)
      - `returned_product_ids` (text array)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on `search_queries` table
    - Add policy for authenticated users to insert search queries
    - Add policy for authenticated users to read their own queries
*/

-- Create the search queries table
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_phrase text NOT NULL,
  user_type text NOT NULL,
  returned_product_ids text[] NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting search queries
CREATE POLICY "Anyone can insert search queries"
  ON search_queries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for reading search queries (staff only)
CREATE POLICY "Staff can read all search queries"
  ON search_queries
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_search_queries_timestamp 
  ON search_queries(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_search_queries_user_type 
  ON search_queries(user_type);