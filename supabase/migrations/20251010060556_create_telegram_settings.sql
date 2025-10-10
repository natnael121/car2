/*
  # Create Telegram Settings Table

  1. New Tables
    - `telegram_settings`
      - `id` (uuid, primary key) - Unique identifier
      - `admin_user_id` (text) - Telegram user ID for receiving notifications
      - `channel_id` (text) - Telegram channel/group ID for promotions
      - `created_at` (timestamptz) - When the settings were created
      - `updated_at` (timestamptz) - When the settings were last updated

  2. Security
    - Enable RLS on `telegram_settings` table
    - Add policy for authenticated users to read settings
    - Add policy for authenticated users to update settings

  3. Notes
    - Only one row of settings should exist (enforced by application logic)
    - Settings are globally accessible to all authenticated admin users
*/

CREATE TABLE IF NOT EXISTS telegram_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id text DEFAULT '',
  channel_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE telegram_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read telegram settings"
  ON telegram_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert telegram settings"
  ON telegram_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update telegram settings"
  ON telegram_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete telegram settings"
  ON telegram_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default empty settings if none exist
INSERT INTO telegram_settings (admin_user_id, channel_id)
SELECT '', ''
WHERE NOT EXISTS (SELECT 1 FROM telegram_settings LIMIT 1);
