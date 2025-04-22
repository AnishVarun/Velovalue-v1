import React, { useState, useEffect } from 'react';
import { Bike, DollarSign, Calendar, Gauge, Award, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { formatCurrency } from '../utils';

/**
 * BikeCalculator component for predicting bike prices
 */
const BikeCalculator = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    condition: 'good',
    engineSize: '150-250',
    bikeType: 'standard',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [apiStatus, setApiStatus] = useState({
    isOnline: false,
    message: 'Checking API status...'
  });

  // Check if the API is online
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setApiStatus({
            isOnline: true,
            message: 'API is online. Using real-time data.'
          });
        } else {
          setApiStatus({
            isOnline: false,
            message: 'API is offline. Using fallback data.'
          });
        }
      } catch (error) {
        setApiStatus({
          isOnline: false,
          message: 'API is offline. Using fallback data.'
        });
      }
    };

    checkApiStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchPriceFromApi = async (bikeData) => {
    try {
      const url = new URL('http://localhost:5000/api/bike-price');
      url.search = new URLSearchParams({
        make: bikeData.make,
        model: bikeData.model,
        year: bikeData.year,
        condition: bikeData.condition
      }).toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const data = await response.json();
      return {
        estimatedPrice: data.average_price,
        confidence: data.confidence,
        marketComparison: data.source === 'web_scraping' ? 'Based on real market data' : 'Estimated',
        priceRange: {
          low: data.min_price,
          high: data.max_price,
        },
        currency: data.currency || 'INR'
      };
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  };

  const generateFallbackPrice = (bikeData) => {
    // Base prices by bike type in INR
    const basePricesByType = {
      'standard': 100000,    // 1 lakh
      'sports': 150000,      // 1.5 lakhs
      'cruiser': 180000,     // 1.8 lakhs
      'touring': 200000,     // 2 lakhs
      'off-road': 120000,    // 1.2 lakhs
      'scooter': 80000,      // 80k
      'electric': 110000,    // 1.1 lakhs
    };

    // Engine size multipliers
    const engineSizeMultipliers = {
      'under-125': 0.8,
      '125-150': 0.9,
      '150-250': 1.0,
      '250-500': 1.3,
      '500-750': 1.8,
      'over-750': 2.5,
    };

    // Get base price based on bike type
    const basePrice = basePricesByType[bikeData.bikeType] || 100000;
    
    // Apply engine size multiplier
    const engineMultiplier = engineSizeMultipliers[bikeData.engineSize] || 1.0;
    
    // Adjust for year (bikes depreciate faster than cars)
    const currentYear = new Date().getFullYear();
    const yearFactor = 1 - ((currentYear - bikeData.year) * 0.1);
    
    // Adjust for condition
    const conditionFactors = {
      'excellent': 1.15,
      'good': 1.0,
      'fair': 0.8,
      'poor': 0.6,
    };
    const conditionFactor = conditionFactors[bikeData.condition] || 1.0;
    
    // Calculate price
    let price = basePrice * engineMultiplier * Math.max(0.3, yearFactor) * conditionFactor;
    
    // Add some randomness
    price = price * (0.95 + Math.random() * 0.1);
    
    return {
      estimatedPrice: Math.round(price),
      confidence: 0.7,
      marketComparison: 'Estimated (fallback)',
      priceRange: {
        low: Math.round(price * 0.85),
        high: Math.round(price * 1.15),
      },
      currency: 'INR'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.make || !formData.model || !formData.year || !formData.mileage) {
        throw new Error('Please fill in all required fields');
      }

      // Convert to appropriate types
      const bikeData = {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
      };

      let result;

      // Try to use the API if it's online
      if (apiStatus.isOnline) {
        try {
          result = await fetchPriceFromApi(bikeData);
        } catch (apiError) {
          console.error('API error, falling back to algorithm:', apiError);
          // Fallback to algorithm if API fails
          result = generateFallbackPrice(bikeData);
        }
      } else {
        // Use algorithm if API is offline
        result = generateFallbackPrice(bikeData);
      }

      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'An error occurred while calculating the price');
    } finally {
      setIsLoading(false);
    }
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const engineSizeOptions = [
    { value: 'under-125', label: 'Under 125cc' },
    { value: '125-150', label: '125cc - 150cc' },
    { value: '150-250', label: '150cc - 250cc' },
    { value: '250-500', label: '250cc - 500cc' },
    { value: '500-750', label: '500cc - 750cc' },
    { value: 'over-750', label: 'Over 750cc' },
  ];

  const bikeTypeOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'sports', label: 'Sports' },
    { value: 'cruiser', label: 'Cruiser' },
    { value: 'touring', label: 'Touring' },
    { value: 'off-road', label: 'Off-Road' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'electric', label: 'Electric' },
  ];

  // Function to format currency in Indian Rupees
  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bike Price Calculator</h2>
        <p className="text-gray-600">
          Enter your bike details below to get an accurate price estimate
        </p>
        <div className={`mt-2 text-sm flex items-center ${apiStatus.isOnline ? 'text-green-600' : 'text-amber-600'}`}>
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{apiStatus.message}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bike Information</CardTitle>
            <CardDescription>
              Fill in the details about your bike to get a price estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Make"
                  id="make"
                  name="make"
                  placeholder="e.g., Hero, Bajaj, Honda"
                  value={formData.make}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Model"
                  id="model"
                  name="model"
                  placeholder="e.g., Splendor, Pulsar, Activa"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Year"
                  id="year"
                  name="year"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Mileage (km)"
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  placeholder="e.g., 15000"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Condition"
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Engine Size"
                  id="engineSize"
                  name="engineSize"
                  value={formData.engineSize}
                  onChange={handleChange}
                >
                  {engineSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Bike Type"
                  id="bikeType"
                  name="bikeType"
                  value={formData.bikeType}
                  onChange={handleChange}
                >
                  {bikeTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                icon={<DollarSign className="h-4 w-4" />}
              >
                Calculate Price
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Price Estimate</CardTitle>
            <CardDescription>
              Your bike's estimated market value
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Estimated Price</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatIndianRupees(prediction.estimatedPrice)}
                  </p>
                  <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {Math.round(prediction.confidence * 100)}% Confidence
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Price Range</p>
                  <div className="flex justify-between text-sm">
                    <span>{formatIndianRupees(prediction.priceRange.low)}</span>
                    <span>{formatIndianRupees(prediction.priceRange.high)}</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full w-1/2"></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Market Comparison:</span>
                    <span className="font-medium">{prediction.marketComparison}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Data Source:</span>
                    <span className="font-medium">
                      {apiStatus.isOnline && prediction.marketComparison.includes('real') 
                        ? 'Web Scraping API' 
                        : 'Prediction Algorithm'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bike className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>Enter your bike details and click "Calculate Price" to see the estimated value</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BikeCalculator;
