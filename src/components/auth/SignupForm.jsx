import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UserPlus, Mail, Lock, User, Check } from 'lucide-react';

/**
 * Signup form component
 */
const SignupForm = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any signup with valid format
      onSignup({ 
        username: formData.name,
        email: formData.email,
      });
    } catch (error) {
      setErrors({
        form: 'An error occurred during signup. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Join our community of car enthusiasts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={<User className="h-4 w-4 text-gray-400" />}
          />
          
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail className="h-4 w-4 text-gray-400" />}
          />
          
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock className="h-4 w-4 text-gray-400" />}
          />
          
          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<Check className="h-4 w-4 text-gray-400" />}
          />
          
          {errors.form && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {errors.form}
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            icon={<UserPlus className="h-4 w-4" />}
          >
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Log in
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
