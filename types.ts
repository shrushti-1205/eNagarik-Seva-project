// FIX: Removed self-import of 'Role' which was conflicting with the 'Role' enum declaration below.
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export enum ComplaintCategory {
  STREETLIGHT = 'Streetlight',
  WATER_SUPPLY = 'Water Supply',
  ROAD_POTHOLES = 'Road Potholes',
  GARBAGE = 'Garbage',
  OTHER = 'Other',
}

export interface User {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isVerified: boolean;
}

export interface Complaint {
  complaintId: string;
  userId: string | null; // null for anonymous complaints
  title: string;
  description: string;
  category: ComplaintCategory;
  photoURL?: string;
  voiceURL?: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  status: ComplaintStatus;
  remarks: string;
  createdAt: string; // ISO string format
  isAnonymous: boolean;
}

export interface Notification {
  notificationId: string;
  userId: string;
  complaintId: string;
  complaintTitle: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO string format
}