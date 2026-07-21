import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { donationService } from '../services/api';
import { FoodCategory, type FoodDonationUpdateRequest } from '../types';
import '../styles/admin.css';
import { userService } from '../services/api';
import LiveMapTracker from '../components/LiveMapTracker';

type QuantityOption = {
  label: string;
  value: number;
};

type DonationRecord = {
  donorName: string;
  amount: string;
  foodReceived: string;
  program: string;
  quantityChoice: string;
  customQuantity: string;
  category: FoodCategory;
  expiryDateTime: string;
  fromLocation: string;
  toLocation: string;
  distanceKm: string;
  travelTimeMinutes: string;
  status: string;
  photoName: string;
  backendDonationId?: number;
};

type RegisteredUserRecord = {
  id: number | string;
  firstName: string;
  lastName: string;
  fullName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  address?: string;
  foodQuantity?: string;
};

type DonationIntentRecord = {
  id?: string;
  fullName: string;
  email: string;
  donationType: 'food' | 'funds' | 'both';
  foodPlates: string;
  fundsAmount: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status?: 'Pending' | 'Approved' | 'Picked Up' | 'Completed' | 'Cancelled' | 'Accepted' | string;
  managedBy?: string;
  deliveryNgoName?: string;
  quantityChoice?: string;
  category?: string;
  toLocation?: string;
  donorName?: string;
  backendDonationId?: string | number;
  pickedUpAt?: string;
  deliveryEta?: string;
};


type NotificationRecord = {
  title: string;
  message: string;
  createdAt: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
};

const DONATION_RECORD_KEY = 'donationRecord';
const DONATION_BACKEND_ID_KEY = 'donationBackendId';
const ADMIN_NOTIFICATIONS_KEY = 'adminNotifications';
const ADMIN_PASSWORD_KEY = 'adminPassword';

type AdminSectionKey = 'overview' | 'donors' | 'ashramas' | 'deliveryNgos' | 'liveTracking' | 'donations' | 'requests' | 'reports' | 'messages' | 'notifications' | 'password';

const adminSectionTabs: { key: AdminSectionKey; label: string }[] = [
  { key: 'overview', label: 'Dashboard Overview' },
  { key: 'donations', label: 'Manage Donations' },
  { key: 'donors', label: 'Manage Donors' },
  { key: 'ashramas', label: 'Manage Donate Me Users' },
  { key: 'requests', label: 'Manage Food Requests' },
  { key: 'deliveryNgos', label: 'Manage Delivery NGOs' },
  { key: 'liveTracking', label: 'Live Delivery Tracking' },
  { key: 'reports', label: 'Reports & Analytics' },
  { key: 'messages', label: 'Messages & Support' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'password', label: 'Change Password' },
];

function readLocalArray<T>(key: string): T[] {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalArray<T>(key: string, records: T[]) {
  localStorage.setItem(key, JSON.stringify(records));
}

const locationOptions = [
  'Jayanagar',
  'Indiranagar',
  'Koramangala',
  'Malleshwaram',
  'Rajajinagar',
  'BTM Layout',
  'J. P. Nagar',
  'HSR Layout',
  'Whitefield',
  'Banashankari',
  'Vijayanagar',
  'Frazer Town',
  'Shivajinagar',
  'Sadashiva nagar',
  'Yelahanka',
  'Richmond Town',
  'MG Road',
  'Bannerughatta',
];

const quantityOptions: QuantityOption[] = [
  { label: '1 Child', value: 1 },
  { label: '5 Children', value: 5 },
  { label: '10 Children', value: 10 },
  { label: '30 Children', value: 30 },
  { label: '50 Children', value: 50 },
  { label: '100 Children', value: 100 },
];

const categoryOptions = [
  { label: 'Cooked', value: FoodCategory.COOKED },
  { label: 'Raw', value: FoodCategory.RAW },
  { label: 'Packaged', value: FoodCategory.PACKAGED },
  { label: 'Bakery', value: FoodCategory.BAKERY },
  { label: 'Dairy', value: FoodCategory.DAIRY },
  { label: 'Fruits & Vegetables', value: FoodCategory.FRUITS_VEGETABLES },
];

const defaultRecord: DonationRecord = {
  donorName: 'Donor Name',
  amount: '₹1100.00',
  foodReceived: '1 child portion',
  program: 'Tiffen',
  quantityChoice: '1',
  customQuantity: '',
  category: FoodCategory.COOKED,
  expiryDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  fromLocation: 'Annamrita Central',
  toLocation: 'Kadapa',
  distanceKm: '12.0',
  travelTimeMinutes: '21',
  status: 'Ready for pickup',
  photoName: '',
};

const locationCoordinates: Record<string, { latitude: number; longitude: number }> =
  locationOptions.reduce((accumulator, location, index) => {
    accumulator[location] = {
      latitude: 12 + index * 0.17,
      longitude: 77 + index * 0.15,
    };
    return accumulator;
  }, {} as Record<string, { latitude: number; longitude: number }>);

function estimateDistance(fromLocation: string, toLocation: string) {
  const fromPoint = locationCoordinates[fromLocation];
  const toPoint = locationCoordinates[toLocation];
  if (!fromPoint || !toPoint) {
    return 0;
  }

  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(toPoint.latitude - fromPoint.latitude);
  const longitudeDelta = toRadians(toPoint.longitude - fromPoint.longitude);
  const lat1 = toRadians(fromPoint.latitude);
  const lat2 = toRadians(toPoint.latitude);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(1));
}

