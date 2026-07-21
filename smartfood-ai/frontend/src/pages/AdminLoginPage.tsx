import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

type AdminLoginState = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminLoginState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const storedPassword = localStorage.getItem('adminPassword');
    if (!formData.email || !formData.password) {
      setError('Enter your email and password to continue.');
      return;
    }

    if (storedPassword && formData.password !== storedPassword) {
      setError('Invalid admin password.');
      return;
    }

    setError('');
    localStorage.setItem('adminUser', formData.email || 'admin');
    localStorage.setItem('adminLoginEmail', formData.email || 'admin');
    navigate('/admin/dashboard');
  };

  return (
    <AuthShell
      title="Admin Access"
      subtitle="Administrators can manage donors, ashramas, donations, and analytics from a centralized dashboard."
      panelTitle="Admin login"
      panelDescription="Use your Email and password to access administrative tools."
      switchText="Need a donation form?"
      switchLinkText="Donate Now"
      switchTo="/login"
      hideFooter={true}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.9rem' }}>{error}</div>}

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter admin password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            required
          />
        </div>

        <button className="auth-button" type="submit">
          Login
        </button>

        <a href="mailto:support@smartfood.local?subject=Admin%20Password%20Reset" className="auth-switch" style={{ marginTop: 0 }}>
          Forgot Password?
        </a>
      </form>
      <div className="auth-help">
        Use this page to manage donors, ashramas, donations, and reports.
      </div>
    </AuthShell>
  );
}