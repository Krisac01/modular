/*
  # Create greenhouse data tables for pest incidence tracking

  1. New Tables
    - `greenhouse_rows`
      - `id` (integer, primary key) - Row number
      - `name` (text) - Row name/identifier
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `incidence_records`
      - `id` (uuid, primary key)
      - `row_id` (integer, foreign key to greenhouse_rows)
      - `position` (integer) - Position within the row (1-10)
      - `subsection` (integer) - Subsection number (1-10)
      - `level` (integer) - Incidence level 0-10
      - `notes` (text, optional) - Additional observations
      - `recorded_by` (text, optional) - User who recorded the data
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

-- Create greenhouse_rows table
CREATE TABLE IF NOT EXISTS greenhouse_rows (
  id integer PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create incidence_records table
CREATE TABLE IF NOT EXISTS incidence_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  row_id integer NOT NULL REFERENCES greenhouse_rows(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position >= 1 AND position <= 10),
  subsection integer NOT NULL CHECK (subsection >= 1 AND subsection <= 10),
  level integer NOT NULL CHECK (level >= 0 AND level <= 10),
  notes text,
  recorded_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique combination of row and position
  UNIQUE(row_id, position)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incidence_records_row_id ON incidence_records(row_id);
CREATE INDEX IF NOT EXISTS idx_incidence_records_position ON incidence_records(position);
CREATE INDEX IF NOT EXISTS idx_incidence_records_subsection ON incidence_records(subsection);
CREATE INDEX IF NOT EXISTS idx_incidence_records_level ON incidence_records(level);
CREATE INDEX IF NOT EXISTS idx_incidence_records_created_at ON incidence_records(created_at);

-- Enable Row Level Security
ALTER TABLE greenhouse_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidence_records ENABLE ROW LEVEL SECURITY;

-- Create policies for greenhouse_rows
CREATE POLICY "Users can read all greenhouse rows"
  ON greenhouse_rows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert greenhouse rows"
  ON greenhouse_rows
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update greenhouse rows"
  ON greenhouse_rows
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for incidence_records
CREATE POLICY "Users can read all incidence records"
  ON incidence_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert incidence records"
  ON incidence_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update incidence records"
  ON incidence_records
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete incidence records"
  ON incidence_records
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default rows (1-20)
INSERT INTO greenhouse_rows (id, name) 
SELECT i, 'Surco ' || i 
FROM generate_series(1, 20) AS i
ON CONFLICT (id) DO NOTHING;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_greenhouse_rows_updated_at
  BEFORE UPDATE ON greenhouse_rows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidence_records_updated_at
  BEFORE UPDATE ON incidence_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();