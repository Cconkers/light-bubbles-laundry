# SPEC-003 — Tarifas (home)

| | |
|---|---|
| **ID** | SPEC-003 |
| **Título** | Sección Tarifas en la homepage |
| **Estado** | `Done` — pulido visual en [`SPEC-004`](./004-visual-polish.md) |
| **Fecha** | agosto 2026 |
| **Ruta** | `/` — ancla `#tarifas` · [`src/components/sections/Pricing.astro`](../../src/components/sections/Pricing.astro) |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Resolver la pregunta que más frena la primera visita — **¿cuánto me cuesta?** — mostrando
las tarifas por tamaño de carga en la home, de forma clara y honestamente marcada cuando el
precio aún no esté confirmado por el negocio (D-010).

### Alcance

Incluye:

- Sección Tarifas en la homepage (`id="tarifas"`), tras Servicios y antes de Cómo funciona
- Cuatro tarjetas informativas: Pequeña, Mediana, Grande, Extra grande
- Precios y capacidades como `[PLACEHOLDER: …]` visibles (D-010)
- Una tarjeta `featured` con badge “Más popular” (Mediana)
- Datos centralizados en [`src/data/content.ts`](../../src/data/content.ts)
- Anclas: Header “Tarifas”, CTA primario del Hero y botón “Ver tarifas” del CTA final → `#tarifas`
- Reutilización de `Card` e `Icon` del design system; icono `basket` si no existe

Excluye:

- Página aparte `/tarifas` (SPEC futura si se necesita)
- Pagos online, reservas o checkout (D-011)
- Comparador interactivo, calculadora o filtros
- FAQ, Sobre nosotros, Contacto ampliado (secciones del mockup aún sin SPEC)
- Sustituir placeholders por euros reales sin confirmación del negocio

---

## User

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| **Sensible al precio** | Precio por tamaño de carga, visible y comparable | Grid de 4 tarifas; precio tipográficamente dominante; placeholders evidentes, no inventados |
| **Colada de gran volumen** | Saber si hay tarifa “extra grande” | Incluir el cuarto tamaño aunque el precio sea placeholder |
| **Primerizo** | Entender que el precio depende del tamaño, no de un pack misterioso | Título + una frase de apoyo; sin jerga |
| **Con prisa** | Llegar a tarifas en un toque desde el CTA / nav | Ancla `#tarifas` operativa desde Hero, Header y CTA final |

---

## Visual references

- [`public/design/mockup_burbujas_de_luz1.webp`](../../public/design/mockup_burbujas_de_luz1.webp) — **fuente de verdad UI**: §3 Tarifas (cuatro tamaños, cestas, precios, chip “Más popular”).
- [`public/design/design-board.webp`](../../public/design/design-board.webp) — cards, badge, tipografía y tokens.
- [`public/design/responsive-reference.webp`](../../public/design/responsive-reference.webp) — jerarquía en móvil/tablet/desktop.

Los importes del mockup (5,50€ / 8,00€ / 11,00€ / 13,50€) son **maqueta**, no datos de negocio (D-010).

---

## Information Architecture

Orden en la home (tras SPEC-001 + esta SPEC):

Hero → Benefits → Services → **Tarifas** → How it works → CTA final → Footer

### 1. Sección Tarifas

- `id="tarifas"` para anclas de navegación y CTAs
- `h2` — “Tarifas”
- Apoyo corto — una frase (p. ej. precio según tamaño de carga; copy no inventa cifras)
- Grid de **4 tarjetas estáticas** (no enlazables, no interactivas salvo foco si hubiera control; aquí no hay)

| Tamaño | Capacidad (ejemplo) | Precio lavado (ejemplo) | Destacada |
|--------|---------------------|-------------------------|-----------|
| Pequeña | 9 kg | 5,50 € | No |
| Mediana | 14 kg | 8,00 € | Sí — badge “Más popular” |
| Grande | 19 kg | 11,00 € | No |
| Extra grande | 24 kg | 13,50 € | No |

> **D-010:** Estos importes y kg salen del design board como **maqueta para UI**. En pantalla
> se muestran como ejemplo realista con nota de “pendientes de confirmación”. Sustituir por
> datos del negocio antes de publicar.

- Icono de cesta en contenedor circular `*-subtle` (acento distinto por tarjeta: violet / pink / cyan / orange)
- Precio con `--color-text` (contraste AA cuerpo/grande)
- Superficie clara; sin bloque oscuro (D-005)
- Máximo **una** `card-featured` por grupo (`DESIGN_SYSTEM.md` — Cards)

