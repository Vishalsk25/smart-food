import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

export default function DonateMeAuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('donateMeUsers') || '[]');
    const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      localStorage.setItem('donateMeSession', JSON.stringify(user));
      navigate('/ashrama/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  const validateName = (name: string) => /^[a-zA-Z\s]{2,}$/.test(name);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleSignUpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!validateName(signUpData.fullName)) {
      setError('Please enter a valid name (min 2 characters, alphabets and spaces only).');
      return;
    }
    if (!validateEmail(signUpData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(signUpData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const nextUser = {
      id: `DMU-${Date.now()}`,
      fullName: signUpData.fullName,
      email: signUpData.email,
      phone: signUpData.phone,
      address: signUpData.address,
      password: signUpData.password,
      registrationDate: new Date().toISOString(),
    };

    const users = JSON.parse(localStorage.getItem('donateMeUsers') || '[]');
    if (users.find((u: any) => u.email === nextUser.email)) {
      setError('User with this email already exists.');
      return;
    }

    localStorage.setItem('donateMeUsers', JSON.stringify([...users, nextUser]));
    setMessage('Account created successfully.');
    setSignUpData({ fullName: '', email: '', phone: '', address: '', password: '', confirmPassword: '' });
    
    setTimeout(() => {
      setMessage('');
      setIsLogin(true);
    }, 2000);
  };

  return (
    <AuthShell
      title="Donate Me"
      subtitle="Join as a receiver to request food plates, track statuses, and manage your organization's needs."
      panelTitle={isLogin ? 'Sign In' : 'Create Account'}
      panelDescription={isLogin ? 'Enter your credentials to access your dashboard.' : 'Register to start requesting food.'}
      switchText=""
      switchLinkText=""
      switchTo=""
      hideFooter={true}
    >
      {message && <div style={{ color: '#22c55e', padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px', marginBottom: '16px' }}>{message}</div>}
      {error && <div style={{ color: '#ef4444', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

      {isLogin ? (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="auth-field">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <button type="button" onClick={() => alert('Forgot password flow...')} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '0.875rem' }}>
              Forgot Password?
            </button>
          </div>
          <button className="auth-button" type="submit">Sign In</button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleSignUpSubmit}>
          <div className="auth-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              placeholder="Full Name"
              value={signUpData.fullName}
              onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signupEmail">Email Address</label>
            <input
              id="signupEmail"
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Phone Number"
              value={signUpData.phone}
              onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              placeholder="Address"
              value={signUpData.address}
              onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field">
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm"
                value={signUpData.confirmPassword}
                onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>
          <button className="auth-button" type="submit">Create Account</button>
        </form>
      )}

      <div className="auth-switch" style={{ marginTop: '24px' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button 
          type="button" 
          onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} 
          style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', padding: 0 }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </AuthShell>
  );
}
