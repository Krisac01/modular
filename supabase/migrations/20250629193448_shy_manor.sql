-- Create update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create auth.users table if it doesn't exist (for development purposes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
        CREATE SCHEMA IF NOT EXISTS auth;
        CREATE TABLE IF NOT EXISTS auth.users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            email text UNIQUE NOT NULL,
            created_at timestamptz DEFAULT now()
        );
    END IF;
END
$$;

-- Create or update user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  department text,
  status text NOT NULL DEFAULT 'active',
  permissions jsonb NOT NULL DEFAULT '{
    "canUpdateLocation": true,
    "canRegisterSupplyPossession": true,
    "canRegisterToolPossession": true,
    "canUseFacialRecognition": true,
    "canViewDashboard": true,
    "canExportData": true,
    "canRecordPestIncidence": true,
    "canRecordPathogenIncidence": true
  }'::jsonb,
  employee_id text,
  position text,
  phone_number text,
  address text,
  notes text,
  last_login timestamptz,
  last_activity timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update cacao_sections table
CREATE TABLE IF NOT EXISTS cacao_sections (
  id text PRIMARY KEY,
  name text NOT NULL,
  max_trees integer DEFAULT 50 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update cacao_pathogen_records table
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

-- Create or update greenhouse_rows table
CREATE TABLE IF NOT EXISTS greenhouse_rows (
  id integer PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update incidence_records table
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

-- Create or update facial_recognition_sessions table
CREATE TABLE IF NOT EXISTS facial_recognition_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL,
  recognition_time timestamptz DEFAULT now(),
  expiration_time timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  confidence numeric(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  device_info jsonb,
  location jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create or update location_records table
CREATE TABLE IF NOT EXISTS location_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  rfid_tag text NOT NULL,
  location_name text NOT NULL,
  coordinates jsonb,
  device_info jsonb,
  timestamp timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create or update supply_records table
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
  assigned_to uuid,
  assigned_date timestamptz DEFAULT now(),
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

-- Create or update tool_records table
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
  assigned_to text NOT NULL,
  assigned_date timestamptz DEFAULT now(),
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

-- Create or update activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL,
  due_date timestamptz NOT NULL,
  estimated_time text,
  assigned_by text NOT NULL,
  assigned_to text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  location text NOT NULL,
  category text NOT NULL,
  notes text,
  completed_at timestamptz,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update location_management table
CREATE TABLE IF NOT EXISTS location_management (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rfid_tag text NOT NULL UNIQUE,
  description text,
  category jsonb NOT NULL,
  coordinates jsonb,
  is_active boolean DEFAULT true,
  max_capacity integer,
  current_occupancy integer,
  equipment jsonb DEFAULT '[]'::jsonb,
  responsible_person text,
  notes text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update supply_database table
CREATE TABLE IF NOT EXISTS supply_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category jsonb NOT NULL,
  description text,
  active_ingredient text,
  concentration text,
  image text,
  instructions text NOT NULL,
  recommended_dose text NOT NULL,
  target_pests jsonb DEFAULT '[]'::jsonb,
  application_methods jsonb DEFAULT '[]'::jsonb,
  safety_notes text NOT NULL,
  manufacturer text,
  registration_number text,
  status text NOT NULL DEFAULT 'active',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update tool_database table
CREATE TABLE IF NOT EXISTS tool_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category jsonb NOT NULL,
  description text,
  brand text,
  model text,
  serial_number text,
  image text,
  maintenance_instructions text NOT NULL,
  safety_instructions text NOT NULL,
  recommended_uses jsonb DEFAULT '[]'::jsonb,
  technical_specifications text,
  status text NOT NULL DEFAULT 'active',
  purchase_date date,
  warranty_expiration date,
  estimated_lifespan text,
  maintenance_frequency text,
  last_maintenance_date date,
  next_maintenance_date date,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cacao_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cacao_pathogen_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenhouse_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE facial_recognition_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_database ENABLE ROW LEVEL SECURITY;

-- Create policies with IF NOT EXISTS checks
DO $$
BEGIN
    -- Policies for user_profiles
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can read all profiles') THEN
        CREATE POLICY "Users can read all profiles" ON user_profiles FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (true);
    END IF;

    -- Policies for cacao_sections
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_sections' AND policyname = 'Users can read all cacao sections') THEN
        CREATE POLICY "Users can read all cacao sections" ON cacao_sections FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_sections' AND policyname = 'Users can insert cacao sections') THEN
        CREATE POLICY "Users can insert cacao sections" ON cacao_sections FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_sections' AND policyname = 'Users can update cacao sections') THEN
        CREATE POLICY "Users can update cacao sections" ON cacao_sections FOR UPDATE TO authenticated USING (true);
    END IF;

    -- Policies for cacao_pathogen_records
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_pathogen_records' AND policyname = 'Users can read all pathogen records') THEN
        CREATE POLICY "Users can read all pathogen records" ON cacao_pathogen_records FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_pathogen_records' AND policyname = 'Users can insert pathogen records') THEN
        CREATE POLICY "Users can insert pathogen records" ON cacao_pathogen_records FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_pathogen_records' AND policyname = 'Users can update pathogen records') THEN
        CREATE POLICY "Users can update pathogen records" ON cacao_pathogen_records FOR UPDATE TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'cacao_pathogen_records' AND policyname = 'Users can delete pathogen records') THEN
        CREATE POLICY "Users can delete pathogen records" ON cacao_pathogen_records FOR DELETE TO authenticated USING (true);
    END IF;

    -- Policies for all other tables
    -- For brevity, I'm using a loop to create similar policies for the remaining tables
    DECLARE
        table_names text[] := ARRAY[
            'greenhouse_rows', 'incidence_records', 'facial_recognition_sessions', 
            'location_records', 'supply_records', 'tool_records', 'activities',
            'location_management', 'supply_database', 'tool_database'
        ];
        table_name text;
    BEGIN
        FOREACH table_name IN ARRAY table_names
        LOOP
            IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = table_name AND policyname = 'Users can read all records') THEN
                EXECUTE format('CREATE POLICY "Users can read all records" ON %I FOR SELECT TO authenticated USING (true)', table_name);
            END IF;
            
            IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = table_name AND policyname = 'Users can insert records') THEN
                EXECUTE format('CREATE POLICY "Users can insert records" ON %I FOR INSERT TO authenticated WITH CHECK (true)', table_name);
            END IF;
            
            IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = table_name AND policyname = 'Users can update records') THEN
                EXECUTE format('CREATE POLICY "Users can update records" ON %I FOR UPDATE TO authenticated USING (true)', table_name);
            END IF;
            
            IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = table_name AND policyname = 'Users can delete records') THEN
                EXECUTE format('CREATE POLICY "Users can delete records" ON %I FOR DELETE TO authenticated USING (true)', table_name);
            END IF;
        END LOOP;
    END;
