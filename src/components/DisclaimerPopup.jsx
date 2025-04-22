import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';

const DisclaimerPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has seen the disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('velavalue_disclaimer_seen');
    
    if (!hasSeenDisclaimer) {
      // Show the disclaimer after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Mark the disclaimer as seen
    localStorage.setItem('velavalue_disclaimer_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Welcome to VelaValue - Disclaimer
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    This application uses web scraping technology (BeautifulSoup) and APIs to gather vehicle price data from various sources. Please note the following:
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <p className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>The price estimates provided are for informational purposes only and may not reflect actual market prices.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Data is collected from publicly available sources and may not always be up-to-date or accurate.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>This is a special project created by Varun Anish for IFHE and is not intended for commercial use.</span>
                    </p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">About This Project</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            VelaValue is a vehicle price calculator that provides estimates for cars and bikes in India. 
                            It uses a combination of web scraping, APIs, and predictive algorithms to generate price estimates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              I Understand
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
