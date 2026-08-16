# SPEC-001 — Homepage

| | |
|---|---|
| **ID** | SPEC-001 |
| **Título** | Homepage (`/`) |
| **Estado** | Implemented |
| **Fecha** | agosto 2026 |
| **Ruta** | `/` — [`src/pages/index.astro`](../../src/pages/index.astro) |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

La home es el único punto de entrada del negocio en la web. Debe responder, en orden y sin
que el usuario tenga que buscar, las cuatro preguntas que bloquean una primera visita:
**cuánto cuesta, dónde está, cuándo abre y cómo funciona**.

Problema concreto que resuelve: alguien que nunca ha usado una lavandería de autoservicio no
sabe qué esperar, y esa incertidumbre es motivo suficiente para no venir. La página debe
eliminarla.

Objetivo secundario: transmitir limpieza y cuidado. En un negocio donde se deja ropa propia
en una máquina ajena, la percepción de higiene es un argumento comercial, y se comunica
visualmente antes que con texto.

### Alcance

Incluye:

- Migración del sistema de tokens de diseño (tarea 0, ver D-015)
- Header, Hero, Benefits, Services, How it works, CTA final y Footer
- Consolidación del logo mediante `astro:assets`
- Decoración de burbujas ligera en CSS/SVG
- Revelados por scroll con `IntersectionObserver`
- SEO básico y metadatos
- Responsive en los tres tiers

Excluye:

- Páginas de servicios, tarifas, FAQ y contacto (SPECs futuras). Los enlaces de navegación a esas rutas quedan preparados pero **no activos**.
- Cualquier capa 3D o canvas (D-003)
- Formularios con servidor, reservas o pagos (D-011)
- Datos de negocio reales (D-010)
- Favicon definitivo y variante de logo solo-wordmark (activos pendientes)

---

## User

Perfiles definidos en [`PRODUCT.md`](../PRODUCT.md) — Target Users. Los que condicionan
esta página:

| Perfil | Qué necesita de la home | Implicación de diseño |
|--------|-------------------------|-----------------------|
| **Primerizo** | Entender el proceso completo | "How it works" es una sección de primer nivel, no una nota al pie |
| **Sensible al precio** | Precio por tamaño de carga | El CTA primario lleva a tarifas |
| **Con prisa** | Horario y ubicación ya | Visibles sin scroll profundo, y en el footer |
| **Colada de volumen** | Saber si su carga cabe | Capacidades mencionadas en Services |

Contexto de uso dominante: **móvil, en la calle o en casa, decidiendo si salir**. Se diseña
para ese caso primero (D-008).

---

## Visual references

- [`/public/design/hero-reference.webp`](../../public/design/hero-reference.webp) — espacio, iluminación, composición y ambiente del hero. **La mitad izquierda y central está deliberadamente vacía: ahí va la UI.**
- [`/public/design/design-board.webp`](../../public/design/design-board.webp) — paleta, tipografía, formas, iconografía, cards, botones, gradientes.
- [`/public/design/responsive-reference.webp`](../../public/design/responsive-reference.webp) — layout y jerarquía visual entre vistas.

Son **referencia**, no assets de UI, y no deben usarse como fondo ni contenido (D-019). El
contenido comercial que muestran es maqueta, no dato real (D-010).

---

## Tarea 0 — Migración de tokens de diseño

**Prerrequisito. Se ejecuta antes de maquetar** (D-015).

Estado actual de [`src/styles/global.css`](../../src/styles/global.css): declara
`--font-display: Georgia serif`, `bubble-blue-400/600`, `foam-white` y
`caramel-gold-400/600`, que contradicen el design board.

