import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/apiService';
import { Complaint, ComplaintStatus } from '../types';
import Spinner from '../components/Spinner';
import { useTranslation } from '../contexts/LanguageContext';

const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const statusClasses = {
    [ComplaintStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ComplaintStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [ComplaintStatus.RESOLVED]: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {t(`statuses.${status}`)}
    </span>
  );
};

const ComplaintDetails: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 mt-6 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{complaint.title}</h3>
          <p className="text-sm text-gray-500">{t('id')}: {complaint.complaintId} | {t('category')}: {t(`categories.${complaint.category}`)}</p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>
      <div className="mt-4 border-t pt-4">
        <p className="text-gray-700">{complaint.description}</p>
        {complaint.remarks && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800">{t('remarks')}:</h4>
            <p className="text-gray-600 italic">"{complaint.remarks}"</p>
          </div>
        )}
        <p className="text-right text-xs text-gray-400 mt-4">
          {t('submitted')}: {new Date(complaint.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const TrackComplaint: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const [complaintId, setComplaintId] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(null);
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserComplaints = useCallback(async () => {
    if (isAuthenticated && user) {
      setIsLoading(true);
      const complaints = await apiService.getComplaintsByUserId(user.userId);
      setUserComplaints(complaints);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchUserComplaints();
  }, [fetchUserComplaints]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId) return;
    setIsLoading(true);
    setError('');
    setSearchedComplaint(null);
    const result = await apiService.getComplaintById(complaintId);
    if (result) {
      setSearchedComplaint(result);
    } else {
      setError(t('complaintNotFound', { id: complaintId }));
    }
    setIsLoading(false);
  };
  
  if(isAuthenticated){
     return (
        <div className="flex-grow bg-gray-50 py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('myComplaints')}</h1>
                {isLoading && <Spinner/>}
                {!isLoading && userComplaints.length === 0 && (
                    <p className="text-center text-gray-500">{t('noComplaintsYet')}</p>
                )}
                <div className="space-y-6">
                 {userComplaints.map(complaint => <ComplaintDetails key={complaint.complaintId} complaint={complaint} />)}
                </div>
            </div>
        </div>
     )
  }

  return (
    <div className="flex-grow flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('trackComplaintStatus')}</h1>
        <p className="mt-2 text-gray-600">{t('trackComplaintSubtitle')}</p>
        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder={t('enterComplaintId')}
            className="flex-grow appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300">
            {isLoading ? t('searching') : t('search')}
          </button>
        </form>
      </div>
      <div className="mt-6 max-w-xl w-full">
        {isLoading && !searchedComplaint && <Spinner />}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {searchedComplaint && <ComplaintDetails complaint={searchedComplaint} />}
      </div>
    </div>
  );
};

export default TrackComplaint;
