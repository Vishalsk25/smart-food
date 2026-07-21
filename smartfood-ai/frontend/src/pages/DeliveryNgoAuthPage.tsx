import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

export default function DeliveryNgoAuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  // Registration State
  const [regForm, setRegForm] = useState({
    orgName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Login State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Name Validation
    if (regForm.orgName.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return;
    }

    // Phone Validation (basic 10 digit or international format check)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(regForm.phone.replace(/[-\s]/g, ''))) {
      setError("Please enter a valid phone number (10-15 digits).");
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regForm.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password Validation
    if (regForm.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    const newUser = {
      id: Date.now().toString(),
      role: 'DELIVERY_NGO',
      fullName: regForm.orgName,
      phone: regForm.phone,
      email: regForm.email,
      address: regForm.address,
      createdAt: new Date().toISOString(),
      status: 'Active' // Auto-approve for demo
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login
    localStorage.setItem('sessionUser', JSON.stringify(newUser));
    alert("Registration successful! Waiting for Admin approval (simulated auto-approval for now).");
    navigate('/delivery-ngo/dashboard');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === loginForm.email && u.role === 'DELIVERY_NGO');
    
    if (user) {
      if (user.status === 'Disabled' || user.status === 'Rejected') {
        setError("Your account is not active. Please contact admin.");
        return;
      }
      localStorage.setItem('sessionUser', JSON.stringify(user));
      navigate('/delivery-ngo/dashboard');
    } else {
      setError("Invalid credentials or user not registered as Delivery NGO.");
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!isLogin ? (
        <AuthShell
          title="Delivery NGO Network"
          subtitle="Join our network of registered volunteer organizations transporting donated food free of cost. Help bridge the gap between donors and Ashramas."
          panelTitle="Register Delivery NGO"
          panelDescription="Create an account to start accepting delivery requests."
          switchText="Already registered?"
          switchLinkText="Sign In"
          switchTo={() => { setIsLogin(true); setError(''); }}
        >
          <form className="auth-form" onSubmit={handleRegister}>
            {error && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.9rem' }}>{error}</div>}
            <div className="auth-field">
              <label>Name</label>
              <input type="text" required value={regForm.orgName} onChange={e => setRegForm({...regForm, orgName: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="auth-field">
                <label>Phone Number</label>
                <input type="tel" required value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} />
              </div>
              <div className="auth-field">
                <label>Email Address</label>
                <input type="email" required value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
              </div>
            </div>
            <div className="auth-field">
              <label>Full Address</label>
              <input type="text" required value={regForm.address} onChange={e => setRegForm({...regForm, address: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" required value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <input type="password" required value={regForm.confirmPassword} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="auth-button">Register</button>
          </form>
        </AuthShell>
      ) : (
        <AuthShell
          title="Delivery NGO Network"
          subtitle="Log in to manage your active deliveries, view optimized routes, and update real-time status."
          panelTitle="Sign In"
          panelDescription="Access your Delivery Dashboard."
          switchText="New organization?"
          switchLinkText="Create Account"
          switchTo={() => { setIsLogin(false); setError(''); }}
        >
          <form className="auth-form" onSubmit={handleLogin}>
            {error && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.9rem' }}>{error}</div>}
            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" required value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>
            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ marginBottom: 0 }}>Password</label>
              </div>
              <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            </div>
            <button type="submit" className="auth-button">Sign In</button>
            <a href="#" className="auth-switch" style={{ marginTop: 0 }}>Forgot Password?</a>
          </form>
        </AuthShell>
      )}
    </div>
  );
}
