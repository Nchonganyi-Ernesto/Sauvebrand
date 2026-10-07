import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, X } from 'lucide-react';

export default function Navbar({ cartCount = 0, onOpenCart }) {
  const [activeTab, setActiveTab] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'about', label: 'Philosophy', href: '#about' },
    { id: 'products', label: 'Best Sellers', href: '#products' },
    { id: 'the-bottle', label: 'The Bottle', href: '#the-bottle' },
    { id: 'ecosystem', label: 'Ecosystem', href: '#ecosystem' },
  ];

  // Detect scroll offset for desktop logo morphing (SUAVE -> S circle) and active section scroll-spy
  useEffect(() => {
    const sectionIds = ['about', 'products', 'the-bottle', 'ecosystem'];

    const onScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 45);

      // Hero section at top: clear active section tab
      if (scrollY < 200) {
        setActiveTab('');
        return;
      }

      // If near bottom of document, keep last section active
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveTab('ecosystem');
        return;
      }

      // Check section offsets for accurate active tab highlighting
      const scrollPosition = scrollY + 240;
      let currentSection = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
            break;
          }
        }
      }

      if (currentSection) {
        setActiveTab(currentSection);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href, id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setActiveTab('');
    setIsMobileMenuOpen(false);
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header
        className={`site-header desktop-header ${isScrolled ? 'is-scrolled' : ''}`}
        role="banner"
      >
        {/* Brand Logo: Switches from SUAVE text to circular 'S' monogram on scroll */}
        <a
          href="#hero"
          className={`brand-logo ${isScrolled ? 'show-monogram' : 'show-text'}`}
          aria-label="SUAVE Homepage"
          onClick={handleLogoClick}
        >
          {/* Full Text Wordmark */}
          <span className="brand-text">SUAVE</span>

          {/* Circular 'S' Monogram Badge (Matching mobile bottom dock) */}
          <span className="brand-monogram-circle" aria-hidden="true">
            <span className="monogram-letter">S</span>
          </span>
        </a>

        {/* Floating Center Glass Capsule Nav */}
        <nav className="nav-dock" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, item.id);
              }}
            >
              {item.isSpecial && <Sparkles className="sparkle-icon" aria-hidden="true" />}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Cart Action */}
        <div className="nav-actions">
          <button
            className="cart-button"
            aria-label={`Shopping bag with ${cartCount} items`}
            title="View Bag"
            onClick={onOpenCart}
          >
            <ShoppingBag className="cart-icon" />
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* ================= MOBILE FLOATING BOTTOM DOCK ================= */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation Dock">
        {/* Left Circular Monogram Button */}
        <a
          href="#hero"
          className="mobile-brand-circle"
          aria-label="Scroll to top"
          onClick={handleLogoClick}
        >
          <span className="monogram-letter">S</span>
        </a>

        {/* Right Capsule Pill (Menu + Bag) */}
        <div className="mobile-dock-capsule">
          {/* Two-Bar Hamburger Menu Trigger */}
          <button
            className="mobile-menu-trigger"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="mobile-close-icon" size={17} />
            ) : (
              <span className="two-bar-hamburger" aria-hidden="true">
                <span className="bar" />
                <span className="bar" />
              </span>
            )}
            <span className="menu-text">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          </button>

          {/* Nested Bag Pill Button */}
          <button
            className="mobile-bag-pill"
            aria-label={`Shopping bag with ${cartCount} items`}
            onClick={onOpenCart}
          >
            <ShoppingBag className="mobile-bag-icon" size={15} />
            <span className="bag-text">Bag ({cartCount})</span>
          </button>
        </div>
      </nav>

      {/* ================= MOBILE EXPANDED MENU DRAWER ================= */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="mobile-drawer-header">
              <span className="drawer-brand">SUAVE</span>
              <button
                className="drawer-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`mobile-drawer-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href, item.id);
                  }}
                >
                  <div className="link-content">
                    {item.isSpecial && <Sparkles className="drawer-sparkle" size={15} />}
                    <span>{item.label}</span>
                  </div>
                  <span className="drawer-arrow">→</span>
                </a>
              ))}
            </div>

            <div className="mobile-drawer-footer">
              <span className="drawer-tagline">The Art of Everyday Freshness</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
