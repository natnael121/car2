import React, { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Phone, Mail, Clock, Info } from 'lucide-react';

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
  sunday: '10:00 AM - 5:00 PM'
};

export const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('businessSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('businessSettings', JSON.stringify(settings));

    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 500);
  };

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
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
