/*
  # Create cacao sections and pathogen records tables

  1. New Tables
    - `cacao_sections`
      - `id` (text, primary key) - Section identifier (A, B, C, D, E)
      - `name` (text) - Section name
      - `max_trees` (integer) - Maximum number of trees in section
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `cacao_pathogen_records`
      - `id` (uuid, primary key)
      - `section_id` (text, foreign key to cacao_sections)
      - `tree_number` (integer) - Tree number within section
      - `pathogen_type` (text) - Type of pathogen detected
      - `incidence_level` (integer) - Severity level 0-10
      - `notes` (text, optional) - Additional observations
      - `photos` (jsonb) - Array of photo URLs/base64
      - `location_latitude` (decimal, optional) - GPS latitude
      - `location_longitude` (decimal, optional) - GPS longitude
      - `recorded_by` (text, optional) - User who recorded the data
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

-- Create cacao_sections table
CREATE TABLE IF NOT EXISTS cacao_sections (
  id text PRIMARY KEY,
  name text NOT NULL,
  max_trees integer NOT NULL DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cacao_pathogen_records table
CREATE TABLE IF NOT EXISTS cacao_pathogen_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL REFERENCES cacao_sections(id) ON DELETE CASCADE,
  tree_number integer NOT NULL,
  pathogen_type text NOT NULL,
  incidence_level integer NOT NULL CHECK (incidence_level >= 0 AND incidence_level <= 10),
  notes text,
  photos jsonb DEFAULT '[]'::jsonb,
  location_latitude decimal(10, 8),
  location_longitude decimal(11, 8),
  recorded_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique combination of section, tree, and pathogen type
  UNIQUE(section_id, tree_number, pathogen_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_section_id ON cacao_pathogen_records(section_id);
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_tree_number ON cacao_pathogen_records(tree_number);
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_pathogen_type ON cacao_pathogen_records(pathogen_type);
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_created_at ON cacao_pathogen_records(created_at);

-- Enable Row Level Security
ALTER TABLE cacao_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cacao_pathogen_records ENABLE ROW LEVEL SECURITY;

-- Create policies for cacao_sections
CREATE POLICY "Users can read all cacao sections"
  ON cacao_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert cacao sections"
  ON cacao_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update cacao sections"
  ON cacao_sections
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for cacao_pathogen_records
CREATE POLICY "Users can read all pathogen records"
  ON cacao_pathogen_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert pathogen records"
  ON cacao_pathogen_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update pathogen records"
  ON cacao_pathogen_records
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete pathogen records"
  ON cacao_pathogen_records
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default sections (A, B, C, D, E)
INSERT INTO cacao_sections (id, name, max_trees) VALUES
  ('A', 'A', 50),
  ('B', 'B', 50),
  ('C', 'C', 50),
  ('D', 'D', 50),
  ('E', 'E', 50)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_cacao_sections_updated_at
  BEFORE UPDATE ON cacao_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cacao_pathogen_records_updated_at
  BEFORE UPDATE ON cacao_pathogen_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();