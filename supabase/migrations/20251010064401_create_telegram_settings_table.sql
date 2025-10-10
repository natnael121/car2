/*
  # Create Telegram Settings Table

  1. New Tables
    - `telegram_settings`
      - `id` (uuid, primary key)
      - `admin_user_id` (text) - Telegram user ID for receiving notifications
      - `channel_id` (text) - Telegram channel/group ID for promotions
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `telegram_settings` table
    - Add policy for anyone to read, insert, and update settings
    - Admin authentication is handled at the application level

  3. Notes
    - Only one row of settings should exist (enforced by application logic)
*/

CREATE TABLE IF NOT EXISTS telegram_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id text DEFAULT '',
  channel_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE telegram_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read telegram settings"
  ON telegram_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert telegram settings"
  ON telegram_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update telegram settings"
  ON telegram_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);