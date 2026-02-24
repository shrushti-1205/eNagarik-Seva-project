import { Complaint, User, Role, ComplaintStatus, ComplaintCategory, Notification } from '../types';

// Define a user type for our mock DB that includes a password
interface MockUser extends User {
  password?: string;
}

// --- MOCK DATABASE ---
let mockUsers: MockUser[] = [
  { userId: 'user1', name: 'John Doe', email: 'john@example.com', phone: '1112223333', role: Role.USER, password: 'password123', isVerified: true },
  { userId: 'admin1', name: 'Shrushti Gaikwad', email: 'shrushti.gaikwad.comp.2023@vpkbiet.org', phone: '9998887777', role: Role.ADMIN, password: 'password123', isVerified: true },
  { userId: 'admin2', name: 'Jane Smith', email: 'jane.admin@example.com', phone: '9998886666', role: Role.ADMIN, password: 'adminpass', isVerified: true },
];

let mockComplaints: Complaint[] = [];

let mockNotifications: Notification[] = [];
// --- END MOCK DATABASE ---

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500 + Math.random() * 500));
};

export const apiService = {
  loginUser: async (emailOrPhone: string, password: string): Promise<User | null> => {
    const user = mockUsers.find(u => 
        (u.email === emailOrPhone || u.phone === emailOrPhone) && 
        u.role === Role.USER
    );

    if (!user || user.password !== password) {
        return simulateDelay(null); // Invalid credentials
    }

    if (!user.isVerified) {
        throw new Error('NOT_VERIFIED'); // User exists but is not verified
    }

    const { password: _password, ...userToReturn } = user;
    return simulateDelay(userToReturn);
  },

  loginAdmin: async (emailOrPhone: string, password: string): Promise<User | null> => {
    const user = mockUsers.find(u => 
        (u.email === emailOrPhone || u.phone === emailOrPhone) && 
        u.role === Role.ADMIN && 
        u.password === password
    );
    if (!user) {
        return simulateDelay(null);
    }
    const { password: _password, ...userToReturn } = user;
    return simulateDelay(userToReturn);
  },

  registerUser: async (name: string, email: string, password: string, phone?: string): Promise<User | null> => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return simulateDelay(null);
    }

    const newUser: MockUser = {
      userId: `user${mockUsers.length + 1}`,
      name,
      email,
      phone,
      password,
      role: Role.USER,
      isVerified: false, // New users start as unverified
    };
    mockUsers.push(newUser);

    const { password: _password, ...userToReturn } = newUser;
    return simulateDelay(userToReturn);
  },

  verifyUserEmail: async (userId: string): Promise<boolean> => {
    const userIndex = mockUsers.findIndex(u => u.userId === userId);
    if (userIndex === -1) {
        return simulateDelay(false);
    }
    mockUsers[userIndex].isVerified = true;
    return simulateDelay(true);
  },

  getUserById: async (userId: string): Promise<User | null> => {
    const user = mockUsers.find(u => u.userId === userId);
    if (!user) {
        return simulateDelay(null);
    }
    const { password: _password, ...userToReturn } = user;
    return simulateDelay(userToReturn);
  },

  submitComplaint: async (data: Omit<Complaint, 'complaintId' | 'createdAt' | 'status' | 'remarks'>): Promise<Complaint> => {
    const newComplaint: Complaint = {
      ...data,
      complaintId: `CMP${String(mockComplaints.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: ComplaintStatus.PENDING,
      remarks: '',
    };
    mockComplaints.unshift(newComplaint);
    return simulateDelay(newComplaint);
  },

  getComplaintById: async (id: string): Promise<Complaint | null> => {
    const complaint = mockComplaints.find(c => c.complaintId === id);
    return simulateDelay(complaint || null);
  },

  getComplaintsByUserId: async (userId: string): Promise<Complaint[]> => {
    const complaints = mockComplaints.filter(c => c.userId === userId);
    return simulateDelay(complaints);
  },

  getAllComplaints: async (): Promise<Complaint[]> => {
    return simulateDelay([...mockComplaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  updateComplaint: async (id: string, updates: { status: ComplaintStatus; remarks: string }): Promise<Complaint | null> => {
    const complaintIndex = mockComplaints.findIndex(c => c.complaintId === id);
    if (complaintIndex === -1) {
      return simulateDelay(null);
    }
    const originalComplaint = mockComplaints[complaintIndex];
    const updatedComplaint = { ...originalComplaint, ...updates };
    mockComplaints[complaintIndex] = updatedComplaint;
    
    // Create a notification if status changed for a non-anonymous user
    if(originalComplaint.status !== updatedComplaint.status && updatedComplaint.userId) {
       const newNotification: Notification = {
           notificationId: `N${Date.now()}`,
           userId: updatedComplaint.userId,
           complaintId: updatedComplaint.complaintId,
           complaintTitle: updatedComplaint.title,
           message: `The status of your complaint #${updatedComplaint.complaintId} has been updated to "${updatedComplaint.status}".`,
           isRead: false,
           createdAt: new Date().toISOString(),
       }
       mockNotifications.unshift(newNotification);
    }
    
    return simulateDelay(updatedComplaint);
  },

  getNotificationsByUserId: async (userId: string): Promise<Notification[]> => {
    const notifications = mockNotifications.filter(n => n.userId === userId);
    return simulateDelay(notifications);
  },

  markNotificationAsRead: async (notificationId: string): Promise<Notification | null> => {
    const notificationIndex = mockNotifications.findIndex(n => n.notificationId === notificationId);
    if (notificationIndex === -1) {
        return simulateDelay(null);
    }
    mockNotifications[notificationIndex].isRead = true;
    return simulateDelay(mockNotifications[notificationIndex]);
  }
};