
import { Link } from 'react-router-dom';
import '../styles/home.css';

const navigationLinks = [
  { label: 'Donate Now', href: '/signup', primary: true },
  { label: 'Admin Login', href: '/admin/login' },
  { label: 'Donate Me', href: '/donateme-auth' },
  { label: 'Delivery NGO', href: '/delivery-ngo/auth' },
];

const stats = [
  { value: '24/7', label: 'Food rescue coordination' },
  { value: '2 Modes', label: 'Food given and food taken' },
  { value: '100%', label: 'Traceable donation flow' },
];

const impactPoints = [
  'Transparent donation tracking from pickup to delivery.',
  'Program-level visibility for food given and food taken.',
  'Reusable workflows for NGOs, restaurants, and volunteers.',
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <div className="landing-glow landing-glow-left" />
      <div className="landing-glow landing-glow-right" />

      <header className="top-banner">
        <div className="brand-pill">Smart Food Management System</div>
        <nav className="main-nav" aria-label="Primary">
          {navigationLinks.map((item) => (
            <Link key={item.label} className={`nav-link ${item.primary ? 'nav-link-primary' : ''}`} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Meal rescue, donation, and impact tracking</span>
          <h1>Your Compassion Can End Hunger</h1>
          <p>
            Organize food donations, record meals given and meals taken, and coordinate delivery
            across partners, communities, and volunteers from one clear dashboard.
          </p>

          {/* site-notice removed per request */}

          <div className="hero-actions">
            <Link className="action-button action-button-primary" to="/signup">
              Donate Now
            </Link>
            <Link className="action-button action-button-secondary" to="/donateme-auth">
              Donate Me
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((item) => (
              <article key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="content-section content-grid">
        <div>
          <span className="section-label">About Us</span>
          <h2>Built to make food redistribution measurable and dependable.</h2>
        </div>
        <p>
          Smart Food Management System helps donors, NGOs, and delivery teams keep food moving
          with visibility on what was given, what was taken, and where support is needed next.
        </p>
      </section>

      <section id="impact" className="content-section impact-section">
        <div className="section-heading">
          <span className="section-label">Impact</span>
          <h2>See the effect of every meal and every delivery.</h2>
        </div>
        <ul className="impact-list">
          {impactPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="content-section cta-strip">
        <div>
          <span className="section-label">Join Us</span>
          <h2>Start tracking food given and food taken today.</h2>
        </div>
        {/* CTA buttons removed as requested */}
      </section>

      {/* footer removed as requested */}
    </main>
  );
}
