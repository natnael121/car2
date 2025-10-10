import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Award, Users, Shield, Star, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

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

export const About: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('businessSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black space-y-6 pb-24 px-4 pt-6">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          {settings.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={settings.logoUrl}
                alt="Business Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold mb-3 text-white">{settings.businessName}</h1>
          <p className="text-yellow-400 text-lg font-medium mb-6">{settings.tagline}</p>

          <div className="flex justify-center gap-2 mt-6">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 p-1.5 rounded-full transition-all"
              >
                <Facebook size={16} />
              </a>
            )}
            {settings.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 p-1.5 rounded-full transition-all"
              >
                <Twitter size={16} />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 p-1.5 rounded-full transition-all"
              >
                <Instagram size={16} />
              </a>
            )}
            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 p-1.5 rounded-full transition-all"
              >
                <Linkedin size={16} />
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 p-1.5 rounded-full transition-all"
              >
                <Youtube size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">About Us</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          {settings.aboutText}
        </p>
        <p className="text-gray-300 leading-relaxed">
          {settings.aboutText2}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 hover:border-yellow-400 transition-all transform hover:scale-105">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-lg">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Certified Quality</h3>
              <p className="text-gray-400 text-sm">All vehicles undergo rigorous inspection and certification</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 hover:border-yellow-400 transition-all transform hover:scale-105">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-lg">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Expert Team</h3>
              <p className="text-gray-400 text-sm">Knowledgeable staff with years of automotive experience</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 hover:border-yellow-400 transition-all transform hover:scale-105">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Warranty Coverage</h3>
              <p className="text-gray-400 text-sm">Comprehensive warranty options for peace of mind</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 hover:border-yellow-400 transition-all transform hover:scale-105">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-400 bg-opacity-20 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Customer Rated</h3>
              <p className="text-gray-400 text-sm">4.8/5 stars from over 2,000 satisfied customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4 group">
            <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
              <MapPin className="w-5 h-5 text-yellow-400 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Address</h3>
              <p className="text-gray-300">{settings.address1}</p>
              <p className="text-gray-300">{settings.address2}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
              <Phone className="w-5 h-5 text-yellow-400 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Phone</h3>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-yellow-400 hover:underline">
                {settings.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
              <Mail className="w-5 h-5 text-yellow-400 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Email</h3>
              <a href={`mailto:${settings.email}`} className="text-yellow-400 hover:underline">
                {settings.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
              <Clock className="w-5 h-5 text-yellow-400 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Business Hours</h3>
              <div className="text-gray-300 space-y-1">
                <p>Monday - Friday: {settings.mondayFriday}</p>
                <p>Saturday: {settings.saturday}</p>
                <p>Sunday: {settings.sunday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Our Services</h2>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors">New and pre-owned vehicle sales</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Trade-in evaluations</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Financing and leasing options</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Vehicle service and maintenance</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Extended warranty programs</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
            <span className="text-gray-300 group-hover:text-white transition-colors">Parts and accessories</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
