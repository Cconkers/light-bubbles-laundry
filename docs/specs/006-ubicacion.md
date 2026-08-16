# SPEC-006 — Ubicación y mapa (home)

| | |
|---|---|
| **ID** | SPEC-006 |
| **Título** | Sección Contacto y ubicación con mapa en la homepage |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | `/` — ancla `#contacto` · componente nuevo [`src/components/sections/Location.astro`](../../src/components/sections/Location.astro) (nombre orientativo) |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

> **Depende de [`SPEC-001`](./001-home.md)** (home y ancla Header “Contacto”).
> Convive con el footer: esta SPEC **mueve** el ancla `#contacto` a la sección nueva.

---

## Objective

Resolver las preguntas **¿dónde está?** y **¿cómo llego?** — segundo goal de usuario en
[`PRODUCT.md`](../PRODUCT.md) — con un bloque de home alineado al mockup §7 (*Contacto y
ubicación*), usando los datos de negocio **ya confirmados** (dirección, teléfono, email,
horario) y un mapa embebido ligero, sin SDK ni dependencias nuevas (D-004).

Hoy la ubicación vive solo en el footer (`id="contacto"`), sin mapa ni CTA “Cómo llegar”.
Esta SPEC añade la sección visual del mockup y deja el footer como cierre de marca, no como
único destino del ancla de contacto.

### Alcance

Incluye:

- Nueva sección en la homepage, **después del CTA final y antes del footer**
- Ancla canónica `id="contacto"` en esa sección (el Header “Contacto” sigue apuntando ahí)
- Bloque de datos: dirección, horario, teléfono, email — desde
  [`src/data/content.ts`](../../src/data/content.ts) (`contact`)
- Mapa embebido: **un** `<iframe>` de Google Maps (búsqueda/place de la dirección),
  `loading="lazy"`, sin script/SDK ni API key
- Enlace externo siempre visible: “Cómo llegar” / “Abrir en Google Maps”
- Tipografía `.type-*` / tokens; superficie light-first (D-005)
- Cero dependencias npm nuevas (D-004)
- Registrar **D-024** en [`DECISIONS.md`](../DECISIONS.md) — **ya Accepted** en la entrega
  documental de esta SPEC; la implementación solo debe respetarla
- Notas aditivas en [`001-home.md`](./001-home.md) y [`PRODUCT.md`](../PRODUCT.md)
  (drift Rule 12)

Excluye:

- Página aparte `/ubicacion` o `/contacto`
- Foto del local (no hay activo de local confirmado; el mockup la muestra — SPEC futura)
- FAQ, Sobre nosotros
- Formularios de contacto o backend (D-011)
- SDK de Google Maps, Mapbox, Leaflet u otra librería
- Carga de mapa vía JS obligatorio; “click to load” opcional **no** es requisito de esta SPEC
- Cambiar Hero, Tarifas, Servicios o Audio (SPEC-002 sigue en Draft aparte)
- Inventar coordenadas distintas de la dirección confirmada

---

## User

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| **Sin lavadora / con prisa** | Dirección y horario sin cazar el footer | Sección dedicada; datos arriba del mapa en móvil |
| **Estancia temporal / primerizo** | Cómo llegar desde el móvil | CTA “Cómo llegar” abre Maps externo; iframe como apoyo visual |
| **Micro-negocio / gran volumen** | Confirmar que el local es alcanzable | Dirección completa + mapa de la zona |
| **Usuario de teclado / lector** | Contacto usable sin mapa | Datos y enlaces `tel:` / `mailto:` / Maps en HTML; iframe con `title` |

---

## Visual references

- [`public/design/mockup_burbujas_de_luz1.webp`](../../public/design/mockup_burbujas_de_luz1.webp)
  — **fuente de verdad UI** §7 *Contacto y ubicación*: copy de apoyo, datos con iconos a la
  izquierda, mapa embebido a la derecha (en desktop); foto del local debajo del mapa en el
  mockup → **fuera de alcance** hasta tener activo.
- [`public/design/responsive-reference.webp`](../../public/design/responsive-reference.webp)
  — el bloque cierra el contenido antes del footer.
- [`public/design/design-board.webp`](../../public/design/design-board.webp) — tokens, iconos.

Los textos del mockup (“Calle Innovación…”, teléfono maqueta) **no** se usan: mandan los
datos de `contact` en `content.ts`. Los hex del mockup no se copian (D-006).

---

## Datos: confirmados vs candidatos

### Confirmado (usar tal cual)

| Campo | Valor | Uso |
|-------|--------|-----|
| Dirección | `C. Virgen de la Cinta, 41011 Sevilla` | Texto + query del iframe/enlace Maps |
| Teléfono | `629 517 805` | `tel:` + visible |
| WhatsApp | `34629517805` | Opcional en esta sección; ya en CTA final |
| Email | `viedmaelectric@gmail.com` | `mailto:` + visible |
| Horario | `Lunes a domingo, de 7:00 h a 23:00 h` | Texto |

