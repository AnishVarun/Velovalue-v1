import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from '../ui/Toast';
import useToast from '../../hooks/useToast';

/**
 * Layout component that wraps all pages with common elements
 */
const Layout = ({ children }) => {
  const { toasts, dismissToast } = useToast();
  const [user, setUser] = React.useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </div>
  );
};

export default Layout;
