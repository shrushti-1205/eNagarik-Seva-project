import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { apiService } from '../services/apiService';
import { User } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

const UserSignUp: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [newUser, setNewUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError(t('errors.passwordMin6'));
        return;
    }
    setError('');
    setIsLoading(true);

    try {
        const registeredUser = await apiService.registerUser(name, email, password, phone);
        if (registeredUser) {
            setNewUser(registeredUser);
            setRegistrationSuccess(true);
        } else {
            setError(t('errors.emailExists'));
        }
    } catch (err) {
        setError(t('errors.registrationFailed'));
    } finally {
        setIsLoading(false);
    }
  };

  if (registrationSuccess && newUser) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl text-center">
          <div>
            <svg className="mx-auto h-12 w-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Registration Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              A verification link has been sent to <strong>{email}</strong>. Please check your inbox to activate your account.
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-left">
            <p className="font-bold">Mock Environment Notice</p>
            <p className="text-sm">Since this is a demo, no email is sent. Please click the link below to verify your account:</p>
            <Link
              to={ROUTES.VERIFY_EMAIL.replace(':userId', newUser.userId)}
              className="mt-2 inline-block font-medium text-blue-600 hover:text-blue-500 break-all"
            >
              Verify My Account
            </Link>
          </div>

          <div className="mt-6">
            <Link to={ROUTES.USER_LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('createAccountSubtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">{t('fullName')}</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('fullName')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">{t('email')}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">{t('phone')}</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`${t('phone')} (optional)`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('passwordMin6')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? t('creatingAccount') : t('createAccountBtn')}
            </button>
          </div>
          <div className="text-sm text-center">
             <p className="text-gray-600">
                {t('alreadyHaveAccount')}
                <Link to={ROUTES.USER_LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
                  {t('signIn')}
                </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;
