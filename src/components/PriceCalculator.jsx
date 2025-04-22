import React, { useState } from 'react';
import { Car, DollarSign, Calendar, Gauge, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { formatCurrency } from '../utils';
import { predictPrice } from '../ml';

/**
 * PriceCalculator component for predicting car prices
 */
const PriceCalculator = () => {
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

  const handleSubmit = (e) => {
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
        id: Date.now(), // Temporary ID for prediction function
        price: 0, // Placeholder price for prediction function
      };

      // Get prediction
      setTimeout(() => {
        const result = predictPrice(carData);
        setPrediction({
          estimatedPrice: result,
          confidence: 0.85,
          marketComparison: 'Average',
          priceRange: {
            low: result * 0.9,
            high: result * 1.1,
          },
        });
        setIsLoading(false);
      }, 1500); // Simulate API delay
    } catch (err) {
      setError(err.message);
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
                    {formatCurrency(prediction.estimatedPrice)}
                  </p>
                  <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {Math.round(prediction.confidence * 100)}% Confidence
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Price Range</p>
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(prediction.priceRange.low)}</span>
                    <span>{formatCurrency(prediction.priceRange.high)}</span>
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
