/*
  # Create Business Settings Table

  1. New Tables
    - `business_settings`
      - `id` (uuid, primary key)
      - `business_name` (text)
      - `tagline` (text)
      - `about_text` (text)
      - `about_text2` (text)
      - `address1` (text)
      - `address2` (text)
      - `phone` (text)
      - `email` (text)
      - `monday_friday` (text)
      - `saturday` (text)
      - `sunday` (text)
      - `logo_url` (text)
      - `facebook_url` (text)
      - `twitter_url` (text)
      - `instagram_url` (text)
      - `linkedin_url` (text)
      - `youtube_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `business_settings` table
    - Add policy for anyone to read settings
    - Add policy for anyone to insert/update settings

  3. Notes
    - Only one row of settings should exist (enforced by application logic)
*/

CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text DEFAULT 'Car Dealership',
  tagline text DEFAULT 'Your trusted automotive partner',
  about_text text DEFAULT '',
  about_text2 text DEFAULT '',
  address1 text DEFAULT '',
  address2 text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  monday_friday text DEFAULT '9:00 AM - 7:00 PM',
  saturday text DEFAULT '9:00 AM - 6:00 PM',
  sunday text DEFAULT '10:00 AM - 5:00 PM',
  logo_url text DEFAULT '',
  facebook_url text DEFAULT '',
  twitter_url text DEFAULT '',
  instagram_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  youtube_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

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