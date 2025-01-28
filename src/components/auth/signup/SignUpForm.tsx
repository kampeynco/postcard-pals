import { useState } from 'react';
import { validateSignUpForm } from './validation';
import { toast } from 'sonner';
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import SignUpFormHeader from './components/SignUpFormHeader';
import PersonalInfoFields from './components/PersonalInfoFields';
import AuthFields from './components/AuthFields';

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
    
    if (name === 'phoneNumber') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
        formattedValue = numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3').trim();
      } else {
        return;
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
        return;
      }

      if (!firstName || !lastName) {
        setErrorMessage('First name and last name are required.');
        return;
      }

      if (!phoneNumber || !/^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber)) {
        setErrorMessage('Please enter a valid phone number in the format (XXX) XXX-XXXX');
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
      <SignUpFormHeader />
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}
        
        <PersonalInfoFields formData={formData} handleInputChange={handleInputChange} />
        <AuthFields formData={formData} handleInputChange={handleInputChange} />

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