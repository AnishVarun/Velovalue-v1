import React, { useState, useEffect } from 'react';
import { Car, DollarSign, Calendar, Gauge, Award, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
// We'll use both Firebase and our new API
import { predictCarPrice } from '../config/firebase';

/**
 * PriceCalculator component for predicting car prices
 */
const PriceCalculator = () => {
  // Function to format currency in Indian Rupees
  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    condition: 'good',
    fuelType: 'gasoline',
    transmission: 'automatic',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const fetchPriceFromApi = async (carData) => {
    try {
      const url = new URL('http://localhost:5000/api/vehicle-price');
      url.search = new URLSearchParams({
        make: carData.make,
        model: carData.model,
        year: carData.year,
        condition: carData.condition,
        vehicle_type: 'car'
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
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
      };

      let result;

      // Try to use the API if it's online
      if (apiStatus.isOnline) {
        try {
          result = await fetchPriceFromApi(carData);
        } catch (apiError) {
          console.error('API error, falling back to Firebase:', apiError);
          // Fallback to Firebase if API fails
          result = await predictCarPrice(carData);
        }
      } else {
        // Use Firebase if API is offline
        result = await predictCarPrice(carData);
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

  const fuelTypeOptions = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Car Price Calculator</h2>
        <p className="text-gray-600">
          Enter your vehicle details below to get an accurate price estimate
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
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>
              Fill in the details about your car to get a price estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Make"
                  id="make"
                  name="make"
                  placeholder="e.g., Toyota"
                  value={formData.make}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Model"
                  id="model"
                  name="model"
                  placeholder="e.g., Camry"
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
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Mileage"
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  placeholder="e.g., 50000"
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
                  label="Fuel Type"
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  {fuelTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Transmission"
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                >
                  {transmissionOptions.map((option) => (
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
              Your vehicle's estimated market value
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
                        : 'Firebase Algorithm'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>Enter your vehicle details and click "Calculate Price" to see the estimated value</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceCalculator;
