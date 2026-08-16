# SPEC-013 — Aviso legal y política de privacidad

| | |
|---|---|
| **ID** | SPEC-013 |
| **Título** | Páginas legales mínimas + enlaces en footer |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | `/aviso-legal` · `/privacidad` · [`Footer.astro`](../../src/components/sections/Footer.astro) |

> **Leer antes:** D-010, D-011, D-024, D-027. Protocolo en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Cumplir el mínimo esperado de transparencia (titular + privacidad) con páginas estáticas
enlazadas desde el footer, sin backend ni banner de cookies.

### Alcance

Incluye:

- `/aviso-legal` y `/privacidad` con `BaseLayout` + Header + Footer
- Datos registrales **claramente inventados** (`legal.ts`) hasta confirmación real
- Enlaces en la barra inferior del footer
- Ampliar `sitemap.xml` con las dos URLs
- Nav del Header con prefijo `/#` para funcionar desde páginas internas

Excluye:

- Cookie banner / CMP
- Textos legales reales / revisión de abogado
- Condiciones de uso extensas o política de cookies separada
- Suno, FAQPage, polish 004

---

## User

| Perfil | Qué necesita | Implicación |
|--------|--------------|-------------|
| Visitante / regulador | Saber quién es el titular y cómo se tratan datos | Páginas legibles, enlaces en footer |

---

## Visual references

No aplica. Light-first, tokens del design system; sin superficies oscuras.

---

## Information Architecture

### Aviso legal

Titular (razón social, CIF inventado, domicilio, contacto), objeto del sitio, propiedad
intelectual genérica, exención de responsabilidad, ley aplicable.

### Privacidad

Responsable, finalidades (escaparate estático), datos de contacto voluntarios, terceros
(Google Maps iframe), `localStorage` del audio ambiental, derechos, contacto.

---

## Responsive / Accessibility / Performance

- Un solo `<h1>` por página; jerarquía `h2` en secciones
- Sin JS nuevo; cero dependencias (D-004)

---

## SEO

Títulos/descripciones propios; entradas en sitemap.

---

## Acceptance Criteria

- [x] `npm run check` / `npm run build` OK
- [x] `/aviso-legal` y `/privacidad` renderizan con Header/Footer
- [x] Footer enlaza ambos; CIF/razón social inventados visibles y documentados como placeholder
- [x] Privacidad menciona Maps y `localStorage` del audio
- [x] Sitemap incluye home + las dos páginas
- [x] Sin cookie banner

---

## Notas de implementación

Datos en [`src/data/legal.ts`](../../src/data/legal.ts). No son consejo jurídico.

---

*Última actualización: agosto 2026*
