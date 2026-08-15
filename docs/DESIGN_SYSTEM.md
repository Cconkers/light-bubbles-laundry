# DESIGN_SYSTEM.md — Sistema de diseño

> **Documento:** Reglas visuales reutilizables y tokens de Burbujas de Luz.
> **Propósito:** Que un agente pueda construir un componente nuevo sin reinterpretar el diseño.
> **Relación:** El criterio estético está en [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md).
> Este documento lo traduce a valores concretos. La arquitectura está en [`PLANNING.md`](../PLANNING.md).

---

## Cómo usar este documento

**Regla base: ningún componente usa un color hexadecimal literal.** Los componentes
consumen **tokens semánticos**. Los tokens semánticos apuntan a **primitivos**. Solo los
primitivos contienen hex.

```
primitivo            semántico              componente
--lb-violet-600  ->  --color-primary    ->  bg-primary
```

Motivo: cambiar la marca debe ser editar una capa, no auditar cada componente. Y un
componente que dice `bg-primary` comunica intención; uno que dice `bg-[#8B4BD1]` no
comunica nada.

Tailwind v4 se configura **sin archivo de config**. Los tokens viven en el bloque `@theme`
de [`src/styles/global.css`](../src/styles/global.css). No crear `tailwind.config.mjs`
(ver [`DECISIONS.md`](./DECISIONS.md) D-013).

---

## Color System

### Capa 1 — Primitivos

Paleta extraída de [`design-board.webp`](../public/design/design-board.webp). Los tonos
`500` son los valores originales de la marca; el resto es escala derivada.

**Violeta** — color de marca principal

| Token | Hex | Contraste sobre blanco |
|-------|-----|------------------------|
| `--lb-violet-50` | `#F8F2FF` | 1.10:1 |
| `--lb-violet-100` | `#F1E5FF` | 1.21:1 |
| `--lb-violet-200` | `#E2C8FF` | 1.51:1 |
| `--lb-violet-300` | `#CFA4FF` | 2.02:1 |
| `--lb-violet-400` | `#BD80FF` | 2.73:1 |
| `--lb-violet-500` | `#AA5CFF` | 3.69:1 — solo texto grande |
| `--lb-violet-600` | `#8B4BD1` | 5.22:1 — apto texto |
| `--lb-violet-700` | `#703DA8` | 7.19:1 |
| `--lb-violet-800` | `#552E80` | 10.05:1 |
| `--lb-violet-900` | `#3A1F57` | 13.87:1 |

**Rosa** — acento

| Token | Hex | Contraste |
|-------|-----|-----------|
| `--lb-pink-50` | `#FFF3FB` | 1.08:1 |
| `--lb-pink-100` | `#FFE7F6` | 1.17:1 |
| `--lb-pink-200` | `#FFCBEC` | 1.40:1 |
| `--lb-pink-300` | `#FFA9E0` | 1.75:1 |
| `--lb-pink-400` | `#FF88D3` | 2.16:1 |
| `--lb-pink-500` | `#FF66C7` | 2.63:1 — decorativo |
| `--lb-pink-600` | `#D154A3` | 3.81:1 — solo texto grande |
| `--lb-pink-700` | `#A84383` | 5.53:1 — apto texto |
| `--lb-pink-800` | `#803364` | 8.15:1 |
| `--lb-pink-900` | `#572344` | 12.14:1 |

**Cian** — secundario

| Token | Hex | Contraste |
|-------|-----|-----------|
| `--lb-cyan-50` | `#EBFAFF` | 1.07:1 |
| `--lb-cyan-100` | `#D6F5FF` | 1.14:1 |
| `--lb-cyan-200` | `#A8EAFF` | 1.32:1 |
| `--lb-cyan-300` | `#70DDFF` | 1.56:1 |
| `--lb-cyan-400` | `#38CFFF` | 1.82:1 |
| `--lb-cyan-500` | `#00C2FF` | 2.07:1 — decorativo |
| `--lb-cyan-600` | `#009FD1` | 3.05:1 — solo texto grande |
| `--lb-cyan-700` | `#0080A8` | 4.51:1 — apto texto |
| `--lb-cyan-800` | `#006180` | 6.95:1 |
| `--lb-cyan-900` | `#004257` | 10.96:1 |

**Naranja** — atención

