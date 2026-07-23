import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * initScrollTransitions
 * ─────────────────────
 * Cinematic section-to-section transitions.
 * Each section slides over the previous with a soft fade + blur.
 * Returns a cleanup function — call it in ngOnDestroy.
 */
export function initScrollTransitions(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const panels = Array.from(
    document.querySelectorAll<HTMLElement>('[data-panel]')
  );
  if (panels.length < 2) return () => {};

  // z-index stacking: each panel sits above the previous
  panels.forEach((el, i) => {
    el.style.zIndex   = String(10 + i);
    el.style.position = 'relative';
  });

  const kills: (() => void)[] = [];

  panels.forEach((panel, i) => {
    if (i === 0) return; // hero is always visible, skip entrance

    // ── Entrance: slide up from 80px, fade in ──────────────────────────────
    gsap.set(panel, { y: 80, opacity: 0, willChange: 'transform, opacity' });

    const enterTL = gsap.timeline({
      scrollTrigger: {
        trigger:    panel,
        start:      'top 95%',
        end:        'top 30%',
        scrub:      1.0,
        invalidateOnRefresh: true,
      },
    });
    enterTL.to(panel, { y: 0, opacity: 1, ease: 'none' });
    kills.push(() => enterTL.scrollTrigger?.kill());

    // ── Exit: cover the previous panel with subtle scale + blur ───────────
    const prev = panels[i - 1];

    const exitTL = gsap.timeline({
      scrollTrigger: {
        trigger:    panel,
        start:      'top 85%',
        end:        'top 5%',
        scrub:      1.4,
        invalidateOnRefresh: true,
      },
    });
    exitTL.to(prev, {
      scale:   0.97,
      filter:  'blur(3px)',
      opacity: 0.65,
      ease:    'none',
    });
    kills.push(() => exitTL.scrollTrigger?.kill());
  });

  return () => {
    kills.forEach(k => k());
    panels.forEach(el => {
      gsap.set(el, { clearProps: 'all' });
      el.style.zIndex   = '';
      el.style.position = '';
    });
    ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
  };
}
