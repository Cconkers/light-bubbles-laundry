# SPEC-008 — Sobre nosotros (home)

| | |
|---|---|
| **ID** | SPEC-008 |
| **Título** | Sección Sobre nosotros en la homepage |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | `/` — ancla `#sobre-nosotros` · componente nuevo [`src/components/sections/About.astro`](../../src/components/sections/About.astro) (nombre orientativo) |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

> **Depende de [`SPEC-001`](./001-home.md).** Convive con Benefits (valores similares: no duplicar
> la misma cuadrícula de cuatro chips). Audio sigue en [`SPEC-002`](./002-audio.md).

---

## Objective

Transmitir **quiénes somos y por qué confiar** — refuerzo de marca y calidez mediterránea —
con el bloque §6 del mockup (*Sobre nosotros*), sin cifras de negocio no confirmadas
(+500 clientes, años, nº de máquinas) como hecho (D-010).

Hoy la home explica el servicio (tarifas, pasos, FAQ, mapa) pero no tiene un bloque de
historia / valores de marca. Esta SPEC lo añade.

### Alcance

Incluye:

- Nueva sección en la homepage, **después de FAQ y antes del CTA final**
- Ancla `id="sobre-nosotros"`
- `h2` + párrafo de apoyo (copy candidato / maqueta)
- **Tres valores** con icono en círculo `*-subtle` (no stats numéricos)
- Datos en [`src/data/content.ts`](../../src/data/content.ts)
- Tipografía `.type-*`; light-first (D-005); cero deps nuevas (D-004)
- Nota aditiva en [`001-home.md`](./001-home.md) al implementar

Excluye:

- Foto del local / lifestyle (mockup la muestra a la derecha; **no hay activo confirmado** —
  layout texto + valores a ancho completo, o columna única; SPEC futura si llega foto)
- Stats (+500, +20 máquinas, +10 años) como hecho; si el mockup los muestra en otro bloque,
  no reutilizarlos aquí
- Página `/sobre-nosotros`
- Ítem nuevo obligatorio en el Header (el ancla existe para enlaces internos/footer opcionales)
- Audio (SPEC-002), formularios (D-011)

---

## User

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| **Primerizo** | Sensación de sitio cuidado y cercano | Copy cálido; tres valores concretos, no jerga |
| **Sin lavadora / recurrencia** | Motivo para volver | Énfasis en día a día y atención, no en “tech” |
| **Con prisa** | No un muro de texto | Un H2, un párrafo, tres bullets/valores |
| **Lector de pantalla** | Jerarquía clara | `h2` + lista de valores con `h3` o texto fuerte |

---

## Visual references

- [`public/design/mockup_burbujas_de_luz1.webp`](../../public/design/mockup_burbujas_de_luz1.webp)
  — **§6 SOBRE NOSOTROS**: H2 *«Más que una lavandería, somos tu aliado en el día a día»*,
  párrafo, tres valores con icono; foto a la derecha en desktop.
- [`public/design/design-board.webp`](../../public/design/design-board.webp) — iconos, tokens.
- [`public/design/responsive-reference.webp`](../../public/design/responsive-reference.webp).

Sin hex arbitrarios (D-006). Sin foto en v1 de esta SPEC.

---

## Datos: copy candidato (maqueta)

Usable en implementación; ajustable sin SPEC nueva si no inventa cifras.

| Elemento | Texto candidato |
|----------|-----------------|
| `h2` | Más que una lavandería, somos tu aliado en el día a día |
| Párrafo | En Burbujas de Luz creemos que cuidar tu ropa puede ser sencillo, limpio y agradable. Somos una lavandería de autoservicio en Sevilla pensada para tu ritmo: máquinas modernas, ambiente luminoso y trato cercano. |
| Valor 1 | Máquinas modernas y fáciles de usar |
| Valor 2 | Cuidado de la ropa y del entorno |
| Valor 3 | Atención cercana cuando la necesites |
| Iconos | Reutilizar existentes (`sparkle`, `leaf`, `heart` o similares en `Icon.astro`) |

Horario/dirección **no** se repiten aquí (viven en FAQ / Location).

