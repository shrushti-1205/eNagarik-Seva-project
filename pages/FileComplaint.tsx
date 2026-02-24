import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import { ComplaintCategory } from '../types';
import { COMPLAINT_CATEGORIES, ROUTES } from '../constants';
import Spinner from '../components/Spinner';
import { useTranslation } from '../contexts/LanguageContext';

const FileComplaint: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>(COMPLAINT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [voice, setVoice] = useState<File | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(`Failed to get location: ${error.message}`);
        setIsGettingLocation(false);
      }
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError(t('errors.titleRequired'));
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    // Simulate file upload and getting URLs
    const photoURL = photo ? URL.createObjectURL(photo) : undefined;
    const voiceURL = voice ? URL.createObjectURL(voice) : undefined;

    try {
      const newComplaint = await apiService.submitComplaint({
        userId: isAnonymous ? null : user!.userId,
        title,
        description,
        category,
        photoURL,
        voiceURL,
        location,
        isAnonymous,
      });
      alert(t('complaintSubmittedSuccess', { id: newComplaint.complaintId }));
      navigate(ROUTES.TRACK_COMPLAINT);
    } catch (err) {
      setError(t('errors.complaintSubmissionFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{t('fileNewComplaint')}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('title')}</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('category')}</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value as ComplaintCategory)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                {COMPLAINT_CATEGORIES.map(cat => <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('description')}</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">{t('photoOptional')}</label>
                  <input type="file" id="photo" accept="image/*" onChange={e => setPhoto(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
               </div>
               <div>
                  <label htmlFor="voice" className="block text-sm font-medium text-gray-700">{t('voiceNoteOptional')}</label>
                  <input type="file" id="voice" accept="audio/*" onChange={e => setVoice(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('locationOptional')}</label>
              <div className="mt-1 flex items-center space-x-4">
                <button 
                  type="button" 
                  onClick={handleGetLocation} 
                  disabled={isGettingLocation}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isGettingLocation ? t('gettingLocation') : t('addCurrentLocation')}
                </button>
                {location && <span className="text-green-600 text-sm">{t('locationAdded')}</span>}
              </div>
              {locationError && <p className="mt-2 text-sm text-red-600">{locationError}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="anonymous" name="anonymous" type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"/>
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="anonymous" className="font-medium text-gray-700">{t('submitAnonymously')}</label>
                <p className="text-gray-500">{t('anonymousDescription')}</p>
              </div>
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                {isSubmitting ? <Spinner/> : t('submitComplaint')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileComplaint;
