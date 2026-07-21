import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

type AuthShellProps = {
  title: string;
  subtitle: string;
  panelTitle: string;
  panelDescription: string;
  children: ReactNode;
  switchText: string;
  switchLinkText: string;
  switchTo: string | (() => void);
  hideFooter?: boolean;
};

export default function AuthShell({
  title,
  subtitle,
  panelTitle,
  panelDescription,
  children,
  switchText,
  switchLinkText,
  switchTo,
  hideFooter = false,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-hero">
          <div>
            <div className="auth-badge">Smart Food Management System</div>

            <h1 className="auth-title">{title}</h1>
            <p className="auth-copy">{subtitle}</p>
          </div>

          <div className="auth-metrics">
            <div className="metric-card">
              <strong>24/7</strong>
              <span>Donation coordination</span>
            </div>
            <div className="metric-card">
              <strong>Fast</strong>
              <span>Simple user onboarding</span>
            </div>
            <div className="metric-card">
              <strong>Secure</strong>
              <span>Protected account access</span>
            </div>
          </div>
        </aside>

        <section className="auth-panel">
          <h2>{panelTitle}</h2>
          <p>{panelDescription}</p>
          {children}
          {!hideFooter && (
            <>
              <div className="auth-switch">
                {switchText}{' '}
                {typeof switchTo === 'string' ? (
                  <Link to={switchTo}>{switchLinkText}</Link>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); switchTo(); }} style={{ color: '#0ea5e9', textDecoration: 'none' }}>
                    {switchLinkText}
                  </a>
                )}
              </div>
              <div className="auth-help">
                Use your credentials to sign in, or create a new account with your name and password.
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
