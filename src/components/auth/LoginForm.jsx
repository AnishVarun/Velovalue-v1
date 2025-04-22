import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LogIn, Mail, Lock } from 'lucide-react';

/**
 * Login form component
 */
const LoginForm = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any login with valid format
      onLogin({ 
        username: formData.email.split('@')[0],
        email: formData.email,
      });
    } catch (error) {
      setErrors({
        form: 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          {errors.form && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {errors.form}
            </div>
          )}
          
          <div className="flex justify-end">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            icon={<LogIn className="h-4 w-4" />}
          >
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
