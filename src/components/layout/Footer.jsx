import React from 'react';
import { Car, Bike, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Info, Shield, FileText } from 'lucide-react';

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
              <span className="ml-2 text-xl font-bold">VelaValue</span>
            </div>
            <p className="text-gray-400 text-sm">
              India's most accurate vehicle price prediction platform, helping you make informed decisions about your car and bike purchases.
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
              {[
                { name: 'Home', href: '#' },
                { name: 'Car Calculator', href: '#' },
                { name: 'Bike Calculator', href: '#' },
                { name: 'Vehicle Models', href: '#' },
                { name: 'Community', href: '#' },
                { name: 'About Us', href: '#' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Vehicle Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">Cars</h4>
                <ul className="space-y-2">
                  {['Hatchbacks', 'Sedans', 'SUVs', 'MUVs', 'Luxury', 'Electric'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-2">Bikes</h4>
                <ul className="space-y-2">
                  {['Standard', 'Sports', 'Cruiser', 'Scooter', 'Electric', 'Off-Road'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                  IFHE Campus, Hyderabad, Telangana, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 7396947531</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">anishvarun17@gmail.com</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-gray-400 text-sm text-center">
            <p>&copy; {currentYear} VelaValue. All rights reserved.</p>
            <p className="mt-2">Special Project by Varun Anish for IFHE</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