| Token | Hex | Contraste |
|-------|-----|-----------|
| `--lb-orange-50` | `#FFF7F0` | 1.06:1 |
| `--lb-orange-100` | `#FFEEE0` | 1.13:1 |
| `--lb-orange-200` | `#FFDBBE` | 1.30:1 |
| `--lb-orange-300` | `#FFC494` | 1.55:1 |
| `--lb-orange-400` | `#FFAC6A` | 1.85:1 |
| `--lb-orange-500` | `#FF9540` | 2.18:1 — decorativo |
| `--lb-orange-600` | `#D17A34` | 3.21:1 — solo texto grande |
| `--lb-orange-700` | `#A8622A` | 4.72:1 — apto texto |
| `--lb-orange-800` | `#804B20` | 7.13:1 |
| `--lb-orange-900` | `#573316` | 11.11:1 |

**Menta** — éxito / ecológico

| Token | Hex | Contraste |
|-------|-----|-----------|
| `--lb-mint-50` | `#F5FDF9` | 1.03:1 |
| `--lb-mint-100` | `#EAFBF3` | 1.07:1 |
| `--lb-mint-200` | `#D3F7E5` | 1.15:1 |
| `--lb-mint-300` | `#B7F2D4` | 1.26:1 |
| `--lb-mint-400` | `#9AECC3` | 1.39:1 |
| `--lb-mint-500` | `#7EE7B2` | 1.50:1 — decorativo |
| `--lb-mint-600` | `#67BD92` | 2.27:1 |
| `--lb-mint-700` | `#539875` | 3.43:1 — solo texto grande |
| `--lb-mint-800` | `#3F7459` | 5.45:1 — apto texto |
| `--lb-mint-900` | `#2B4F3D` | 9.18:1 |

**Neutros**

| Token | Hex | Nota |
|-------|-----|------|
| `--lb-white` | `#FFFFFF` | Superficie base |
| `--lb-foam-50` | `#FAFAFA` | Superficie alterna |
| `--lb-foam-100` | `#F4F5F7` | Superficie hundida |
| `--lb-foam-200` | `#E7E9EE` | Bordes |
| `--lb-foam-300` | `#CFD3DC` | Bordes marcados |
| `--lb-slate-500` | `#6B7280` | Texto atenuado — 4.83:1 |
| `--lb-slate-700` | `#3F4654` | Texto secundario — 9.30:1 |
| `--lb-ink` | `#1A1A2E` | Texto principal — 17.06:1 |

> `--lb-ink` es **color de texto**, no de fondo. No usar como superficie
> (ver [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) §2).

### Capa 2 — Tokens semánticos

Lo que los componentes consumen:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `--lb-violet-600` | Acción principal, enlaces |
| `--color-primary-hover` | `--lb-violet-700` | Hover de acción principal |
| `--color-primary-subtle` | `--lb-violet-100` | Fondos de badge y estado activo |
| `--color-secondary` | `--lb-cyan-700` | Acción e información secundaria |
| `--color-secondary-subtle` | `--lb-cyan-100` | Fondo informativo |
| `--color-accent` | `--lb-pink-700` | Destacados, "más popular" |
| `--color-accent-subtle` | `--lb-pink-100` | Fondo de destacado |
| `--color-success` | `--lb-mint-800` | Confirmación, ecológico |
| `--color-success-subtle` | `--lb-mint-100` | Fondo de confirmación |
| `--color-warning` | `--lb-orange-700` | Aviso, atención |
| `--color-warning-subtle` | `--lb-orange-100` | Fondo de aviso |
| `--color-text` | `--lb-ink` | Texto principal |
| `--color-text-secondary` | `--lb-slate-700` | Texto de apoyo |
| `--color-muted` | `--lb-slate-500` | Metadatos, texto auxiliar |
| `--color-text-on-fill` | `--lb-white` | Texto sobre relleno saturado |
| `--color-background` | `--lb-white` | Fondo de página |
| `--color-background-alt` | `--lb-foam-50` | Fondo de sección alterna |
| `--color-surface` | `--lb-white` | Superficie de tarjeta |
| `--color-surface-sunken` | `--lb-foam-100` | Superficie hundida |
| `--color-border` | `--lb-foam-200` | Borde por defecto |
| `--color-border-strong` | `--lb-foam-300` | Borde de énfasis |
| `--color-focus` | `--lb-violet-600` | Anillo de foco |

