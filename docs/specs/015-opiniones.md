# SPEC-015 — Opiniones (reseñas Google curadas)

| | |
|---|---|
| **ID** | SPEC-015 |
| **Título** | Sección de opiniones con reseñas 5★ de Google Maps |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | `#opiniones` · [`Reviews.astro`](../../src/components/sections/Reviews.astro) |

> **Leer antes:** D-028, D-004, D-010, [`PRODUCT.md`](../PRODUCT.md). Protocolo en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Mostrar prueba social real (reseñas 5★ con texto) en cards ligeras, sin API ni embeds,
con enlace a Google para ver el resto de opiniones.

### Alcance

Incluye:

- Datos curados (JVD, orejamx; omitir antonio viedma sin texto)
- Sección `#opiniones` entre About y CtaFinal
- CTA “Ver en Google Maps” (búsqueda por nombre)
- D-028 + actualización PRODUCT Non-goals
- Quitar «Ver detalle» de tarifas si aún pendiente

Excluye:

- Places / Trustpilot API, widgets
- Reseñas &lt; 5★ en la web
- Schema Review / AggregateRating
- Ítem nuevo en Header

---

## User

| Perfil | Qué necesita | Implicación |
|--------|--------------|-------------|
| Primerizo | Confianza antes de ir | Citas cortas 5★ + fuente Google |
| Con prisa | Escaneo rápido | 2 cards, sin carrusel obligatorio |

---

## Visual references

Patrón quote-card del design system (superficie, borde, radio). Sin avatares de terceros.

---

## Information Architecture

Orden home: … Faq → About → **Opiniones** → CtaFinal → Location …

Cada card: iniciales, autor, “5 estrellas”, fecha relativa, texto, mención fuente Google.

---

## Responsive / Accessibility / Performance

- Grid 1 col móvil / 2 col desktop
- Estrellas con `aria-label`; decoración `aria-hidden`
- Cero dependencias; HTML estático

---

## SEO

Contenido indexable en HTML. Sin JSON-LD de reviews en esta SPEC.

---

## Acceptance Criteria

- [x] `npm run check` / `build` OK
- [x] `#opiniones` con 2 cards (JVD, orejamx) y sin card vacía de antonio
- [x] Enlace externo a Google Maps (nombre del negocio)
- [x] Sin API keys ni scripts de widgets
- [x] Sin «Ver detalle» en Pricing

---

*Última actualización: agosto 2026*
