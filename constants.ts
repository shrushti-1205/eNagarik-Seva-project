import { ComplaintCategory, ComplaintStatus } from './types';

export const APP_NAME = 'eNagarik Seva';

export const ROUTES = {
  HOME: '/',
  USER_LOGIN: '/login/user',
  ADMIN_LOGIN: '/login/admin',
  USER_SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify/:userId',
  FILE_COMPLAINT: '/complaint/new',
  TRACK_COMPLAINT: '/complaint/track',
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  ComplaintCategory.STREETLIGHT,
  ComplaintCategory.WATER_SUPPLY,
  ComplaintCategory.ROAD_POTHOLES,
  ComplaintCategory.GARBAGE,
  ComplaintCategory.OTHER,
];

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  ComplaintStatus.PENDING,
  ComplaintStatus.IN_PROGRESS,
  ComplaintStatus.RESOLVED,
];