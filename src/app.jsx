import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import PriceCalculator from './components/PriceCalculator';
import BikeCalculator from './components/BikeCalculator';
import DiscussionForum from './components/community/DiscussionForum';
import ContactForm from './components/ContactForm';
import AuthModal from './components/auth/AuthModal';
import DisclaimerPopup from './components/DisclaimerPopup';
import { getCarData } from './config/firebase';
import { Car, Bike, Calculator, Users, Mail } from 'lucide-react';
import './styles.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch car data
    const fetchCars = async () => {
      try {
        await getCarData();
      } catch (error) {
        console.error('Error fetching car data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'car-calculator':
        return <PriceCalculator />;
      case 'bike-calculator':
        return <BikeCalculator />;
      case 'community':
        return <DiscussionForum user={user} />;
      case 'contact':
        return <ContactForm />;
      case 'about':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About VelaValue</h2>
            <p className="text-lg text-gray-700 mb-6">
              VelaValue is a cutting-edge platform designed to help vehicle buyers and sellers
              get accurate price estimates for cars and bikes in India. Our advanced prediction algorithm takes
              into account multiple factors including make, model, year, mileage, condition,
              and market trends to provide the most accurate price estimates possible.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-700">
                To empower Indian consumers with transparent, accurate information about vehicle pricing,
                helping them make informed decisions and get fair deals in the automotive market.
              </p>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h3>
            <p className="text-gray-700 mb-6">
              Our price prediction algorithm analyzes vast amounts of data from various Indian sources,
              including historical sales data, current market conditions, and vehicle-specific
              factors to generate accurate price estimates. We continuously update our model to
              ensure the highest level of accuracy.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-16 py-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white">
              <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display">
                    Smart Vehicle Price Predictions
                  </h1>
                  <p className="mt-6 max-w-lg mx-auto text-xl">
                    Get accurate price estimates for cars and bikes in India using our advanced prediction technology.
                  </p>
                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('car-calculator')}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                    >
                      <Car className="mr-2 h-5 w-5" />
                      Car Price Calculator
                    </button>
                    <button
                      onClick={() => setActiveTab('bike-calculator')}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                    >
                      <Bike className="mr-2 h-5 w-5" />
                      Bike Price Calculator
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Everything you need to make informed decisions
                </p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Feature 1 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                        <Calculator className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Accurate Price Predictions</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Our advanced algorithm analyzes multiple factors to provide the most accurate price estimates in Indian Rupees.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                        <Car className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Cars & Bikes</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Get price estimates for both cars and bikes with detailed specifications and market analysis.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                        <Users className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Community Insights</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Join discussions with fellow vehicle enthusiasts and get valuable insights from the Indian market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-primary">Try our price calculators today.</span>
                </h2>
                <div className="mt-8 flex flex-wrap gap-4 lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => setActiveTab('car-calculator')}
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-600"
                    >
                      <Car className="mr-2 h-4 w-4" />
                      Car Calculator
                    </button>
                  </div>
                  <div className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => setActiveTab('bike-calculator')}
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-600"
                    >
                      <Bike className="mr-2 h-4 w-4" />
                      Bike Calculator
                    </button>
                  </div>
                  <div className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => setActiveTab('community')}
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                    >
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'home'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('car-calculator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'car-calculator'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Car className="h-4 w-4 mr-1" />
              Car Calculator
            </button>
            <button
              onClick={() => setActiveTab('bike-calculator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'bike-calculator'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bike className="h-4 w-4 mr-1" />
              Bike Calculator
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'community'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'contact'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      
      {/* Disclaimer Popup */}
      <DisclaimerPopup />
    </Layout>
  );
}

export default App;
