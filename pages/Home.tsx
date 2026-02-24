import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          {t('welcomeMessage')}
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
          {t('welcomeSubtitle')}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('fileComplaint')}</h2>
          <p className="text-gray-600 mb-6">Encountered an issue? Submit a new complaint quickly and easily. Provide details, upload evidence, and let us take care of the rest.</p>
          <Link
            to={ROUTES.FILE_COMPLAINT}
            className="w-full sm:w-auto text-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {t('submitNow')}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('trackComplaint')}</h2>
          <p className="text-gray-600 mb-6">Stay updated on the status of your submitted complaints. Enter your complaint ID or log in to view your history.</p>
          <Link
            to={ROUTES.TRACK_COMPLAINT}
            className="w-full sm:w-auto text-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            {t('trackStatus')}
          </Link>
        </div>
      </div>
       {isAuthenticated && user?.role === Role.ADMIN && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700">You are logged in as an administrator.</p>
            <Link to={ROUTES.ADMIN_DASHBOARD} className="mt-4 inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition duration-200">
              {t('dashboard')}
            </Link>
          </div>
        )}
    </div>
  );
};

export default Home;
