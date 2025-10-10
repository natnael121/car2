import React, { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Phone, Mail, Clock, Info, Image, Share2, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessSettings {
  businessName: string;
  tagline: string;
  aboutText: string;
  aboutText2: string;
  address1: string;
  address2: string;
  phone: string;
  email: string;
  mondayFriday: string;
  saturday: string;
  sunday: string;
  logoUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}

interface TelegramSettings {
  id?: string;
  admin_user_id: string;
  channel_id: string;
}

const defaultSettings: BusinessSettings = {
  businessName: 'Car Dealership',
  tagline: 'Your trusted automotive partner since 2005',
  aboutText: 'Welcome to Car Dealership, where we\'ve been serving our community with quality vehicles and exceptional service for over 18 years. We pride ourselves on offering a wide selection of new and pre-owned vehicles to suit every lifestyle and budget.',
  aboutText2: 'Our experienced team is dedicated to making your car buying experience smooth, transparent, and enjoyable. From the moment you walk through our doors to long after you drive away, we\'re here to support you with expert advice and outstanding customer service.',
  address1: '123 Main Street',
  address2: 'Anytown, ST 12345',
  phone: '(555) 123-4567',
  email: 'info@cardealership.com',
  mondayFriday: '9:00 AM - 7:00 PM',
  saturday: '9:00 AM - 6:00 PM',
  sunday: '10:00 AM - 5:00 PM',
  logoUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: ''
};

export const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>({
    admin_user_id: '',
    channel_id: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('businessSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    loadTelegramSettings();
  }, []);

  const loadTelegramSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('telegram_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTelegramSettings({
          id: data.id,
          admin_user_id: data.admin_user_id || '',
          channel_id: data.channel_id || '',
        });
      }
    } catch (error) {
      console.error('Error loading Telegram settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('businessSettings', JSON.stringify(settings));

      if (telegramSettings.id) {
        await supabase
          .from('telegram_settings')
          .update({
            admin_user_id: telegramSettings.admin_user_id,
            channel_id: telegramSettings.channel_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', telegramSettings.id);
      } else {
        const { data, error } = await supabase
          .from('telegram_settings')
          .insert({
            admin_user_id: telegramSettings.admin_user_id,
            channel_id: telegramSettings.channel_id,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setTelegramSettings({
            id: data.id,
            admin_user_id: data.admin_user_id,
            channel_id: data.channel_id,
          });
        }
      }

      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleTelegramChange = (field: keyof TelegramSettings, value: string) => {
    if (field === 'id') return;
    setTelegramSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your dealership information and About page content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveMessage && (
        <div className={`${
          saveMessage.includes('Error')
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-green-50 border-green-200 text-green-800'
        } border px-4 py-3 rounded-lg`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Send className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Telegram Integration</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                Configure your Telegram settings to receive notifications for test drives and trade-ins,
                and to promote vehicles to your Telegram channel or group.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin User ID
              </label>
              <input
                type="text"
                value={telegramSettings.admin_user_id}
                onChange={(e) => handleTelegramChange('admin_user_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Telegram User ID (e.g., 123456789)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get your user ID by messaging <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@userinfobot</a> on Telegram
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel/Group ID
              </label>
              <input
                type="text"
                value={telegramSettings.channel_id}
                onChange={(e) => handleTelegramChange('channel_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="@your_channel or -1001234567890"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use @channel_username for public channels or numeric ID for private channels/groups
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Setup Instructions:</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Get your Telegram user ID from @userinfobot</li>
                <li>Create or use an existing Telegram channel/group</li>
                <li>Add @car_shop_MD_bot as an administrator with posting permissions</li>
                <li>Get the channel/group ID (for private ones, forward a message to @userinfobot)</li>
                <li>Save your settings using the button above</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Car Dealership"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your trusted automotive partner since 2005"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Logo</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={settings.logoUrl || ''}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
            <p className="text-sm text-gray-500 mt-1">Enter the URL of your business logo</p>
            {settings.logoUrl && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                <img
                  src={settings.logoUrl}
                  alt="Logo Preview"
                  className="h-20 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Social Media</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitterUrl || ''}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.linkedinUrl || ''}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/company/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtubeUrl || ''}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/@yourbusiness"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">About Us Content</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Us - Paragraph 1
              </label>
              <textarea
                value={settings.aboutText}
                onChange={(e) => handleChange('aboutText', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="First paragraph of your about section..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Us - Paragraph 2
              </label>
              <textarea
                value={settings.aboutText2}
                onChange={(e) => handleChange('aboutText2', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Second paragraph of your about section..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={settings.address1}
                onChange={(e) => handleChange('address1', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={settings.address2}
                onChange={(e) => handleChange('address2', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Anytown, ST 12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone size={16} className="inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail size={16} className="inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="info@cardealership.com"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monday - Friday
              </label>
              <input
                type="text"
                value={settings.mondayFriday}
                onChange={(e) => handleChange('mondayFriday', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="9:00 AM - 7:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saturday
              </label>
              <input
                type="text"
                value={settings.saturday}
                onChange={(e) => handleChange('saturday', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="9:00 AM - 6:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sunday
              </label>
              <input
                type="text"
                value={settings.sunday}
                onChange={(e) => handleChange('sunday', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10:00 AM - 5:00 PM"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
