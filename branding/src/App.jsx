import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import BestSellers from './components/BestSellers';
import ProductShowcase from './components/ProductShowcase';
import Ecosystem from './components/Ecosystem';
import Footer from './components/Footer';
import Cart from './components/Cart';

import './styles/global.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 'peach',
      name: 'Nourishing Shea Lotion',
      editionName: 'PEACH EDITION',
      volume: '28 fl oz / 828 mL',
      price: 38,
      bgColor: '#FBAF96',
      quantity: 1,
    },
  ]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Initialize Lenis Smooth Scrolling and link to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.__lenis = null;
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  const handleAddToCart = (product) => {
    if (!product) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          editionName: product.editionName,
          volume: product.volume,
          price: 38,
          bgColor: product.bgColor,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="suave-campaign-app">
      {/* Floating Header Navigation (Brand left, Pill Dock center, Cart right with reactive count) */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Campaign Content */}
      <main id="main-content">
        <Hero isReady={true} />
        <About />
        <BestSellers onAddToCart={handleAddToCart} />
        <ProductShowcase />
        <Ecosystem />
      </main>

      {/* Campaign Footer */}
      <Footer />

      {/* Transparent Frosted Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
