import React, { useState, useEffect } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

import rawPeachImg from '../assets/save3.png';
import sunshineImg from '../assets/sauve2.png';
import twilightImg from '../assets/sauve.png';
import berryImg from '../assets/sauve4.png';

// Canvas-based flood-fill helper to strip white background from the first image
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

        // Check if pixel is part of the white/near-white outer background
        const isWhiteBg = (idx) => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          return r > 232 && g > 232 && b > 232;
        };

        // Seed outer perimeter coordinates into flood-fill queue
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

          // Clear pixel alpha to 0 (make transparent)
          data[p * 4 + 3] = 0;

          const px = p % w;
          const py = Math.floor(p / w);

          // 4-directional connected neighbors
          const neighbors = [
            px > 0 ? p - 1 : -1,
            px < w - 1 ? p + 1 : -1,
            py > 0 ? p - w : -1,
            py < h - 1 ? p + w : -1,
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
        console.warn('Could not extract transparent cutout, using original:', err);
      }
    };
    img.src = src;
  }, [src]);

  return cutoutSrc;
}

export default function BestSellers({ onAddToCart }) {
  const [addedItem, setAddedItem] = useState(null);

  // Automatically extracts transparent cutout of the first image
  const peachCutout = useTransparentCutout(rawPeachImg);

  // Concentrated, richer pastel background colors
  const products = [
    {
      id: 'peach',
      name: 'Nourishing Shea Lotion',
      editionName: 'PEACH EDITION',
      scent: 'Warm Peach & Vanilla',
      tag: 'Peach',
      volume: '28 fl oz / 828 mL',
      price: '$14.50',
      bgColor: '#FBAF96', // Rich concentrated peach
      accentColor: '#A83B18',
      image: peachCutout,
      alt: 'Suave Nourishing Care Shea Butter Lotion in warm peach bottle',
    },
    {
      id: 'sunshine',
      name: 'Radiance Restore Lotion',
      editionName: 'SUNSHINE EDITION',
      scent: 'Vitamin C & Citrus Sun',
      tag: 'Sunshine',
      volume: '18 fl oz / 532 mL',
      price: '$16.00',
      bgColor: '#FDCB52', // Rich concentrated golden sunshine
      accentColor: '#8C5A00',
      image: sunshineImg,
      alt: 'Suave Radiance Restore Vitamin C Lotion in golden sunshine bottle',
    },
    {
      id: 'twilight',
      name: 'Advanced Therapy Lotion',
      editionName: 'COBALT EDITION',
      scent: 'Hydro Complex & Twilight Dew',
      tag: 'Twilight',
      volume: '18 fl oz / 532 mL',
      price: '$15.00',
      bgColor: '#A3C2F7', // Rich concentrated twilight lavender-blue
      accentColor: '#254A94',
      image: twilightImg,
      alt: 'Suave Advanced Therapy Hydro Complex Lotion in twilight periwinkle bottle',
    },
    {
      id: 'berry',
      name: 'Soothing Botanical Blend',
      editionName: 'BERRY EDITION',
      scent: 'Wild Berry & Fresh Aloe',
      tag: 'Berry',
      volume: '18 fl oz / 532 mL',
      price: '$15.50',
      bgColor: '#F792AD', // Rich concentrated fresh berry blush
      accentColor: '#8C153E',
      image: berryImg,
      alt: 'Suave Soothing Botanical Body Lotion in soft berry blush bottle',
    },
  ];

  const handleBuy = (product, e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    setAddedItem(product.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1600);
  };

  return (
    <section id="products" className="bestsellers-section" aria-labelledby="bestsellers-title">
      <div className="bestsellers-header">
        <span className="bestsellers-eyebrow">The Collection</span>
        <h2 id="bestsellers-title" className="bestsellers-title">
          Best Sellers
        </h2>
        <p className="bestsellers-subtitle">
          Formulated for 48-hour continuous hydration, effortless comfort, and lasting fragrance.
        </p>
      </div>

      <div className="bestsellers-grid">
        {products.map((product) => {
          const isAdded = addedItem === product.id;
          return (
            <article
              key={product.id}
              className="product-card"
              role="region"
              aria-label={product.name}
            >
              {/* Product Visual Container with concentrated background & morphing border-radius on hover */}
              <div
                className="product-image-container"
                style={{ backgroundColor: product.bgColor }}
              >
                {/* Bottle Cutout Image */}
                <img
                  src={product.image}
                  alt={product.alt}
                  className="product-bottle-img"
                  loading="lazy"
                />

                {/* Centered Actions Overlay (Name badge centered; Buy Now unfolds underneath on hover) */}
                <div className="product-card-center-group">
                  <div className="product-edition-badge" aria-label={product.editionName}>
                    <span>{product.editionName}</span>
                  </div>

                  <div className="product-buy-wrapper">
                    <button
                      type="button"
                      className={`product-buy-btn ${isAdded ? 'is-added' : ''}`}
                      onClick={(e) => handleBuy(product, e)}
                      aria-label={`Buy ${product.name} for ${product.price}`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} aria-hidden="true" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} aria-hidden="true" />
                          <span>Buy Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
