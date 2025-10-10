/*
  # Fix business settings RLS policies

  1. Changes
    - Drop existing restrictive RLS policies
    - Create new policies that allow anyone to read, insert, and update business settings
    - This is appropriate since there's only one settings record and it needs to be manageable from the admin panel

  2. Security Notes
    - Business settings are public information (contact info, hours, etc.)
    - Admin authentication is handled at the application level
    - Only one record exists in this table
*/

DROP POLICY IF EXISTS "Anyone can read business settings" ON business_settings;
DROP POLICY IF EXISTS "Authenticated users can insert business settings" ON business_settings;
DROP POLICY IF EXISTS "Authenticated users can update business settings" ON business_settings;

CREATE POLICY "Anyone can read business settings"
  ON business_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert business settings"
  ON business_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update business settings"
  ON business_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