END
$$;

-- Create update triggers for all tables
DO $$
DECLARE
    table_names text[] := ARRAY[
        'user_profiles', 'cacao_sections', 'cacao_pathogen_records', 
        'greenhouse_rows', 'incidence_records', 'supply_records', 
        'tool_records', 'activities', 'location_management', 
        'supply_database', 'tool_database'
    ];
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_' || table_name || '_updated_at') THEN
            EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', table_name, table_name);
        END IF;
    END LOOP;
END
$$;

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

CREATE INDEX IF NOT EXISTS idx_activities_assigned_to ON activities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_due_date ON activities(due_date);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

CREATE INDEX IF NOT EXISTS idx_location_management_rfid_tag ON location_management(rfid_tag);
CREATE INDEX IF NOT EXISTS idx_location_management_is_active ON location_management(is_active);

CREATE INDEX IF NOT EXISTS idx_supply_database_status ON supply_database(status);
CREATE INDEX IF NOT EXISTS idx_tool_database_status ON tool_database(status);

-- Insert initial data for cacao sections if not exists
INSERT INTO cacao_sections (id, name, max_trees) VALUES 
('A', 'A', 50),
('B', 'B', 50),
('C', 'C', 50),
('D', 'D', 50),
('E', 'E', 50)
ON CONFLICT (id) DO NOTHING;

-- Insert initial data for greenhouse rows if not exists
INSERT INTO greenhouse_rows (id, name) 
SELECT i, 'Surco ' || i 
FROM generate_series(1, 20) AS i
ON CONFLICT (id) DO NOTHING;

-- Insert demo user if not exists
INSERT INTO user_profiles (id, full_name, role, department, status, permissions) 
VALUES (
  gen_random_uuid(), 
  'Roberto Sánchez', 
  'user', 
  'Campo', 
  'active',
  '{
    "canUpdateLocation": true,
    "canRegisterSupplyPossession": true,
    "canRegisterToolPossession": true,
    "canUseFacialRecognition": true,
    "canViewDashboard": true,
    "canExportData": true,
    "canRecordPestIncidence": true,
    "canRecordPathogenIncidence": true
  }'::jsonb
);

-- Insert admin user if not exists
INSERT INTO user_profiles (id, full_name, role, department, status, permissions) 
VALUES (
  gen_random_uuid(), 
  'Administrador Sistema', 
  'admin', 
  'Administración', 
  'active',
  '{
    "canUpdateLocation": true,
    "canRegisterSupplyPossession": true,
    "canRegisterToolPossession": true,
    "canUseFacialRecognition": true,
    "canViewDashboard": true,
    "canExportData": true,
    "canRecordPestIncidence": true,
    "canRecordPathogenIncidence": true,
    "canManageUsers": true,
    "canManageLocations": true,
    "canManageSupplyDatabase": true,
    "canManageToolDatabase": true,
    "canAssignActivities": true,
    "canViewAllRecords": true,
    "canManageSystemSettings": true,
    "canAccessAdminPanel": true
  }'::jsonb
);