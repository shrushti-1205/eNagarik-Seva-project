import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { Complaint, ComplaintStatus, ComplaintCategory, User } from '../types';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../constants';
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

const ComplaintDetailsModal: React.FC<{ complaint: Complaint; onClose: () => void; onUpdate: () => void; }> = ({ complaint, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.remarks);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!complaint.isAnonymous && complaint.userId) {
        setIsUserLoading(true);
        setUserDetails(null); 
        try {
            const user = await apiService.getUserById(complaint.userId);
            setUserDetails(user);
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setIsUserLoading(false);
        }
      }
    };
    fetchUserDetails();
  }, [complaint.userId, complaint.isAnonymous]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await apiService.updateComplaint(complaint.complaintId, { status, remarks });
    setIsUpdating(false);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{t('complaintDetails')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
        </div>
        <div className="p-6 space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{t('complaintInfo')}</h3>
                <div className="text-sm space-y-2 text-gray-700">
                    <p><strong>{t('id')}:</strong> {complaint.complaintId}</p>
                    <p><strong>{t('title')}:</strong> {complaint.title}</p>
                    <p><strong>{t('description')}:</strong> {complaint.description}</p>
                    <p><strong>{t('category')}:</strong> {t(`categories.${complaint.category}`)}</p>
                    <p><strong>{t('submitted')}:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
                    {complaint.location && <p><strong>Location:</strong> Lat: {complaint.location.latitude}, Lng: {complaint.location.longitude}</p>}
                </div>
            </div>

            {(complaint.photoURL || complaint.voiceURL) && (
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{t('attachments')}</h3>
                    {complaint.photoURL && <div><strong>{t('photo')}:</strong> <img src={complaint.photoURL} alt="Complaint evidence" className="mt-2 rounded-lg max-w-sm"/></div>}
                    {complaint.voiceURL && <div className="mt-4"><strong>{t('voiceNote')}:</strong> <audio controls src={complaint.voiceURL} className="mt-2 w-full"></audio></div>}
                </div>
            )}

            <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{t('submittedBy')}</h3>
                {complaint.isAnonymous ? (
                    <p className="text-sm text-gray-600 italic">{t('anonymousComplaint')}</p>
                ) : isUserLoading ? (
                    <div className="flex justify-center items-center py-4"><Spinner /></div>
                ) : userDetails ? (
                    <div className="text-sm space-y-1">
                        <p><strong>{t('name')}:</strong> {userDetails.name}</p>
                        <p><strong>{t('email')}:</strong> {userDetails.email}</p>
                        {userDetails.phone && <p><strong>{t('phone')}:</strong> {userDetails.phone}</p>}
                    </div>
                ) : (
                    <p className="text-sm text-red-500">{t('userDetailsCouldNotBeLoaded', { id: complaint.userId })}</p>
                )}
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">{t('updateStatusAndRemarks')}</h3>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">{t('status')}</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        {COMPLAINT_STATUSES.map(s => <option key={s} value={s}>{t(`statuses.${s}`)}</option>)}
                    </select>
                </div>
                <div className="mt-4">
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">{t('remarks')}</label>
                    <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
        </div>
        <div className="p-6 bg-gray-50 border-t flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel')}</button>
            <button onClick={handleUpdate} disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">{isUpdating ? t('saving') : t('saveChanges')}</button>
        </div>
      </div>
    </div>
  );
};


const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    const data = await apiService.getAllComplaints();
    setComplaints(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const statusMatch = filterStatus === 'All' || c.status === filterStatus;
      const categoryMatch = filterCategory === 'All' || c.category === filterCategory;
      return statusMatch && categoryMatch;
    });
  }, [complaints, filterStatus, filterCategory]);

  return (
    <div className="flex-grow bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard')}</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
            <h2 className="text-lg font-semibold text-gray-800 mr-4">{t('filters')}</h2>
            <div>
                <label htmlFor="filterStatus" className="text-sm font-medium text-gray-700 mr-2">{t('status')}:</label>
                <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <option value="All">{t('all')}</option>
                    {COMPLAINT_STATUSES.map(s => <option key={s} value={s}>{t(`statuses.${s}`)}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="filterCategory" className="text-sm font-medium text-gray-700 mr-2">{t('category')}:</label>
                <select id="filterCategory" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <option value="All">{t('all')}</option>
                    {COMPLAINT_CATEGORIES.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
                </select>
            </div>
        </div>

        {isLoading ? <Spinner/> : (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('id')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('title')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map(complaint => (
                  <tr key={complaint.complaintId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.complaintId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{complaint.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(`categories.${complaint.category}`)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={complaint.status}/></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setSelectedComplaint(complaint)} className="text-blue-600 hover:text-blue-900">View/Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredComplaints.length === 0 && !isLoading && <p className="text-center text-gray-500 mt-6">{t('noComplaintsMatchFilters')}</p>}
      </div>
      {selectedComplaint && <ComplaintDetailsModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} onUpdate={fetchComplaints}/>}
    </div>
  );
};

export default AdminDashboard;
