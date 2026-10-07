import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

import rawPeachImg from '../assets/save3.png';
import sunshineImg from '../assets/sauve2.png';
import twilightImg from '../assets/sauve.png';
import berryImg from '../assets/sauve4.png';

// Canvas-based flood-fill to strip white background from the first image
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
          return r > 232 && g > 232 && b > 232;
        };

        for (let x = 0; x < w; x++) {
          queue.push(x, (h - 1) * w + x);
          visited[x] = 1;
          visited[(h - 1) * w + x] = 1;
        }
        for (let y = 1; y < h - 1; y++) {
          queue.push(y * w, y * w + (w - 1));
          visited[y * w] = 1;
          visited[y * w + (w - 1)] = 1;
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

export default function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0); // Normalized drag offset in index units
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 860);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stageRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isPointerDownRef = useRef(false);

  const peachCutout = useTransparentCutout(rawPeachImg);

  const editions = [
    {
      id: 'peach',
      name: 'Peach Edition',
      title: 'SUAVE Sculpted Bottle Pro',
      editionPill: 'Modular Editions',
      scent: 'Warm Shea Butter & Vanilla',
      description: 'Deep, warm shea and radiant peach — engineered for 48-hour moisture barrier renewal and velvet-smooth skin.',
      color: '#FBAF96',
      image: peachCutout,
      accent: '#A83B18',
    },
    {
      id: 'sunshine',
      name: 'Sunshine Edition',
      title: 'SUAVE Radiance Restore Pro',
      editionPill: 'Modular Editions',
      scent: 'Vitamin C & Citrus Sun',
      description: 'Bright citrus and Vitamin C complex — formulated for luminous radiance, cell vitality, and instant glow.',
      color: '#FDCB52',
      image: sunshineImg,
      accent: '#8C5A00',
    },
    {
      id: 'cobalt',
      name: 'Cobalt Edition',
      title: 'SUAVE Advanced Therapy Pro',
      editionPill: 'Modular Editions',
      scent: 'Hydro Complex & Mineral Dew',
      description: 'Deep, electric and resolute — engineered for high-altitude endurance and crisp, long-lasting hydration.',
      color: '#A3C2F7',
      image: twilightImg,
      accent: '#254A94',
    },
    {
      id: 'berry',
      name: 'Berry Edition',
      title: 'SUAVE Soothing Botanical Pro',
      editionPill: 'Modular Editions',
      scent: 'Wild Berry & Fresh Aloe',
      description: 'Soothing botanical blend with fresh aloe — wild berry essence for calming relief and all-day antioxidant defense.',
      color: '#F792AD',
      image: berryImg,
      accent: '#8C153E',
    },
  ];

  const total = editions.length;

  // Shortest circular delta between two indices
  const getCircularDiff = useCallback(
    (index, activeFloat) => {
      let diff = (index - activeFloat) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    },
    [total]
  );

  // Pointer drag event handlers for mouse & touch
  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    setIsDragging(true);
    if (stageRef.current) {
      stageRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const stageWidth = stageRef.current ? stageRef.current.offsetWidth : 800;
    // Map drag pixels to fractional index shift (drag left => shift index right)
    const normalized = -deltaX / (stageWidth * 0.38);
    setDragOffset(normalized);
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      if (stageRef.current && stageRef.current.hasPointerCapture(e.pointerId)) {
        stageRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaTime = Date.now() - dragStartRef.current.time;
    const velocity = Math.abs(deltaX) / (deltaTime || 1);

    // Snap decision based on displacement or drag velocity
    let change = 0;
    if (Math.abs(deltaX) > 40 || velocity > 0.45) {
      change = deltaX < 0 ? 1 : -1;
    }

    setDragOffset(0);
    if (change !== 0) {
      setCurrentIndex((prev) => (prev + change + total) % total);
    }
  };

  const handlePointerCancel = (e) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleItemClick = (index, diff) => {
    if (Math.abs(dragOffset) > 0.05) return; // Ignore click during drag
    if (Math.round(diff) === 0) return;
    setCurrentIndex(index);
  };

  const activeEdition = editions[currentIndex];
  const effectiveIndex = currentIndex + dragOffset;

  return (
    <section
      id="the-bottle"
      className="vshape-showcase-section"
      aria-label="Modular Editions Interactive Showcase"
    >
      <div className="vshape-container">
        {/* Header with pill eyebrow & main display title */}
        <div className="vshape-header">
          <span className="vshape-pill">{activeEdition.editionPill}</span>
          <h2 className="vshape-title">{activeEdition.title}</h2>
        </div>

        {/* The V-Shape Interactive Drag Stage */}
        <div
          ref={stageRef}
          className={`vshape-stage ${isDragging ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          role="region"
          aria-label="Drag left or right to explore product editions"
          tabIndex={0}
        >
          {editions.map((edition, idx) => {
            const diff = getCircularDiff(idx, effectiveIndex);
            const isVisible = Math.abs(diff) <= 1.45;

            // V-Shape Geometric Equations:
            // x: horizontal spacing (centers at 0, spread to left and right)
            // y: V-shape curve where center (diff=0) is lowest, left & right rise upwards
            // scale: center item is large (1.15), side items shrink to ~0.74
            // opacity: center item is 100%, side items fade to 45%
            const stepX = isMobile ? 255 : 430;
            const posX = diff * stepX;
            const posY = -Math.pow(Math.abs(diff), 1.15) * (isMobile ? 48 : 70); // THE V-SHAPE LIFT
            const maxScale = isMobile ? 1.2 : 1.45;
            const scale = Math.max(0.74, maxScale - Math.abs(diff) * (isMobile ? 0.42 : 0.52));
            const opacity = Math.max(0, 1 - Math.abs(diff) * 0.52);
            const brightness = Math.max(0.48, 1 - Math.abs(diff) * 0.45);
            const zIndex = Math.round(10 - Math.abs(diff) * 6);

            const isCenter = Math.abs(diff) < 0.35;

            return (
              <div
                key={edition.id}
                className={`vshape-bottle-node ${isCenter ? 'is-center' : ''}`}
                style={{
                  transform: `translate3d(${posX}px, ${posY}px, 0) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  filter: `brightness(${brightness}) drop-shadow(0 ${16 + (isCenter ? 14 : 0)}px 32px rgba(0, 0, 0, 0.75))`,
                  zIndex,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, filter 0.45s ease',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                onClick={() => handleItemClick(idx, diff)}
              >
                <img
                  src={edition.image}
                  alt={edition.name}
                  className="vshape-bottle-img"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Control Dock: Thumbnails (Left), Description (Center), Explore (Right) */}
        <div className="vshape-bottom-bar">
          {/* Left: Thumbnail Edition Selector */}
          <div
            className="vshape-thumbnails"
            role="tablist"
            aria-label="Select edition"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {editions.map((edition, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={edition.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Select ${edition.name}`}
                  className={`vshape-thumb-btn ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDragOffset(0);
                    setCurrentIndex(idx);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <img
                    src={edition.image}
                    alt=""
                    aria-hidden="true"
                    className="vshape-thumb-img"
                  />
                </button>
              );
            })}
          </div>

          {/* Center: Dynamic Narrative Description */}
          <div className="vshape-description-wrap">
            <p className="vshape-description" key={activeEdition.id}>
              {activeEdition.description}
            </p>
          </div>

          {/* Right: Explore Action Button */}
          <div className="vshape-action-wrap">
            <a
              href="#products"
              className="vshape-explore-btn"
              aria-label={`Explore ${activeEdition.name}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector('#products');
                if (target) {
                  const isMobile = window.innerWidth <= 860;
                  const targetOffset = isMobile ? -20 : -70;
                  if (window.__lenis) {
                    window.__lenis.start();
                    window.__lenis.scrollTo(target, {
                      offset: targetOffset,
                      duration: 1.1,
                    });
                  } else {
                    const topPos = target.getBoundingClientRect().top + window.scrollY + targetOffset;
                    window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
                  }
                }
              }}
            >
              <span>Explore</span>
              <ArrowRight size={11} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
