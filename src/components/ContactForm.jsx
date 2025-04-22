import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import useToast from '../hooks/useToast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
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
      
      // Show success toast
      toast({
        title: 'Message Sent',
        description: 'Thank you for your message. We will get back to you soon!',
        type: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Contact Us</CardTitle>
        <CardDescription>
          Have questions about vehicle pricing? Send us a message and we'll get back to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<User className="h-4 w-4 text-gray-400" />}
              required
            />
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="h-4 w-4 text-gray-400" />}
              required
            />
          </div>
          
          <Input
            label="Subject"
            id="subject"
            name="subject"
            placeholder="How can we help you?"
            value={formData.subject}
            onChange={handleChange}
          />
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={`block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                  errors.message ? 'border-red-300' : ''
                }`}
                placeholder="Please describe your inquiry in detail..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            icon={<Send className="h-4 w-4" />}
          >
            Send Message
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-gray-500">
        <p>
          You can also reach us directly at{' '}
          <a href="mailto:anishvarun17@gmail.com" className="text-primary hover:underline">
            anishvarun17@gmail.com
          </a>
        </p>
        <p className="mt-1">
          We typically respond within 24-48 hours.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ContactForm;
