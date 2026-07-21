import { FormEvent, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { authService } from '../services/api';
import { UserRole, OrganizationType } from '../types';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // Refs for focusing
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: string, passwordValue?: string): string => {
    switch (name) {
      case 'firstName':
        return /^[A-Za-z\s]{2,}$/.test(value) ? '' : 'Please enter a valid first name.';
      case 'lastName':
        return /^[A-Za-z\s]{2,}$/.test(value) ? '' : 'Please enter a valid last name.';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.';
      case 'phone':
        return /^\d{10}$/.test(value) ? '' : 'Please enter a valid 10-digit mobile number.';
      case 'password':
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? ''
          : 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.';
      case 'confirmPassword':
        return value === passwordValue && value.length > 0 ? '' : 'Passwords do not match.';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // special handling for confirmPassword validation when password changes
    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: validateField('password', value),
        confirmPassword: touched.confirmPassword ? validateField('confirmPassword', formData.confirmPassword, value) : prev.confirmPassword
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, name === 'confirmPassword' ? formData.password : undefined),
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, name === 'confirmPassword' ? formData.password : undefined),
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName && !errors.firstName &&
      formData.lastName && !errors.lastName &&
      formData.email && !errors.email &&
      formData.phone && !errors.phone &&
      formData.password && !errors.password &&
      formData.confirmPassword && !errors.confirmPassword
    );
  };

  const focusFirstInvalid = () => {
    if (validateField('firstName', formData.firstName)) { firstNameRef.current?.focus(); return; }
    if (validateField('lastName', formData.lastName)) { lastNameRef.current?.focus(); return; }
    if (validateField('email', formData.email)) { emailRef.current?.focus(); return; }
    if (validateField('phone', formData.phone)) { phoneRef.current?.focus(); return; }
    if (validateField('password', formData.password)) { passwordRef.current?.focus(); return; }
    if (validateField('confirmPassword', formData.confirmPassword, formData.password)) { confirmPasswordRef.current?.focus(); return; }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError('');
    
    // Force touch all fields
    setTouched({
      firstName: true, lastName: true, email: true, phone: true, password: true, confirmPassword: true
    });
    
    const currentErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword, formData.password),
    };
    setErrors(currentErrors);

    if (Object.values(currentErrors).some(err => err !== '')) {
      focusFirstInvalid();
      return;
    }

    setIsLoading(true);

    const nextUser = {
      id: String(Date.now()),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: UserRole.RESTAURANT,
      address: '-',
      foodQuantity: '-',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = storedUsers.findIndex((user: any) => user.email.toLowerCase() === nextUser.email.toLowerCase());
    const updatedUsers = userIndex >= 0
      ? storedUsers.map((user: any, index: number) => (index === userIndex ? nextUser : user))
      : [...storedUsers, nextUser];

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    let success = true;

    try {
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: UserRole.RESTAURANT,
        organizationType: OrganizationType.RESTAURANT,
      });

      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
    } catch (err: any) {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        success = false;
        setApiError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
      }
    } finally {
      setIsLoading(false);
    }

    if (success) {
      setSuccessMessage('Account created successfully.');
      localStorage.setItem('donorUser', `${formData.firstName} ${formData.lastName}`);
      setTimeout(() => {
        navigate('/donor/dashboard');
      }, 1500);
    }
  };

  const getStyle = (name: string) => {
    if (!touched[name]) return {};
    if (errors[name]) return { border: '2px solid #ef4444' }; // Red border
    if (formData[name as keyof typeof formData]) return { border: '2px solid #22c55e' }; // Green border
    return {};
  };

  return (
    <AuthShell
      title="Sign Up"
      subtitle="Create an account to help connect surplus food with people and organizations that need it most."
      panelTitle="Create Account"
      panelDescription="Enter your details to register as a food donor."
      switchText="Already registered?"
      switchLinkText="Sign in"
      switchTo="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.9rem', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{apiError}</div>}
        {successMessage && <div style={{ color: '#22c55e', marginBottom: '12px', fontSize: '0.9rem', padding: '10px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>{successMessage}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="auth-field">
            <label htmlFor="firstName">First Name</label>
            <input
              ref={firstNameRef}
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={getStyle('firstName')}
              required
            />
            {touched.firstName && errors.firstName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.firstName}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              ref={lastNameRef}
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={getStyle('lastName')}
              required
            />
            {touched.lastName && errors.lastName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.lastName}</span>}
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email Address</label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getStyle('email')}
            required
          />
          {touched.email && errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="phone">Mobile Number</label>
          <input
            ref={phoneRef}
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getStyle('phone')}
            required
          />
          {touched.phone && errors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.phone}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            ref={passwordRef}
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getStyle('password')}
            required
          />
          {touched.password && errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            ref={confirmPasswordRef}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={getStyle('confirmPassword')}
            required
          />
          {touched.confirmPassword && errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.confirmPassword}</span>}
        </div>

        <button 
          className="auth-button" 
          type="submit" 
          disabled={isLoading || !isFormValid()}
          style={{ opacity: (!isFormValid() || isLoading) ? 0.6 : 1, cursor: (!isFormValid() || isLoading) ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease-in-out' }}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
}