1. Sustituir el bloque `@theme` por el sistema de dos capas definido en [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Color System: primitivos (`--lb-*`) y tokens semánticos (`--color-primary`, `--color-surface`, `--color-text`, ...).
2. Añadir las escalas de espaciado, radio y sombra.
3. Configurar **Poppins** autoalojada, con `font-display: swap` y stack de fallback. Preferir la API de fuentes nativa de Astro si está estable en 7.2.2; en caso contrario `@fontsource-variable/poppins`. **Sin CDN de terceros.**
4. Añadir el bloque de `prefers-reduced-motion` de [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Motion.
5. Conservar `.skip-link` y `scroll-behavior`.
6. **No crear `tailwind.config.mjs`** (D-013).

Corolario: al terminar, ningún componente puede usar clases de color por defecto de
Tailwind (`text-sky-700`) ni valores arbitrarios (`bg-black/40`). La implementación actual de
`index.astro` usa ambos y debe quedar limpia.

---

## Information Architecture

Orden vertical. Cada sección responde una pregunta y solo una.

### 1. Header

Fijo en la parte superior, sobre superficie clara translúcida.

- **Logo** — [`src/assets/brand/logo.webp`](../../src/assets/brand/logo.webp) vía `<Image>` de `astro:assets`, enlazado a `/`. Alto de 40-48px respetando el ancho mínimo de 104px en móvil (D-016).
  > **Corrige un fallo existente.** `index.astro` línea 29 apunta a `/images/logo.png`, archivo que ya se borró, de modo que hoy el logo de la cabecera devuelve 404. Al migrar a `<Image>` desaparece la referencia rota.
- **Navegación** — Inicio, Servicios, Cómo funciona, Tarifas, Preguntas, Contacto. Las rutas aún no existen: en esta SPEC apuntan a anclas de la propia página cuando hay sección equivalente (`#como-funciona`, `#servicios`). **Tarifas** apunta a `#tarifas` (véase [`SPEC-003`](./003-tarifas.md)). `Preguntas` y `Contacto` quedan apuntando a `#cta` / `#contacto`, nunca a un 404.
- **Píldora de ubicación** — "Sevilla", decorativa e informativa.
- **Móvil** — navegación colapsada en menú accesible: operable por teclado, `aria-expanded`, foco atrapado si es overlay, cierre con `Escape`.
- Superficie clara con `backdrop-filter`. **Nunca oscura** (D-005).

### 2. Hero

Primera pantalla. Es la sección que más puede degradar el resultado si se recarga.

- **H1** — único de la página. Copy candidato: "Tu colada, más fácil, más tiempo para ti". Marcar como copy pendiente de confirmación.
- **Subtítulo** — una o dos líneas describiendo el servicio.
- **CTA primario** — "Ver tarifas" → `#tarifas` (D-011, `PRODUCT.md` — Primary CTA; ancla definida en [`SPEC-003`](./003-tarifas.md)).
- **CTA secundario** — "Cómo funciona", ancla a §4.
- **Fondo** — lavado de color con `--gradient-hero` y formas orgánicas, o la fotografía del local. Debe respetar el vacío de la referencia y **no** llevar velo oscuro; la legibilidad se resuelve con superficie clara translúcida (`VISUAL_DIRECTION.md` §5).
  > Si se usa fotografía, los activos disponibles son `public/images/background-img.webp` (1536x1024, 146KB) y `public/images/background-img-sm.webp` (768x512, 46KB). **No referirlos en crudo desde `public/`**: deben moverse a `src/` para que pasen por `astro:assets`, que emite las variantes responsive adecuadas y gestiona el caché. Sin ese paso el LCP seguiría siendo subóptimo.
- **Logo de marca** — puede aparecer a mayor tamaño como elemento gráfico. Sin burbujas decorativas adyacentes (D-017).
- **Móvil:** H1 y CTA primario visibles **sin scroll**.

### 3. Benefits

Cuatro ventajas breves. En la referencia son chips o tarjetas con icono.

Contenido derivado de la referencia (icono + etiqueta + apoyo corto):

1. Fácil de usar
2. Ecológico y eficiente
3. Ahorra tiempo
4. Cuidamos tu ropa

- Iconos lineales de 24px en contenedor circular `*-subtle` de 40-48px (`DESIGN_SYSTEM.md` — Icons).
- Un color de acento distinto por ventaja, en superficie pequeña (D-017).
- Layout: 1 columna en móvil, 2 en tablet, 4 en desktop.
- Iconos decorativos con `aria-hidden="true"`; la etiqueta textual transmite el significado.

### 4. Services

Qué se ofrece. Responde "¿cabe mi colada?" y "¿qué puedo hacer aquí?".

> **SPEC-005.** El alineamiento al mockup §2 (retícula 2×2, “Ver más” a anclas existentes,
> franja de contacto, placeholders D-010) está en [`SPEC-005`](./005-servicios.md). Esta
> sección de SPEC-001 conserva la IA; donde discrepen, manda SPEC-005.

Cuatro tarjetas, según la referencia:

| Servicio | Contenido |
|----------|-----------|
| Lavado | `[PLACEHOLDER: capacidades de lavadora disponibles]` |
| Secado | `[PLACEHOLDER: capacidades de secadora y temperaturas]` |
| Productos | `[PLACEHOLDER: detergentes y suavizantes disponibles]` |
| Extra | `[PLACEHOLDER: servicios adicionales]` |

- Componente `Card` reutilizable (`DESIGN_SYSTEM.md` — Cards), altura homogénea en la cuadrícula.
- Si la tarjeta entera es enlazable, el elemento raíz es `<a>`; sin controles anidados.
- Todo dato de capacidad o precio es placeholder visible (D-010).
- `id="servicios"` para el ancla del header.

### 5. How it works

La sección crítica para el perfil primerizo.

Pasos numerados, según la referencia:

1. **Elige la máquina** — `[PLACEHOLDER: detalle del paso]`
2. **Añade los productos** — `[PLACEHOLDER: detalle del paso]`
3. **Inicia el ciclo** — `[PLACEHOLDER: método de pago aceptado]`
4. **Disfruta tu tiempo** — `[PLACEHOLDER: duración aproximada del ciclo]`

- Marcado como lista ordenada `<ol>`: la secuencia es semántica, no solo visual.
- Número en círculo con color de acento distinto por paso.
- Layout: vertical en móvil, 2x2 en tablet, 4 columnas en desktop.
- `id="como-funciona"` para el ancla del header.
- El paso de pago es el de mayor incertidumbre para el usuario: no inventar método (D-010).

### 6. CTA final

Cierre orientado a la visita física.

- Titular breve reforzando la acción.
- CTA primario "Ver tarifas" (coherente con el hero).
- CTA de apoyo: contacto directo mediante `tel:` y WhatsApp, ambos con `[PLACEHOLDER: teléfono]`.
- Fondo con `--gradient-wash` o superficie `*-subtle`. **Sin bloque oscuro** (D-005).

### 7. Footer

Información práctica y cierre de marca.

- Logo (tamaño reducido, ancho mínimo respetado).
- **Dirección** — `[PLACEHOLDER: dirección postal completa]`
- **Horario** — `[PLACEHOLDER: horario de apertura]`
- **Teléfono** — `[PLACEHOLDER: teléfono]`, enlace `tel:`
- **Email** — `[PLACEHOLDER: email]`, enlace `mailto:`
- **Redes** — `[PLACEHOLDER: perfiles sociales]`. Si no hay dato confirmado, **omitir el bloque** en lugar de dejar iconos que no llevan a ningún sitio.
- Aviso de copyright con año dinámico.
- Superficie clara o `--color-background-alt`. **No `bg-black/40`**, como en la implementación actual (D-005).

---

## Responsive requirements

Reglas completas en [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Responsive. Específico de esta página:

### Mobile (< 768px)

- Una columna en todas las secciones.
- H1 y CTA primario visibles sin scroll.
- Navegación colapsada, accesible por teclado.
- Máximo **6 burbujas** en viewport (D-009).
- Objetivos táctiles de 44x44px con 8px de separación.
- Ritmo de sección `--space-16`.
- Verificar a **320px**: sin scroll horizontal ni desbordamientos.
- Sin efectos de hover; estados `:active` visibles.

### Tablet (768-1023px)

- Benefits en 2 columnas; Services en 2; How it works en 2x2.
- Navegación horizontal si los enlaces caben sin truncarse.
- Máximo **10 burbujas**.
- Ritmo de sección `--space-20`.

### Desktop (≥ 1024px)

- Benefits y How it works en 4 columnas; Services en 2 o 4.
- Contenido limitado a `--content-max` (72rem), centrado.
- Máximo **14 burbujas**.
- Ritmo de sección `--space-24`.
- Hover habilitado.
- Por encima de 1440px crece el aire, no el tamaño del texto.

---

## Accessibility

- **Skip link** como primer elemento focusable, visible al recibir foco. Ya existe en `global.css`.
- **Landmarks:** `<header>`, `<main>`, `<footer>`, y `<section aria-labelledby="...">` en cada sección.
- **Un solo `<h1>`**; jerarquía de encabezados sin saltos de nivel.
- **Contraste** según la tabla normativa de [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Contrast rules, **medido y no estimado**, especialmente sobre gradientes (D-007).
- **Navegación completa por teclado:** todos los CTA, enlaces y el menú móvil alcanzables y operables. Orden de foco lógico.
- **Foco visible** en todo elemento interactivo, con `--shadow-focus`. Nunca `outline: none` sin sustituto.
- **Menú móvil:** `aria-expanded`, `aria-controls`, cierre con `Escape`, foco atrapado si es overlay y devuelto al disparador al cerrar.
- **Burbujas:** `aria-hidden="true"` y `pointer-events: none`, fuera del orden de tabulación (D-009).
- **Imágenes:** decorativas con `alt=""`; el logo con alt descriptivo. Ninguna información existe solo en una imagen.
- **Iconos:** decorativos con `aria-hidden="true"`; informativos con etiqueta accesible.
- **`prefers-reduced-motion`:** burbujas desactivadas y revelados por scroll en estado final visible.
- **Objetivos táctiles** de 44x44px mínimo.
- **Zoom** hasta 200% sin pérdida de contenido ni funcionalidad.
- Texto de lectura nunca por debajo de 16px.

---

## Performance

Objetivos heredados de [`PLANNING.md`](../../PLANNING.md) §3.6:

| Métrica | Objetivo |
|---------|----------|
| LCP | < 2.5s (objetivo final < 1.8s) |
| TBT | < 200ms (objetivo final < 100ms) |
| CLS | < 0.1 (objetivo final < 0.05) |

Requisitos concretos:

- **Cero dependencias nuevas** salvo la fuente Poppins (D-004). Sin GSAP, sin Howler, sin librerías de animación o iconos.
- **Sin canvas ni Three.js** en esta página (D-003). No importar nada de `src/scripts/3d/`.
- Todas las imágenes vía `astro:assets` (`<Image>`), con `width`/`height` o `aspect-ratio` explícitos para evitar CLS.
- El logo del header es LCP probable: `loading="eager"` y sin lazy.
- El resto de imágenes con `loading="lazy"` y `decoding="async"`.
- Burbujas y formas orgánicas con CSS/SVG, animadas solo con `transform` y `opacity` (propiedades compuestas). **Sin animar** `top`, `left`, `width` ni `height`.
- `IntersectionObserver` desconectado tras disparar (D-018).
- JavaScript mínimo: solo menú móvil y revelados por scroll. La página debe ser legible y navegable **sin** JS.
- Poppins autoalojada con `swap`, y solo los pesos usados (400, 500, 600, 700).

---

## SEO

Básico, suficiente para búsqueda local. El SEO completo es una SPEC futura.

- `<title>` único y descriptivo, con marca y ubicación. Máximo ~60 caracteres.
- `<meta name="description">` de 150-160 caracteres.
- `lang="es"` en `<html>` (ya presente).
- Un solo `<h1>` con la propuesta de valor.
- HTML semántico con jerarquía correcta de encabezados.
- URL canónica.
- Open Graph y Twitter Card: `og:title`, `og:description`, `og:image`, `og:type`, `og:locale` = `es_ES`.
  - **`og:image` no puede ser el logo transparente:** varias plataformas componen la transparencia sobre negro. Hace falta una variante con fondo sólido; si no existe todavía, marcar como `[PLACEHOLDER: imagen Open Graph 1200x630]` (D-016).
- Texto alternativo descriptivo en imágenes informativas.
- Todo contenido indexable en HTML, no generado por JS.

Fuera de alcance en esta SPEC: `schema.org` LocalBusiness, sitemap y `robots.txt`. Requieren
datos de negocio confirmados (D-010) y son SPEC propia.

---

## Acceptance Criteria

Verificables. Todos deben cumplirse.

### Build y tipos

- [ ] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [ ] `npm run build` completa sin errores.
- [ ] Sin errores ni warnings en la consola del navegador en carga y scroll.

### Tokens y sistema de diseño

- [ ] `global.css` contiene el sistema de dos capas (primitivos + semánticos) de `DESIGN_SYSTEM.md`.
- [ ] **No existe `tailwind.config.mjs`** ni ningún otro archivo de configuración de Tailwind.
- [ ] Ningún componente usa valores de color arbitrarios (`bg-[#...]`, `bg-black/40`).
- [ ] Ningún componente usa colores por defecto de Tailwind (`text-sky-700`, `text-slate-600`) para color de marca.
- [ ] Poppins se carga autoalojada, con `swap`, sin peticiones a CDN de terceros.

### Estructura y contenido

- [ ] Las siete secciones están presentes en el orden especificado.
- [ ] Existe exactamente un `<h1>`.
- [ ] Jerarquía de encabezados sin saltos de nivel (verificado con árbol de accesibilidad).
- [ ] `<header>`, `<main>` y `<footer>` presentes; cada sección con `aria-labelledby`.
- [ ] "How it works" usa `<ol>`.
- [ ] Todo dato de negocio sin confirmar aparece como `[PLACEHOLDER: ...]` visible. Ningún precio, dirección, teléfono, horario ni estadística inventados.
- [ ] Ningún enlace de navegación produce un 404.

### Visual

- [ ] Ninguna superficie oscura a ancho completo. No queda `bg-black/20` ni `bg-black/40`.
- [ ] Fondo dominante claro en todas las secciones.
- [ ] Como máximo un elemento saturado por zona visual.
- [ ] Sin burbujas decorativas adyacentes al logo.
- [ ] Ninguna burbuja se solapa con texto, botón o control.
- [ ] Densidad de burbujas dentro de los topes: ≤6 móvil, ≤10 tablet, ≤14 desktop.
- [ ] Radios y sombras dentro de las escalas definidas; ningún elemento de UI con esquina viva.
- [ ] Superposición de texto sobre imagen resuelta con superficie clara translúcida, no con velo oscuro.

### Responsive

- [ ] Correcto a 320px, 375px, 768px, 1024px, 1440px.
- [ ] Sin scroll horizontal en ningún ancho.
- [ ] En móvil, H1 y CTA primario visibles sin scroll.
- [ ] Objetivos táctiles ≥ 44x44px.
- [ ] Sin pérdida de contenido entre breakpoints.
- [ ] El logo no baja de 104px de ancho en móvil ni de 132px en desktop.

### Accesibilidad

- [ ] Skip link es el primer elemento focusable y se hace visible al enfocarlo.
- [ ] Todos los CTA e enlaces alcanzables y operables solo con teclado.
- [ ] Foco visible en todo elemento interactivo.
- [ ] Menú móvil: abre y cierra por teclado, `aria-expanded` correcto, cierra con `Escape`, devuelve el foco al disparador.
- [ ] Contraste **medido** conforme a la tabla normativa; texto de cuerpo ≥ 4.5:1.
- [ ] Burbujas con `aria-hidden="true"` y fuera del orden de tabulación.
- [ ] Con `prefers-reduced-motion: reduce`: sin animación de burbujas y todo el contenido visible.
- [ ] Zoom al 200% sin pérdida de contenido ni funcionalidad.
- [ ] Página legible y navegable con JavaScript desactivado.

### Assets

- [ ] El logo se sirve mediante `<Image>` de `astro:assets` desde `src/assets/brand/logo.webp`.
- [ ] La referencia rota a `/images/logo.png` ha desaparecido de `index.astro`; ninguna imagen devuelve 404.
- [ ] `src/assets/images/logo.png` eliminado (la copia de `public/images/` ya no existe).
- [ ] **Ningún activo con marca de agua permanece en el repositorio.**
- [ ] El logo servido es un WebP optimizado y dimensionado, no el maestro completo.
- [ ] Las tres referencias de `public/design/` siguen presentes e intactas (D-019).
- [ ] Los archivos de `src/scripts/3d/` y `BubbleCanvas.astro` siguen presentes y sin importar desde ningún sitio (D-003).

### Rendimiento

- [ ] Sin dependencias nuevas más allá de la fuente.
- [ ] Nada importado desde `src/scripts/3d/`.
- [ ] Todas las imágenes con dimensiones o `aspect-ratio` explícitos.
- [ ] Animaciones limitadas a `transform` y `opacity`.
- [ ] `IntersectionObserver` desconectado tras disparar.
- [ ] CLS < 0.1 medido en local.

### SEO

- [ ] `<title>` y `<meta description>` únicos y dentro de longitud.
- [ ] URL canónica presente.
- [ ] Etiquetas Open Graph presentes; `og:image` no es el logo transparente.
- [ ] Todo el contenido presente en el HTML servido.

---

## Notas de implementación

- **Reutilizar antes de crear** (Rule 5). Extraer `Button`, `Card`, `SectionHeading` e `Icon` como componentes compartidos: los usarán las SPECs siguientes.
- Estructura sugerida según [`PLANNING.md`](../../PLANNING.md) §2: secciones en `src/components/sections/`, primitivas en `src/components/ui/`.
- El contenido en placeholder conviene centralizarlo en un único módulo de datos, para que sustituirlo cuando el negocio confirme sea una sola edición y no una búsqueda por todo el código.
- No modificar `src/scripts/3d/` ni `BubbleCanvas.astro`: están aparcados a propósito (D-003).
- Si durante la implementación surge una decisión arquitectónica, de producto o de diseño global, proponer una entrada nueva en [`DECISIONS.md`](../DECISIONS.md) (Rule 14).

---

*Última actualización: agosto 2026*
