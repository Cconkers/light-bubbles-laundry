/**
 * Revelados por scroll — IntersectionObserver + CSS transitions (D-018).
 * Requiere .has-js en <html> para activar el estado inicial oculto.
 * Sin librerías externas.
 */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('has-js');

if (!prefersReduced) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    observer.observe(el);
  });
} else {
  // Con reducción de movimiento: mostrar todo inmediatamente
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.classList.add('is-visible');
  });
}
