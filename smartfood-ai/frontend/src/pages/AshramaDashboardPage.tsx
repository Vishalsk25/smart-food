import { FormEvent, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/ngo-dashboard.css';
import OrderStatusTimeline from '../components/OrderStatusTimeline';

type SectionKey = 'profile' | 'request' | 'history' | 'notifications' | 'tracking';

export default function AshramaDashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionKey>('profile');
  const [message, setMessage] = useState('');
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('donateMeSession') || 'null');
      if (!user) {
        navigate('/donateme-auth');
      } else {
        setSessionUser(user);
      }
    } catch (e) {
      navigate('/donateme-auth');
    }
  }, [navigate]);

  // Request form state
  const [requestForm, setRequestForm] = useState({
    foodType: '',
    numberOfPlates: '',
    quantity: '',
    requiredDate: '',
    requiredTime: '',
    address: '',
    contactNumber: '',
    additionalNotes: ''
  });

  const requests = useMemo(() => {
    try {
      const all = JSON.parse(localStorage.getItem('foodRequests') || '[]');
      return Array.isArray(all) ? all.filter((r: any) => r.userId === sessionUser?.id) : [];
    } catch { return []; }
  }, [sessionUser, message]); 

  const incomingDeliveries = useMemo(() => {
    try {
      const all = JSON.parse(localStorage.getItem('donationIntents') || '[]');
      // Filter intents that are meant for this Ashrama (by name/email mock matching)
      return Array.isArray(all) ? all.filter((d: any) => d.toLocation?.toLowerCase().includes(sessionUser?.fullName?.toLowerCase() || '') || d.status !== 'Pending') : [];
    } catch { return []; }
  }, [sessionUser, message]);

  const notifications = useMemo(() => {
    try {
      const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
      return Array.isArray(all) ? all.filter((n: any) => n.userId === sessionUser?.id).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
    } catch { return []; }
  }, [sessionUser, message]);

  if (!sessionUser) return null;

  const pushNotification = (title: string, msg: string) => {
    const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    all.push({
      id: `NOTIF-${Date.now()}`,
      userId: sessionUser.id,
      title,
      message: msg,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('systemNotifications', JSON.stringify(all));
  };

  const handleRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const newRequest = {
      ...requestForm,
      id: `REQ-${Date.now()}`,
      userId: sessionUser.id,
      userName: sessionUser.fullName,
      email: sessionUser.email,
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };

    const allRequests = JSON.parse(localStorage.getItem('foodRequests') || '[]');
    localStorage.setItem('foodRequests', JSON.stringify([...allRequests, newRequest]));
    
    setMessage('Food request submitted successfully! It is now pending admin review.');
    pushNotification('Request Submitted', `Your food request for ${requestForm.numberOfPlates} plates has been submitted.`);
    
    setRequestForm({
      foodType: '', numberOfPlates: '', quantity: '', requiredDate: '',
      requiredTime: '', address: '', contactNumber: '', additionalNotes: ''
    });
    setTimeout(() => setMessage(''), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('donateMeSession');
    navigate('/donateme-auth');
  };

  const pendingCount = requests.filter((r: any) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r: any) => r.status === 'Approved').length;

  return (
    <div className="ngo-page">
      <header className="ngo-header">
        <div className="ngo-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Smart food</span>
          <span className="ngo-logo">Donate Me</span>
        </div>
        <div className="ngo-user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <div className="ngo-user-greeting" style={{ fontSize: '1.5rem', margin: 0, padding: 0 }}>Welcome back,</div>
          <div className="ngo-user-name" style={{ fontSize: '1.65rem', margin: 0, padding: 0, lineHeight: 1 }}>{sessionUser.fullName}</div>
        </div>
      </header>

      <main className="ngo-main">
        <div className="ngo-nav">
          <button className={`ngo-nav-btn ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>
            <svg className="ngo-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="ngo-nav-text">Profile</span>
          </button>
          <button className={`ngo-nav-btn ${activeSection === 'request' ? 'active' : ''}`} onClick={() => setActiveSection('request')}>
            <svg className="ngo-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            <span className="ngo-nav-text">Request Food Plates</span>
          </button>
          <button className={`ngo-nav-btn ${activeSection === 'history' ? 'active' : ''}`} onClick={() => setActiveSection('history')}>
            <svg className="ngo-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span className="ngo-nav-text">My Requests</span>
          </button>
          <button className={`ngo-nav-btn ${activeSection === 'tracking' ? 'active' : ''}`} onClick={() => setActiveSection('tracking')}>
            <svg className="ngo-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            <span className="ngo-nav-text">Track Deliveries</span>
          </button>
          <button className={`ngo-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSection('notifications')}>
            <svg className="ngo-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span className="ngo-nav-text">Notifications</span>
          </button>
        </div>

        {message && <div className="ngo-msg">{message}</div>}

        {activeSection === 'profile' && (
          <div className="ngo-section">
            <div className="ngo-stats-grid">
              <div className="ngo-stat-card">
                <div className="ngo-stat-label">Pending Requests</div>
                <div className="ngo-stat-value">{pendingCount}</div>
              </div>
              <div className="ngo-stat-card">
                <div className="ngo-stat-label">Approved Requests</div>
                <div className="ngo-stat-value">{approvedCount}</div>
              </div>
              <div className="ngo-stat-card">
                <div className="ngo-stat-label">Notifications</div>
                <div className="ngo-stat-value">{notifications.length}</div>
              </div>
            </div>

            <div className="ngo-card">
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#f8fafc' }}>Account Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <div className="ngo-label">User ID</div>
                  <div style={{ fontSize: '1.1rem' }}>{sessionUser.id}</div>
                  <div className="ngo-label" style={{ marginTop: '1rem' }}>Registered</div>
                  <div style={{ fontSize: '1.1rem' }}>{new Date(sessionUser.registrationDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="ngo-label">Name</div>
                  <div style={{ fontSize: '1.1rem' }}>{sessionUser.fullName}</div>
                  <div className="ngo-label" style={{ marginTop: '1rem' }}>Email</div>
                  <div style={{ fontSize: '1.1rem' }}>{sessionUser.email}</div>
                  <div className="ngo-label" style={{ marginTop: '1rem' }}>Phone</div>
                  <div style={{ fontSize: '1.1rem' }}>{sessionUser.phone}</div>
                </div>
                <div>
                  <div className="ngo-label">Address</div>
                  <div style={{ fontSize: '1.1rem' }}>{sessionUser.address}</div>
                  
                  <button className="ngo-btn-primary" onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', boxShadow: 'none', marginTop: '2rem' }}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'request' && (
          <div className="ngo-section ngo-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ margin: '0 0 2rem 0' }}>Request Food Plates</h2>
            <form onSubmit={handleRequestSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="ngo-form-group">
                  <label className="ngo-label">Food Type</label>
                  <input className="ngo-input" required value={requestForm.foodType} onChange={e => setRequestForm({...requestForm, foodType: e.target.value})} placeholder="e.g. Cooked Meals, Raw Groceries" />
                </div>
                <div className="ngo-form-group">
                  <label className="ngo-label">Number of Plates Required</label>
                  <input className="ngo-input" required type="number" min="1" value={requestForm.numberOfPlates} onChange={e => setRequestForm({...requestForm, numberOfPlates: e.target.value})} placeholder="e.g. 50" />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="ngo-form-group">
                  <label className="ngo-label">Total Quantity (kg/liters if applicable)</label>
                  <input className="ngo-input" value={requestForm.quantity} onChange={e => setRequestForm({...requestForm, quantity: e.target.value})} placeholder="Optional" />
                </div>
                <div className="ngo-form-group">
                  <label className="ngo-label">Contact Number</label>
                  <input className="ngo-input" required type="tel" value={requestForm.contactNumber} onChange={e => setRequestForm({...requestForm, contactNumber: e.target.value})} placeholder="Phone number for this request" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="ngo-form-group">
                  <label className="ngo-label">Required Date</label>
                  <input className="ngo-input" required type="date" value={requestForm.requiredDate} onChange={e => setRequestForm({...requestForm, requiredDate: e.target.value})} />
                </div>
                <div className="ngo-form-group">
                  <label className="ngo-label">Required Time</label>
                  <input className="ngo-input" required type="time" value={requestForm.requiredTime} onChange={e => setRequestForm({...requestForm, requiredTime: e.target.value})} />
                </div>
              </div>

              <div className="ngo-form-group">
                <label className="ngo-label">Delivery/Pickup Address</label>
                <input className="ngo-input" required value={requestForm.address} onChange={e => setRequestForm({...requestForm, address: e.target.value})} placeholder="Full address" />
              </div>

              <div className="ngo-form-group">
                <label className="ngo-label">Additional Notes</label>
                <textarea className="ngo-textarea" value={requestForm.additionalNotes} onChange={e => setRequestForm({...requestForm, additionalNotes: e.target.value})} placeholder="Any specific instructions?" />
              </div>

              <button className="ngo-btn-primary" type="submit">Submit Request</button>
            </form>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="ngo-section ngo-card">
            <h2 style={{ margin: '0 0 2rem 0' }}>My Food Requests</h2>
            <div className="ngo-list">
              {requests.length > 0 ? requests.map((req: any) => (
                <div key={req.id} className="ngo-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{req.foodType} <span style={{ color: '#94a3b8', fontWeight: 500 }}>({req.numberOfPlates} plates)</span></strong>
                    <span className={`ngo-badge ${req.status === 'Pending' ? 'ngo-badge-warning' : req.status === 'Approved' ? 'ngo-badge-success' : req.status === 'Rejected' ? 'ngo-badge-danger' : 'ngo-badge-neutral'}`}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', width: '100%', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Requested for:</strong><br/>
                      {req.requiredDate} at {req.requiredTime}
                    </div>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Address:</strong><br/>
                      {req.address}
                    </div>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Request ID:</strong><br/>
                      {req.id}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ color: '#64748b', padding: '1rem' }}>You haven't made any food requests yet.</div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'tracking' && (
          <div className="ngo-section ngo-card">
            <h2 style={{ margin: '0 0 2rem 0' }}>Incoming Deliveries & Live Tracking</h2>
            <div className="ngo-list">
              {incomingDeliveries.length > 0 ? incomingDeliveries.map((req: any) => (
                <div key={req.id} className="ngo-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{req.donationType?.toUpperCase()} Donation <span style={{ color: '#94a3b8', fontWeight: 500 }}>({req.foodPlates || req.quantityChoice} plates)</span></strong>
                    <span className={`ngo-badge ngo-badge-blue`}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', width: '100%', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Donor:</strong><br/>
                      {req.donorName || req.fullName}
                    </div>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Order ID:</strong><br/>
                      {req.backendDonationId || req.id}
                    </div>
                  </div>

                  {/* Live Tracking & Receiver QR */}
                  {['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(req.status) && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
                      <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Assigned Delivery Partner</h4>
                        <div style={{ fontSize: '1.1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>{req.deliveryNgoName || 'FastRescue Delivery NGO'}</div>
                        
                        {['Picked Up', 'On the Way to Delivery'].includes(req.status) && (
                          <div style={{ marginTop: '1.5rem', textAlign: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px' }}>
                            {req.deliveryQrToken ? (
                              <QRCodeSVG value={req.deliveryQrToken} size={150} level="H" />
                            ) : (
                              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RECEIVER-DELIVERY-VERIFY" alt="Receiver QR Code" style={{ width: '150px', height: '150px' }} />
                            )}
                            <div style={{ color: '#000000', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600 }}>Show this QR code to the delivery partner on arrival</div>
                            
                            {req.deliveryOtp && (
                              <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px', color: '#0f172a' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Or Share Delivery OTP</div>
                                <div style={{ fontSize: '1.5rem', letterSpacing: '0.2em', fontWeight: 'bold' }}>{req.deliveryOtp}</div>
                              </div>
                            )}
                          </div>
                        )}
                        {['Accepted', 'On the Way to Pickup'].includes(req.status) && (
                          <div style={{ marginTop: '1.5rem', color: '#f59e0b', fontWeight: 500 }}>
                            ⌛ Delivery partner is en route to pickup the food from the donor.
                          </div>
                        )}
                      </div>
                      <div style={{ width: '100%', height: '100%', minHeight: '200px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', zIndex: 1 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <h4 style={{ margin: 0, color: '#f8fafc', zIndex: 1 }}>Live Map Tracking</h4>
                        <p style={{ margin: '0.5rem 0 0', zIndex: 1, fontSize: '0.9rem' }}>{['Accepted', 'On the Way to Pickup'].includes(req.status) ? 'Delivery Partner En Route to Pickup' : 'Delivery Partner En Route to You'}</p>
                        <div style={{ marginTop: '1rem', zIndex: 1, backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#38bdf8', fontWeight: 600 }}>
                          ETA: {req.deliveryEta || req.pickupEta || '15 mins'}
                        </div>
                      </div>
                      
                      <div style={{ gridColumn: '1 / -1', marginTop: '1rem', backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', color: '#f8fafc' }}>Delivery Timeline</h4>
                        <OrderStatusTimeline order={req} />
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div style={{ color: '#64748b', padding: '1rem' }}>You haven't made any food requests yet.</div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="ngo-section ngo-card">
            <h2 style={{ margin: '0 0 2rem 0' }}>Notifications</h2>
            <div className="ngo-list">
              {notifications.length > 0 ? notifications.map((notif: any) => (
                <div key={notif.id} className="ngo-list-item" style={{ borderLeft: '4px solid #0ea5e9' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '1.1rem' }}>{notif.title}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>{notif.message}</div>
                  </div>
                </div>
              )) : (
                <div style={{ color: '#64748b', padding: '1rem' }}>No new notifications.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
