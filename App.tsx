import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ROUTES } from './constants';
import { Role } from './types';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import FileComplaint from './pages/FileComplaint';
import TrackComplaint from './pages/TrackComplaint';
import AdminDashboard from './pages/AdminDashboard';
import UserSignUp from './pages/UserSignUp';
import VerifyEmail from './pages/VerifyEmail';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <HashRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route path={ROUTES.USER_LOGIN} element={<UserLogin />} />
                  <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
                  <Route path={ROUTES.USER_SIGNUP} element={<UserSignUp />} />
                  <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                  <Route path={ROUTES.TRACK_COMPLAINT} element={<TrackComplaint />} />

                  {/* Protected Routes */}
                  <Route
                    path={ROUTES.FILE_COMPLAINT}
                    element={
                      <ProtectedRoute allowedRoles={[Role.USER]}>
                        <FileComplaint />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_DASHBOARD}
                    element={
                      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
