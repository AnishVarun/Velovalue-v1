import React, { useState } from 'react';
import { cn } from '../../utils';
import { Car, Bike, Menu, X, User, LogIn, UserPlus } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Navbar component with responsive mobile menu
 */
const Navbar = ({ user, onLogin, onSignup, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Car Calculator', href: '/car-calculator', icon: <Car className="h-4 w-4 mr-1" /> },
    { name: 'Bike Calculator', href: '/bike-calculator', icon: <Bike className="h-4 w-4 mr-1" /> },
    { name: 'Vehicle Models', href: '/models', icon: null },
    { name: 'Community', href: '/community', icon: null },
    { name: 'About', href: '/about', icon: null },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Car className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">VelaValue</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary hover:text-primary text-sm font-medium"
                >
                  {link.icon && link.icon}
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* User authentication buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.username}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-700">
                    {user.username}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  icon={<User className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogin}
                  icon={<LogIn className="h-4 w-4" />}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSignup}
                  icon={<UserPlus className="h-4 w-4" />}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary"
            >
              {link.icon && link.icon}
              {link.name}
            </a>
          ))}
        </div>
        {/* Mobile authentication */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.username}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.username}</div>
                <button
                  onClick={onLogout}
                  className="mt-1 text-sm font-medium text-primary hover:text-primary-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={onLogin}
                icon={<LogIn className="h-4 w-4" />}
              >
                Login
              </Button>
              <Button
                variant="primary"
                className="w-full"
                onClick={onSignup}
                icon={<UserPlus className="h-4 w-4" />}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