### 2. Cableado de anclas

| Origen | Destino |
|--------|---------|
| Nav Header “Tarifas” | `#tarifas` |
| `hero.ctaPrimary` “Ver tarifas” | `#tarifas` |
| Botón “Ver tarifas” en CTA final | `#tarifas` |
| Logo del Hero (si apunta a tarifas) | `#tarifas` o `#cta` según ya implementado; preferir coherencia con “Ver tarifas” → `#tarifas` |

`#cta` permanece para el cierre / Preguntas si aplica.

---

## Responsive requirements

Reglas generales en [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Responsive.

### Mobile (< 768px)

- 1 columna
- Verificar a **320px**: sin scroll horizontal
- Objetivos táctiles 44px si hay controles (esta sección no requiere botones en tarjeta)

### Tablet (768-1023px)

- 2 columnas

### Desktop (≥ 1024px)

- 4 columnas, altura homogénea en la cuadrícula

---

## Accessibility

- Un solo `h1` en la página (ya en Hero); esta sección usa `h2` + `h3` por tarjeta
- Landmark: `<section aria-labelledby="…">`
- Lista semántica `<ul role="list">` de tarifas
- Iconos decorativos con `aria-hidden="true"`
- Badge “Más popular” visible también en texto (no solo color)
- Contraste: títulos y precios con `--color-text` o pasos 700+; placeholders legibles
- Sin dependencia de hover para entender el contenido
- Respetar `prefers-reduced-motion` en reveals existentes

---

## Performance

- Sin dependencias nuevas (D-004)
- Sin imágenes en esta sección (solo SVG inline)
- Sin JavaScript propio; revela opcional vía `data-reveal` ya existente
- Página usable sin JS

---

## SEO

- Contenido de tarifas en HTML estático indexable
- No inventar rich snippets de `Offer`/`Price` con placeholders
- Metadatos de página sin cambio obligatorio en esta SPEC

---

## Acceptance Criteria

### Build y tipos

- [x] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [x] `npm run build` completa sin errores.

### Estructura y contenido

- [x] Existe sección con `id="tarifas"` entre Servicios y Cómo funciona.
- [x] Cuatro tarifas: Pequeña, Mediana, Grande, Extra grande.
- [x] Todos los precios y capacidades usan el formato `[PLACEHOLDER: …]` visible (D-010).
- [x] Exactamente una tarjeta `featured` con badge “Más popular” (Mediana).
- [x] Datos definidos en `src/data/content.ts`, no hardcodeados en el markup de precios.
- [x] Header “Tarifas”, CTA Hero y CTA final “Ver tarifas” apuntan a `#tarifas`.

### Visual

- [x] Ninguna superficie oscura a ancho completo (D-005).
- [x] Solo tokens semánticos / utilidades de marca, sin hex arbitrarios en la sección (D-006).
- [x] Cards según `DESIGN_SYSTEM.md` (`Card` reutilizado).
- [x] Alineado a la composición del mockup §3 (grid de tamaños + icono + precio).

### Responsive

- [x] 1 / 2 / 4 columnas en móvil / tablet / desktop.
- [ ] Correcto a 320px, 768px y 1280px; sin scroll horizontal. *(verificar en navegador)*

### Accesibilidad

- [x] Jerarquía `h2` → `h3` sin saltos.
- [x] Contraste de precio y títulos conforme a Contrast rules.
- [x] Iconos decorativos `aria-hidden`.

### Rendimiento

- [x] Sin dependencias nuevas.
- [x] Sin JS adicional obligatorio.

---

## Notas de implementación

1. Escribir/actualizar SPEC → datos en `content.ts` → `Pricing.astro` → montar en `index.astro` → anclas.
2. Reutilizar [`Card.astro`](../../src/components/ui/Card.astro) (`plain` / `featured`).
3. Añadir icono `basket` en [`Icon.astro`](../../src/components/ui/Icon.astro) si falta.
4. No tocar layout/colores custom del Hero salvo `href` vía `content.ts`.
5. Actualizar nota en [`001-home.md`](./001-home.md): ancla canónica de Tarifas es `#tarifas` (SPEC-003).
6. No publicar importes del mockup como si fueran reales.

---

*Última actualización: agosto 2026*
