import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { authService } from '../services/api';

type LoginFormState = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormState>({
    identifier: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(
        formData.identifier,
        formData.password
      );
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      const role = response.data.data?.user?.role;
      if (role === 'NGO') {
        localStorage.setItem('ashramaUser', formData.identifier);
        setStatusMessage('Login successful. Opening dashboard...');
        navigate('/ashrama/dashboard');
      } else {
        localStorage.setItem('donorUser', formData.identifier);
        setStatusMessage('Login successful. Opening donor dashboard...');
        navigate('/donor/dashboard');
      }
    } catch (err: any) {
      // Fallback to local storage for local development
      const storedUsersStr = localStorage.getItem('users');
      const storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      const matchedUser = storedUsers.find((user: any) => user.email.toLowerCase() === formData.identifier.toLowerCase());
      
      if (matchedUser) {
         if (matchedUser.role === 'NGO') {
            localStorage.setItem('ashramaUser', formData.identifier);
            setStatusMessage('Ashrama login successful. Opening the dashboard...');
            navigate('/ashrama/dashboard');
         } else {
            localStorage.setItem('donorUser', formData.identifier);
            setStatusMessage('Donor login successful. Opening dashboard...');
            navigate('/donor/dashboard');
         }
      } else {
        const storedPassword = localStorage.getItem('ashramaPassword');
        if (storedPassword && formData.password !== storedPassword) {
          setError('Invalid password.');
          setStatusMessage('');
          setIsLoading(false);
          return;
        } else if (storedPassword && formData.password === storedPassword) {
          localStorage.setItem('ashramaUser', formData.identifier || 'ashrama');
          setStatusMessage('Ashrama login successful. Opening the dashboard...');
          navigate('/ashrama/dashboard');
        } else {
          setError('Invalid credentials. User not found.');
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <AuthShell
      title="Login"
      subtitle="Log in to request food, track donations, or donate food from one place."
      panelTitle="Login"
      panelDescription="Use your Email together with your password to continue."
      switchText="Don't have an account?"
      switchLinkText="Create Account"
      switchTo="/signup"
      hideFooter={true}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.9rem' }}>{error}</div>}
        {statusMessage && <div className="auth-help">{statusMessage}</div>}

        <div className="auth-field">
          <label htmlFor="identifier">Email</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Enter email"
            value={formData.identifier}
            onChange={(event) => setFormData({ ...formData, identifier: event.target.value })}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            required
          />
        </div>

        <button className="auth-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <a href="mailto:support@smartfood.local?subject=Password%20Reset" className="auth-switch" style={{ marginTop: 0 }}>
          Forgot Password?
        </a>
      </form>
    </AuthShell>
  );
}
