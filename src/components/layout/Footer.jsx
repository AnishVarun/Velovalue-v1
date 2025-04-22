import React from 'react';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Enhanced Footer component with multiple sections and social links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Auto Price Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              The most accurate car price prediction platform, helping you make informed decisions about your vehicle purchases.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Home', 'Price Calculator', 'Car Models', 'Community', 'About Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Car Categories
            </h3>
            <ul className="space-y-2">
              {['Sedans', 'SUVs', 'Trucks', 'Luxury', 'Electric', 'Hybrid'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Auto Lane, Car City, CC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@autopricepro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} Auto Price Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
