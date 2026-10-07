import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero({ isReady = true, loopStartTime = 2.0 }) {
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hasFinishedFirstWatch = useRef(false);

  useEffect(() => {
    // Attempt autoPlay programmatically in case browser restricts it
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    // Subtle editorial entrance animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.25 }
      ).fromTo(
        titleRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.3 },
        '-=0.75'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  // Smart loop controller: plays full intro on first run, loops from loopStartTime on all subsequent runs
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    // Detect near-end (0.15s buffer prevents black frame flash on loop)
    if (video.currentTime >= video.duration - 0.15) {
      hasFinishedFirstWatch.current = true;
      const targetTime = typeof loopStartTime === 'number'
        ? Math.min(loopStartTime, Math.max(0, video.duration - 0.5))
        : video.duration * 0.25;

      video.currentTime = targetTime;
      video.play().catch(() => {});
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    hasFinishedFirstWatch.current = true;
    const targetTime = typeof loopStartTime === 'number'
      ? Math.min(loopStartTime, Math.max(0, video.duration - 0.5))
      : video.duration * 0.25;

    video.currentTime = targetTime;
    video.play().catch(() => {});
  };

  return (
    <section id="hero" className="hero-section" ref={containerRef}>
      {/* Background Video */}
      <div className="hero-video-wrapper">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        >
          <source src="/suave-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Cinematic Contrast Vignette Overlay */}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-grain-overlay" aria-hidden="true" />

      {/* Hero Editorial Text (Matching Structure of Reference) */}
      <div className="hero-content">
        <span ref={eyebrowRef} className="hero-eyebrow">
          The Architecture of Freshness
        </span>
        <h1 ref={titleRef} className="hero-title">
          Engineered for Pure Freshness
        </h1>
      </div>
    </section>
  );
}
