# SPEC-010 — SEO LocalBusiness + Open Graph sólido

| | |
|---|---|
| **ID** | SPEC-010 |
| **Título** | Schema LocalBusiness y imagen Open Graph con fondo sólido |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | [`src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro) · [`src/data/content.ts`](../../src/data/content.ts) · [`astro.config.mjs`](../../astro.config.mjs) · `public/og.webp` |

> **Leer antes:** [`PRODUCT.md`](../PRODUCT.md), D-010, D-016, D-023, D-025,
> [`001-home.md`](./001-home.md) § SEO, [`006-ubicacion.md`](./006-ubicacion.md) § SEO.
> Protocolo en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Que buscadores y redes entiendan el local físico (nombre, dirección, teléfono, horario) y
que al compartir el enlace la previsualización use una imagen 1200×630 con fondo sólido,
sin el fallo del logo transparente compuesto sobre negro (D-016).

### Alcance

Incluye:

- JSON-LD `LocalBusiness` en el `<head>`, alimentado solo desde `site` + `contact` en
  [`content.ts`](../../src/data/content.ts)
- `site.url` canónica (placeholder de producción hasta dominio real; D-025)
- `site` en Astro y URLs absolutas para `og:image` / Twitter
- Sustituir `public/og-placeholder.webp` por `public/og.webp` (1200×630, fondo sólido + marca)

Excluye:

- `sitemap.xml` / `robots.txt` → [`SPEC-011`](./011-sitemap-robots.md)
- `FAQPage` schema (sigue fuera; SPEC-007)
- Aviso legal / privacidad
- GeoCoordinates inventadas, `priceRange` o reviews
- Confirmar derechos de la pista Suno (sigue en 002/009)

---

## User

No es una sección visible. Beneficia a quien llega desde Google/Maps o un enlace compartido.

| Perfil | Qué necesita | Implicación |
|--------|--------------|-------------|
| Sin lavadora / prisa | Encontrar el local y el horario en resultados | Datos de contacto reales en schema |
| Cualquiera que comparte el enlace | Preview legible | OG con fondo sólido y marca |

---

## Visual references

No aplica a secciones de página. El activo OG usa tokens light (`--lb-foam-50` / blanco) y el
logo de [`src/assets/brand/`](../../src/assets/brand/) sobre fondo opaco (D-016, D-005).

---

## Information Architecture

### 1. Metadatos de página (ya en SPEC-001)

- `<title>`, description, canonical, OG/Twitter — se mantienen; `og:image` pasa a absoluto
  apuntando a `/og.webp`

### 2. JSON-LD LocalBusiness

Campos (solo datos confirmados):

- `@type`: `LocalBusiness`
- `name`, `description`, `url` ← `site`
- `telephone` ← E.164 desde `contact.whatsapp` / teléfono
- `email` ← `contact.email`
- `address` ← `PostalAddress` parseado de `contact.address` (calle, CP, Sevilla, ES)
- `openingHours` ← `Mo-Su 07:00-23:00` (horario confirmado en `contact.hours`)
- `image` ← URL absoluta de `/og.webp`

`[PLACEHOLDER: URL canónica de producción]` vive en `site.url` hasta confirmar dominio.

### 3. Activo Open Graph

- `public/og.webp`, 1200×630, fondo sólido claro + logo + nombre de marca
- No usar el PNG/WebP transparente del logo como `og:image` aislado

---

## Responsive requirements

No aplica (metadatos y activo estático).

---

## Accessibility

- El JSON-LD no sustituye el HTML visible de contacto (SPEC-006)
- Sin impacto en teclado ni contraste de la UI

---

## Performance

- Cero dependencias nuevas (D-004)
- Un solo `<script type="application/ld+json">` inline, sin fetch
- `og.webp` en `public/` (no LCP; solo se descarga al compartir/preview)

---

## SEO

Esta SPEC **es** el bloque SEO local aplazado en 001/006:

- LocalBusiness JSON-LD
- OG image válida (absoluta, fondo sólido)

Fuera: FAQPage. Sitemap/robots: [`SPEC-011`](./011-sitemap-robots.md).

---

## Acceptance Criteria

### Build y tipos

- [x] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [x] `npm run build` completa sin errores.

### SEO / datos

- [x] Existe JSON-LD `LocalBusiness` en el HTML de producción.
- [x] Teléfono, email, dirección y horario coinciden con `content.ts` (sin inventar geo/precios).
- [x] `og:image` y `twitter:image` son URLs absolutas bajo `site.url`.
- [x] `public/og.webp` mide 1200×630 y tiene fondo opaco (no solo logo con alfa).
- [x] `astro.config` declara `site` alineado con `site.url`.
- [x] No se añaden sitemap ni robots en esta SPEC.

### Rendimiento / arquitectura

- [x] Sin dependencias nuevas.
- [x] Sin superficie UI nueva ni secciones oscuras.

---

## Notas de implementación

1. Ampliar `site` en `content.ts` con `url`.
2. `astro.config.mjs`: `site: …` (mismo valor).
3. En `BaseLayout`, `new URL(ogPath, Astro.site)` y serializar el schema con `JSON.stringify`.
4. Generar `og.webp` con sharp (disponible vía Astro); no commitear el script si es one-shot, o dejarlo fuera del runtime.
5. Registrar D-025 (`site.url` + OG absoluto).
6. Actualizar notas SEO de 001 y 006 apuntando a esta SPEC.

---

*Última actualización: agosto 2026*
