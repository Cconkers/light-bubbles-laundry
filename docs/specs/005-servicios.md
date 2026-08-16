# SPEC-005 — Servicios (home)

| | |
|---|---|
| **ID** | SPEC-005 |
| **Título** | Alinear la sección Servicios de la homepage al mockup |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | `/` — ancla `#servicios` · [`src/components/sections/Services.astro`](../../src/components/sections/Services.astro) |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

> **Depende de [`SPEC-001`](./001-home.md)** (sección ya montada) y convive con
> [`SPEC-003`](./003-tarifas.md) (capacidad + precio viven en Tarifas, no se duplican aquí).

---

## Objective

Resolver la pregunta **¿qué puedo hacer aquí?** y **¿cabe mi colada?** en la home, con la
misma claridad visual que Tarifas, **inventar capacidades, productos incluidos ni
servicios extra** que el negocio no ha confirmado (D-010).

Hoy la sección existe (SPEC-001) como cuatro tarjetas genéricas. Esta SPEC la alinea al
mockup §2: jerarquía icono → título → apoyo → acción, retícula del mockup, y copy
explícitamente separado entre **confirmado / candidato** y **placeholder**.

### Alcance

Incluye:

- Refinar la sección Servicios ya presente en la homepage (`id="servicios"`)
- Cuatro categorías del mockup y de SPEC-001: Lavado, Secado, Productos, Extra
- Datos centralizados en [`src/data/content.ts`](../../src/data/content.ts)
- Reutilizar `Card` del design system (hoy el markup duplica radio/sombra en la sección)
- Tipografía con tokens `.type-*` / `--text-*` ([`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md))
- Enlace de apoyo por tarjeta **solo a anclas existentes** (no hay `/servicios`)
- Franja de contacto del mockup §2, con copy y destino placeholder-safe (`#contacto`)
- Nota aditiva en [`001-home.md`](./001-home.md) apuntando a esta SPEC

Excluye:

- Página aparte `/servicios` o fichas por servicio (SPEC futura si se necesita)
- Duplicar precios o kg de [`SPEC-003`](./003-tarifas.md) dentro de las cards
- Afirmar que el detergente “va incluido”, planchado, bolsas u otros extras como hecho
- Formularios, WhatsApp de negocio no confirmado, o backend (D-011)
- FAQ, Sobre nosotros, mapa (siguen sin SPEC)
- Cambiar Hero, Tarifas o el stack (D-004)
- Sustituir placeholders por datos reales sin confirmación del negocio

---

## User

Perfiles de [`PRODUCT.md`](../PRODUCT.md). Los que condicionan esta sección:

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| **Colada de gran volumen** | Saber si hay lavado/secado de gran capacidad | Categoría Lavado/Secado visibles; **kg y temperaturas son placeholder** |
| **Primerizo** | Entender qué hay en el local (lavar, secar, productos, extra) | Cuatro cards, una idea cada una; sin jerga |
| **Sensible al precio** | No confundir “servicios” con “tarifas” | “Ver más” de Lavado/Secado lleva a `#tarifas`, no a un precio inventado en la card |
| **Con prisa** | Encontrar Servicios desde el nav | Ancla `#servicios` ya cableada en Header (SPEC-001); no romperla |

---

## Visual references

- [`public/design/mockup_burbujas_de_luz1.webp`](../../public/design/mockup_burbujas_de_luz1.webp) — **fuente de verdad UI** de esta SPEC: bloque **§2 Servicios** (H2 + apoyo, 2×2 cards, icono en contenedor de color, “Ver más →”, franja “¿Necesitas ayuda…? / Contáctanos”).
- [`public/design/design-board.webp`](../../public/design/design-board.webp) — cards, iconos lineales, tokens.
- [`public/design/responsive-reference.webp`](../../public/design/responsive-reference.webp) — jerarquía móvil/tablet/desktop.

El copy comercial del mockup (capacidades “grandes”, detergente incluido, planchado, bolsas)
es **maqueta**, no dato de negocio (D-010). Los hex del mockup **no** se copian: se usan
tokens semánticos (D-006). El contenedor de icono del mockup es un cuadrado redondeado; el
sistema manda **círculo `*-subtle` 40–48px** ([`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) —
Icons; D-017).

---

## Datos: confirmados vs placeholders

Inventario alineado a [`PRODUCT.md`](../PRODUCT.md) — Datos pendientes de confirmación y D-010.

### Confirmado (estructura y navegación)

| Dato | Estado | Fuente |
|------|--------|--------|
| Existe sección Servicios en la home | Confirmado (código + SPEC-001) | `Services.astro`, `id="servicios"` |
| Nav “Servicios” → `#servicios` | Confirmado | Header SPEC-001 |
| Cuatro categorías: Lavado, Secado, Productos, Extra | Confirmado como **IA** | SPEC-001 §4 + mockup §2 + footer del mockup |
| Componente `Icon` con nombres `washing-machine`, `wind`, `spray`, `plus-circle` | Confirmado en código | `content.ts` / `Icon.astro` |

### Copy candidato (marca, no operativo)

Usable como punto de partida; no es dato de máquina ni de contrato. Puede ajustarse sin
SPEC nueva si no afirma un hecho de negocio.

| Elemento | Texto candidato | Notas |
|----------|-----------------|-------|
| `h2` | Nuestros servicios | SPEC-001 / mockup |
| Apoyo de sección | Todo lo que necesitas para cuidar tu ropa, en un solo lugar. | Ya en código; mockup omite “cuidar” — se mantiene el de SPEC-001 salvo que el negocio pida el literal del mockup |
| Títulos de card | Lavado / Secado / Productos / Extra | IA, no cifra |
| Acción de card | Ver más | Mockup; destino = ancla, no ficha |
| Franja de ayuda | ¿Necesitas ayuda personalizada? Estamos aquí para asesorarte | Mockup; no implica chat ni formulario |
| CTA de franja | Contáctanos | Destino `#contacto`; el teléfono del footer sigue siendo placeholder |

### Placeholder obligatorio (D-010)

Cualquier afirmación que el usuario pueda tomar como **hecho del local**. En `content.ts`
debe verse el formato `[PLACEHOLDER: …]` (o nota equivalente visible en UI, como en
Tarifas).

| Campo | No usar como hecho | Placeholder de contenido |
|-------|--------------------|---------------------------|
| Capacidades de lavadora | “Lavadoras de grandes capacidades…” del mockup | `[PLACEHOLDER: capacidades de lavadora disponibles]` |
| Secado / temperaturas | “Secadoras potentes…” | `[PLACEHOLDER: capacidades de secadora y temperaturas]` |
| Productos en sala | “Detergentes y suavizantes de calidad incluidos en cada lavado” | `[PLACEHOLDER: detergentes y suavizantes disponibles en el local]` — **incluido en el precio no está confirmado** |
| Extra | “Bolsas, planchado y más…” | `[PLACEHOLDER: servicios adicionales disponibles]` |
| Precios o kg | Cualquier cifra | No van en esta sección; viven en SPEC-003 |

La descripción actual en `content.ts` **ya usa placeholders**. Esta SPEC **prohíbe**
sustituirlos por el copy afirmativo del mockup.

---

## Information Architecture

Orden de la home (sin cambio):

Hero → Benefits → **Servicios** → Tarifas → How it works → CTA final → Footer

### 1. Sección Servicios

- `id="servicios"` (no renombrar)
- Landmark: `<section aria-labelledby="services-heading">`
- `h2` — copy candidato “Nuestros servicios”
- Apoyo corto — una frase; **no** lista de kg ni precios
- Grid de **4 tarjetas**
- Una idea por tarjeta (`VISUAL_DIRECTION.md` §3)
- Superficie de sección clara (D-005). Atmósfera D-022 (wash suave) **permitida** si no
  compite con Tarifas; no es bloque oscuro ni hex arbitrario
- Máximo **cero** `card-featured` en este grupo (el “Más popular” es de Tarifas, SPEC-003)

#### Tarjetas (estructura visual = mockup; datos = tabla D-010)

| Orden | Título | Icono (existente) | Acento de contenedor | Cuerpo | Acción |
|-------|--------|-------------------|----------------------|--------|--------|
| 1 | Lavado | `washing-machine` | violet / `--color-primary-subtle` | Placeholder capacidades | “Ver más” → `#tarifas` |
| 2 | Secado | `wind` | cyan / `--color-secondary-subtle` | Placeholder secado | “Ver más” → `#tarifas` |
| 3 | Productos | `spray` | mint / `--color-success-subtle` | Placeholder productos | “Ver más” → `#contacto` |
| 4 | Extra | `plus-circle` | orange / `--color-warning-subtle` | Placeholder extras | “Ver más” → `#contacto` |

Motivo de los destinos: no existen fichas. Lavado/Secado empujan a la pregunta de precio y
tamaño (CTA de producto). Productos/Extra no tienen sección propia; `#contacto` es el
cierre honesto hasta una SPEC de detalle.

Regla `Card`: si la tarjeta **entera** es enlazable, el raíz es `<a>` y **no** se anida
otro control. Elegir **una** de estas, no ambas:

1. Card completa = enlace único (preferible, mockup “Ver más” como affordance visual
   dentro del mismo `<a>`), o
2. Card estática + solo el texto “Ver más” como `<a>` (entonces la card **no** tiene
   hover de elevación: `DESIGN_SYSTEM.md` — Cards).

Prohibido: `<a>` envolviendo la card y otro `<a>` “Ver más” dentro.

### 2. Franja de contacto (mockup §2)

- Banner claro (`*-subtle` o `--color-secondary-subtle` / surface), radio `--radius-card`
  o `--radius-lg`, **sin** bloque oscuro
- Texto candidato a la izquierda; `Button` “Contáctanos” a la derecha en desktop,
  apilado en móvil
- `href="#contacto"` (footer ya tiene `id="contacto"`)
- No abrir modal, no formulario, no WhatsApp inventado (D-011, D-010)

### 3. Relación con Tarifas

| Pregunta | Dónde se responde |
|----------|-------------------|
| ¿Qué hay? | Esta sección |
| ¿Cuánto cuesta / qué tamaño? | `#tarifas` (SPEC-003) |
| ¿Cómo se usa? | `#como-funciona` (SPEC-001; pulido futuro) |

No repetir la tabla de precios en Servicios.

---

## Responsive requirements

Reglas generales en [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Responsive.

El mockup §2 es una retícula **2×2**. SPEC-001 permitía 2 o 4 columnas en desktop; **esta
SPEC manda 2×2 desde tablet** para que el apoyo + “Ver más” respiren (Rule 6 / mockup).
Cuatro columnas en desktop estrecharían las cards respecto a la referencia.

### Mobile (< 768px)

- 1 columna
- Verificar a **320px**: sin scroll horizontal
- Franja de contacto: texto + botón apilados; objetivo táctil del botón ≥ 44px
- Padding de card `--space-5`

### Tablet (768–1023px)

- 2 columnas, altura homogénea
- Padding de card `--space-6`

### Desktop (≥ 1024px)

- **2×2** (no 4 en una fila)
- Franja de contacto en una fila: copy | botón
- Contenido limitado a `--content-max`

---

## Accessibility

- Un solo `h1` en la página (Hero); esta sección: `h2` + `h3` por tarjeta
- Lista semántica `<ul role="list">`
- Iconos de categoría: `aria-hidden="true"`; el `h3` transmite el significado
- “Ver más” / card-enlace: nombre accesible que incluya el servicio (p. ej. “Ver más sobre Lavado”)
- Contraste AA medido: títulos `--color-text`; apoyo `--color-text-secondary` o `--color-muted`
  solo si cumple Contrast rules (ningún tono 500 de marca como cuerpo, D-007)
- Franja y botón navegables por teclado; foco `--shadow-focus`
- Sin información solo en el icono o solo en el color del acento
- `prefers-reduced-motion` en `data-reveal` existente
- Zoom 200% sin pérdida de “Ver más” ni de la franja

---

## Performance

- Sin dependencias nuevas (D-004)
- Sin imágenes nuevas en esta sección (iconos SVG existentes)
- Sin JS propio; `data-reveal` opcional ya en la página
- Usable y enlazable **sin** JavaScript
- No importar `src/scripts/3d/` (D-003)

---

## SEO

- Títulos y descripciones (aunque placeholder) en HTML estático
- No schema `Service`/`Offer` con hechos no confirmados
- No cambiar `<title>` / description de la página en esta SPEC

---

## Acceptance Criteria

Todos comprobables. Las casillas se marcan al implementar, no al escribir esta SPEC.

### Build y tipos

- [x] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [x] `npm run build` completa sin errores.

### Estructura y contenido

- [x] Sigue existiendo `id="servicios"` entre Benefits y Tarifas.
- [x] Exactamente cuatro servicios: Lavado, Secado, Productos, Extra, en ese orden.
- [x] Cuerpos de Lavado, Secado, Productos y Extra contienen el formato `[PLACEHOLDER: …]`
      visible (D-010); **ninguno** afirma detergente incluido, planchado, bolsas ni kg.
- [x] Datos de título, descripción, icono, color y `href` de acción viven en `content.ts`.
- [x] Acciones Lavado y Secado apuntan a `#tarifas`.
- [x] Acciones Productos y Extra apuntan a `#contacto`.
- [x] Header “Servicios” sigue apuntando a `#servicios` (sin 404).
- [x] Existe la franja de contacto del mockup con CTA a `#contacto`; sin formulario.

### Visual

- [x] Ninguna superficie oscura a ancho completo (D-005).
- [x] Solo tokens / `color-mix` de tokens; sin hex de marca arbitrarios (D-006).
- [x] Cards vía `Card.astro` (no duplicar radio/sombra a mano).
- [x] Iconos 24px en círculo `*-subtle` 40–48px (`DESIGN_SYSTEM.md` — Icons).
- [x] Tipografía `.type-h2` / `.type-h3` / `.type-body-lg` / `.type-small` o equivalentes
      `--text-*` (sin `text-sm` de Tailwind para tamaño).
- [x] Composición alineada al mockup §2 (icono → título → texto → Ver más; franja inferior).
- [x] Un solo control interactivo por tarjeta (raíz `<a>` **o** enlace “Ver más”, no ambos).

### Responsive

- [x] 1 columna &lt; 768px; 2×2 desde 768px.
- [x] Correcto a 320px, 375px, 768px, 1024px y 1440px.
- [x] Sin scroll horizontal en ningún ancho.

### Accesibilidad

- [x] Jerarquía `h2` → `h3` sin saltos.
- [x] Contraste medido conforme a Contrast rules.
- [x] Iconos decorativos `aria-hidden`.
- [x] Enlaces con nombre accesible que incluye el servicio.
- [x] Teclado + foco visible en cards/CTA de franja.

### Rendimiento

- [x] Sin dependencias nuevas.
- [x] Sin JS adicional obligatorio.

---

## Notas de implementación

1. SPEC (este archivo) → ajustar `services` / `servicesIntro` en `content.ts` →
   `Services.astro` con `Card` → franja → verificar anclas.
2. No copiar el párrafo afirmativo del mockup al cuerpo de las cards.
3. No añadir `/servicios`. Si hace falta ficha, nueva SPEC.
4. No tocar precios en `pricingByCategory`.
5. Hover-lift solo si la card es el enlace (Rule 6 + Cards).
6. Actualizar [`001-home.md`](./001-home.md) §4 con enlace a esta SPEC (corrección aditiva).
7. No registrar decisión nueva salvo que se cambie el destino de “Ver más” o se creen rutas.

### Drift detectado (Rule 12)

- SPEC-001 §4 permite 2 o 4 columnas en desktop; el mockup §2 es 2×2. **Esta SPEC prevalece**
  para Servicios (precedencia: SPEC activa).
- `Services.astro` no usa `Card.astro` y aplica `hover:shadow-md` a cards **no** enlazadas:
  incumple `DESIGN_SYSTEM.md` — Cards. Corregir en la implementación de esta SPEC.

---

*Última actualización: agosto 2026*
