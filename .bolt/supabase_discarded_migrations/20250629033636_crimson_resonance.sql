/*
  # Complete Database Schema for Cacao Pathogen and Greenhouse Management

  1. New Tables
    - `cacao_sections` - Sections A, B, C, D, E for cacao trees
    - `cacao_pathogen_records` - Pathogen records per tree
    - `greenhouse_rows` - Greenhouse rows (1-20)
    - `incidence_records` - Pest incidence records
    - `user_profiles` - User management with roles
    - `facial_recognition_sessions` - Facial recognition sessions
    - `location_records` - RFID location tracking
    - `supply_records` - Supply assignment records
    - `tool_records` - Tool assignment records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Analytics
    - Create summary views
    - Add analysis functions
    - Create alert views
*/

-- Create update function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user profiles table first - using UUID type for id
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'Operario',
  department text NOT NULL DEFAULT 'Campo',
  is_active boolean DEFAULT true,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cacao sections table
CREATE TABLE IF NOT EXISTS cacao_sections (
  id text PRIMARY KEY,
  name text NOT NULL,
  max_trees integer DEFAULT 50 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cacao pathogen records table
CREATE TABLE IF NOT EXISTS cacao_pathogen_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL REFERENCES cacao_sections(id) ON DELETE CASCADE,
  tree_number integer NOT NULL,
  pathogen_type text NOT NULL,
  incidence_level integer NOT NULL CHECK (incidence_level >= 0 AND incidence_level <= 10),
  notes text,
  photos jsonb DEFAULT '[]'::jsonb,
  location_latitude numeric(10,8),
  location_longitude numeric(11,8),
  recorded_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, tree_number, pathogen_type)
);

-- Create greenhouse rows table
CREATE TABLE IF NOT EXISTS greenhouse_rows (
  id integer PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create incidence records table
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
  UNIQUE(row_id, position)
);

-- Create facial recognition sessions table with correct UUID reference
CREATE TABLE IF NOT EXISTS facial_recognition_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  recognition_time timestamptz DEFAULT now(),
  expiration_time timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  confidence numeric(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  device_info jsonb,
  location_latitude numeric(10,8),
  location_longitude numeric(11,8),
  created_at timestamptz DEFAULT now()
);

-- Create location records table
CREATE TABLE IF NOT EXISTS location_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  rfid_tag text NOT NULL,
  location_name text NOT NULL,
  coordinates_latitude numeric(10,8),
  coordinates_longitude numeric(11,8),
  device_info jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create supply records table
CREATE TABLE IF NOT EXISTS supply_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  active_ingredient text,
  concentration text,
  image text,
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

-- Create tool records table
CREATE TABLE IF NOT EXISTS tool_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  brand text,
  model text,
  serial_number text,
  description text,
  image text,
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

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cacao_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cacao_pathogen_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenhouse_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE facial_recognition_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read all profiles" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (id::text = auth.uid()::text);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (id::text = auth.uid()::text);

-- Create policies for cacao_sections
CREATE POLICY "Users can read all cacao sections" ON cacao_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert cacao sections" ON cacao_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update cacao sections" ON cacao_sections FOR UPDATE TO authenticated USING (true);

-- Create policies for cacao_pathogen_records
CREATE POLICY "Users can read all pathogen records" ON cacao_pathogen_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert pathogen records" ON cacao_pathogen_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update pathogen records" ON cacao_pathogen_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete pathogen records" ON cacao_pathogen_records FOR DELETE TO authenticated USING (true);

-- Create policies for greenhouse_rows
CREATE POLICY "Users can read all greenhouse rows" ON greenhouse_rows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert greenhouse rows" ON greenhouse_rows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update greenhouse rows" ON greenhouse_rows FOR UPDATE TO authenticated USING (true);

-- Create policies for incidence_records
CREATE POLICY "Users can read all incidence records" ON incidence_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert incidence records" ON incidence_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update incidence records" ON incidence_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete incidence records" ON incidence_records FOR DELETE TO authenticated USING (true);

-- Create policies for facial_recognition_sessions
CREATE POLICY "Users can read all facial recognition sessions" ON facial_recognition_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert facial recognition sessions" ON facial_recognition_sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update facial recognition sessions" ON facial_recognition_sessions FOR UPDATE TO authenticated USING (true);

-- Create policies for location_records
CREATE POLICY "Users can read all location records" ON location_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert location records" ON location_records FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for supply_records
CREATE POLICY "Users can read all supply records" ON supply_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert supply records" ON supply_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update supply records" ON supply_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete supply records" ON supply_records FOR DELETE TO authenticated USING (true);

-- Create policies for tool_records
CREATE POLICY "Users can read all tool records" ON tool_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert tool records" ON tool_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update tool records" ON tool_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete tool records" ON tool_records FOR DELETE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_section_id ON cacao_pathogen_records(section_id);
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_tree_number ON cacao_pathogen_records(tree_number);
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_pathogen_type ON cacao_pathogen_records(pathogen_type);
CREATE INDEX IF NOT EXISTS idx_cacao_pathogen_records_created_at ON cacao_pathogen_records(created_at);

