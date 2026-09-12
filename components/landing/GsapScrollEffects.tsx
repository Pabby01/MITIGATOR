'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function GsapScrollEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Staggered reveal for cards & sections marked with data-gsap="fade-up"
    const fadeElements = document.querySelectorAll('[data-gsap="fade-up"]');
    fadeElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // 2. Parallax subtle drift on showcase elements
    const parallaxElements = document.querySelectorAll('[data-gsap="parallax"]');
    parallaxElements.forEach((el) => {
      gsap.to(el, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // 3. Multi-Dimensional 7 Boxes: Roll in from the left on scroll
    const dimensionBoxes = document.querySelectorAll('.dimension-box');
    const dimensionContainer = document.querySelector('#dimension-container');
    if (dimensionBoxes.length > 0 && dimensionContainer) {
      gsap.fromTo(
        dimensionBoxes,
        {
          x: -160,
          opacity: 0,
          rotation: -14,
          transformOrigin: 'left center',
        },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          stagger: 0.09,
          duration: 0.85,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: dimensionContainer,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }

    // 4. Two Showcase Images: Hide initially, appear from center zooming out,
    // and left rolls to left, right rolls to right on scroll
    const showcaseSection = document.querySelector('#showcase-section');
    const leftCard = document.querySelector('.showcase-card-left');
    const rightCard = document.querySelector('.showcase-card-right');

    if (showcaseSection && leftCard && rightCard) {
      const showcaseTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseSection,
          start: 'top 85%',
          end: 'center 45%',
          scrub: 1.2,
        },
      });

      // Left image card zooms out from center, rolls to the left
      showcaseTimeline.fromTo(
        leftCard,
        {
          opacity: 0,
          scale: 0.35,
          xPercent: 55,
          rotateY: 18,
          rotateZ: 4,
          transformOrigin: 'center center',
        },
        {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          rotateY: 0,
          rotateZ: 0,
          ease: 'power2.out',
        },
        0
      );

      // Right image card zooms out from center, rolls to the right
      showcaseTimeline.fromTo(
        rightCard,
        {
          opacity: 0,
          scale: 0.35,
          xPercent: -55,
          rotateY: -18,
          rotateZ: -4,
          transformOrigin: 'center center',
        },
        {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          rotateY: 0,
          rotateZ: 0,
          ease: 'power2.out',
        },
        0
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