No usar formato `[PLACEHOLDER: …]` para estos campos en la sección (ya no aplica D-010 aquí).

### Copy candidato (ajustable sin SPEC nueva si no inventa hechos)

| Elemento | Texto candidato |
|----------|-----------------|
| `h2` | Estamos aquí para ayudarte |
| Apoyo | Encuéntranos en Sevilla. Ven cuando quieras dentro del horario. |
| CTA mapa | Cómo llegar |
| Enlace iframe | Abrir en Google Maps |

---

## Information Architecture

Orden de la home tras esta SPEC:

Hero → Benefits → Servicios → Tarifas → Cómo funciona → CTA final → **Ubicación / Contacto** → Footer

### 1. Sección Ubicación / Contacto

- `id="contacto"` — **único** ancla canónica para Header “Contacto” y CTAs que apunten a
  contacto (p. ej. franja de Servicios → `#contacto`)
- Landmark: `<section aria-labelledby="location-heading">` (o id equivalente estable)
- `h2` — copy candidato arriba
- Apoyo corto — una frase; sin lista de precios ni FAQ
- **Columna / bloque de datos** (iconos existentes `map-pin`, `clock`, `phone`, `mail`):
  dirección, horario, teléfono (enlace), email (enlace)
- **Columna / bloque mapa:**
  - `<iframe>` Google Maps embed (búsqueda o place de la dirección confirmada)
  - `loading="lazy"`
  - `title` descriptivo (p. ej. “Mapa de Burbujas de Luz en C. Virgen de la Cinta, Sevilla”)
  - `referrerpolicy` / `allow` mínimos necesarios; sin `allow-scripts` de más si el proveedor
    lo permite — seguir el embed estándar de Google Maps
  - Contenedor con radio `--radius-card` o `--radius-lg`, borde `--color-border`, sin sombra
    pesada
- Enlace textual **fuera** del iframe (y/o bajo el mapa): “Cómo llegar” → URL de Google Maps
  con la dirección (abre en pestaña nueva, `rel="noopener noreferrer"`)
- Superficie de sección clara (`bg-background` o `bg-background-alt`); sin bloque oscuro
  (D-005). Atmósfera D-022 **opcional** y suave; no obligatoria si compite con Tarifas

### 2. Footer tras esta SPEC

- **Quitar** `id="contacto"` del `<footer>` (el ancla vive en la sección nueva)
- Puede seguir mostrando un resumen de dirección/teléfono (recomendado: sí, para quien
  scrollea al final) **sin** duplicar el iframe
- Copyright y marca sin cambio de alcance

### 3. Cableado de anclas

| Origen | Destino |
|--------|---------|
| Header “Contacto” | `#contacto` (sin cambiar la etiqueta del nav) |
| Franja Servicios “Contáctanos” | `#contacto` |
| CTA final tel / WhatsApp | Sin cambio (enlaces directos) |

No hace falta ítem de nav “Mapa” o “Ubicación” en esta SPEC.

---

## Responsive requirements