---

## Information Architecture

Orden tras esta SPEC:

Hero → Benefits → Servicios → Tarifas → Cómo funciona → FAQ → **Sobre nosotros** → CTA final → Ubicación → Footer

### 1. Sección Sobre nosotros

- `id="sobre-nosotros"`
- Landmark: `<section aria-labelledby="about-heading">`
- `h2` + párrafo de apoyo
- Lista de **3** valores: icono 24px en círculo 40–48px `*-subtle` + título corto (+ línea de apoyo opcional)
- Layout: **1 columna** en móvil; en desktop, texto + valores apilados o grid 3 columnas de valores bajo el párrafo (sin foto)
- Superficie `bg-background` o `bg-background-alt` (alternar respecto a FAQ: FAQ usa `background-alt` → esta puede usar `background`)
- Sin `card-featured`

### 2. Navegación

- Header: **no** exige ítem nuevo. Opcional: enlace en footer “Sobre nosotros” → `#sobre-nosotros`
- No romper anclas existentes

### 3. Relación con Benefits

Benefits responde “por qué este sitio” en chips de producto. Sobre nosotros responde
**identidad de marca**. Evitar copiar literalmente los cuatro títulos de Benefits; los tres
valores pueden solapar tema pero con wording distinto.

---

## Responsive requirements

### Mobile (< 768px)

- 1 columna; valores apilados o en fila con wrap
- Verificar 320px sin scroll horizontal

### Tablet / Desktop

- Párrafo con `max-width` de lectura (~48–65ch)
- Tres valores en fila desde `md` si el espacio lo permite; si no, 1 col

---

## Accessibility

- Un `h1` (Hero); esta sección: `h2`; valores como `h3` o `p` fuerte dentro de lista
- Iconos `aria-hidden="true"`
- Contraste AA (D-007)
- Sin información solo en el color del acento
- `prefers-reduced-motion` en `data-reveal` existente

---

## Performance

- Sin deps nuevas; sin JS propio; sin imagen nueva en esta SPEC
- Usable sin JS

---

## SEO

- Copy estático indexable
- No schema `Organization` obligatorio aquí
- No cambiar title/description de página

---

## Acceptance Criteria

Marcar al implementar.

### Build y tipos

- [x] `npm run check` — 0 errores, 0 warnings, 0 hints.
- [x] `npm run build` sin errores.

### Estructura y contenido

- [x] Sección `id="sobre-nosotros"` entre FAQ y CTA final.
- [x] `h2` + párrafo + exactamente tres valores con icono.
- [x] Datos en `content.ts`.
- [x] Stats de maqueta (+500 / +20 / +8) visibles; sustituir cuando el negocio confirme (D-010).
- [x] Foto del local vía `astro:assets` (`background.webp`).

### Visual

- [x] Light-first (D-005); solo tokens (D-006).
- [x] Tipografía `.type-h2` / `.type-body` / `.type-h3` o `.type-small`.
- [x] Iconos 24px en círculo `*-subtle` 40–48px.

### Responsive / a11y / perf

- [x] Correcto 320–1440px; sin scroll horizontal.
- [x] Jerarquía y contraste OK; iconos decorativos `aria-hidden`.
- [x] Sin deps nuevas; sin JS obligatorio.

### Documentación

- [x] Nota aditiva en [`001-home.md`](./001-home.md) apuntando a SPEC-008.

---

## Notas de implementación

1. `aboutIntro` + `aboutValues` en `content.ts`.
2. `About.astro` → `index.astro` entre `Faq` y `CtaFinal`.
3. Reutilizar `Icon`; acentos violet / mint / pink (o cyan) distintos.
4. Footer opcional: enlace a `#sobre-nosotros`.
5. Verificar `npm run check` y `npm run build`.
6. Copy de maqueta permitido en implementación si el negocio aún no entrega texto definitivo
   (misma práctica que FAQ / Cómo funciona).

### Drift (Rule 12)

- SPEC-001 no describe Sobre nosotros. Esta SPEC añade la sección; nota aditiva en 001.

---

*Última actualización: agosto 2026*
