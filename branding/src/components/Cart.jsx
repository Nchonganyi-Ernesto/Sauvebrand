import React, { useEffect } from 'react';
import peachImg from '../assets/save3.png';
import sunshineImg from '../assets/sauve2.png';
import twilightImg from '../assets/sauve.png';
import berryImg from '../assets/sauve4.png';

// Inline Icons for 100% reliable rendering
function XIcon({ size = 18 }) {
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
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function BagIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function PlusIcon({ size = 13 }) {
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
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon({ size = 13 }) {
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
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function ArrowRightIcon({ size = 14 }) {
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
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Cart({
  isOpen = false,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
}) {
  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fallback image helper
  const getImage = (item) => {
    if (item.image) return item.image;
    if (item.id === 'peach') return peachImg;
    if (item.id === 'sunshine') return sunshineImg;
    if (item.id === 'twilight') return twilightImg;
    if (item.id === 'berry') return berryImg;
    return peachImg;
  };

  return (
    <div
      className={`cart-drawer-root ${isOpen ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Frosted Transparent Backdrop */}
      <div
        className="cart-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Glass Container with Transparent Frosted Background */}
      <aside className="cart-panel">
        {/* Mobile Pull Handle Indicator */}
        <div className="cart-grab-bar" aria-hidden="true">
          <span className="cart-grab-pill" />
        </div>

        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-wrap">
            <h2 className="cart-title">Your Bag</h2>
            <span className="cart-count-pill">{totalCount}</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close Shopping Bag"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Items List or Empty State */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <BagIcon size={32} />
              </div>
              <h3 className="cart-empty-title">Your bag is empty</h3>
              <p className="cart-empty-desc">
                Discover our 48-hour moisture formulas sculpted for everyday freshness.
              </p>
              <button
                type="button"
                className="cart-empty-btn"
                onClick={() => {
                  onClose();
                  const el = document.querySelector('#products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Best Sellers</span>
                <ArrowRightIcon size={13} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  {/* Thumbnail */}
                  <div
                    className="cart-item-thumb"
                    style={{ backgroundColor: item.bgColor ? `${item.bgColor}22` : 'rgba(255,255,255,0.06)' }}
                  >
                    <img
                      src={getImage(item)}
                      alt={item.name}
                      className="cart-item-img"
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <span className="cart-item-edition">{item.editionName || 'LIMITED EDITION'}</span>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>

                    {/* Quantity & Remove Controls */}
                    <div className="cart-item-controls">
                      <div className="cart-qty-pill">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary (Only shown when items exist) */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal</span>
              <span className="cart-summary-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">Shipping</span>
              <span className="cart-shipping-free">Complimentary</span>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() => {
                alert('Thank you for exploring SUAVE! Checkout experience ready.');
              }}
            >
              <span>Checkout — ${subtotal.toFixed(2)}</span>
              <ArrowRightIcon size={14} />
            </button>

            <p className="cart-guarantee-note">
              48-Hour Dermatological Moisture Guarantee • Free Returns
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
