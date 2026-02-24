import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import { Role } from '../types';
import NotificationBell from './NotificationBell';
import { useTranslation } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-blue-600">
              {t('appName')}
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link to={ROUTES.HOME} className="text-gray-600 hover:text-blue-600 font-medium">{t('home')}</Link>
            {isAuthenticated && user?.role === Role.USER && (
               <>
                <Link to={ROUTES.FILE_COMPLAINT} className="text-gray-600 hover:text-blue-600 font-medium">{t('fileComplaint')}</Link>
                <Link to={ROUTES.TRACK_COMPLAINT} className="text-gray-600 hover:text-blue-600 font-medium">{t('myComplaints')}</Link>
               </>
            )}
             {isAuthenticated && user?.role === Role.ADMIN && (
                <Link to={ROUTES.ADMIN_DASHBOARD} className="text-gray-600 hover:text-blue-600 font-medium">{t('dashboard')}</Link>
            )}
             {!isAuthenticated && (
                 <Link to={ROUTES.TRACK_COMPLAINT} className="text-gray-600 hover:text-blue-600 font-medium">{t('trackComplaint')}</Link>
            )}
          </nav>
          <div className="flex items-center">
             <div className="mr-4">
                <LanguageSelector />
             </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === Role.USER && <NotificationBell />}
                <span className="text-gray-700 hidden sm:block">{t('welcomeUser', { name: user?.name?.split(' ')[0] ?? '' })}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to={ROUTES.USER_LOGIN}
                  className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  {t('userLogin')}
                </Link>
                <Link
                  to={ROUTES.ADMIN_LOGIN}
                  className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                  {t('adminLogin')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
