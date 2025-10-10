/*
  # Create business settings table

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
    - Add policy for public read access
    - Add policy for authenticated insert/update

  3. Notes
    - This table stores the dealership's business information and settings
    - Only one record should exist in this table (enforced by the app)
*/

CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Car Dealership',
  tagline text NOT NULL DEFAULT 'Your trusted automotive partner',
  about_text text NOT NULL DEFAULT 'Welcome to our dealership',
  about_text2 text NOT NULL DEFAULT 'We are dedicated to serving you',
  address1 text NOT NULL DEFAULT '123 Main Street',
  address2 text NOT NULL DEFAULT 'Anytown, ST 12345',
  phone text NOT NULL DEFAULT '(555) 123-4567',
  email text NOT NULL DEFAULT 'info@dealership.com',
  monday_friday text NOT NULL DEFAULT '9:00 AM - 7:00 PM',
  saturday text NOT NULL DEFAULT '9:00 AM - 6:00 PM',
  sunday text NOT NULL DEFAULT '10:00 AM - 5:00 PM',
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
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert business settings"
  ON business_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update business settings"
  ON business_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
