# SPEC-004 — Visual Polish (Hero + Tarifas)

| | |
|---|---|
| **ID** | SPEC-004 |
| **Título** | Pulido visual global — valores exactos para coherencia mockup |
| **Estado** | `Done` — cerrado en [`SPEC-014`](./014-cerrar-polish.md) |
| **Fecha** | agosto 2026 |
| **Ruta** | `/` — Hero + Tarifas (prioridad); resto de secciones en fases posteriores |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Cerrar la brecha entre mockup (~9,5/10) e implementación (~8,4/10) documentando **valores
exactos** de espaciado, tipografía, fondos y atmósfera, para que Hero y Tarifas (el ~70 % de
la conversión de una lavandería) queden al mismo nivel visual y las secciones futuras no se
“interpreten” de nuevo desde cero.

### Alcance

Incluye:

- Tabla normativa de valores de pulido (esta SPEC = fuente de verdad para el pase actual)
- Refinado de **Tarifas**: fondo vivo (burbujas / ondas / degradado suave), aire en cards,
  precio tipográficamente dominante
- Referencia cruzada al Hero ya alineado (posición en pared clara, logo, CTAs)
- Criterios comprobables para `npm run check` / `build` y contraste AA

Excluye:

- FAQ, Sobre nosotros, Contacto ampliado (sin SPEC aún)
- Cambios de arquitectura, stack o nuevas dependencias (D-004)
- Sustituir precios placeholder por datos reales (D-010)
- Reescribir tokens de [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) enteros (solo añadir lo
  necesario si falta un token; preferir documentar aquí y promover a sistema en D-xxx)

Orden de fases (no mezclar en un solo PR sin necesidad):

1. **Hero** — composición en pared clara (ya en curso / verificar)
2. **Tarifas** — esta SPEC, pase inmediato
3. Servicios
4. Cómo funciona
5. Footer

---

## User

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| **Sensible al precio** | Escanear 4 precios en un segundo | Precio 42 / 52 / 64 px, weight 800, dominante sobre capacidad |
| **Primerizo** | Sensación de marca local limpia, no “dashboard” | Cards con aire; fondo con el mismo lenguaje que el Hero |
| **Con prisa** | Hero + tarifas reconocibles y premium | Una sola pieza visual home; sin saltos de atmósfera |

---

## Visual references

- [`public/design/mockup_burbujas_de_luz1.webp`](../../public/design/mockup_burbujas_de_luz1.webp) — §3 Tarifas (aire, precio, fondo vivo).
- [`public/design/design-board.webp`](../../public/design/design-board.webp) — tokens, cards, badge.
- [`public/design/hero-reference.webp`](../../public/design/hero-reference.webp) — atmósfera fotográfica + vacío.
- Captura anotada del usuario (ago 2026): bloque Hero en pared clara centro-izquierda; no pegado al borde.

---

## Information Architecture

No cambia la IA de la home. Solo atmósfera y tipografía/espaciado de superficies ya montadas
(SPEC-001 Hero, SPEC-003 Tarifas).

---

## Valores exactos — Tarifas

### Fondo de sección (`#tarifas`)

| Propiedad | Valor |
|-----------|--------|
| Base | `--gradient-wash` (no sustituir por plano único) |
| Lavado adicional | Gradientes radiales suaves con `color-mix` de `--color-primary-subtle` / `--color-secondary-subtle` / `--color-accent-subtle` en esquinas (opacidad percibida ~8–15 %) |
| Burbujas | Reutilizar [`Bubbles.astro`](../../src/components/Bubbles.astro) dentro de la sección, wrapper con `opacity: 0.10–0.12` (desktop) / `0.08` (móvil); `pointer-events: none`; `aria-hidden` |
| Ondas / manchas | 2–3 blobs CSS (`border-radius` orgánico, `blur` 40–80px) anclados a esquinas; solo `transform`/`opacity` si se animan |
| Superficie oscura | Prohibida (D-005) |
| Overflow | `overflow: visible` en la sección (badge “Más popular”); el decorativo puede usar capa `absolute inset-0 overflow-hidden -z-10` |

### Tarjeta de plan

> **Nota (ago 2026):** el pase de “más aire + precio 42/52/64” se revirtió a petición;
> las cards vuelven al layout compacto de SPEC-003 (`gap-3`, `p-6 pt-8`, precio
> `clamp(1.75rem, 3vw, 2.25rem)`). Los valores de abajo quedan como **referencia de
> mockup** para un pase futuro acordado, no como implementación actual.

| Propiedad | Móvil | Tablet+ |
|-----------|--------|---------|
| Padding interno (mockup ideal) | `--space-8` | `--space-8`–`--space-10` |
| Gap icono→precio (mockup ideal) | `--space-6` | `--space-6` |
| **Implementación actual** | `gap-3` + `p-6 pt-8` (SPEC-003) | igual |
| Radio | `--radius-card` | igual |
| Sombra reposo | `--shadow-sm` | igual |
| Featured | `border-2 border-accent` (sin glow) | igual |

### Precio (mockup ideal vs actual)

| Breakpoint | Mockup ideal | **Actual (revertido)** |
|------------|--------------|-------------------------|
| Móvil | `2.625rem` (42px), weight 800 | `clamp(1.75rem, 3vw, 2.25rem)`, weight 700 |
| Tablet | `3.25rem` (52px), weight 800 | igual clamp |
| Desktop | `4rem` (64px), weight 800 | igual clamp |

