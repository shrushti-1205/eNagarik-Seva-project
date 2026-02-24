import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>{t('footerText', { year: new Date().getFullYear(), appName: t('appName') })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