Reglas generales en [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Responsive.

### Mobile (< 768px)

- 1 columna: **datos arriba, mapa abajo**
- Altura mínima del mapa ~240px; ancho 100% del content box
- Enlaces y CTA con objetivo táctil ≥ 44px
- Verificar a **320px**: sin scroll horizontal

### Tablet (768–1023px)

- Preferir 2 columnas si cabe; si no, mantener stack con mapa más alto (~280–320px)

### Desktop (≥ 1024px)

- **2 columnas** dentro de `--content-max`: datos \| mapa (como mockup §7)
- Mapa con altura ~320–400px, alineado visualmente al bloque de datos

---

## Accessibility

- Un solo `h1` en la página (Hero); esta sección: `h2` (+ `h3` solo si se agrupan subbloques)
- Datos en lista o definición semántica; iconos decorativos `aria-hidden="true"`
- Enlaces con nombre accesible (p. ej. “Llamar: 629 517 805”, “Abrir ubicación en Google Maps”)
- Iframe con `title`; no es la única vía a la dirección (texto + enlace externos)
- Contraste AA: `--color-text` / `--color-text-secondary` (D-007); ningún tono 500 de marca
  como cuerpo
- Teclado + `focus-visible:shadow-focus` en todos los enlaces/botones
- `prefers-reduced-motion`: solo afecta a `data-reveal` existente; el mapa no anima
- Zoom 200% sin pérdida de dirección ni del enlace “Cómo llegar”

---

## Performance

- Sin dependencias npm nuevas (D-004)
- Sin imagen nueva de local
- Un solo iframe de terceros, `loading="lazy"` (no debe competir con LCP del Hero)
- Página usable **sin** JavaScript: datos y enlace Maps en HTML estático; el iframe es
  refuerzo
- No importar `src/scripts/3d/` (D-003)
- No cargar el SDK de Maps ni scripts adicionales en el `<head>`

---

## SEO

- Dirección, horario y teléfono en HTML estático (base para LocalBusiness)
- `schema.org` LocalBusiness: [`SPEC-010`](./010-seo-local.md) (no en esta SPEC)
- No cambiar `<title>` / description de la página salvo que se decida en otra SPEC
- El iframe no sustituye el texto de la dirección para indexación

---

## Acceptance Criteria

Todos comprobables. Las casillas se marcan al implementar, no al escribir esta SPEC.

### Build y tipos

- [x] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [x] `npm run build` completa sin errores.

### Estructura y contenido

- [x] Existe sección de ubicación **entre** CTA final y Footer.
- [x] `id="contacto"` está en esa sección; el `<footer>` **ya no** lleva `id="contacto"`.
- [x] Header “Contacto” y la franja de Servicios siguen resolviendo a `#contacto` sin 404.
- [x] Dirección, horario, teléfono y email coinciden con `contact` en `content.ts` (sin
      placeholders).
- [x] Hay un iframe de Google Maps con `loading="lazy"` y `title` accesible.
- [x] Hay un enlace externo “Cómo llegar” / “Abrir en Google Maps” siempre visible.
- [x] D-024 registrada en [`DECISIONS.md`](../DECISIONS.md) (Accepted).

### Visual

- [x] Ninguna superficie oscura a ancho completo (D-005).
- [x] Solo tokens / `color-mix` de tokens; sin hex de marca arbitrarios (D-006).
- [x] Composición alineada al mockup §7 (datos + mapa); **sin** foto del local.
- [x] Tipografía `.type-h2` / `.type-body` / `.type-small` (o equivalentes `--text-*`).

### Responsive

- [x] 1 columna &lt; 768px (datos → mapa); 2 columnas en desktop.
- [x] Correcto a 320px, 375px, 768px, 1024px y 1440px.
- [x] Sin scroll horizontal en ningún ancho.

### Accesibilidad

- [x] Jerarquía de encabezados sin saltos.
- [x] Contraste medido conforme a Contrast rules.
- [x] Iconos decorativos `aria-hidden`.
- [x] Teclado + foco visible; iframe no es la única vía a la ubicación.

### Rendimiento

- [x] Sin dependencias npm nuevas.
- [x] Sin SDK de mapas; un solo iframe lazy.
- [x] Sin JS adicional obligatorio.

### Documentación

- [x] Nota aditiva en [`001-home.md`](./001-home.md): ancla `#contacto` = sección ubicación
      (SPEC-006).
- [x] Tabla “Datos pendientes” en [`PRODUCT.md`](../PRODUCT.md) actualizada para
      dirección, teléfono, email y horario (confirmados).

---

## D-024 (registrada)

**D-024** está **Accepted** en [`DECISIONS.md`](../DECISIONS.md): un único iframe de mapa
de terceros (lazy), sin SDK ni API key, con enlace externo de respaldo. La implementación
de esta SPEC debe cumplirla; no hace falta volver a proponerla.

---

## Notas de implementación

1. Respetar **D-024** (ya en [`DECISIONS.md`](../DECISIONS.md)).
2. Extender `content.ts` si hace falta (`locationIntro`, URL de Maps) — no hardcodear la
   dirección en el componente.
3. Crear `Location.astro` (o nombre equivalente) → montar en
   [`src/pages/index.astro`](../../src/pages/index.astro) entre `CtaFinal` y `Footer`.
4. Quitar `id="contacto"` de [`Footer.astro`](../../src/components/sections/Footer.astro).
5. Reutilizar `Icon`, `Button` si el CTA es botón; tokens tipográficos existentes.
6. URL del embed: construir a partir de la dirección confirmada (encodeURIComponent); no
   inventar place ID distinto sin verificación.
7. Corrección aditiva Rule 12:
   - [`001-home.md`](./001-home.md) — footer ya no es el ancla; enlace a SPEC-006.
   - [`PRODUCT.md`](../PRODUCT.md) — marcar dirección / teléfono / WhatsApp / email /
     horario como confirmados.
8. No tocar SPEC-002 (audio), FAQ ni Sobre nosotros.
9. Verificar: `npm run check` y `npm run build`.

### Drift detectado (Rule 12)

- SPEC-001 §7 Footer declara `id="contacto"` en el footer y placeholders de contacto.
  **Esta SPEC prevalece** para el ancla y los datos confirmados.
- `PRODUCT.md` — Datos pendientes aún lista dirección/teléfono/email/horario como “Sin
  confirmar”; el código ya los tiene. Corregir al implementar.

---

*Última actualización: agosto 2026*
