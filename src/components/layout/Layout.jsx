import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from '../ui/Toast';
import useToast from '../../hooks/useToast';
import AuthModal from '../auth/AuthModal';
import { onAuthChange, signOut } from '../../config/firebase';

/**
 * Layout component that wraps all pages with common elements
 */
const Layout = ({ children }) => {
  const { toasts, dismissToast, toast } = useToast();
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        // User is signed in
        setUser({
          uid: authUser.uid,
          username: authUser.displayName || authUser.email.split('@')[0],
          email: authUser.email,
          photoURL: authUser.photoURL,
        });
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    toast({
      title: 'Login Successful',
      description: `Welcome back, ${userData.username}!`,
      type: 'success',
    });
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    toast({
      title: 'Signup Successful',
      description: `Welcome to VelaValue, ${userData.username}!`,
      type: 'success',
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        type: 'info',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        type: 'error',
      });
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={user}
        onLogin={() => openAuthModal('login')}
        onSignup={() => openAuthModal('signup')}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        initialView={authMode}
      />
    </div>
  );
};

export default Layout;
