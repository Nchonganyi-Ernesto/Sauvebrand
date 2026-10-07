import React, { useState } from 'react';
import footerBottleImg from '../assets/footer_lotion_bottle.jpg';

// Inline ArrowRight icon
function ArrowRight({ size = 13, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// Inline Check icon
function Check({ size = 13, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 2800);
  };

  const navLinks = [
    { label: 'Sculpted Lotions', href: '#the-bottle' },
    { label: 'Active Daily Lotion', href: '#ecosystem' },
    { label: 'Whipped Soufflé', href: '#ecosystem' },
    { label: 'Botanical Barrier Balm', href: '#ecosystem' },
    { label: 'Dermatological Standards', href: '#ecosystem' },
  ];

  return (
    <footer id="club" className="site-footer" role="contentinfo" aria-label="Site Footer">
      <div className="footer-container">
        {/* Left Column: Brand, Newsletter & Links */}
        <div className="footer-left-content">
          {/* Circular 'S' Brand Monogram Badge */}
          <div className="footer-brand-badge" aria-label="SUAVE Brand">
            <span className="footer-monogram-letter">S</span>
          </div>

          {/* Heading */}
          <h2 className="footer-headline">Join the ritual.</h2>

          {/* Subtitle */}
          <p className="footer-subtitle">
            Private formula drops, seasonal botanical releases, and dermatological notes.
          </p>

          {/* Newsletter Input */}
          <form className="footer-newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="footer-input"
              placeholder="Enter email for private drops..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address for private drops"
              required
            />
            <button
              type="submit"
              className={`footer-join-btn ${isSubscribed ? 'is-subscribed' : ''}`}
              aria-label="Submit email to join"
            >
              {isSubscribed ? (
                <>
                  <span>Joined</span>
                  <Check size={12} />
                </>
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="footer-nav" aria-label="Footer Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector(link.href);
                  if (target) {
                    if (window.__lenis) {
                      window.__lenis.scrollTo(target, { offset: -70, duration: 1.2 });
                    } else {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Bottom Legal Bar */}
          <div className="footer-bottom-bar">
            <p className="footer-copyright">
              © 2026 SUAVE Skincare & Beauty Inc. All rights reserved.
            </p>
            <p className="footer-location">New York, NY</p>
          </div>
        </div>

        {/* Right Column: Heroic Tilted Product Silhouette */}
        <div className="footer-right-visual" aria-hidden="true">
          <div className="footer-visual-glow" />
          <img
            src={footerBottleImg}
            alt="SUAVE Sculpted Lotion Bottle in dark olive finish"
            className="footer-bottle-image"
            draggable={false}
          />
        </div>
      </div>
    </footer>
  );
}