CREATE INDEX IF NOT EXISTS idx_incidence_records_row_id ON incidence_records(row_id);
CREATE INDEX IF NOT EXISTS idx_incidence_records_position ON incidence_records(position);
CREATE INDEX IF NOT EXISTS idx_incidence_records_subsection ON incidence_records(subsection);
CREATE INDEX IF NOT EXISTS idx_incidence_records_level ON incidence_records(level);
CREATE INDEX IF NOT EXISTS idx_incidence_records_created_at ON incidence_records(created_at);

CREATE INDEX IF NOT EXISTS idx_facial_recognition_sessions_user_id ON facial_recognition_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_location_records_user_id ON location_records(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_records_assigned_to ON supply_records(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tool_records_assigned_to ON tool_records(assigned_to);

-- Create update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cacao_sections_updated_at BEFORE UPDATE ON cacao_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cacao_pathogen_records_updated_at BEFORE UPDATE ON cacao_pathogen_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_greenhouse_rows_updated_at BEFORE UPDATE ON greenhouse_rows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidence_records_updated_at BEFORE UPDATE ON incidence_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supply_records_updated_at BEFORE UPDATE ON supply_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_records_updated_at BEFORE UPDATE ON tool_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for cacao sections
INSERT INTO cacao_sections (id, name, max_trees) VALUES 
('A', 'A', 50),
('B', 'B', 50),
('C', 'C', 50),
('D', 'D', 50),
('E', 'E', 50)
ON CONFLICT (id) DO NOTHING;

-- Insert initial data for greenhouse rows
INSERT INTO greenhouse_rows (id, name) 
SELECT i, 'Surco ' || i 
FROM generate_series(1, 20) AS i
ON CONFLICT (id) DO NOTHING;

-- Insert demo users
INSERT INTO user_profiles (id, email, full_name, role, department) VALUES 
(gen_random_uuid(), 'juan.perez@agro.com', 'Juan Pérez', 'Técnico Agrícola', 'Campo'),
(gen_random_uuid(), 'maria.gonzalez@agro.com', 'María González', 'Supervisora', 'Invernadero'),
(gen_random_uuid(), 'carlos.rodriguez@agro.com', 'Carlos Rodríguez', 'Operario', 'Mantenimiento'),
(gen_random_uuid(), 'ana.lopez@agro.com', 'Ana López', 'Técnica en Plagas', 'Control Fitosanitario'),
(gen_random_uuid(), 'luis.martinez@agro.com', 'Luis Martínez', 'Jefe de Campo', 'Producción')
ON CONFLICT (email) DO NOTHING;

-- Create view for pathogen summary by section
CREATE OR REPLACE VIEW pathogen_summary_by_section AS
SELECT 
  cs.id as section_id,
  cs.name as section_name,
  cs.max_trees,
  COUNT(cpr.id) as total_records,
  COUNT(DISTINCT cpr.tree_number) as affected_trees,
  ROUND(AVG(cpr.incidence_level), 2) as avg_incidence_level,
  MAX(cpr.incidence_level) as max_incidence_level,
  COUNT(CASE WHEN cpr.incidence_level >= 8 THEN 1 END) as critical_cases,
  COUNT(CASE WHEN cpr.incidence_level BETWEEN 5 AND 7 THEN 1 END) as high_cases,
  COUNT(CASE WHEN cpr.incidence_level BETWEEN 3 AND 4 THEN 1 END) as medium_cases,
  COUNT(CASE WHEN cpr.incidence_level <= 2 THEN 1 END) as low_cases
FROM cacao_sections cs
LEFT JOIN cacao_pathogen_records cpr ON cs.id = cpr.section_id
GROUP BY cs.id, cs.name, cs.max_trees
ORDER BY cs.id;

-- Create view for incidence summary by row
CREATE OR REPLACE VIEW incidence_summary_by_row AS
SELECT 
  gr.id as row_id,
  gr.name as row_name,
  COUNT(ir.id) as total_records,
  ROUND(AVG(ir.level), 2) as avg_incidence_level,
  MAX(ir.level) as max_incidence_level,
  COUNT(CASE WHEN ir.level >= 8 THEN 1 END) as critical_cases,
  COUNT(CASE WHEN ir.level BETWEEN 5 AND 7 THEN 1 END) as high_cases,
  COUNT(CASE WHEN ir.level BETWEEN 3 AND 4 THEN 1 END) as medium_cases,
  COUNT(CASE WHEN ir.level <= 2 THEN 1 END) as low_cases,
  MAX(ir.created_at) as last_updated
FROM greenhouse_rows gr
LEFT JOIN incidence_records ir ON gr.id = ir.row_id
GROUP BY gr.id, gr.name
ORDER BY gr.id;

-- Create view for user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  up.id as user_id,
  up.full_name,
  up.email,
  up.role,
  up.department,
  COUNT(DISTINCT frs.id) as total_sessions,
  COUNT(CASE WHEN frs.is_active THEN 1 END) as active_sessions,
  MAX(frs.recognition_time) as last_session,
  COUNT(DISTINCT lr.id) as location_changes,
  MAX(lr.created_at) as last_location_update
FROM user_profiles up
LEFT JOIN facial_recognition_sessions frs ON up.id = frs.user_id
LEFT JOIN location_records lr ON up.id = lr.user_id
WHERE up.is_active = true
GROUP BY up.id, up.full_name, up.email, up.role, up.department
ORDER BY up.full_name;

-- Create view for supply expiration alerts
CREATE OR REPLACE VIEW supply_expiration_alerts AS
SELECT 
  sr.id,
  sr.name,
  sr.category,
  sr.expiration_date,
  sr.batch_number,
  sr.supplier,
  sr.assigned_by,
  up.full_name as assigned_to_name,
  CASE 
    WHEN sr.expiration_date < CURRENT_DATE THEN 'EXPIRED'
    WHEN sr.expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'EXPIRING_SOON'
    ELSE 'OK'
  END as status,
  sr.expiration_date - CURRENT_DATE as days_until_expiration
FROM supply_records sr
LEFT JOIN user_profiles up ON sr.assigned_to = up.id
WHERE sr.expiration_date IS NOT NULL
  AND sr.expiration_date <= CURRENT_DATE + INTERVAL '60 days'
ORDER BY sr.expiration_date ASC;

-- Create view for tool maintenance alerts
CREATE OR REPLACE VIEW tool_maintenance_alerts AS
SELECT 
  tr.id,
  tr.name,
  tr.category,
  tr.condition,
  tr.next_maintenance_date,
  tr.last_maintenance_date,
  tr.assigned_by,
  up.full_name as assigned_to_name,
  CASE 
    WHEN tr.next_maintenance_date < CURRENT_DATE THEN 'OVERDUE'
    WHEN tr.next_maintenance_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'DUE_SOON'
    WHEN tr.condition = 'Necesita mantenimiento' THEN 'NEEDS_MAINTENANCE'
    WHEN tr.condition = 'Fuera de servicio' THEN 'OUT_OF_SERVICE'
    ELSE 'OK'
  END as status,
  tr.next_maintenance_date - CURRENT_DATE as days_until_maintenance
FROM tool_records tr
LEFT JOIN user_profiles up ON tr.assigned_to = up.id
WHERE tr.next_maintenance_date IS NOT NULL
  AND (tr.next_maintenance_date <= CURRENT_DATE + INTERVAL '30 days'
       OR tr.condition IN ('Necesita mantenimiento', 'Fuera de servicio'))
ORDER BY tr.next_maintenance_date ASC;

-- Create function to get pathogen statistics
CREATE OR REPLACE FUNCTION get_pathogen_statistics(
  section_filter text DEFAULT NULL,
  date_from timestamptz DEFAULT NULL,
  date_to timestamptz DEFAULT NULL
)
RETURNS TABLE (
  total_records bigint,
  total_sections bigint,
  total_trees bigint,
  avg_incidence numeric,
  most_common_pathogen text,
  most_affected_section text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(cpr.id) as total_records,
    COUNT(DISTINCT cpr.section_id) as total_sections,
    COUNT(DISTINCT cpr.tree_number) as total_trees,
    ROUND(AVG(cpr.incidence_level), 2) as avg_incidence,
    (SELECT cpr2.pathogen_type 
     FROM cacao_pathogen_records cpr2 
     WHERE (section_filter IS NULL OR cpr2.section_id = section_filter)
       AND (date_from IS NULL OR cpr2.created_at >= date_from)
       AND (date_to IS NULL OR cpr2.created_at <= date_to)
     GROUP BY cpr2.pathogen_type 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) as most_common_pathogen,
    (SELECT cpr3.section_id 
     FROM cacao_pathogen_records cpr3 
     WHERE (section_filter IS NULL OR cpr3.section_id = section_filter)
       AND (date_from IS NULL OR cpr3.created_at >= date_from)
       AND (date_to IS NULL OR cpr3.created_at <= date_to)
     GROUP BY cpr3.section_id 
     ORDER BY AVG(cpr3.incidence_level) DESC 
     LIMIT 1) as most_affected_section
  FROM cacao_pathogen_records cpr
  WHERE (section_filter IS NULL OR cpr.section_id = section_filter)
    AND (date_from IS NULL OR cpr.created_at >= date_from)
    AND (date_to IS NULL OR cpr.created_at <= date_to);
END;
$$ LANGUAGE plpgsql;

-- Create function to get heatmap data
CREATE OR REPLACE FUNCTION get_incidence_heatmap_data(
  date_filter date DEFAULT NULL
)
RETURNS TABLE (
  row_id integer,
  subsection integer,
  avg_level numeric,
  record_count bigint,
  last_updated timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ir.row_id,
    ir.subsection,
    ROUND(AVG(ir.level), 1) as avg_level,
    COUNT(ir.id) as record_count,
    MAX(ir.created_at) as last_updated
  FROM incidence_records ir
  WHERE (date_filter IS NULL OR DATE(ir.created_at) = date_filter)
  GROUP BY ir.row_id, ir.subsection
  ORDER BY ir.row_id, ir.subsection;
END;
$$ LANGUAGE plpgsql;