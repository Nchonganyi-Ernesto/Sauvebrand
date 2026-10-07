import React, { useState, useEffect } from 'react';
import rawCreamImg from '../assets/lotion_cream_jar.jpg';
import rawPumpImg from '../assets/lotion_daily_pump.jpg';
import rawTubeImg from '../assets/lotion_lavender_tube.jpg';

// Inline ArrowUpRight icon component for 100% reliable rendering
function ArrowUpRight({ size = 13, className = '' }) {
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
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// Inline Check icon component for interactive added state
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

// Client-side canvas flood-fill helper to strip solid white outer background
function useTransparentCutout(src) {
  const [cutoutSrc, setCutoutSrc] = useState(src);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const visited = new Uint8Array(w * h);
        const queue = [];

        const isWhiteBg = (idx) => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          return r > 236 && g > 236 && b > 236;
        };

        for (let x = 0; x < w; x++) {
          queue.push(x, (h - 1) * w + x);
          visited[x] = 1;
          visited[(h - 1) * w + x] = 1;
        }
        for (let y = 1; y < h - 1; y++) {
          queue.push(y * w, y * w + (w - 1));
          visited[y * w] = 1;
          visited[(y * w) + (w - 1)] = 1;
        }

        let head = 0;
        while (head < queue.length) {
          const p = queue[head++];
          if (!isWhiteBg(p)) continue;
          data[p * 4 + 3] = 0;

          const px = p % w;
          const py = Math.floor(p / w);

          const neighbors = [
            py > 0 ? p - w : -1,
            py < h - 1 ? p + w : -1,
            px > 0 ? p - 1 : -1,
            px < w - 1 ? p + 1 : -1,
          ];

          for (let n of neighbors) {
            if (n >= 0 && !visited[n]) {
              visited[n] = 1;
              if (isWhiteBg(n)) {
                queue.push(n);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setCutoutSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas transparency extraction bypassed:', err);
        setCutoutSrc(src);
      }
    };
    img.src = src;
  }, [src]);

  return cutoutSrc;
}

export default function Ecosystem() {
  const creamImg = useTransparentCutout(rawCreamImg);
  const pumpImg = useTransparentCutout(rawPumpImg);
  const tubeImg = useTransparentCutout(rawTubeImg);

  return (
    <section
      id="ecosystem"
      className="ecosystem-section"
      aria-label="SUAVE Everyday Ecosystem Formats"
      style={{ position: 'relative' }}
    >
      {/* Anchor alias to maintain backwards compatibility */}
      <span id="care-support" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', visibility: 'hidden' }} />
      <div className="ecosystem-container">
        {/* Section Header */}
        <div className="ecosystem-header">
          <span className="ecosystem-pill">SUAVE Ecosystem</span>
          <h2 className="ecosystem-title">Everyday formulas. Sculpted for life.</h2>
          <p className="ecosystem-subtitle">
            Clean architectural lines, dermatological precision, and sustainable matte materials across every format.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="ecosystem-grid">
          {/* Card 1: Top Wide Card (Whipped Luxe Body Cream Jar) */}
          <article className="eco-card eco-card-wide eco-card-coral">
            <div className="eco-card-content">
              <div className="eco-card-header-block">
                <span className="eco-badge">INTENSIVE NOURISHMENT</span>
                <h3 className="eco-card-title">Whipped Body Soufflé</h3>
                <p className="eco-card-edition">Vanilla Suede & Shea Edition</p>
              </div>
              <div className="eco-card-footer-block">
                <p className="eco-card-desc">
                  Cold-pressed shea butter engineered to lock in 48-hour deep moisture.
                </p>
                <button
                  type="button"
                  className="eco-btn eco-btn-dark"
                  aria-label="Explore Whipped Body Soufflé"
                >
                  <span>Explore Soufflé</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
            <div className="eco-card-visual eco-visual-wide">
              <img
                src={creamImg}
                alt="Whipped Body Soufflé luxury cream jar"
                className="eco-product-img eco-img-cream"
                loading="lazy"
              />
            </div>
          </article>

          {/* Card 2: Bottom Left Card (Terracotta Hydrating Lotion Pump) */}
          <article className="eco-card eco-card-half eco-card-terracotta">
            <div className="eco-card-content">
              <div className="eco-card-header-block">
                <span className="eco-badge eco-badge-light">DAILY HYDRATION</span>
                <h3 className="eco-card-title eco-title-white">Active Hydrating Lotion</h3>
                <p className="eco-card-edition eco-edition-white">Terracotta Neroli Edition</p>
              </div>
              <div className="eco-card-footer-block">
                <p className="eco-card-desc eco-desc-white">
                  Fast-absorbing citrus shield formulated for seamless daily hydration.
                </p>
                <button
                  type="button"
                  className="eco-btn eco-btn-light"
                  aria-label="Explore Active Hydrating Lotion"
                >
                  <span>Explore Lotion</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
            <div className="eco-card-visual eco-visual-pump">
              <img
                src={pumpImg}
                alt="Active Hydrating Lotion Terracotta pump"
                className="eco-product-img eco-img-pump"
                loading="lazy"
              />
            </div>
          </article>

          {/* Card 3: Bottom Right Card (Lavender & Oat Hand Cream Tube) */}
          <article className="eco-card eco-card-half eco-card-lavender">
            <div className="eco-card-content">
              <div className="eco-card-header-block">
                <span className="eco-badge">BARRIER DEFENSE</span>
                <h3 className="eco-card-title">Precision Hand Cream</h3>
                <p className="eco-card-edition">Lavender & Oat Edition</p>
              </div>
              <div className="eco-card-footer-block">
                <p className="eco-card-desc">
                  Colloidal oat and squalane engineered for instant on-the-go barrier care.
                </p>
                <button
                  type="button"
                  className="eco-btn eco-btn-dark"
                  aria-label="Explore Precision Hand Cream"
                >
                  <span>Explore Cream</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
            <div className="eco-card-visual eco-visual-tube">
              <img
                src={tubeImg}
                alt="Precision Hand Cream Lavender tube"
                className="eco-product-img eco-img-tube"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