function estimateTime(distanceKm: number) {
  return Math.max(10, Math.round((distanceKm / 32) * 60));
}

function getQuantityLabel(record: DonationRecord) {
  if (record.quantityChoice === 'custom') {
    return record.customQuantity ? `Custom: ${record.customQuantity}` : 'Custom Amount';
  }

  const selectedOption = quantityOptions.find((option) => String(option.value) === record.quantityChoice);
  return selectedOption?.label ?? '1 Child';
}

function getQuantityValue(record: DonationRecord) {
  if (record.quantityChoice === 'custom') {
    return Number(record.customQuantity || '1');
  }

  return Number(record.quantityChoice || '1');
}

function buildDonationUpdatePayload(record: DonationRecord): FoodDonationUpdateRequest {
  const quantity = getQuantityValue(record);
  return {
    foodName: record.program,
    description: `Amount: ${record.amount}. Food received: ${record.foodReceived}. From ${record.fromLocation} to ${record.toLocation}.`,
    quantity,
    expiryTime: new Date(record.expiryDateTime).toISOString(),
    pickupInstructions: `Pickup ${record.fromLocation} and deliver to ${record.toLocation}`,
    estimatedBeneficiaries: Math.round(quantity),
  };
}

function mapBackendDonationToRecord(
  record: DonationRecord,
  backendDonation: { foodName?: string; quantity?: number; expiryTime?: string; imageUrl?: string; donorName?: string }
): DonationRecord {
  const quantityValue = backendDonation.quantity ? String(Math.round(backendDonation.quantity)) : record.quantityChoice;

  return {
    ...record,
    donorName: backendDonation.donorName ?? record.donorName,
    program: backendDonation.foodName ?? record.program,
    quantityChoice: quantityValue,
    expiryDateTime: backendDonation.expiryTime ? new Date(backendDonation.expiryTime).toISOString().slice(0, 16) : record.expiryDateTime,
    photoName: backendDonation.imageUrl ?? record.photoName,
  };
}

