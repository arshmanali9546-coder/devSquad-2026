import { gsap } from 'gsap';

export const fadeUp = (targets, options = {}) => {
  return gsap.fromTo(targets, 
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', ...options }
  );
};

export const staggerFadeUp = (targets, options = {}) => {
  return gsap.fromTo(targets, 
    { y: 50, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.6, 
      stagger: 0.1, 
      ease: 'power2.out',
      ...options 
    }
  );
};

export const scaleIn = (targets, options = {}) => {
  return gsap.fromTo(targets,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', ...options }
  );
};
