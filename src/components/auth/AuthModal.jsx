import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

/**
 * Authentication modal component that toggles between login and signup
 */
const AuthModal = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [activeTab, setActiveTab] = useState('login');

  if (!isOpen) return null;

  const handleLogin = (userData) => {
    onLogin(userData);
    onClose();
  };

  const handleSignup = (userData) => {
    onSignup(userData);
    onClose();
  };

  const switchToLogin = () => setActiveTab('login');
  const switchToSignup = () => setActiveTab('signup');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6">
          {activeTab === 'login' ? (
            <LoginForm onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
          ) : (
            <SignupForm onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
