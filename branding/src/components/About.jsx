import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const eyebrowRef = useRef(null);

  const statementText =
    "We believe everyday personal care should feel like an intentional moment of pure renewal. Crafted with botanical purity and refined fragrance, Suave elevates your daily ritual into the art of lasting freshness.";

  const words = statementText.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordElements = textRef.current.querySelectorAll('.highlight-word');

      // ScrollTrigger line-by-line / word-by-word highlight scrub
      gsap.fromTo(
        wordElements,
        {
          color: '#d3d7de',
          opacity: 0.25,
        },
        {
          color: '#0c0e12',
          opacity: 1,
          stagger: 0.08,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 0.75,
          },
        }
      );

      // Eyebrow entrance animation
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Adaptive Header contrast switch when crossing white section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80px',
        end: 'bottom 80px',
        onEnter: () => {
          document.querySelector('.site-header')?.classList.add('dark-contrast');
        },
        onLeave: () => {
          document.querySelector('.site-header')?.classList.remove('dark-contrast');
        },
        onEnterBack: () => {
          document.querySelector('.site-header')?.classList.add('dark-contrast');
        },
        onLeaveBack: () => {
          document.querySelector('.site-header')?.classList.remove('dark-contrast');
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-container">
        {/* Editorial Eyebrow with Lobster Two script font */}
        <span ref={eyebrowRef} className="about-eyebrow">
          The Philosophy
        </span>

        {/* Highlight on Scroll Text */}
        <h2 ref={textRef} className="about-statement" aria-label={statementText}>
          {words.map((word, index) => (
            <span key={index} className="highlight-word">
              {word}{' '}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
