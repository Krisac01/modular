/*
  # Create user management and activity tracking tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - User role in the system
      - `department` (text) - Department/area of work
      - `is_active` (boolean) - Account status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `facial_recognition_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `recognition_time` (timestamp) - When recognition occurred
      - `expiration_time` (timestamp) - When session expires
      - `is_active` (boolean) - Session status
      - `confidence` (integer) - Recognition confidence percentage
      - `device_info` (jsonb) - Device information
      - `location_latitude` (decimal, optional) - GPS latitude
      - `location_longitude` (decimal, optional) - GPS longitude
      - `created_at` (timestamp)
    
    - `location_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `rfid_tag` (text) - RFID tag identifier
      - `location_name` (text) - Human readable location name
      - `coordinates_latitude` (decimal, optional) - GPS latitude
      - `coordinates_longitude` (decimal, optional) - GPS longitude
      - `device_info` (jsonb) - Device information
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'Operario',
  department text DEFAULT 'Campo',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create facial_recognition_sessions table
CREATE TABLE IF NOT EXISTS facial_recognition_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recognition_time timestamptz NOT NULL DEFAULT now(),
  expiration_time timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  device_info jsonb DEFAULT '{}'::jsonb,
  location_latitude decimal(10, 8),
  location_longitude decimal(11, 8),
  created_at timestamptz DEFAULT now()
);

-- Create location_records table
CREATE TABLE IF NOT EXISTS location_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  rfid_tag text NOT NULL,
  location_name text NOT NULL,
  coordinates_latitude decimal(10, 8),
  coordinates_longitude decimal(11, 8),
  device_info jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_facial_recognition_sessions_user_id ON facial_recognition_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_facial_recognition_sessions_is_active ON facial_recognition_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_facial_recognition_sessions_created_at ON facial_recognition_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_location_records_user_id ON location_records(user_id);
CREATE INDEX IF NOT EXISTS idx_location_records_rfid_tag ON location_records(rfid_tag);
CREATE INDEX IF NOT EXISTS idx_location_records_created_at ON location_records(created_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE facial_recognition_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for facial_recognition_sessions
CREATE POLICY "Users can read all facial recognition sessions"
  ON facial_recognition_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert facial recognition sessions"
  ON facial_recognition_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update facial recognition sessions"
  ON facial_recognition_sessions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for location_records
CREATE POLICY "Users can read all location records"
  ON location_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert location records"
  ON location_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update location records"
  ON location_records
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some demo users
INSERT INTO user_profiles (id, email, full_name, role, department) VALUES
  (gen_random_uuid(), 'juan.perez@ejemplo.com', 'Juan Pérez', 'Técnico Agrícola', 'Campo'),
  (gen_random_uuid(), 'maria.gonzalez@ejemplo.com', 'María González', 'Supervisora', 'Invernadero'),
  (gen_random_uuid(), 'carlos.rodriguez@ejemplo.com', 'Carlos Rodríguez', 'Operario', 'Mantenimiento'),
  (gen_random_uuid(), 'ana.lopez@ejemplo.com', 'Ana López', 'Técnica en Plagas', 'Control Fitosanitario'),
  (gen_random_uuid(), 'luis.martinez@ejemplo.com', 'Luis Martínez', 'Jefe de Campo', 'Producción')
ON CONFLICT (email) DO NOTHING;