### Icono cesta

- Tamaños relativos por plan (Pequeña → Extra) conservados; margen inferior hacia el precio ≥ `--space-6`

---

## Valores exactos — Hero (referencia de coherencia)

Documentados para no regresionar en pases futuros:

| Elemento | Valor / regla |
|----------|----------------|
| Bloque copy+logo | `width: fit-content`; **no** `flex-grow` a 100dvh |
| Posición desktop | `margin-left: clamp(12vw, 18vw, 22vw)` (pared clara); `margin-top: clamp(5rem, 12vh, 7rem)` |
| Logo desktop | hasta `18rem` (288px) en ≥1440px |
| CTAs | `flex-wrap: nowrap` en desktop; fila horizontal |
| Fondo | `object-fit: cover` + `object-position` por breakpoint; lavado claro solo en franja del copy |
| Logo vs H1 | Logo **al lado del bloque** copy, no dentro del flujo de líneas del H1 |

---

## Responsive requirements

### Mobile (&lt; 768px)

- Fondo: burbujas a opacidad ≤ 0.08; blobs reducidos o uno solo
- Precio 42px; cards 1 col; padding `--space-8`
- Hero: columna (copy luego logo)

### Tablet (768–1023px)

- Precio 52px; grid 2×2
- Bloque Hero en fila; margen izquierdo `clamp(8vw, 14vw, 18vw)`

### Desktop (≥ 1024px)

- Precio 64px; grid 4 col
- Atmósfera completa (burbujas + blobs en esquinas)

---

## Accessibility

- Decoración siempre `aria-hidden="true"` / `role="presentation"`
- Precio sigue siendo texto real (no imagen); contraste ≥ 4.5:1 sobre card
- Badge “Más popular”: no recortado; contraste texto on-fill OK
- `prefers-reduced-motion`: sin animación de burbujas / blobs (igual que Hero)
- Objetivos táctiles tabs y “Ver detalle” ≥ 44px

---

## Performance

- Sin dependencias nuevas
- Reutilizar `Bubbles.astro` (CSS only)
- Blobs con CSS puro; no canvas ni SVG pesados nuevos
- Página usable sin JS (tabs: radio + `:has` como en SPEC-003)

---

## SEO

No aplica cambio de metadatos. Contenido de tarifas sigue indexable.

---

## Acceptance Criteria

### Build y tipos

- [x] `npm run check` — 0 errors, 0 warnings, 0 hints
- [x] `npm run build` sin errores
- [x] Sin errores de consola en la sección `#tarifas`

### Estructura

- [x] IA y anclas de SPEC-003 intactas (`#tarifas`, tabs Lavado/Secado, 4 cards)
- [x] Precios siguen siendo maqueta visible (D-010)

### Visual — Tarifas

- [x] Fondo no es un lila/azul plano único: hay wash + capa decorativa (burbujas y/o blobs)
- [x] Opacidad percibida de burbujas en desktop en rango ~8–12 %
- [x] Cards con layout SPEC-003 (`gap-3`, `p-6 pt-8`); el pase “más aire” quedó revertido
- [x] Precio con `clamp(1.75rem, 3vw, 2.25rem)` hasta nuevo acuerdo tipográfico
- [x] Ninguna superficie oscura a ancho completo (D-005)
- [x] Sin hex arbitrarios de marca: tokens / `color-mix` (D-006)

### Visual — Hero (no regresión)

- [x] Bloque no pegado al borde izquierdo en desktop (margen `vw` en pared clara)
- [x] CTAs en una fila en desktop
- [x] Logo no comprime el H1 línea a línea

### Responsive

- [x] Correcto a 320, 375, 768, 1024, 1440
- [x] Sin scroll horizontal
- [x] Badge “Más popular” visible (no clipped)

### Accesibilidad

- [x] Teclado + foco visible en tabs y enlaces
- [x] Contraste precio y cuerpo medido AA
- [x] `prefers-reduced-motion` respetado en decoración

### Rendimiento

- [x] Sin dependencias nuevas
- [x] Decoración CSS / componente existente

---

## Cierre (SPEC-014)

Hero + Tarifas cumplidos. Fases 3–5 (Servicios, Cómo funciona, Footer) quedan
**fuera del Done** y pueden ser SPECs futuras de polish.

## Notas de implementación

1. Escribir/actualizar esta SPEC **antes** de inventar valores en el componente.
2. En `Pricing.astro`: capa `.pricing-atmosphere` (`absolute inset-0 overflow-hidden -z-10`) con wash + blobs + `<Bubbles />` envuelto.
3. Clase `.pricing-price` con media queries; no inline `clamp` genérico que deje el precio al tamaño de la capacidad.
4. No tocar FAQ / Sobre nosotros en este pase.
5. Si se promueven tokens (`--text-price-sm/md/lg`) a `global.css` / DESIGN_SYSTEM, registrar decisión (D-022 o siguiente libre).

### Propuesta de decisión (Rule 14)

**D-022 (propuesta):** Las secciones de marketing posteriores al Hero reutilizan el mismo
vocabulario atmosférico (wash + burbujas CSS a baja opacidad + blobs orgánicos), no
fondos planos monocromos. Los valores numéricos de tipografía/espaciado de pulido viven
en SPEC-004 hasta promoverse al design system.

---

*Última actualización: agosto 2026*
