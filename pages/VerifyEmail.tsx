import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { ROUTES } from '../constants';
import Spinner from '../components/Spinner';
import { useTranslation } from '../contexts/LanguageContext';

type VerificationStatus = 'verifying' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const { t } = useTranslation();

  useEffect(() => {
    const verify = async () => {
      if (!userId) {
        setStatus('error');
        return;
      }
      try {
        const success = await apiService.verifyUserEmail(userId);
        setStatus(success ? 'success' : 'error');
      } catch (e) {
        setStatus('error');
      }
    };

    verify();
  }, [userId]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800">{t('verifyingEmail')}</h2>
            <Spinner />
          </>
        );
      case 'success':
        return (
          <>
            <svg className="mx-auto h-12 w-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">{t('verificationSuccessTitle')}</h2>
            <p className="mt-2 text-gray-600">{t('verificationSuccessText')}</p>
            <Link
              to={ROUTES.USER_LOGIN}
              className="mt-6 inline-block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {t('proceedToLogin')}
            </Link>
          </>
        );
      case 'error':
        return (
          <>
            <svg className="mx-auto h-12 w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">{t('verificationFailedTitle')}</h2>
            <p className="mt-2 text-gray-600">{t('verificationFailedText')}</p>
            <Link
              to={ROUTES.USER_SIGNUP}
              className="mt-6 inline-block w-full text-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
            >
              {t('backToSignUp')}
            </Link>
          </>
        );
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 p-10 bg-white shadow-lg rounded-xl text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmail;
