import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LogIn, Mail, Lock, Chrome } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithGoogle } from '../../config/firebase';

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
      // Use Firebase authentication
      const result = await signInWithEmailAndPassword(formData.email, formData.password);

      onLogin({
        uid: result.user.uid,
        username: result.user.displayName || formData.email.split('@')[0],
        email: result.user.email,
        photoURL: result.user.photoURL,
      });
    } catch (error) {
      setErrors({
        form: error.message || 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Use Firebase Google authentication
      const result = await signInWithGoogle();

      onLogin({
        uid: result.user.uid,
        username: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });
    } catch (error) {
      setErrors({
        form: error.message || 'Google login failed',
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
            Login with Email
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            icon={<Chrome className="h-4 w-4 text-blue-500" />}
          >
            Login with Google
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
