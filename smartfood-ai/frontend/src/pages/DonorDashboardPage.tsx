import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/donor-dashboard.css';
import DonateNowSidebar from '../components/DonateNowSidebar';
import OrderStatusTimeline from '../components/OrderStatusTimeline';

export default function DonorDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const isSidebarOpen = true;

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions.");
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  // Dynamically Load User Data
  const loggedInEmailOrName = localStorage.getItem('donorUser') || 'Ashram';
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
  const matchedUser = storedUsers.find((u: any) => 
    u.email.toLowerCase() === loggedInEmailOrName.toLowerCase() || 
    `${u.firstName} ${u.lastName}`.toLowerCase() === loggedInEmailOrName.toLowerCase()
  );

  const userProfile = {
    id: matchedUser?.id ? `DMU-${matchedUser.id}` : 'DMU-1784405360290',
    name: matchedUser ? `${matchedUser.firstName} ${matchedUser.lastName}` : loggedInEmailOrName,
    email: matchedUser?.email || loggedInEmailOrName,
    phone: matchedUser?.phone || 'Not provided',
    address: matchedUser?.address || 'Not provided',
    registrationDate: matchedUser?.createdAt ? new Date(matchedUser.createdAt).toLocaleDateString() : '19/07/2026'
  };

  const allDonations = JSON.parse(localStorage.getItem('donationIntents') || '[]');
  const myDonations = allDonations.filter((d: any) => d.donorName?.toLowerCase() === userProfile.name.toLowerCase() || d.donorName === 'Donor Name');
  
  const totalDonations = myDonations.length;
  const activeDonations = myDonations.filter((d: any) => ['Pending', 'Approved', 'Accepted', 'On the Way to Pickup'].includes(d.status)).length;
  const completedDonations = myDonations.filter((d: any) => ['Completed', 'Delivered', 'Picked Up', 'On the Way to Delivery'].includes(d.status)).length;
  const upcomingDonations = myDonations.filter((d: any) => d.status === 'Scheduled').length;
  const adminMessages = 1;

  const navItems = [
    { id: 'Overview', label: 'Dashboard' },
    { id: 'Profile', label: 'Profile' },
    { id: 'Food', label: 'Food Donation' },
    { id: 'Document', label: 'Document Donation' },
    { id: 'History', label: 'My Donations' },
    { id: 'Upcoming', label: 'Upcoming Donations' },
    { id: 'Messages', label: 'Messages' }
  ];

  const [showNotifications, setShowNotifications] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);
  const [isDonateSidebarOpen, setDonateSidebarOpen] = useState(false);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    setSystemNotifications(all.filter((n: any) => n.role === 'DONOR' || n.userId === userProfile.email || n.userId === userProfile.id).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const unreadCount = systemNotifications.filter(n => !n.read).length;

  const markAsRead = () => {
    const all = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
    const updated = all.map((n: any) => (n.role === 'DONOR' || n.userId === userProfile.email || n.userId === userProfile.id) ? { ...n, read: true } : n);
    localStorage.setItem('systemNotifications', JSON.stringify(updated));
    setSystemNotifications(updated.filter((n: any) => n.role === 'DONOR' || n.userId === userProfile.email || n.userId === userProfile.id).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  return (
    <div className="dd-layout">
      {/* Sidebar Navigation */}
      <aside className={`dd-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dd-sidebar-header">
          <div className="dd-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Smart food</span>
            <button 
              onClick={() => setDonateSidebarOpen(true)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <span className="dd-logo" style={{ color: '#0ea5e9' }}>Donate Now</span>
            </button>
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

      {/* Main Content Area */}
      <main className="dd-main-content">
        <header className="dd-topbar">
          <div className="dd-topbar-left">
            <h1 className="dd-page-title">{activeTab}</h1>
          </div>
          <div className="dd-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAsRead(); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', position: 'relative' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {unreadCount > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
              </button>
              
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: 320, background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    Notifications
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
            
            <div className="dd-user-profile">
              <div className="dd-user-avatar" style={{ fontSize: '1.5rem' }}>👤</div>
              <div className="dd-user-details">
                <div className="dd-user-name" style={{ fontSize: '1.65rem', color: '#f1f5f9', fontWeight: '500' }}>Welcome, {userProfile.name}</div>
              </div>
            </div>
            <button className="dd-btn-logout">Logout</button>
          </div>
        </header>

        <div className="dd-content-scroll">
          {activeTab === 'Overview' && (
            <div className="dd-overview-section fade-in">
              <div className="dd-stats-grid">
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{totalDonations}</div>
                  <div className="dd-stat-label">TOTAL DONATIONS</div>
                </div>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{activeDonations}</div>
                  <div className="dd-stat-label">ACTIVE DONATIONS</div>
                </div>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{completedDonations}</div>
                  <div className="dd-stat-label">COMPLETED DONATIONS</div>
                </div>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{upcomingDonations}</div>
                  <div className="dd-stat-label">UPCOMING DONATIONS</div>
                </div>
                <div className="dd-stat-card">
                  <div className="dd-stat-value">{adminMessages}</div>
                  <div className="dd-stat-label">MESSAGES</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="dd-profile-section fade-in">
              <div className="dd-card">
                <h2>Account Information</h2>
                <div className="dd-profile-grid">
                  <div className="dd-profile-item">
                    <label>User ID</label>
                    <div>{userProfile.id}</div>
                  </div>
                  <div className="dd-profile-item">
                    <label>Name</label>
                    <div>{userProfile.name}</div>
                  </div>
                  <div className="dd-profile-item">
                    <label>Email</label>
                    <div>{userProfile.email}</div>
                  </div>
                  <div className="dd-profile-item">
                    <label>Phone</label>
                    <div>{userProfile.phone}</div>
                  </div>
                  <div className="dd-profile-item">
                    <label>Address</label>
                    <div>{userProfile.address}</div>
                  </div>
                  <div className="dd-profile-item">
                    <label>Registered</label>
                    <div>{userProfile.registrationDate}</div>
                  </div>
                </div>
                <button className="dd-btn-primary" style={{marginTop: '2rem'}}>Edit Profile</button>
              </div>
            </div>
          )}

          {activeTab === 'Food' && (
            <div className="dd-card fade-in">
              <h2>Food Donation Form</h2>
              <form className="dd-form-grid">
                <div className="dd-form-group">
                  <label>Food Category</label>
                  <select className="dd-input">
                    <option>Cooked Food</option>
                    <option>Packed Food</option>
                    <option>Grocery Items</option>
                    <option>Fruits & Vegetables</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="dd-form-group">
                  <label>Dietary Type</label>
                  <select className="dd-input">
                    <option>VEG</option>
                    <option>NON VEG</option>
                    <option>OVO-VEG</option>
                  </select>
                </div>
                <div className="dd-form-group">
                  <label>Food Name</label>
                  <input type="text" className="dd-input" placeholder="E.g. Rice and Dal" />
                </div>
                <div className="dd-form-group">
                  <label>Quantity / Number of People</label>
                  <input type="number" className="dd-input" placeholder="50" />
                </div>
                <div className="dd-form-group">
                  <label>Preparation Date & Time</label>
                  <input type="datetime-local" className="dd-input" />
                </div>
                <div className="dd-form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Upload Food Image</label>
                  <div className="dd-upload-zone" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                    {capturedImage ? (
                      <div style={{ position: 'relative' }}>
                        <img src={capturedImage} alt="Food capture" style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #142E40' }} />
                        <button type="button" onClick={() => setCapturedImage(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
                      </div>
                    ) : isCameraOpen ? (
                      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', border: '1px solid #142E40', background: '#000' }} />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button type="button" onClick={captureImage} className="dd-btn-primary" style={{ flex: 1 }}>📸 Snap Photo</button>
                          <button type="button" onClick={stopCamera} className="dd-btn-secondary">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button type="button" className="dd-btn-secondary" onClick={startCamera}>📷 Open Camera</button>
                        <span style={{ color: '#94a3b8' }}>or</span>
                        <input type="file" accept="image/jpeg, image/png, image/jpg" style={{ color: '#94a3b8' }} />
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="dd-btn-primary" style={{gridColumn: '1 / -1', marginTop: '1rem'}}>Submit Donation</button>
              </form>
            </div>
          )}
          
          {activeTab === 'Document' && (
            <div className="dd-card fade-in">
              <h2>Document / Item Donation Form</h2>
              <form className="dd-form-grid">
                <div className="dd-form-group">
                  <label>Donation Title</label>
                  <input type="text" className="dd-input" placeholder="School Books" />
                </div>
                <div className="dd-form-group">
                  <label>Category</label>
                  <select className="dd-input">
                    <option>Educational Materials</option>
                    <option>Medical Supplies</option>
                    <option>Other Documents</option>
                  </select>
                </div>
                <div className="dd-form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Upload Document/Image</label>
                  <input type="file" className="dd-input" />
                </div>
                <button type="submit" className="dd-btn-primary" style={{gridColumn: '1 / -1'}}>Submit Donation</button>
              </form>
            </div>
          )}

          {activeTab === 'History' && (
            <div className="dd-card fade-in">
              <h2>My Donations</h2>
              {myDonations.length === 0 ? (
                <div style={{ color: '#94a3b8', padding: '1rem 0' }}>No donations found yet.</div>
              ) : (
                myDonations.map((donation: any, index: number) => (
                  <div key={index} className="dd-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{margin: '0 0 0.5rem 0'}}>{donation.category || 'Food'} Donation - {donation.foodReceived || donation.quantityChoice}</h4>
                        <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Quantity: {donation.foodReceived || donation.quantityChoice} | Route: {donation.fromLocation} to {donation.toLocation}</div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <span className={`dd-badge ${donation.status === 'Completed' || donation.status === 'Delivered' ? 'dd-badge-green' : 'dd-badge-blue'}`}>{donation.status || 'Pending'}</span>
                        <div style={{color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem'}}>Expected Expiry: {donation.expiryDateTime ? new Date(donation.expiryDateTime).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                    
                    {/* Live Tracking & QR for Active Deliveries */}
                    {['Accepted', 'On the Way to Pickup', 'Picked Up', 'On the Way to Delivery'].includes(donation.status) && (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px' }}>
                          <h4 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Assigned Delivery Partner</h4>
                          <div style={{ fontSize: '1.1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>{donation.deliveryNgoName || 'Delivery NGO Partner'}</div>
                          
                          {['Accepted', 'On the Way to Pickup'].includes(donation.status) && (
                            <div style={{ marginTop: '1.5rem', textAlign: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px' }}>
                              {donation.qrToken ? (
                                <QRCodeSVG value={donation.qrToken} size={150} level="H" />
                              ) : (
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DONOR-PICKUP-VERIFY" alt="Pickup QR Code" style={{ width: '150px', height: '150px' }} />
                              )}
                              <div style={{ color: '#000000', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600 }}>Show this to the delivery partner at pickup</div>
                            </div>
                          )}
                          {['Picked Up', 'On the Way to Delivery'].includes(donation.status) && (
                            <div style={{ marginTop: '1.5rem', color: '#22c55e', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <span>✓ Food Picked Up Successfully.</span>
                              <span style={{ color: '#cbd5e1' }}>Pickup Time: {new Date(donation.pickedUpAt || Date.now()).toLocaleString()}</span>
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
                          <p style={{ margin: '0.5rem 0 0', zIndex: 1, fontSize: '0.9rem' }}>{['Accepted', 'On the Way to Pickup'].includes(donation.status) ? 'Delivery Partner En Route to You' : 'Delivery Partner En Route to Receiver'}</p>
                          <div style={{ marginTop: '1rem', zIndex: 1, backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#38bdf8', fontWeight: 600 }}>
                            ETA: {donation.deliveryEta || donation.pickupEta || '15 mins'}
                          </div>
                        </div>
                        
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem', backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px' }}>
                          <h4 style={{ margin: '0 0 1.5rem 0', color: '#f8fafc' }}>Delivery Timeline</h4>
                          <OrderStatusTimeline order={donation} />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Upcoming' && (
            <div className="dd-card fade-in">
              <h2>Scheduled / Upcoming Donation</h2>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Schedule a future donation or set up a recurring donation.</p>
              <form className="dd-form-grid">
                <div className="dd-form-group">
                  <label>Food Category</label>
                  <select className="dd-input">
                    <option>Cooked Food</option>
                    <option>Packed Food</option>
                    <option>Grocery Items</option>
                    <option>Fruits & Vegetables</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="dd-form-group">
                  <label>Dietary Type</label>
                  <select className="dd-input">
                    <option>VEG</option>
                    <option>NON VEG</option>
                    <option>OVO-VEG</option>
                  </select>
                </div>
                <div className="dd-form-group">
                  <label>Food Name</label>
                  <input type="text" className="dd-input" placeholder="E.g. Weekly Rice and Dal" />
                </div>
                <div className="dd-form-group">
                  <label>Quantity / Number of People</label>
                  <input type="number" className="dd-input" placeholder="50" />
                </div>
                <div className="dd-form-group">
                  <label>Frequency</label>
                  <select className="dd-input">
                    <option>One-Time Future Date</option>
                    <option>Every Day</option>
                    <option>Every Week</option>
                    <option>Every Month</option>
                  </select>
                </div>
                <div className="dd-form-group">
                  <label>Scheduled Date</label>
                  <input type="date" className="dd-input" />
                </div>
                <div className="dd-form-group">
                  <label>Scheduled Time</label>
                  <input type="time" className="dd-input" />
                </div>
                <div className="dd-form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Upload Food Image</label>
                  <div className="dd-upload-zone">
                    <input type="file" accept="image/jpeg, image/png, image/jpg" style={{ color: '#94a3b8' }} />
                  </div>
                </div>
                <button type="submit" className="dd-btn-primary" style={{gridColumn: '1 / -1', marginTop: '1rem'}}>Schedule Donation</button>
              </form>
            </div>
          )}

          {activeTab === 'Messages' && (
            <div className="dd-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
              <h2>Admin Messages & Support</h2>
              <div style={{ flex: 1, backgroundColor: '#061923', borderRadius: '12px', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #142E40', marginBottom: '1rem' }}>
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#1e293b', padding: '0.75rem 1rem', borderRadius: '12px', maxWidth: '70%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Admin</div>
                  <div style={{ color: '#f8fafc' }}>Hello! Thank you for signing up as a donor. Let us know if you have any questions about scheduling a pickup!</div>
                </div>
                <div style={{ alignSelf: 'flex-end', backgroundColor: '#0ea5e9', padding: '0.75rem 1rem', borderRadius: '12px', maxWidth: '70%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#e0f2fe', marginBottom: '0.25rem' }}>You</div>
                  <div style={{ color: '#ffffff' }}>Thanks! I have a question about the food quantity requirements.</div>
                </div>
              </div>
              <form className="dd-form-grid" style={{ display: 'flex', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
                <input type="text" className="dd-input" placeholder="Type your message to admin..." style={{ flex: 1 }} />
                <button type="submit" className="dd-btn-primary">Send</button>
              </form>
            </div>
          )}

        </div>
      </main>

      <DonateNowSidebar 
        isOpen={isDonateSidebarOpen} 
        onClose={() => setDonateSidebarOpen(false)} 
        donorId={userProfile?.id}
        donorName={userProfile?.name}
      />
    </div>
  );
}
