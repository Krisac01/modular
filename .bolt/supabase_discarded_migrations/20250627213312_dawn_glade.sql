/*
  # Create supply and tool management tables

  1. New Tables
    - `supply_records`
      - `id` (uuid, primary key)
      - `name` (text) - Supply name
      - `category` (text) - Supply category
      - `description` (text) - Description
      - `active_ingredient` (text, optional) - Active ingredient
      - `concentration` (text, optional) - Concentration
      - `image_url` (text, optional) - Image URL
      - `instructions` (text) - Usage instructions
      - `assigned_dose` (text) - Assigned dose
      - `assigned_by` (text) - Technician who assigned
      - `assigned_to` (uuid, optional, foreign key to user_profiles) - User assigned to
      - `target_pest` (text, optional) - Target pest/disease
      - `application_method` (text) - Application method
      - `safety_notes` (text, optional) - Safety notes
      - `expiration_date` (date, optional) - Expiration date
      - `batch_number` (text, optional) - Batch number
      - `supplier` (text, optional) - Supplier name
      - `notes` (text, optional) - Additional notes
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tool_records`
      - `id` (uuid, primary key)
      - `name` (text) - Tool name
      - `category` (text) - Tool category
      - `brand` (text, optional) - Brand
      - `model` (text, optional) - Model
      - `serial_number` (text, optional) - Serial number
      - `description` (text) - Description
      - `image_url` (text, optional) - Image URL
      - `assigned_by` (text) - Technician who assigned
      - `assigned_to` (uuid, optional, foreign key to user_profiles) - User assigned to
      - `condition` (text) - Tool condition
      - `maintenance_instructions` (text) - Maintenance instructions
      - `safety_instructions` (text) - Safety instructions
      - `last_maintenance_date` (date, optional) - Last maintenance date
      - `next_maintenance_date` (date, optional) - Next maintenance date
      - `purchase_date` (date, optional) - Purchase date
      - `warranty_expiration` (date, optional) - Warranty expiration
      - `location` (text, optional) - Usage location
      - `notes` (text, optional) - Additional notes
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage data
*/

-- Create supply_records table
CREATE TABLE IF NOT EXISTS supply_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  active_ingredient text,
  concentration text,
  image_url text,
  instructions text NOT NULL,
  assigned_dose text NOT NULL,
  assigned_by text NOT NULL,
  assigned_to uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  target_pest text,
  application_method text NOT NULL,
  safety_notes text,
  expiration_date date,
  batch_number text,
  supplier text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tool_records table
CREATE TABLE IF NOT EXISTS tool_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  brand text,
  model text,
  serial_number text,
  description text,
  image_url text,
  assigned_by text NOT NULL,
  assigned_to uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  condition text NOT NULL,
  maintenance_instructions text NOT NULL,
  safety_instructions text NOT NULL,
  last_maintenance_date date,
  next_maintenance_date date,
  purchase_date date,
  warranty_expiration date,
  location text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_supply_records_category ON supply_records(category);
CREATE INDEX IF NOT EXISTS idx_supply_records_assigned_to ON supply_records(assigned_to);
CREATE INDEX IF NOT EXISTS idx_supply_records_expiration_date ON supply_records(expiration_date);
CREATE INDEX IF NOT EXISTS idx_supply_records_created_at ON supply_records(created_at);

CREATE INDEX IF NOT EXISTS idx_tool_records_category ON tool_records(category);
CREATE INDEX IF NOT EXISTS idx_tool_records_assigned_to ON tool_records(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tool_records_condition ON tool_records(condition);
CREATE INDEX IF NOT EXISTS idx_tool_records_next_maintenance_date ON tool_records(next_maintenance_date);
CREATE INDEX IF NOT EXISTS idx_tool_records_created_at ON tool_records(created_at);

-- Enable Row Level Security
ALTER TABLE supply_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_records ENABLE ROW LEVEL SECURITY;

-- Create policies for supply_records
CREATE POLICY "Users can read all supply records"
  ON supply_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert supply records"
  ON supply_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update supply records"
  ON supply_records
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete supply records"
  ON supply_records
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for tool_records
CREATE POLICY "Users can read all tool records"
  ON tool_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert tool records"
  ON tool_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update tool records"
  ON tool_records
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete tool records"
  ON tool_records
  FOR DELETE
  TO authenticated
  USING (true);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_supply_records_updated_at
  BEFORE UPDATE ON supply_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_records_updated_at
  BEFORE UPDATE ON tool_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();