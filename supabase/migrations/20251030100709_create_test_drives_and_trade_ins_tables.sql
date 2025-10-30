/*
  # Create Test Drives and Trade-Ins Tables

  1. New Tables
    - `test_drives`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, optional reference to customers)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `vehicle_id` (text)
      - `vehicle_make` (text)
      - `vehicle_model` (text)
      - `vehicle_year` (integer)
      - `preferred_date` (date)
      - `preferred_time` (text)
      - `notes` (text, optional)
      - `status` (text, default 'pending')
      - `drivers_license_verified` (boolean, default false)
      - `duration` (integer, default 30)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `trade_ins`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, optional reference to customers)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `vehicle_make` (text)
      - `vehicle_model` (text)
      - `vehicle_year` (integer)
      - `vehicle_mileage` (integer)
      - `vehicle_condition` (text)
      - `exterior_color` (text)
      - `interior_color` (text)
      - `has_accidents` (boolean, default false)
      - `accident_details` (text, optional)
      - `known_issues` (text, optional)
      - `photos` (jsonb, array of photo URLs)
      - `status` (text, default 'submitted')
      - `target_vehicle_id` (text, optional)
      - `target_vehicle_name` (text, optional)
      - `estimated_value` (numeric, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `financing_applications`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, optional reference to customers)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `date_of_birth` (date)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `credit_score_range` (text)
      - `down_payment` (numeric)
      - `loan_term_preference` (integer)
      - `monthly_budget` (numeric, optional)
      - `employment_data` (jsonb)
      - `vehicle_id` (text, optional)
      - `vehicle_price` (numeric, optional)
      - `status` (text, default 'submitted')
      - `pre_approval_status` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Allow public to insert (for lead generation)
    - Only authenticated users can read/update/delete
*/

-- Create test_drives table
CREATE TABLE IF NOT EXISTS test_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  vehicle_id text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  drivers_license_verified boolean DEFAULT false,
  duration integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trade_ins table
CREATE TABLE IF NOT EXISTS trade_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer NOT NULL,
  vehicle_mileage integer NOT NULL,
  vehicle_condition text NOT NULL,
  exterior_color text NOT NULL,
  interior_color text NOT NULL,
  has_accidents boolean DEFAULT false,
  accident_details text,
  known_issues text,
  photos jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'submitted',
  target_vehicle_id text,
  target_vehicle_name text,
  estimated_value numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create financing_applications table
CREATE TABLE IF NOT EXISTS financing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  date_of_birth date NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  credit_score_range text NOT NULL,
  down_payment numeric NOT NULL,
  loan_term_preference integer NOT NULL,
  monthly_budget numeric,
  employment_data jsonb NOT NULL,
  vehicle_id text,
  vehicle_price numeric,
  status text NOT NULL DEFAULT 'submitted',
  pre_approval_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing_applications ENABLE ROW LEVEL SECURITY;

-- Policies for test_drives
CREATE POLICY "Anyone can create test drive requests"
  ON test_drives FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all test drives"
  ON test_drives FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update test drives"
  ON test_drives FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete test drives"
  ON test_drives FOR DELETE
  TO authenticated
  USING (true);

-- Policies for trade_ins
CREATE POLICY "Anyone can create trade-in requests"
  ON trade_ins FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all trade-ins"
  ON trade_ins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update trade-ins"
  ON trade_ins FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete trade-ins"
  ON trade_ins FOR DELETE
  TO authenticated
  USING (true);

-- Policies for financing_applications
CREATE POLICY "Anyone can create financing applications"
  ON financing_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all financing applications"
  ON financing_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update financing applications"
  ON financing_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete financing applications"
  ON financing_applications FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_drives_customer_email ON test_drives(customer_email);
CREATE INDEX IF NOT EXISTS idx_test_drives_status ON test_drives(status);
CREATE INDEX IF NOT EXISTS idx_test_drives_created_at ON test_drives(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trade_ins_customer_email ON trade_ins(customer_email);
CREATE INDEX IF NOT EXISTS idx_trade_ins_status ON trade_ins(status);
CREATE INDEX IF NOT EXISTS idx_trade_ins_created_at ON trade_ins(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_financing_applications_customer_email ON financing_applications(customer_email);
CREATE INDEX IF NOT EXISTS idx_financing_applications_status ON financing_applications(status);
CREATE INDEX IF NOT EXISTS idx_financing_applications_created_at ON financing_applications(created_at DESC);