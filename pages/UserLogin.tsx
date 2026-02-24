import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { ROUTES } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';

const UserLogin: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(emailOrPhone, password, Role.USER);
    setIsLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      if (result.reason === 'NOT_VERIFIED') {
        setError(t('notVerified'));
      } else {
        setError(t('errors.invalidCredentials'));
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('loginTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('loginSubtitle')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-or-phone" className="sr-only">{t('emailOrPhone')}</label>
              <input
                id="email-or-phone"
                name="email-or-phone"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('emailOrPhone')}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? t('signingIn') : t('signIn')}
            </button>
          </div>
          <div className="text-sm text-center">
             <p className="text-gray-600">
                {t('dontHaveAccount')}
                <Link to={ROUTES.USER_SIGNUP} className="font-medium text-blue-600 hover:text-blue-500">
                  {t('signUp')}
                </Link>
            </p>
            <p className="mt-2">
                <Link to={ROUTES.ADMIN_LOGIN} className="font-medium text-gray-600 hover:text-gray-500">
                  {t('areYouAdmin')}
                </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
