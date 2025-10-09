import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Award, Users, Shield, Star } from 'lucide-react';

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

export const About: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('businessSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{settings.businessName}</h1>
        <p className="text-blue-100 text-lg">{settings.tagline}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {settings.aboutText}
        </p>
        <p className="text-gray-700 leading-relaxed">
          {settings.aboutText2}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Certified Quality</h3>
              <p className="text-gray-600 text-sm">All vehicles undergo rigorous inspection and certification</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Expert Team</h3>
              <p className="text-gray-600 text-sm">Knowledgeable staff with years of automotive experience</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Warranty Coverage</h3>
              <p className="text-gray-600 text-sm">Comprehensive warranty options for peace of mind</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Customer Rated</h3>
              <p className="text-gray-600 text-sm">4.8/5 stars from over 2,000 satisfied customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600">{settings.address1}</p>
              <p className="text-gray-600">{settings.address2}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:underline">
                {settings.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <a href={`mailto:${settings.email}`} className="text-blue-600 hover:underline">
                {settings.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
              <div className="text-gray-600 space-y-1">
                <p>Monday - Friday: {settings.mondayFriday}</p>
                <p>Saturday: {settings.saturday}</p>
                <p>Sunday: {settings.sunday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h2>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">New and pre-owned vehicle sales</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Trade-in evaluations</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Financing and leasing options</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Vehicle service and maintenance</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Extended warranty programs</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Parts and accessories</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
