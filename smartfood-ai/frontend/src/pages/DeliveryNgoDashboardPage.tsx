import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/donor-dashboard.css'; // Reuse some CSS structure
import QRScanner from '../components/QRScanner';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import LiveMapTracker, { MapLocation } from '../components/LiveMapTracker';

export default function DeliveryNgoDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);

  // Verification Modal State
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [deliveryMethodChoice, setDeliveryMethodChoice] = useState<'QR' | 'OTP'>('QR');
  const [verificationTarget, setVerificationTarget] = useState<any>(null);
  const [verificationType, setVerificationType] = useState<'Pickup' | 'Delivery' | 'ViewQR'>('Pickup');
  const [otpInput, setOtpInput] = useState('');
  const [qrScanned, setQrScanned] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [scanPickupActiveOrderId, setScanPickupActiveOrderId] = useState<string | null>(null);
  const [scanPickupSuccess, setScanPickupSuccess] = useState<string | null>(null);

  const adminSettings = (() => {
    try {
      const stored = localStorage.getItem('adminVerificationSettings');
      return stored ? JSON.parse(stored) : { method: 'QR_AND_OTP', otpExpiryMinutes: 5, maxAttempts: 3 };
    } catch {
      return { method: 'QR_AND_OTP', otpExpiryMinutes: 5, maxAttempts: 3 };
    }
  })();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('sessionUser') || 'null');
    if (!user || user.role !== 'DELIVERY_NGO') {
      navigate('/delivery-ngo/auth');
    } else {
      setSessionUser(user);
    }
  }, [navigate]);

  useEffect(() => {
    const loadDeliveries = () => {
      const all = JSON.parse(localStorage.getItem('donationIntents') || '[]');
      setDeliveries(all);
    };
    
    loadDeliveries();
    window.addEventListener('storage', loadDeliveries);
    return () => window.removeEventListener('storage', loadDeliveries);
  }, [activeTab]);

  if (!sessionUser) return null;

  const handleLogout = () => {
    localStorage.removeItem('sessionUser');
    navigate('/');
  };

  const navItems = [
    { id: 'Overview', label: '🏠 Dashboard' },
    { id: 'Available', label: '📦 Assigned Deliveries' },
    { id: 'Accepted', label: '🚗 Accepted Orders' },
    { id: 'ScanPickup', label: '📷 Scan Pickup QR' },
    { id: 'OrderStatus', label: '📊 Order Status' },
    { id: 'Notifications', label: '🔔 Notifications' },
    { id: 'History', label: '📋 Delivery History' },
    { id: 'Profile', label: '👤 Profile' },
  ];

  // Stats calculation
  const totalCompleted = deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Delivered').length;
  const pendingRequests = deliveries.filter(d => d.status === 'Approved').length;
  const acceptedOrders = deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Accepted').length;
  const pickedUpOrders = deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Picked Up').length;

  const pushNotification = (userId: string, role: string, title: string, message: string) => {
    const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    all.push({
      id: Date.now().toString(),
      userId,
      role,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('systemNotifications', JSON.stringify(all));
  };

  const updateOrderStatus = (order: any, newStatus: string, requireVerification = false, vType = '') => {
    if (requireVerification) {
      setVerificationTarget(order);
      setVerificationType(vType as 'Pickup' | 'Delivery');
      setOtpInput('');
      setQrScanned(false);
      setVerificationError('');
      setVerificationModalOpen(true);
      return;
    }
    
    processStatusUpdate(order, newStatus);
  };

  const processStatusUpdate = (order: any, newStatus: string) => {

    const all = JSON.parse(localStorage.getItem('donationIntents') || '[]');
    const updated = all.map((d: any) => {
      // matching logic
      if ((d.backendDonationId && d.backendDonationId === order.backendDonationId) || (d.id && d.id === order.id) || (d.donorName === order.donorName && d.toLocation === order.toLocation)) {
        const payload = { ...d, status: newStatus };
        
        // Setup initial accepted state
        if (newStatus === 'Accepted') {
          payload.deliveryNgoId = sessionUser.id;
          payload.deliveryNgoName = sessionUser.fullName;
          payload.deliveryNgoContact = sessionUser.phone;
          payload.acceptedAt = new Date().toISOString();
          payload.ngoLat = 12.9716; // mock start loc
          payload.ngoLng = 77.5946;
          payload.pickupEta = '15 mins';
          
          pushNotification('admin', 'ADMIN', 'Delivery NGO Assigned', `${sessionUser.fullName} has accepted Order ID ${order.backendDonationId || order.id}.`);
        }
        else if (newStatus === 'On the Way to Pickup') {
           payload.ngoLat = 12.9720; // simulate movement
           payload.ngoLng = 77.5950;
           payload.pickupEta = '5 mins';
        }
        else if (newStatus === 'Picked Up') {
          payload.pickedUpAt = new Date().toISOString();
          payload.deliveryEta = '20 mins';
          
          // Generate Delivery QR Token and 4-digit OTP
          payload.deliveryQrToken = `DELIVERY-VERIFY-${order.backendDonationId || order.id}-${Date.now()}`;
          payload.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

          pushNotification('admin', 'ADMIN', 'Pickup Confirmed', `Order ID ${order.backendDonationId || order.id} has been picked up.`);
          pushNotification(order.donorId || 'donor', 'DONOR', 'Food Picked Up', `Your donation (Order ${order.backendDonationId || order.id}) was picked up.`);
          pushNotification(order.receiverId || 'receiver', 'RECEIVER', 'Food on the way', `Order ${order.backendDonationId || order.id} is on the way.`);
        }
        else if (newStatus === 'On the Way to Delivery') {
           payload.ngoLat = 12.9750; // simulate movement
           payload.ngoLng = 77.6000;
           payload.deliveryEta = '5 mins';
        }
        else if (newStatus === 'Delivered') {
          payload.deliveredAt = new Date().toISOString();
          pushNotification('admin', 'ADMIN', 'Delivery Completed', `Order ID ${order.backendDonationId || order.id} has been successfully delivered.`);
        }
        
        return payload;
      }
      return d;
    });
    localStorage.setItem('donationIntents', JSON.stringify(updated));
    setDeliveries(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const handleDriverLocationUpdate = (order: any, loc: MapLocation) => {
    const all = JSON.parse(localStorage.getItem('donationIntents') || '[]');
    const updated = all.map((d: any) => {
      if ((d.backendDonationId && d.backendDonationId === order.backendDonationId) || (d.id && d.id === order.id)) {
        return { ...d, ngoLat: loc.lat, ngoLng: loc.lng };
      }
      return d;
    });
    localStorage.setItem('donationIntents', JSON.stringify(updated));
    setDeliveries(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const handleVerificationSubmit = () => {
    setVerificationError('');
    let method = adminSettings.method;
    
    if (verificationType === 'Delivery') {
      method = deliveryMethodChoice === 'QR' ? 'QR_ONLY' : 'OTP_ONLY';
    }

    if (method === 'QR_ONLY' || method === 'QR_AND_OTP') {
      if (!qrScanned) {
        setVerificationError('Please scan the QR code first.');
        return;
      }
    }

    if (method === 'OTP_ONLY' || method === 'QR_AND_OTP') {
      const expectedLength = verificationType === 'Delivery' ? 4 : 6;
      if (otpInput.length !== expectedLength) {
        setVerificationError(`Please enter a valid ${expectedLength}-digit OTP.`);
        return;
      }
      if (verificationType === 'Pickup' && otpInput !== '123456') { // Mock pickup OTP
        setVerificationError('Invalid OTP. Please try again. (Hint: use 123456)');
        return;
      }
      if (verificationType === 'Delivery' && verificationTarget.deliveryOtp && otpInput !== verificationTarget.deliveryOtp) {
        setVerificationError(`Invalid OTP. Please try again. (Hint: use ${verificationTarget.deliveryOtp})`);
        return;
      }
    }

    setVerificationModalOpen(false);
    
    const newStatus = verificationType === 'Pickup' ? 'Picked Up' : 'Delivered';
    
    // Add verification logs to the order
    const all = JSON.parse(localStorage.getItem('donationIntents') || '[]');
    const updated = all.map((d: any) => {
      if (d.id === verificationTarget.id) {
        const payload = { ...d, status: newStatus };
        if (verificationType === 'Pickup') {
          payload.pickupVerificationTime = new Date().toISOString();
          payload.pickupOtpVerified = method.includes('OTP');
          payload.pickupQrScanned = method.includes('QR');
          payload.verificationMethod = method;
        } else {
          payload.deliveryVerificationTime = new Date().toISOString();
          payload.deliveryOtpVerified = method.includes('OTP');
          payload.deliveryQrScanned = method.includes('QR');
        }
        return payload;
      }
      return d;
    });
    localStorage.setItem('donationIntents', JSON.stringify(updated));
    
    processStatusUpdate(verificationTarget, newStatus);
  };

  const renderMapPlaceholder = (title: string, subtitle: string) => (
    <div style={{ width: '100%', height: '300px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', zIndex: 1 }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <h3 style={{ margin: 0, color: '#f8fafc', zIndex: 1 }}>{title}</h3>
      <p style={{ margin: '0.5rem 0 0', zIndex: 1 }}>{subtitle}</p>
    </div>
  );

  return (
    <div className="dd-layout" style={{ backgroundColor: '#020617', color: '#f8fafc' }}>
      <aside className={`dd-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dd-sidebar-header">
          <div className="dd-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
            <span style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Partner</span>
            <span className="dd-logo">Smart food</span>
          </div>
        </div>
        
        <nav className="dd-sidebar-nav">
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`dd-sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="dd-sidebar-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dd-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header className="dd-topbar">
          <div className="dd-topbar-left">
            <button className="dd-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
            <h1 className="dd-page-title">{navItems.find(i => i.id === activeTab)?.label}</h1>
          </div>
          <div className="dd-topbar-right">
            <div className="dd-user-profile">
              <div className="dd-user-avatar" style={{ fontSize: '1.5rem' }}>🚚</div>
              <div className="dd-user-details">
                <div className="dd-user-name" style={{ fontSize: '1.2rem', color: '#f1f5f9', fontWeight: '500' }}>{sessionUser.fullName}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Delivery NGO</div>
              </div>
            </div>
            <button className="dd-btn-secondary" onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
          </div>
        </header>

        <div className="dd-content-scroll" style={{ padding: '2rem', overflowY: 'auto' }}>
          
          {activeTab === 'Overview' && (
            <div className="fade-in">
              <div className="dd-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{pendingRequests}</div>
                  <div className="dd-stat-label">AVAILABLE REQUESTS</div>
                </div>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{acceptedOrders + pickedUpOrders}</div>
                  <div className="dd-stat-label">ACTIVE DELIVERIES</div>
                </div>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{totalCompleted}</div>
                  <div className="dd-stat-label">COMPLETED DELIVERIES</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Available' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Available Delivery Requests</h2>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>These orders have been approved by the Admin and are waiting for a delivery partner.</p>
              
              {deliveries.filter(d => d.status === 'Approved').length === 0 ? (
                <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center', border: '1px dashed #1e293b', borderRadius: '12px' }}>
                  No available delivery requests at the moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {deliveries.filter(d => d.status === 'Approved').map((order, idx) => (
                    <div key={idx} className="dd-card" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>{order.category || 'Food'} - {order.foodReceived || order.quantityChoice} Plates</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pickup Location</div>
                            <div style={{ color: '#f1f5f9' }}>{order.donorName}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{order.fromLocation}</div>
                          </div>
                          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Delivery Location</div>
                            <div style={{ color: '#f1f5f9' }}>{order.toLocation}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pending Assignment</div>
                          </div>
                        </div>
                        <button onClick={() => updateOrderStatus(order, 'Accepted')} className="dd-btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                          Accept Order
                        </button>
                      </div>
                      <div>
                        {renderMapPlaceholder('Route Preview', `Estimated Distance: ${order.distanceKm || '12.5'} km`)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Accepted' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Active Deliveries & Live Tracking</h2>
              
              {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && ['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(d.status)).length === 0 ? (
                <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center', border: '1px dashed #1e293b', borderRadius: '12px' }}>
                  You don't have any active deliveries right now.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && ['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(d.status)).map((order, idx) => (
                    <div key={idx} className="dd-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#f8fafc' }}>Order ID: {order.backendDonationId || `OD-${Math.floor(Math.random()*10000)}`}</h3>
                        <span className={`dd-badge dd-badge-blue`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                            <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Pickup From (Donor)</div>
                            <div style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 500 }}>{order.donorName}</div>
                            <div style={{ color: '#cbd5e1', marginTop: '0.25rem' }}>{order.fromLocation}</div>
                            {order.status === 'Accepted' && (
                              <button onClick={() => updateOrderStatus(order, 'On the Way to Pickup')} className="dd-btn-primary" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#0ea5e9' }}>
                                Start Navigation to Pickup
                              </button>
                            )}
                            {order.status === 'On the Way to Pickup' && (
                              <button onClick={() => updateOrderStatus(order, 'Picked Up', true, 'Pickup')} className="dd-btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                                Scan Donor QR Code
                              </button>
                            )}
                          </div>

                          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #22c55e', opacity: ['Accepted', 'On the Way to Pickup'].includes(order.status) ? 0.5 : 1 }}>
                            <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Deliver To (Receiver)</div>
                            <div style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 500 }}>{order.toLocation}</div>
                            <div style={{ color: '#cbd5e1', marginTop: '0.25rem' }}>Contact Receiver on Arrival</div>
                            {order.status === 'Picked Up' && (
                              <button onClick={() => updateOrderStatus(order, 'On the Way to Delivery')} className="dd-btn-primary" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#0ea5e9' }}>
                                Start Navigation to Delivery
                              </button>
                            )}
                            {order.status === 'On the Way to Delivery' && (
                              <button onClick={() => updateOrderStatus(order, 'Delivered', true, 'Delivery')} className="dd-btn-primary" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#22c55e' }}>
                                Scan Receiver QR Code
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          {renderMapPlaceholder(
                            'Live Navigation Map', 
                            ['Accepted', 'On the Way to Pickup'].includes(order.status) ? 'Navigating to Donor Location...' : 'Navigating to Receiver Location...'
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'History' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Delivery History</h2>
              <div className="dd-card">
                {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Delivered').length === 0 ? (
                   <div style={{ color: '#94a3b8', padding: '1rem 0' }}>No completed deliveries found yet.</div>
                ) : (
                  deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Delivered').map((order, idx) => (
                    <div key={idx} className="dd-list-item" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 150px', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Donor</div>
                        <div style={{ color: '#f8fafc', fontWeight: 500 }}>{order.donorName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Receiver</div>
                        <div style={{ color: '#f8fafc', fontWeight: 500 }}>{order.toLocation}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Food</div>
                        <div style={{ color: '#cbd5e1' }}>{order.quantityChoice} Plates</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="dd-badge dd-badge-green" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>Delivered</span>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(order.actualDeliveryTime || Date.now()).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Scan Pickup QR */}
          {activeTab === 'ScanPickup' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Scan Pickup QR</h2>

              {/* Success Toast */}
              {scanPickupSuccess && (
                <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#22c55e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <div>
                    <div style={{ fontWeight: 600 }}>Pickup Verified Successfully!</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{scanPickupSuccess}</div>
                  </div>
                </div>
              )}

              <div className="dd-card">
                <h3 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Orders Ready for Pickup</h3>
                {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Accepted').length === 0 ? (
                  <div style={{ color: '#94a3b8', padding: '1rem 0' }}>No orders awaiting pickup at this time.</div>
                ) : (
                  deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Accepted').map((order, idx) => {
                    const orderId = order.backendDonationId || order.id || `order-${idx}`;
                    const isScannerOpen = scanPickupActiveOrderId === orderId;
                    return (
                      <div key={idx} style={{ padding: '1.25rem', backgroundColor: '#0f172a', borderRadius: '12px', marginBottom: '1.25rem', border: isScannerOpen ? '2px solid #38bdf8' : '1px solid #1e293b', transition: 'border 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Donor</span>
                          <strong style={{ color: '#f8fafc' }}>{order.donorName}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pickup Location</span>
                          <strong style={{ color: '#38bdf8' }}>{order.fromLocation || order.toLocation}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Food</span>
                          <strong style={{ color: '#cbd5e1' }}>{order.quantityChoice} Plates</strong>
                        </div>

                        {/* Camera Scanner Toggle */}
                        {!isScannerOpen ? (
                          <button
                            className="dd-btn-primary"
                            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={() => { setScanPickupActiveOrderId(orderId); setScanPickupSuccess(null); }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            Open Camera & Scan QR
                          </button>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                              <span style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                                Camera Active – Point at Donor's QR
                              </span>
                              <button
                                onClick={() => setScanPickupActiveOrderId(null)}
                                style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}
                              >
                                ✕ Close Camera
                              </button>
                            </div>
                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '2px solid #1e293b' }}>
                              <QRScanner
                                onScanSuccess={(_decodedText) => {
                                  setScanPickupActiveOrderId(null);
                                  setScanPickupSuccess(`Order #${orderId} from ${order.donorName} verified.`);
                                  processStatusUpdate(order, 'Picked Up');
                                }}
                                onScanFailure={() => {}}
                              />
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.75rem' }}>Position the Donor's Pickup QR code in front of your camera</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}


          {/* Order Status */}
          {activeTab === 'OrderStatus' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Order Status Tracker</h2>
              {deliveries.filter(d => d.deliveryNgoId === sessionUser.id).length === 0 ? (
                <div className="dd-card" style={{ color: '#94a3b8' }}>No orders assigned to you yet.</div>
              ) : (
                deliveries.filter(d => d.deliveryNgoId === sessionUser.id).map((order, idx) => (
                  <div key={idx} className="dd-card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.1rem' }}>Order #{order.backendDonationId || order.id}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{order.donorName} → {order.toLocation}</div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', backgroundColor: order.status === 'Delivered' ? 'rgba(34,197,94,0.15)' : 'rgba(56,189,248,0.15)', color: order.status === 'Delivered' ? '#22c55e' : '#38bdf8', fontWeight: 600 }}>{order.status}</span>
                    </div>
                    <OrderStatusTimeline order={order} />
                    {['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(order.status) && (
                      <div style={{ marginTop: '1.5rem', width: '100%', height: '300px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                        <LiveMapTracker 
                          mode="navigation"
                          pickupLocation={{ lat: order.pickupLat || 12.9716, lng: order.pickupLng || 77.5946 }}
                          dropoffLocation={{ lat: order.dropLat || 12.9916, lng: order.dropLng || 77.6146 }}
                          driverLocation={{ lat: order.ngoLat || 12.9750, lng: order.ngoLng || 77.6000 }}
                          onDriverLocationUpdate={(loc) => handleDriverLocationUpdate(order, loc)}
                          style={{ height: '100%', width: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'Notifications' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Notifications</h2>
              {(() => {
                const notifs = JSON.parse(localStorage.getItem('systemNotifications') || '[]')
                  .filter((n: any) => n.userId === sessionUser.id || n.role === 'DELIVERY_NGO')
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                return notifs.length === 0 ? (
                  <div className="dd-card" style={{ color: '#94a3b8' }}>No notifications yet.</div>
                ) : notifs.map((notif: any, idx: number) => (
                  <div key={idx} className="dd-card" style={{ marginBottom: '1rem', borderLeft: '4px solid #38bdf8', paddingLeft: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ color: '#f8fafc' }}>{notif.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#cbd5e1' }}>{notif.message}</div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Old QR Code tab - redirect to ScanPickup */}
          {activeTab === 'QR Code' && (
            <div className="fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>QR Code Verification</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="dd-card">
                  <h3 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Pending Pickup Requests</h3>
                  {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Accepted').length === 0 ? (
                    <div style={{ color: '#94a3b8', padding: '1rem 0' }}>No pending pickups.</div>
                  ) : (
                    deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Accepted').map((order, idx) => (
                      <div key={idx} style={{ padding: '1rem', backgroundColor: '#0f172a', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #1e293b' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Donor</span>
                          <strong style={{ color: '#f8fafc' }}>{order.donorName}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Location</span>
                          <strong style={{ color: '#f8fafc' }}>{order.toLocation}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="dd-btn-primary" 
                            style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                            onClick={() => updateOrderStatus(order, 'Picked Up', true, 'Pickup')}
                          >
                            Scan QR
                          </button>
                          <button 
                            className="dd-btn-secondary" 
                            style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8' }}
                            onClick={() => {
                              // Generate local QR view
                              const mockPayload = JSON.stringify({
                                donationId: order.id,
                                deliveryNgoId: sessionUser.id,
                                type: 'PICKUP'
                              });
                              setVerificationTarget({ ...order, mockPayload });
                              setVerificationType('ViewQR');
                              setVerificationModalOpen(true);
                            }}
                          >
                            View Generated QR
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div>
                  <div className="dd-card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Active Deliveries (On the Way)</h3>
                    {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && (d.status === 'Picked Up' || d.status === 'On the Way to Delivery')).length === 0 ? (
                      <div style={{ color: '#94a3b8' }}>No active deliveries.</div>
                    ) : (
                      deliveries.filter(d => d.deliveryNgoId === sessionUser.id && (d.status === 'Picked Up' || d.status === 'On the Way to Delivery')).map((order, idx) => (
                        <div key={idx} style={{ padding: '0.75rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ color: '#f8fafc' }}>{order.toLocation}</div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>ETA: {order.deliveryEta || '15 mins'}</div>
                          </div>
                          <button 
                            className="dd-btn-primary" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => updateOrderStatus(order, 'Delivered', true, 'Delivery')}
                          >
                            Complete Delivery
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="dd-card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Recent Pickups</h3>
                    {deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Picked Up').length === 0 ? (
                      <div style={{ color: '#94a3b8' }}>No recent pickups.</div>
                    ) : (
                      deliveries.filter(d => d.deliveryNgoId === sessionUser.id && d.status === 'Picked Up').map((order, idx) => (
                        <div key={idx} style={{ padding: '0.75rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#cbd5e1' }}>{order.donorName}</span>
                          <span className="dd-badge dd-badge-blue">Picked Up</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
             <div className="fade-in dd-card">
                <h2>Organization Profile</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                  <div>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Organization Name</div>
                    <div style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{sessionUser.fullName}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Contact Person</div>
                    <div style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{sessionUser.contactPerson}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Email</div>
                    <div style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{sessionUser.email}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Phone Number</div>
                    <div style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{sessionUser.phone}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Registered Address</div>
                    <div style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{sessionUser.address}</div>
                  </div>
                </div>
             </div>
          )}
          
        </div>
      </main>

      {verificationModalOpen && verificationTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="dd-card fade-in" style={{ width: '100%', maxWidth: 500, padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setVerificationModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
            
            <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#f8fafc' }}>
              {verificationType === 'Pickup' ? 'Pickup Verification' : verificationType === 'ViewQR' ? 'Generated QR Code' : 'Delivery Verification'}
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              Order #{verificationTarget.backendDonationId || verificationTarget.id}
            </p>

            {verificationType === 'ViewQR' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1rem', display: 'inline-block', borderRadius: '8px' }}>
                  <QRCodeSVG value={verificationTarget.mockPayload} size={250} level="H" />
                </div>
                <p style={{ marginTop: '2rem', color: '#94a3b8' }}>
                  This unique QR code was generated for this accepted delivery. 
                  Show this to the donor or use the scanner on the previous screen to confirm pickup.
                </p>
              </div>
            ) : (
              <>
                <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8' }}>{verificationType === 'Pickup' ? 'Donor' : 'Receiver'}</span>
                    <strong style={{ color: '#f8fafc' }}>{verificationType === 'Pickup' ? verificationTarget.donorName : verificationTarget.toLocation}</strong>
                  </div>
                  {verificationType === 'Pickup' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Mode</span>
                      <strong style={{ color: '#38bdf8' }}>{adminSettings.method.replace(/_/g, ' ')}</strong>
                    </div>
                  )}
                </div>

                {verificationType === 'Delivery' && (
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button 
                      onClick={() => { setDeliveryMethodChoice('QR'); setVerificationError(''); }}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: deliveryMethodChoice === 'QR' ? '2px solid #38bdf8' : '1px solid #1e293b', backgroundColor: deliveryMethodChoice === 'QR' ? 'rgba(56, 189, 248, 0.1)' : '#0f172a', color: deliveryMethodChoice === 'QR' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', fontWeight: 600 }}
                    >
                      QR Code
                    </button>
                    <button 
                      onClick={() => { setDeliveryMethodChoice('OTP'); setVerificationError(''); }}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: deliveryMethodChoice === 'OTP' ? '2px solid #38bdf8' : '1px solid #1e293b', backgroundColor: deliveryMethodChoice === 'OTP' ? 'rgba(56, 189, 248, 0.1)' : '#0f172a', color: deliveryMethodChoice === 'OTP' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', fontWeight: 600 }}
                    >
                      4-Digit OTP
                    </button>
                  </div>
                )}

                {((verificationType === 'Pickup' && (adminSettings.method === 'QR_ONLY' || adminSettings.method === 'QR_AND_OTP')) || (verificationType === 'Delivery' && deliveryMethodChoice === 'QR')) && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '0.75rem' }}>1. Scan QR Code</h3>
                    {qrScanned ? (
                      <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '8px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        QR Code Scanned Successfully
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                        <QRScanner 
                          onScanSuccess={(decodedText) => {
                            try {
                              // If it's delivery, we might expect a slightly different format, but for mock purposes we just check if it parses and has donationId/includes DELIVERY-VERIFY
                              if (decodedText.includes('DELIVERY-VERIFY') || decodedText.includes('DONOR-PICKUP-VERIFY') || JSON.parse(decodedText)) {
                                setQrScanned(true);
                              } else {
                                setVerificationError("Invalid QR Code.");
                              }
                            } catch (e) {
                                // For the generated string payload we used in Pickup
                                if (decodedText.includes('VERIFY')) setQrScanned(true);
                                else setVerificationError("Invalid QR Code Format.");
                            }
                          }}
                          onScanFailure={() => {}}
                        />
                      </div>
                    )}
                  </div>
                )}

                {((verificationType === 'Pickup' && (adminSettings.method === 'OTP_ONLY' || adminSettings.method === 'QR_AND_OTP')) || (verificationType === 'Delivery' && deliveryMethodChoice === 'OTP')) && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '0.75rem' }}>
                      {verificationType === 'Delivery' ? 'Enter 4-Digit OTP' : (adminSettings.method === 'QR_AND_OTP' ? '2. Enter OTP' : '1. Enter OTP')}
                    </h3>
                    <input 
                      type="text" 
                      maxLength={verificationType === 'Delivery' ? 4 : 6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder={`Enter ${verificationType === 'Delivery' ? '4' : '6'}-digit OTP`}
                      style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', letterSpacing: '0.2em', textAlign: 'center', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc', borderRadius: '8px', outline: 'none' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                      <button style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.9rem' }}>Resend OTP</button>
                    </div>
                  </div>
                )}

                {verificationError && (
                  <div style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                    {verificationError}
                  </div>
                )}

                <button 
                  onClick={handleVerificationSubmit}
                  className="dd-btn-primary" 
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', backgroundColor: '#22c55e' }}
                >
                  Verify & Complete {verificationType}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
