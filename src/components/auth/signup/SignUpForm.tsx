import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState } from 'react';
import { validateSignUpForm } from './validation';
import { toast } from 'sonner';
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format phone number as user types
    if (name === 'phoneNumber') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
        formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3').trim();
      } else {
        return; // Don't update if more than 10 digits
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { email, password, firstName, lastName, phoneNumber } = formData;
      const { isValid, errors } = validateSignUpForm(email, password);

      if (!isValid) {
        setErrorMessage(errors.join(' '));
        setIsSubmitting(false);
        return;
      }

      if (!firstName || !lastName) {
        setErrorMessage('First name and last name are required.');
        setIsSubmitting(false);
        return;
      }

      if (!phoneNumber || !/^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber)) {
        setErrorMessage('Please enter a valid phone number in the format (XXX) XXX-XXXX');
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber
          }
        }
      });

      if (error) throw error;

      if (data) {
        toast.success('Account created successfully!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Signup failed. Please try again.');
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">Get started with Thanks From Us</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              placeholder="(XXX) XXX-XXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {isSubmitting ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            disabled={isSubmitting}
          >
            Create Account
          </button>
        )}
      </form>
    </>
  );
};

export default SignUpForm;