**Decorativos** — nunca alojan texto ni control interactivo:

| Token | Valor |
|-------|-------|
| `--color-deco-violet` | `--lb-violet-500` |
| `--color-deco-pink` | `--lb-pink-500` |
| `--color-deco-cyan` | `--lb-cyan-500` |
| `--color-deco-mint` | `--lb-mint-500` |
| `--color-deco-orange` | `--lb-orange-500` |

### Gradientes

```css
--gradient-wash:    linear-gradient(135deg, #F1E5FF 0%, #FFE7F6 45%, #D6F5FF 100%);
--gradient-hero:    linear-gradient(160deg, #FFFFFF 0%, #F8F2FF 40%, #EBFAFF 100%);
--gradient-accent:  linear-gradient(90deg,  #AA5CFF 0%, #FF66C7 100%);
```

`--gradient-accent` es **solo decorativo** (formas, separadores). No aloja texto pequeño.

### Implementación en Tailwind v4

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Primitivos */
  --color-lb-violet-500: #AA5CFF;
  --color-lb-violet-600: #8B4BD1;
  /* ...resto de la escala... */

  /* Semánticos */
  --color-primary: var(--color-lb-violet-600);
  --color-surface: #FFFFFF;
  --color-text: #1A1A2E;
  /* ...resto... */
}
```

Uso: `bg-primary`, `text-text`, `border-border`. Prohibido: `bg-[#8B4BD1]`.

---

## Contrast rules

**Normativo. Estas reglas no son orientativas.**

Ningún tono `500` de la marca alcanza 4.5:1 sobre blanco. El mejor es violeta con 3.69:1
y el peor menta con 1.50:1. Sin la regla siguiente, usar la paleta "tal cual" produce
interfaz ilegible.

| Uso | Mínimo | Token permitido |
|-----|--------|-----------------|
| Texto de cuerpo (< 18.66px, o < 24px si bold) | 4.5:1 | `--color-text`, `--color-text-secondary`, `--color-muted`, o pasos 700+ (menta 800+) |
| Texto grande (≥ 18.66px bold, ≥ 24px normal) | 3:1 | Pasos 600+ |
| Relleno con texto blanco encima | 4.5:1 | Violeta 600+, rosa 700+, cian 700+, naranja 700+, menta 800+ |
| Bordes y separadores no informativos | sin mínimo | Cualquiera |
| Bordes de control de formulario | 3:1 | `--color-border-strong` o superior |
| Iconos informativos | 3:1 | Pasos 600+ |
| Iconos decorativos | sin mínimo | Tokens `--color-deco-*` |
| Anillo de foco frente a fondo adyacente | 3:1 | `--color-focus` |

Consecuencias prácticas:

- **Menta es el tono más débil de la paleta.** Como texto exige el paso 800; como relleno con texto blanco, también 800. Nunca menta 500 con texto encima.
- **El rosa y el naranja 500 son puramente decorativos.** Un badge rosa lleva texto `--lb-pink-900`, no blanco.
- **Nunca texto blanco sobre un tono 500.** Ninguno llega a 4.5:1.
- Al superponer texto a gradiente o fotografía hay que **medir el contraste real**, no estimarlo. La zona más clara del fondo es la que decide.
- No transmitir información **solo** por color: acompañar de icono, texto o forma.

---

## Typography

**Familia:** Poppins. Geométrica redondeada, coherente con la personalidad amable de la
marca y con la referencia. Pesos: 400, 500, 600, 700.

Fallback obligatorio y `font-display: swap`:

```css
--font-body: "Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
--font-display: "Poppins", ui-sans-serif, system-ui, sans-serif;
```

> El mecanismo de carga (API nativa de fuentes de Astro frente a `@fontsource-variable/poppins`)
> se decide al implementar. Requisito: autoalojada, con `swap` y sin bloquear el render.
> No se admite CDN de terceros.

| Rol | Tamaño | Peso | Line-height | Uso |
|-----|--------|------|-------------|-----|
| `display` | `clamp(2.5rem, 6vw, 4.5rem)` | 700 | 1.05 | Titular de hero |
| `h1` | `clamp(2rem, 4vw, 3rem)` | 700 | 1.15 | Título de página |
| `h2` | `clamp(1.5rem, 3vw, 2.25rem)` | 700 | 1.2 | Título de sección |
| `h3` | `clamp(1.25rem, 2vw, 1.5rem)` | 600 | 1.3 | Título de tarjeta |
| `body-lg` | `1.125rem` | 400 | 1.6 | Entradilla |
| `body` | `1rem` | 400 | 1.65 | Texto por defecto |
| `small` | `0.875rem` | 400 | 1.5 | Metadatos. **Nunca** cuerpo. |
| `button` | `1rem` | 600 | 1 | Etiquetas de acción |
| `label` | `0.8125rem` | 600 | 1.4 | Etiquetas, `uppercase`, `letter-spacing: 0.08em` |

Reglas:

- **Mínimo 16px para texto de lectura**, en todos los breakpoints.
- Un solo `h1` por página; jerarquía sin saltos de nivel.
- Medida de lectura de 45-75 caracteres (`max-width: 65ch`).
- Titulares con `letter-spacing: -0.02em`; el cuerpo sin ajuste.
- Sin cursiva para énfasis: usar peso 600.
- Sin mayúsculas en textos largos; solo en `label`.

---

## Spacing

Escala de base 4px. Sin valores fuera de escala.

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | `0.25rem` (4px) | Separación mínima |
| `--space-2` | `0.5rem` (8px) | Icono-texto |
| `--space-3` | `0.75rem` (12px) | Interior compacto |
| `--space-4` | `1rem` (16px) | Interior por defecto |
| `--space-5` | `1.25rem` (20px) | Interior de tarjeta |
| `--space-6` | `1.5rem` (24px) | Separación entre elementos |
| `--space-8` | `2rem` (32px) | Separación entre grupos |
| `--space-10` | `2.5rem` (40px) | Interior de tarjeta amplia |
| `--space-12` | `3rem` (48px) | Separación interna de sección |
| `--space-16` | `4rem` (64px) | Sección en móvil |
| `--space-20` | `5rem` (80px) | Sección en tablet |
| `--space-24` | `6rem` (96px) | Sección en desktop |

Compuestos:

| Token | Valor |
|-------|-------|
| `--section-gap` | `clamp(4rem, 8vw, 6rem)` |
| `--content-max` | `72rem` (1152px) |
| `--prose-max` | `65ch` |
| `--gutter` | `clamp(1rem, 4vw, 2rem)` |

---

## Border Radius

La marca no tiene esquinas vivas.

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `0.5rem` (8px) | Badges, chips pequeños |
| `--radius-md` | `0.75rem` (12px) | Inputs, botones pequeños |
| `--radius-card` | `1.25rem` (20px) | Tarjetas por defecto |
| `--radius-lg` | `1.75rem` (28px) | Contenedores grandes, hero |
| `--radius-pill` | `9999px` | Botones, chips, píldoras de navegación |

Regla: nunca `border-radius: 0` en un elemento de interfaz. El mínimo es `--radius-sm`.

---

## Shadows

Difusas y neutras. Una sombra dura o de color saturado contradice la dirección artística.

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-xs` | `0 1px 2px rgba(26,26,46,0.05)` | Separación mínima |
| `--shadow-sm` | `0 2px 8px rgba(26,26,46,0.06)` | Tarjeta en reposo |
| `--shadow-md` | `0 6px 20px rgba(26,26,46,0.08)` | Tarjeta elevada, hover |
| `--shadow-lg` | `0 14px 40px rgba(26,26,46,0.10)` | Modal, popover |
| `--shadow-focus` | `0 0 0 3px rgba(139,75,209,0.35)` | Anillo de foco |

Reglas:

- Opacidad máxima `0.12`. Por encima, la sombra se vuelve dura.
- Tinte neutro basado en `--lb-ink`, nunca negro puro.
- **Prohibido** `box-shadow` de color saturado como resplandor: es un anti-patrón (`glow`).
- La elevación sube un nivel en hover, nunca dos.

---

## Buttons

Todas las variantes: `--radius-pill`, `font-weight: 600`, altura táctil mínima **44px**,
`transition` de 250ms, y anillo de foco visible con `--shadow-focus`.

### Primary

Acción principal. Como máximo uno por zona visual.

- Fondo `--color-primary` (`#8B4BD1`), texto `--color-text-on-fill` → 5.22:1
- Hover: `--color-primary-hover` + `--shadow-md`
- Activo: sin desplazamiento vertical superior a 1px
- Deshabilitado: opacidad 0.5, `cursor: not-allowed`

### Secondary

Alternativa de igual jerarquía informativa, menor peso visual.

- Fondo transparente, borde 2px `--color-primary`, texto `--color-primary`
- Hover: fondo `--color-primary-subtle`

### Ghost

Acción terciaria, navegación.

- Sin fondo ni borde; texto `--color-text-secondary`
- Hover: fondo `--color-surface-sunken`, texto `--color-primary`

### Icon

Solo icono.

- Cuadrado de 44x44 mínimo, `--radius-pill`
- **Obligatorio** `aria-label` descriptivo
- Nunca es la única forma de acceder a una acción crítica

Prohibido: relleno con gradiente en botones (el texto pierde contraste garantizable), y
sombras de color.

---

## Cards

Contenedor por defecto para contenido agrupado.

- Fondo `--color-surface`, radio `--radius-card`, sombra `--shadow-sm`
- Interior `--space-5` en móvil, `--space-6` desde tablet
- Borde `--color-border` solo cuando la tarjeta se apoya sobre fondo blanco y necesita definición
- Hover **solo si la tarjeta es interactiva**: sube a `--shadow-md`. Una tarjeta estática no reacciona.
- Estructura: icono opcional → título (`h3`) → texto (`body`) → acción opcional
- Altura homogénea dentro de una misma cuadrícula
- Si la tarjeta entera es un enlace, el elemento raíz es `<a>`; no anidar controles interactivos

Variantes:

| Variante | Diferencia |
|----------|------------|
| `card-plain` | Base |
| `card-tinted` | Fondo `*-subtle` en lugar de blanco |
| `card-featured` | Borde 2px `--color-accent` + badge. Máximo una por grupo. |
| `card-sunken` | Fondo `--color-surface-sunken`, sin sombra |

---

## Icons

- **Estilo:** lineal, trazo redondeado, esquinas suaves. Coherente con la referencia.
- **Grosor:** 1.5px-2px a 24px, con `stroke-linecap: round`.
- **Rejilla:** 24x24. Tamaños permitidos: 16, 20, 24, 32, 48.
- **Color:** hereda `currentColor`. Informativos con paso 600+; decorativos con `--color-deco-*`.
- **Contenedor:** los iconos de categoría van en un círculo `*-subtle` de 40-48px, como en la referencia.
- **Formato:** SVG inline para permitir `currentColor`. Sin fuentes de iconos.
- **Accesibilidad:** decorativo → `aria-hidden="true"`; informativo → `<title>` o `aria-label`.
- Sin iconos multicolor ni con relleno degradado. El color lo aporta el contenedor.

---

## Bubbles

El motivo de marca y el mayor riesgo estético. La implementación del MVP es **CSS/SVG
ligera**; la capa 3D está aparcada (ver [`DECISIONS.md`](./DECISIONS.md) D-003).

### Tamaño

| Clase | Diámetro | Proporción |
|-------|----------|------------|
| `bubble-sm` | 8-16px | ~50% |
| `bubble-md` | 24-48px | ~35% |
| `bubble-lg` | 64-120px | ~15% |

### Transparencia

- Opacidad total entre **0.10 y 0.35**. Nunca superior.
- Relleno prácticamente vacío: gradiente radial del 5-12% de alfa en el centro.
- Borde a 0.25-0.40 de alfa: es lo que define la burbuja.
- Un brillo especular pequeño y desplazado del centro, alfa máxima 0.5.

### Blur

- `backdrop-filter: blur(2px)` como máximo en las grandes; ninguno en `bubble-sm`.
- Desenfoque propio de 0 a 1px. Una burbuja borrosa parece una mancha.

### Movimiento

| Propiedad | Valor |
|-----------|-------|
| Dirección | Ascendente con deriva lateral |
| Duración de ciclo | 18-40s, aleatoria por burbuja |
| Deriva horizontal | ±5% del viewport |
| Easing | `ease-in-out`, nunca `linear` |
| Escala | Pulso sutil de 0.95-1.05 |
| Desfase | Aleatorio, para evitar sincronía perceptible |

### Frecuencia y densidad

Límites máximos **simultáneos en viewport**:

| Breakpoint | Máximo |
|------------|--------|
| Mobile (< 768px) | 6 |
| Tablet (768-1024px) | 10 |
| Desktop (> 1024px) | 14 |

Y por sección: máximo 4 en móvil, 8 en desktop. Superar estos topes convierte la
decoración en ruido.

### Interacción

- `pointer-events: none` sin excepción.
- `aria-hidden="true"`; nunca en el orden de tabulación.
- Sin reacción al cursor en esta fase.
- Sin sonido.

### Prohibiciones

- Nunca sobre texto, botón o control, ni siquiera por detrás con opacidad apreciable.
- Nunca adyacentes al logo (§Brand and Logo).
- Nunca dentro de una tarjeta con contenido.
- Nunca por encima de la cabecera fija.
- Se **desactivan por completo** con `prefers-reduced-motion: reduce`. Puede conservarse
  un conjunto estático mínimo, sin animación.

---

## Motion

### Duraciones

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-instant` | `100ms` | Cambio de color, foco |
| `--duration-fast` | `150ms` | Hover de controles pequeños |
| `--duration-base` | `250ms` | Transición por defecto |
| `--duration-slow` | `400ms` | Entrada de elemento |
| `--duration-slower` | `700ms` | Revelado por scroll |

### Easing

| Token | Valor | Uso |
|-------|-------|-----|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas. Por defecto. |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Movimiento continuo |
| `--ease-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | Cambios de estado |

Sin `linear` salvo en el movimiento de burbujas, y sin rebotes ni sobreimpulsos elásticos.

### Entrada

- `opacity: 0 → 1` con `translateY(12px → 0)`.
- `--duration-slow` con `--ease-out`.
- Escalonado de 60-80ms entre hermanos, máximo 6 elementos; a partir de ahí, entrada conjunta.
- Nunca desplazamientos superiores a 24px: producen sensación de inestabilidad.

### Hover

- Solo en dispositivos con puntero fino: `@media (hover: hover) and (pointer: fine)`.
- Elevación de un nivel de sombra, o cambio de color, no ambos.
- Escala máxima `1.02`.
- Duración `--duration-fast`.

### Scroll

- **`IntersectionObserver` + transiciones CSS.** Sin librería de animación
  (ver [`DECISIONS.md`](./DECISIONS.md) D-004 y D-018).
- Umbral de disparo del 15% de visibilidad; la animación ocurre **una sola vez**.
- Sin efectos ligados a la posición del scroll (`scrub`), sin pines, sin parallax en móvil.
- Nada de contenido que dependa del scroll para ser legible: si JS falla, todo debe verse.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Además: burbujas desactivadas, revelados por scroll en estado final visible, y `scroll-behavior: auto`.

---

## Responsive

Móvil primero. Los breakpoints coinciden con los de Tailwind y con los tiers descritos en
[`PLANNING.md`](../PLANNING.md) §3.2.

| Nombre | Rango | Tier |
|--------|-------|------|
| Base | 0-639px | mobile |
| `sm` | 640-767px | mobile |
| `md` | 768-1023px | tablet |
| `lg` | 1024-1279px | desktop |
| `xl` | 1280px+ | desktop |

### Mobile (base)

- Una columna. Ancho de contenido = viewport menos `--gutter`.
- Objetivo táctil mínimo 44x44px, con 8px de separación entre objetivos.
- Navegación colapsada; menú accesible por teclado y con foco atrapado si es overlay.
- Ritmo de sección `--space-16`.
- Decoración al mínimo: 6 burbujas, 1-2 formas orgánicas.
- El hero muestra titular y CTA sin scroll.
- Sin efectos de hover; estados `:active` claros.

### Tablet (`md`)

- 2 columnas donde aporte; nunca forzar 3.
- Ritmo de sección `--space-20`.
- Navegación horizontal si caben todos los enlaces sin truncar.
- Decoración intermedia: 10 burbujas.

### Desktop (`lg` / `xl`)

- Hasta 3-4 columnas en cuadrículas de tarjetas.
- Contenido limitado a `--content-max`, centrado; el aire crece a los lados.
- Ritmo de sección `--space-24`.
- Decoración plena: 14 burbujas, formas completas.
- Hover habilitado.
- Por encima de 1440px no se aumenta el tamaño del texto; solo el aire.

### Reglas transversales

- Sin scroll horizontal en ningún breakpoint.
- Sin pérdida de contenido entre breakpoints: lo que existe en desktop existe en móvil, quizá reorganizado.
- Imágenes con `width`/`height` o `aspect-ratio` para no provocar CLS.
- Probar a 320px de ancho: es el suelo real.

---

## Brand and Logo

### Inventario de activos

| Archivo | Rol | Estado |
|---------|-----|--------|
| [`src/assets/brand/logo.png`](../src/assets/brand/logo.png) | **Maestro lossless.** 1230x1186, RGBA, 1,9MB. Canal alfa reconstruido. | Vigente |
| [`src/assets/brand/logo.webp`](../src/assets/brand/logo.webp) | Derivado web. 1230x1186, canal alfa, 198KB. | Vigente |
| `public/images/logo_burbujas_de_luz.png` | Origen aplanado (sin alfa). 1254x1254, 1,5MB. No en repositorio. | Fuera del repo (untracked) |
| `src/assets/images/logo.png` | Copia antigua con marca de agua | **Retirada en SPEC-001** |
| `public/images/logo.png` | Copia antigua servida sin optimizar | Ya borrada (commit `9c1b277`) |

El PNG lossless (`logo.png`) es el **master de mayor fidelidad**: sin pérdida de datos,
conserva la información exacta que entró en la reconstrucción. El WebP es la versión
derivada para servir en web. Ambos viven en `src/` para pasar por `astro:assets`. En
componentes se usa el PNG como fuente: Astro emite WebP dimensionado por uso en build time.

> El PNG comprometido pesa 1,9 MB, inusual para un activo de texto, porque el logo
> contiene gradientes complejos y especularidades que el compresor lossless no puede
> simplificar. La alternativa (WebP 198 KB con pérdida mínima) sirve igual de bien para
> renderizado; el PNG solo aporta si se hace edición posterior o si algún día un diseñador
> deriva un SVG de él.

El maestro vive en `src/`, no en `public/`, para que pase por `astro:assets` y Astro emita
WebP dimensionado por uso en lugar de servir el original completo.

> **Nota:** La referencia rota a `/images/logo.png` en `index.astro` quedó reparada en
> SPEC-001. El logo de cabecera se sirve ahora mediante `<Image>` de `astro:assets` desde
> `src/assets/brand/logo.webp`.

**Procedencia y limitación conocida.** El original entregado por el negocio
(`public/images/logo_burbujas_de_luz.png`, PNG sin pérdida de 1254x1254) **no tiene canal
alfa**: viene aplanado sobre un blanco no uniforme, con valores de fondo entre 243 y 254. El
aplanado ocurrió aguas arriba, en la exportación, no por compresión: un PNG sin pérdida
conserva exactamente esa irregularidad.

La transparencia se **reconstruyó** con relleno por inundación desde las cuatro esquinas,
umbral 240, eliminando únicamente el fondo conectado al borde. Así se preservan las zonas
blancas interiores, que son las críticas: el relleno del wordmark y los brillos especulares
de las burbujas. Un recorte por color global las habría perforado.

El resultado se verificó a escala 1:1 compuesto sobre violeta saturado: contorno navy del
wordmark nítido, sin halo, y bordes de burbuja leyéndose como brillo propio. Después se
recortó el margen transparente sobrante (contenido de 1230x1186 sobre 1254x1254), de modo que
el espacio de respeto se controla en CSS y no queda horneado en el bitmap.

> **Pendiente:** sigue siendo deseable un maestro **vectorial (SVG)** o un PNG con alfa real
> del diseñador. El actual es una reconstrucción, de calidad suficiente para producción, pero
> no un original. Un SVG además eliminaría los mínimos de tamaño de la tabla siguiente.

### Otros activos de marca

| Archivo | Rol | Nota |
|---------|-----|------|
| [`src/assets/images/background.webp`](../src/assets/images/background.webp) | Fotografía de fondo hero, desktop. 1536x1024. Servida vía `astro:assets`. | Vigente |
| [`src/assets/images/background-sm.webp`](../src/assets/images/background-sm.webp) | Fotografía de fondo hero, mobile. 768x512. Art-direction en `<picture>`. | Vigente |
| `public/images/background-img.webp` | Copia en `public/` (legado de la optimización previa). Preferir `src/assets/`. | Redundante |
| `public/images/background-img-sm.webp` | Copia móvil en `public/`. Preferir `src/assets/`. | Redundante |
| `public/images/background-img.png` | Original PNG sin optimizar, 2MB. No en repositorio. | Fuera del repo (untracked) |
| `public/design/mockup_burbujas_de_luz1.webp` | Design board completo (paleta, tipografía, componentes, wireframes). 91KB. | Vigente |
| `public/design/mockup_burbujas_de_luz1.png` | Fuente PNG del design board (actualizada). Preferir `.webp` en docs. | Vigente |
| `public/design/mockup_burbujas_de_luz2.webp` / `.png` | Vista a pantalla completa (retirada; consolidada en el board 1). | Retirada |
| `public/design/*.webp` (referencias hero, board, responsive) | Referencias de diseño originales | Ver D-019 |
| `public/music/Ropa Limpia-web.mp3` | Pista ambiental lista para web. 264KB, 45s, mono 48kbps. | Vigente |
| `public/music/Ropa Limpia.mp3` | Original, 2,5MB. No en repositorio. | Fuera del repo (untracked) |

El fondo web tiene dos variantes comprometidas. `SPEC-001` debe servirlas desde `src/`
vía `astro:assets` en lugar de referenciarlas en crudo desde `public/`, para que Astro
emita las variantes responsive y gestione el caché correctamente.

La pista ambiental está dentro del límite de 400 KB (D-021 / [`SPEC-002`](./specs/002-audio.md)).
Los derechos de uso siguen pendientes de confirmar antes de publicar.

### Uso

| Regla | Valor |
|-------|-------|
| Ancho mínimo (desktop) | 132px |
| Ancho mínimo (móvil) | 104px |
| Espacio de respeto | ≥ 50% de la altura de la "b" minúscula, en los cuatro lados |
| Superficie sancionada | Blanco o casi blanco |
| Proporción | Bloqueada. Nunca deformar. |

Por debajo del ancho mínimo el detalle fino (burbujas pequeñas, contorno del wordmark) se
degrada. En ese caso hace falta una variante solo-wordmark, que **no existe todavía** y no
debe fabricarse recortando el maestro.

### Prohibiciones

- No recolorear, rotar ni invertir.
- No aplicar `box-shadow`, `filter: drop-shadow` ni resplandor. Un `glow` sobre el logo infringe la dirección artística.
- No reintroducir un fondo horneado ni encerrarlo en una caja de color.
- No estirar ni comprimir.
- **No colocar burbujas decorativas junto al logo.** El logo ya contiene burbujas; sumar más produce ruido. Ver §Bubbles.
- No usar el logo como favicon sin simplificar: a 32px es ilegible.
- **No usarlo como imagen de Open Graph.** Varias plataformas componen la transparencia sobre negro; hace falta una variante con fondo sólido.
- No rehacer el eslogan como bitmap: "Lavandería Autoservicio" se compone en **texto real** con tokens tipográficos, para que sea seleccionable, traducible y nítido.

### Presupuesto de saturación

El logo es el objeto más saturado de la marca y **consume el presupuesto de saturación de
la página**. Todo lo que lo rodea se mantiene pastel. Regla completa y su razonamiento en
[`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) §9.

---

## Checklist de componente nuevo

1. ¿Usa solo tokens semánticos, sin hex literal?
2. ¿Cumple los mínimos de contraste de la tabla normativa, **medidos**?
3. ¿Funciona a 320px y a 1440px?
4. ¿Objetivos táctiles de 44px como mínimo?
5. ¿Navegable por teclado, con foco visible?
6. ¿Radio y sombra dentro de la escala?
7. ¿Movimiento con los tokens de duración y easing, y anulado por `prefers-reduced-motion`?
8. ¿Existe ya un componente reutilizable que resuelva esto?
9. ¿Coherente con la dirección light-first, sin superficies oscuras?
10. ¿Alguna burbuja interfiere con texto o control?

---

*Última actualización: agosto 2026*