export default function AdminDashboardPage() {
  const adminUser = localStorage.getItem('adminUser');
  const [record, setRecord] = useState<DonationRecord>(defaultRecord);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Ready to edit the donor record.');
  const [users, setUsers] = useState<RegisteredUserRecord[]>([]);
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('overview');
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({ currentPassword: '', newPassword: '' });
  const [notificationDraft, setNotificationDraft] = useState({ title: '', message: '' });
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);
  const [storageTick, setStorageTick] = useState(0);

  // Verification Settings State
  const defaultVerificationSettings = {
    method: 'QR_AND_OTP',
    otpExpiryMinutes: 5,
    maxAttempts: 3,
    enableGpsLogging: false,
    enableScanHistory: true,
    enableAuditLogs: true
  };
  const [verificationSettings, _setVerificationSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('adminVerificationSettings');
      return stored ? JSON.parse(stored) : defaultVerificationSettings;
    } catch {
      return defaultVerificationSettings;
    }
  });

  const _handleSaveVerificationSettings = () => {
    localStorage.setItem('adminVerificationSettings', JSON.stringify(verificationSettings));
    setAdminMessage('Verification settings updated successfully.');
    setTimeout(() => setAdminMessage(''), 3000);
  };

  useEffect(() => {
    const handleStorage = () => {
      const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
      setSystemNotifications(all.filter((n: any) => n.role === 'ADMIN' || n.userId === 'admin').sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setStorageTick((tick) => tick + 1);
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const unreadCount = systemNotifications.filter(n => !n.read).length;

  const markAsRead = () => {
    const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    const updated = all.map((n: any) => (n.role === 'ADMIN' || n.userId === 'admin') ? { ...n, read: true } : n);
    localStorage.setItem('systemNotifications', JSON.stringify(updated));
    setSystemNotifications(updated.filter((n: any) => n.role === 'ADMIN' || n.userId === 'admin').sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const readLocalUsers = () => {
    try {
      const storedUsers = localStorage.getItem('users');
      return storedUsers ? (JSON.parse(storedUsers) as RegisteredUserRecord[]) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const resp = await userService.getAllUsers();
        const backendUsers = Array.isArray(resp.data?.data)
          ? (resp.data.data as RegisteredUserRecord[])
          : Array.isArray(resp.data)
            ? (resp.data as RegisteredUserRecord[])
            : [];

        setUsers(backendUsers.length > 0 ? backendUsers : readLocalUsers());
      } catch (e) {
        setUsers(readLocalUsers());
      }
    };
    void loadUsers();
  }, []);

  useEffect(() => {
    const storedRecord = localStorage.getItem(DONATION_RECORD_KEY);
    if (storedRecord) {
      setRecord((currentRecord) => ({ ...currentRecord, ...JSON.parse(storedRecord) }));
    }

    const loadBackendDonation = async () => {
      const storedDonationId = localStorage.getItem(DONATION_BACKEND_ID_KEY);
      if (!storedDonationId) {
        return;
      }

      try {
        const response = await donationService.getDonation(Number(storedDonationId));
        const backendDonation = response.data.data;
        if (backendDonation) {
          setRecord((currentRecord) => mapBackendDonationToRecord(currentRecord, backendDonation));
          setSyncMessage('Loaded donation from the backend.');
        }
      } catch {
        setSyncMessage('Loaded local draft because the backend is not available yet.');
      }
    };

    void loadBackendDonation();
  }, []);

  const selectedQuantityLabel = useMemo(() => getQuantityLabel(record), [record]);

  const donorUsers = users.filter((user) => user.role !== 'ADMIN');
  const donationIntents = useMemo(() => readLocalArray<DonationIntentRecord>('donationIntents'), [activeSection, syncMessage, storageTick]);
  const donateMeUsers = useMemo(() => readLocalArray<any>('donateMeUsers'), [activeSection, syncMessage, storageTick]);
  const foodRequests = useMemo(() => readLocalArray<any>('foodRequests'), [activeSection, syncMessage, adminMessage, storageTick]);
  const adminNotifications = useMemo(() => readLocalArray<NotificationRecord>(ADMIN_NOTIFICATIONS_KEY), [activeSection, syncMessage, storageTick]);
  const totalRequestPlates = foodRequests.reduce((total, request) => total + Number(request.numberOfPlates || '0'), 0);
  const pendingRequestCount = donationIntents.filter(d => d.status === 'Waiting for Delivery Partner').length;
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const persistRecord = (nextRecord: DonationRecord) => {
    setRecord(nextRecord);
    localStorage.setItem(DONATION_RECORD_KEY, JSON.stringify(nextRecord));
  };

  const refreshUsers = async () => {
    try {
      const resp = await userService.getAllUsers();
      const backendUsers = Array.isArray(resp.data?.data)
        ? (resp.data.data as RegisteredUserRecord[])
        : Array.isArray(resp.data)
          ? (resp.data as RegisteredUserRecord[])
          : [];

      setUsers(backendUsers.length > 0 ? backendUsers : readLocalUsers());
    } catch {
      setUsers(readLocalUsers());
    }
  };

  const handleUserDelete = async (id: number | string) => {
    try {
      if (typeof id === 'number') {
        await userService.deleteUser(id);
      }
      setUsers((prev) => {
        const nextUsers = prev.filter((u) => u.id !== id);
        localStorage.setItem('users', JSON.stringify(nextUsers));
        return nextUsers;
      });
      setSyncMessage('User deleted');
    } catch {
      setSyncMessage('Could not delete user (backend unreachable)');
    }
  };

  const updateRecord = (patch: Partial<DonationRecord>) => {
    const nextRecord = { ...record, ...patch };
    if (patch.fromLocation || patch.toLocation) {
      const distance = estimateDistance(nextRecord.fromLocation, nextRecord.toLocation);
      nextRecord.distanceKm = distance.toFixed(1);
      nextRecord.travelTimeMinutes = String(estimateTime(distance));
    }

    persistRecord(nextRecord);
    setSyncMessage('Draft updated locally.');
  };

  const syncToBackend = async () => {
    const nextRecord = { ...record };
    persistRecord(nextRecord);
    setIsSyncing(true);
    setSyncMessage('Saving admin edits...');

    try {
      const storedDonationId = localStorage.getItem(DONATION_BACKEND_ID_KEY);
      // If a new photo is selected, upload it first and attach its URL to the record
      if (photoFile) {
        try {
          const uploadResp = await donationService.uploadImage(photoFile);
          const imageUrl = uploadResp.data.data;
          if (imageUrl) {
            nextRecord.photoName = imageUrl;
            persistRecord(nextRecord);
          }
        } catch (e) {
          // ignore upload errors
        }
      }

      if (storedDonationId) {
        await donationService.updateDonation(Number(storedDonationId), {
          ...buildDonationUpdatePayload(nextRecord),
          imageUrl: nextRecord.photoName,
        } as any);
        setSyncMessage('Admin edits saved locally and synced to the backend.');
      } else {
        setSyncMessage('Admin edits saved locally. Create the donor donation once to sync it to the backend.');
      }
    } catch {
      setSyncMessage('Admin edits saved locally. The backend connection is not available yet.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoFile(file ?? null);
    updateRecord({ photoName: file ? file.name : '' });
  };

  const pushAdminNotification = (title: string, message: string) => {
    const nextNotifications = [
      { title, message, createdAt: new Date().toISOString() },
      ...readLocalArray<NotificationRecord>(ADMIN_NOTIFICATIONS_KEY),
    ];
    writeLocalArray(ADMIN_NOTIFICATIONS_KEY, nextNotifications);
  };



  const handleFoodRequestStatusChange = (id: string | number, status: string) => {
    const allReqs = readLocalArray<any>('foodRequests');
    const updated = allReqs.map(r => r.id === id ? { ...r, status } : r);
    writeLocalArray('foodRequests', updated);
    setAdminMessage(`Request updated to ${status}.`);
    
    const req = allReqs.find(r => r.id === id);
    if (req) {
      const allNotifs = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
      allNotifs.push({
        id: `NOTIF-${Date.now()}`,
        userId: req.userId,
        title: `Request ${status}`,
        message: `Your food request for ${req.numberOfPlates} plates has been ${status.toLowerCase()}.`,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('systemNotifications', JSON.stringify(allNotifs));
    }
    window.dispatchEvent(new Event('storage'));
  };

  const handleDonationIntentStatusChange = (id: string, status: string, donorEmail: string, donorName: string) => {
    const allIntents = readLocalArray<DonationIntentRecord>('donationIntents');
    const updatedIntents = allIntents.map(intent => intent.id === id ? { ...intent, status: status as any, managedBy: 'Admin' } : intent);
    writeLocalArray('donationIntents', updatedIntents);

    const allNotifications = readLocalArray<any>('donorNotifications');
    allNotifications.unshift({
      email: donorEmail,
      title: `Donation Status Update: ${status}`,
      message: `Hi ${donorName}, your donation (ID: ${id || 'unknown'}) has been updated to ${status} by the admin team.`,
      date: new Date().toISOString(),
      read: false
    });
    writeLocalArray('donorNotifications', allNotifications);
    
    setAdminMessage(`Donation updated to ${status} and donor notified.`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleNotificationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!notificationDraft.title || !notificationDraft.message) {
      setAdminError('Enter a notification title and message.');
      return;
    }

    pushAdminNotification(notificationDraft.title, notificationDraft.message);
    setNotificationDraft({ title: '', message: '' });
    setAdminMessage('Notification saved.');
    setAdminError('');
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);

    if (storedPassword && passwordForm.currentPassword !== storedPassword) {
      setAdminError('Current admin password is incorrect.');
      return;
    }

    if (!passwordForm.newPassword) {
      setAdminError('Enter a new admin password.');
      return;
    }

    localStorage.setItem(ADMIN_PASSWORD_KEY, passwordForm.newPassword);
    setPasswordForm({ currentPassword: '', newPassword: '' });
    setAdminMessage('Admin password updated successfully.');
    setAdminError('');
    pushAdminNotification('Password changed', 'Administrator password was updated.');
  };

  const handleDismissAdminNotification = (index: number) => {
    const nextNotifications = adminNotifications.filter((_, notificationIndex) => notificationIndex !== index);
    writeLocalArray(ADMIN_NOTIFICATIONS_KEY, nextNotifications);
    setAdminMessage('Notification dismissed.');
  };

  const handleClearAdminNotifications = () => {
    writeLocalArray(ADMIN_NOTIFICATIONS_KEY, []);
    setAdminMessage('All admin notifications cleared.');
  };

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="admin-badge">Admin Dashboard</span>
          <h1>Centralized donation, donor, and ashrama control</h1>
          <p>Monitor donors, ashramas, donations, and food request workflows from a single control room.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ position: 'relative', marginTop: '0.5rem' }}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAsRead(); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', position: 'relative' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {unreadCount > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
            </button>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: '100%', right: 0, width: 320, background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b', fontWeight: 600, display: 'flex', justifyContent: 'space-between', color: '#f8fafc' }}>
                  System Notifications
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {systemNotifications.length === 0 ? (
                    <div style={{ padding: '1rem', color: '#94a3b8', textAlign: 'center' }}>No notifications</div>
                  ) : (
                    systemNotifications.map((notif: any) => (
                      <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid #1e293b', background: notif.read ? 'transparent' : 'rgba(56, 189, 248, 0.05)' }}>
                        <div style={{ fontWeight: 500, color: '#f8fafc', marginBottom: 4 }}>{notif.title}</div>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{notif.message}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{new Date(notif.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="admin-user-card" style={{ margin: 0 }}>
            <span>Logged in as</span>
            <strong>{adminUser}</strong>
            <div style={{ marginTop: 8 }}>
              <button
                className="admin-action"
                type="button"
                onClick={() => {
                  localStorage.removeItem('adminUser');
                  window.location.href = '/admin/login';
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-summary">
        <article className="admin-summary-card"><span>Total Donors</span><strong>{donorUsers.length}</strong></article>
        <article className="admin-summary-card"><span>Donate Me Users</span><strong>{donateMeUsers.length}</strong></article>
        <article className="admin-summary-card"><span>Donations</span><strong>{donationIntents.length}</strong></article>
        <article className="admin-summary-card"><span>Food Requests</span><strong>{pendingRequestCount}</strong></article>
        <article className="admin-summary-card"><span>Requested Plates</span><strong>{totalRequestPlates}</strong></article>
      </section>

      <section className="admin-panel" style={{ marginTop: '18px' }}>
        <div className="admin-panel-header">
          <div>
            <span className="admin-label">Dashboard Access</span>
            <h2>Manage donors, ashramas, donations, requests, and analytics</h2>
            <p className="admin-note">Choose a section below to work with the dashboard tools.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {adminSectionTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSection(tab.key)}
              className="admin-action"
              style={{
                background: activeSection === tab.key ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'rgba(15, 23, 42, 0.88)',
                color: activeSection === tab.key ? '#111827' : '#e2e8f0',
                marginTop: 0,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {adminMessage && <p className="admin-note" style={{ marginTop: '16px' }}>{adminMessage}</p>}
        {adminError && <p style={{ marginTop: '16px', color: '#fca5a5' }}>{adminError}</p>}

        {activeSection === 'overview' && (() => {
          const waiting = donationIntents.filter(d => d.status === 'Waiting for Delivery Partner').length;
          const pickedUp = donationIntents.filter(d => d.status === 'Picked Up').length;
          const outForDelivery = donationIntents.filter(d => d.status === 'Out for Delivery').length;
          const delivered = donationIntents.filter(d => d.status === 'Delivered').length;
          
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 22 }}>
              <article className="admin-edit-card">
                <span className="admin-label">Food Donations</span>
                <p className="admin-note" style={{ marginTop: 12 }}>Total Requests: <strong>{donationIntents.length}</strong></p>
                <p className="admin-note">Waiting for Pickup: <strong>{waiting}</strong></p>
              </article>
              <article className="admin-edit-card">
                <span className="admin-label">Delivery Status</span>
                <p className="admin-note" style={{ marginTop: 12 }}>Picked Up: <strong>{pickedUp}</strong></p>
                <p className="admin-note">Out for Delivery: <strong>{outForDelivery}</strong></p>
                <p className="admin-note">Delivered: <strong>{delivered}</strong></p>
              </article>
              <article className="admin-edit-card">
                <span className="admin-label">Security & Verification</span>
                <p className="admin-note" style={{ marginTop: 12 }}>Failed QR Scans: <strong>0</strong></p>
                <p className="admin-note">Active Live Trackers: <strong>{pickedUp + outForDelivery}</strong></p>
              </article>
              <article className="admin-edit-card">
                <span className="admin-label">General Statistics</span>
                <p className="admin-note" style={{ marginTop: 12 }}>Active Donors: <strong>{donorUsers.length}</strong></p>
                <p className="admin-note">Pending Requests: <strong>{pendingRequestCount}</strong></p>
              </article>
            </div>
          );
        })()}

        {activeSection === 'donors' && (
          <section style={{ marginTop: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: '16px' }}>
              <div>
                <h3>Registered Donors & Partners</h3>
                <p className="admin-note">All registered users with complete details and management options.</p>
              </div>
              <button className="admin-action" onClick={() => void refreshUsers()} style={{ padding: '8px 16px', marginTop: 0 }}>
                Refresh
              </button>
            </div>
            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
              <table className="admin-table" style={{ width: '100%' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.62)' }}>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Food Quantity</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donorUsers.length > 0 ? donorUsers.map((u) => (
                    <tr key={u.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.16)' }}>
                      <td><strong>{u.firstName} {u.lastName}</strong></td>
                      <td>{u.phone || '-'}</td>
                      <td>{u.foodQuantity || '-'}</td>
                      <td>{u.email || '-'}</td>
                      <td><span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: 'rgba(34, 197, 94, 0.14)', color: '#bbf7d0', fontSize: '0.85rem' }}>{u.role}</span></td>
                      <td><span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: u.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.14)' : 'rgba(239, 68, 68, 0.14)', color: u.status === 'ACTIVE' ? '#bbf7d0' : '#fca5a5', fontSize: '0.85rem' }}>{u.status || 'ACTIVE'}</span></td>
                      <td>{u.address || '-'}</td>
                      <td><button className="admin-action" style={{ fontSize: '0.85rem', padding: '6px 10px', marginTop: 0 }} onClick={() => void handleUserDelete(u.id)}>Delete</button></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No registered users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'ashramas' && (
          <section style={{ marginTop: '22px' }}>
            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
              <table className="admin-table" style={{ width: '100%' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.62)' }}>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donateMeUsers.length > 0 ? donateMeUsers.map((u) => (
                    <tr key={u.id} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.16)' }}>
                      <td>{u.id}</td>
                      <td><strong>{u.fullName}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.address}</td>
                      <td>{new Date(u.registrationDate).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No Donate Me users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'donations' && (
          <section style={{ marginTop: '22px' }}>
            <div className="admin-layout">
              <div className="admin-edit-card">
                <div className="admin-form-grid">
                  <label className="admin-field"><span>Donor name</span><input value={record.donorName} onChange={(event) => updateRecord({ donorName: event.target.value })} /></label>
                  <label className="admin-field"><span>Amount</span><input value={record.amount} onChange={(event) => updateRecord({ amount: event.target.value })} /></label>
                  <label className="admin-field"><span>Food received</span><input value={record.foodReceived} onChange={(event) => updateRecord({ foodReceived: event.target.value })} /></label>
                  <label className="admin-field"><span>Program</span><input value={record.program} onChange={(event) => updateRecord({ program: event.target.value })} /></label>
                  <label className="admin-field"><span>Quantity</span><select value={record.quantityChoice} onChange={(event) => updateRecord({ quantityChoice: event.target.value })}>{quantityOptions.map((option) => (<option key={option.label} value={String(option.value)}>{option.label}</option>))}<option value="custom">Custom Amount</option></select></label>
                  {record.quantityChoice === 'custom' ? <label className="admin-field"><span>Custom amount</span><input value={record.customQuantity} onChange={(event) => updateRecord({ customQuantity: event.target.value })} /></label> : null}
                  <label className="admin-field"><span>Food category</span><select value={record.category} onChange={(event) => updateRecord({ category: event.target.value as FoodCategory })}>{categoryOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></label>
                  <label className="admin-field"><span>Status</span><input value={record.status} onChange={(event) => updateRecord({ status: event.target.value })} /></label>
                  <label className="admin-field"><span>Expiry date and time</span><input type="datetime-local" value={record.expiryDateTime} onChange={(event) => updateRecord({ expiryDateTime: event.target.value })} /></label>
                  <div className="admin-field-row"><label className="admin-field"><span>From</span><select value={record.fromLocation} onChange={(event) => updateRecord({ fromLocation: event.target.value })}>{locationOptions.map((option) => (<option key={option} value={option}>{option}</option>))}</select></label><label className="admin-field"><span>To</span><select value={record.toLocation} onChange={(event) => updateRecord({ toLocation: event.target.value })}>{locationOptions.map((option) => (<option key={option} value={option}>{option}</option>))}</select></label></div>
                  <label className="admin-field"><span>Distance (km)</span><input value={record.distanceKm} onChange={(event) => updateRecord({ distanceKm: event.target.value })} /></label>
                  <label className="admin-field"><span>Travel time (min)</span><input value={record.travelTimeMinutes} onChange={(event) => updateRecord({ travelTimeMinutes: event.target.value })} /></label>
                  <label className="admin-field admin-field-wide"><span>Food photo</span><input type="file" accept="image/*" onChange={handlePhotoChange} />{record.photoName && <small className="admin-note">Selected: {record.photoName}</small>}</label>
                </div>
                <div style={{ marginTop: 18 }}>
                  <button className="admin-action" type="button" disabled={isSyncing} onClick={() => void syncToBackend()} style={{ marginTop: 0 }}>{isSyncing ? 'Saving...' : 'Save changes'}</button>
                </div>
                <p className="admin-note">{syncMessage}</p>
              </div>

              <div className="admin-preview-card">
                <div className="summary-card admin-preview">
                  <strong>{record.donorName}</strong>
                  <p>{record.program}</p>
                  <p>{record.amount} | {record.foodReceived}</p>
                  <p>{record.fromLocation} to {record.toLocation}</p>
                  <p>{record.distanceKm} km | {record.travelTimeMinutes} min</p>
                  <p>Quantity: {selectedQuantityLabel}</p>
                  <p>Status: {record.status}</p>
                  <p>Photo: {record.photoName || 'No photo uploaded yet'}</p>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Field</th><th>Value</th></tr></thead>
                    <tbody>
                      <tr><td>Donor</td><td>{record.donorName}</td></tr>
                      <tr><td>Amount</td><td>{record.amount}</td></tr>
                      <tr><td>Food Received</td><td>{record.foodReceived}</td></tr>
                      <tr><td>Route</td><td>{record.fromLocation} to {record.toLocation}</td></tr>
                      <tr><td>Distance</td><td>{record.distanceKm} km</td></tr>
                      <tr><td>Travel Time</td><td>{record.travelTimeMinutes} min</td></tr>
                      <tr><td>Status</td><td>{record.status}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 18 }}>
                  <h3>Donation Intents (From Donor Dashboard)</h3>
                  {donationIntents.length > 0 ? donationIntents.map((donation, index) => (
                    <article key={`${donation.id || index}`} className="admin-edit-card" style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{donation.fullName} ({donation.email})</strong>
                        <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                            background: donation.status === 'Pending' ? '#f59e0b' : donation.status === 'Completed' ? '#10b981' : donation.status === 'Cancelled' ? '#ef4444' : '#3b82f6' 
                          }}>{donation.status || 'Pending'}</span>
                      </div>
                      <p className="admin-note" style={{ marginTop: 8 }}>{donation.donationType.toUpperCase()} | Plates: {donation.foodPlates || '0'} | Funds: ₹{donation.fundsAmount || '0'}</p>
                      <p className="admin-note">Preferred: {donation.preferredDate} {donation.preferredTime}</p>
                      
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                        <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleDonationIntentStatusChange(donation.id!, 'Approved', donation.email, donation.fullName)}>Approve</button>
                        <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleDonationIntentStatusChange(donation.id!, 'Picked Up', donation.email, donation.fullName)}>Picked Up</button>
                        <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleDonationIntentStatusChange(donation.id!, 'Completed', donation.email, donation.fullName)}>Complete</button>
                        <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleDonationIntentStatusChange(donation.id!, 'Cancelled', donation.email, donation.fullName)}>Cancel</button>
                      </div>
                    </article>
                  )) : <p className="admin-note">No donation intents yet.</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'requests' && (
          <section style={{ marginTop: '22px', display: 'grid', gap: 14 }}>
            <h3>Manage Food Requests</h3>
            {foodRequests.length > 0 ? foodRequests.map((request) => (
              <article key={request.id} className="admin-edit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>{request.foodType} ({request.numberOfPlates} plates)</strong>
                  <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      background: request.status === 'Pending' ? '#f59e0b' : request.status === 'Approved' ? '#22c55e' : request.status === 'Rejected' ? '#ef4444' : '#3b82f6' 
                    }}>{request.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div><strong>Request ID:</strong> {request.id}</div>
                  <div><strong>User:</strong> {request.userName} ({request.email})</div>
                  <div><strong>Required Date/Time:</strong> {request.requiredDate} {request.requiredTime}</div>
                  <div><strong>Address:</strong> {request.address}</div>
                  <div><strong>Contact:</strong> {request.contactNumber}</div>
                  <div><strong>Quantity:</strong> {request.quantity || 'N/A'}</div>
                </div>
                {request.additionalNotes && <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#94a3b8' }}><strong>Notes:</strong> {request.additionalNotes}</div>}
                
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                  <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleFoodRequestStatusChange(request.id, 'Approved')}>Approve</button>
                  <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleFoodRequestStatusChange(request.id, 'Rejected')}>Reject</button>
                  <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleFoodRequestStatusChange(request.id, 'Volunteer Assigned')}>Assign Volunteer</button>
                  <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => handleFoodRequestStatusChange(request.id, 'Completed')}>Mark Completed</button>
                </div>
              </article>
            )) : <div className="admin-edit-card">No food requests yet.</div>}
          </section>
        )}

        {activeSection === 'deliveryNgos' && (
          <section style={{ marginTop: '22px', display: 'grid', gap: 14 }}>
            <h3>Manage Delivery NGOs</h3>
            <p className="admin-note">View and manage registered Delivery NGOs.</p>
            {users.filter(u => u.role === 'DELIVERY_NGO').length > 0 ? users.filter(u => u.role === 'DELIVERY_NGO').map((ngo) => (
              <article key={ngo.id} className="admin-edit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>{ngo.fullName}</strong>
                  <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      background: ngo.status === 'Active' ? '#22c55e' : ngo.status === 'Disabled' ? '#ef4444' : '#f59e0b' 
                    }}>{ngo.status || 'Active'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div><strong>Email:</strong> {ngo.email}</div>
                  <div><strong>Phone:</strong> {ngo.phone}</div>
                  <div><strong>Contact Person:</strong> {ngo.contactPerson}</div>
                  <div><strong>Address:</strong> {ngo.address}</div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                  <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => {
                     const updated = users.map(u => u.id === ngo.id ? {...u, status: 'Active'} : u);
                     localStorage.setItem('users', JSON.stringify(updated));
                     setUsers(updated);
                  }}>Enable</button>
                  <button className="admin-action" type="button" style={{ marginTop: 0 }} onClick={() => {
                     const updated = users.map(u => u.id === ngo.id ? {...u, status: 'Disabled'} : u);
                     localStorage.setItem('users', JSON.stringify(updated));
                     setUsers(updated);
                  }}>Disable</button>
                </div>
              </article>
            )) : <div className="admin-edit-card">No Delivery NGOs registered.</div>}
          </section>
        )}

        {activeSection === 'liveTracking' && (
          <section style={{ marginTop: '22px', display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Live Delivery Tracking</h3>
            </div>
            
            <div style={{ width: '100%', height: '500px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '1rem', overflow: 'hidden' }}>
              <LiveMapTracker 
                mode="global" 
                activeOrders={donationIntents.filter(d => ['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(d.status || ''))}
                style={{ height: '100%', width: '100%' }}
              />
            </div>

            <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#f8fafc' }}>Active Delivery Orders</h4>
            {donationIntents.filter(d => d.status && ['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(d.status)).length > 0 ? donationIntents.filter(d => d.status && ['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(d.status)).map((order, idx) => (
              <article key={idx} className="admin-edit-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>Order #{order.backendDonationId || `OD-${idx+1}`}</strong>
                  <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      background: ['Picked Up', 'On the Way to Delivery'].includes(order.status || '') ? '#3b82f6' : '#f59e0b' 
                    }}>{order.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div><strong>Donor:</strong> {order.donorName}</div>
                  <div><strong>Receiver:</strong> {order.toLocation}</div>
                  <div><strong>Delivery NGO:</strong> <span style={{ color: '#38bdf8' }}>{order.deliveryNgoName || 'Unknown'}</span></div>
                  <div><strong>Food Details:</strong> {order.quantityChoice} Plates ({order.category || 'Food'})</div>
                  {(order.status === 'Picked Up' || order.status === 'On the Way to Delivery') && (
                    <>
                      <div><strong>Pickup Time:</strong> {order.pickedUpAt ? new Date(order.pickedUpAt).toLocaleTimeString() : 'N/A'}</div>
                      <div><strong style={{ color: '#22c55e' }}>ETA:</strong> {order.deliveryEta || '15 mins'}</div>
                    </>
                  )}
                </div>
              </article>
            )) : <div className="admin-edit-card">No active deliveries are currently in transit.</div>}
          </section>
        )}

        {activeSection === 'reports' && (
          <section style={{ marginTop: '22px', display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <article className="admin-edit-card"><span className="admin-label">Donors</span><p className="admin-note" style={{ marginTop: 12 }}>Registered donor count: <strong>{donorUsers.length}</strong></p></article>
              <article className="admin-edit-card"><span className="admin-label">Donate Me Users</span><p className="admin-note" style={{ marginTop: 12 }}>Registrations: <strong>{donateMeUsers.length}</strong></p></article>
              <article className="admin-edit-card"><span className="admin-label">Donations</span><p className="admin-note" style={{ marginTop: 12 }}>Donation intents: <strong>{donationIntents.length}</strong></p></article>
              <article className="admin-edit-card"><span className="admin-label">Requests</span><p className="admin-note" style={{ marginTop: 12 }}>Pending requests: <strong>{pendingRequestCount}</strong></p></article>
            </div>
            <div className="admin-edit-card">
              <h3>Reports & Analytics</h3>
              <p className="admin-note">Track donation totals, request statuses, and operational changes from the stored local records.</p>
            </div>
          </section>
        )}

        {activeSection === 'notifications' && (
          <section style={{ marginTop: '22px', display: 'grid', gap: 16 }}>
            <form className="admin-edit-card" onSubmit={handleNotificationSubmit}>
              <h3>Compose Notification</h3>
              <div className="admin-form-grid" style={{ marginTop: 16 }}>
                <label className="admin-field"><span>Title</span><input value={notificationDraft.title} onChange={(event) => setNotificationDraft({ ...notificationDraft, title: event.target.value })} placeholder="Notification title" /></label>
                <label className="admin-field"><span>Message</span><input value={notificationDraft.message} onChange={(event) => setNotificationDraft({ ...notificationDraft, message: event.target.value })} placeholder="Notification message" /></label>
              </div>
              <button className="admin-action" type="submit" style={{ marginTop: 16 }}>Save notification</button>
            </form>

            <div style={{ display: 'grid', gap: 12 }}>
              <button className="admin-action" type="button" onClick={handleClearAdminNotifications} style={{ marginTop: 0, width: 'fit-content' }}>Clear all notifications</button>
              {adminNotifications.length > 0 ? adminNotifications.map((notification, index) => (
                <article key={`${notification.title}-${index}`} className="admin-edit-card">
                  <strong>{notification.title}</strong>
                  <p className="admin-note">{notification.message}</p>
                  <p className="admin-note">{new Date(notification.createdAt).toLocaleString()}</p>
                  <button className="admin-action" type="button" onClick={() => handleDismissAdminNotification(index)} style={{ marginTop: 0 }}>Dismiss</button>
                </article>
              )) : <div className="admin-edit-card">No notifications yet.</div>}
            </div>
          </section>
        )}

        {activeSection === 'password' && (
          <form className="admin-edit-card" onSubmit={handlePasswordSubmit} style={{ marginTop: '22px', display: 'grid', gap: 12 }}>
            <h3>Change Password</h3>
            <label className="admin-field"><span>Current Password</span><input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} placeholder="Current password" /></label>
            <label className="admin-field"><span>New Password</span><input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} placeholder="New password" required /></label>
            <button className="admin-action" type="submit" style={{ marginTop: 0 }}>Update password</button>
          </form>
        )}

        <div style={{ marginTop: '18px' }}>
          <button className="admin-action" type="button" onClick={() => { localStorage.removeItem('adminUser'); window.location.href = '/admin/login'; }}>
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
