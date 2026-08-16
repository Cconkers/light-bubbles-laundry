# SPEC-009 — Audio ambiental (implementación web)

| | |
|---|---|
| **ID** | SPEC-009 |
| **Título** | Implementar audio ambiental conforme a políticas web y SPEC-002 |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | Layout + control fijo · [`src/components/ui/AmbientAudio.astro`](../../src/components/ui/AmbientAudio.astro) · [`src/scripts/ambient-audio.ts`](../../src/scripts/ambient-audio.ts) |

> **Leer antes:** [`002-audio.md`](./002-audio.md), D-021, D-004, D-009,
> [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md). Protocolo en [`AGENTS.md`](../../AGENTS.md).

> **Implementa y cierra** [`SPEC-002`](./002-audio.md). Donde 009 detalle normativa web
> adicional, **prevalece 009**.

---

## Objective

Activar la música ambiental opcional de marca con **cero autoplay**, carga diferida,
control accesible y pista optimizada para web — alineado a políticas de navegadores
(Chrome/Safari/Firefox Autoplay Policy), WCAG 1.4.2 y buenas prácticas de media web.

### Alcance

Incluye:

- Todo lo de SPEC-002 (comportamiento, a11y, perf, UI del control)
- Refuerzo normativo explícito (tabla abajo)
- Volumen de reproducción conservador (~0.25–0.4) para fluidez ambiental
- Bucle con `loop`; fade corto opcional en play/pause solo con `volume` (sin Web Audio API)
- Clave `localStorage`: `lb-ambient-audio` (`on` | `off`)
- Iconos mute/play en `Icon.astro`
- Marcar SPEC-002 como `Done` al cerrar

Excluye:

- Howler u otras libs (D-004)
- SFX, audio en hover/foco, múltiples pistas
- Autoplay aunque `localStorage` diga `on`
- Preload / `link rel="preload"` de la pista
- Confirmar derechos legales de la pista Suno (sigue bloqueante para **publicación** comercial;
  la implementación UI puede avanzar). Procedencia documentada en [`002-audio.md`](./002-audio.md) §3.

---

## Normativa y políticas (no negociable)

| Norma / política | Cumplimiento en esta SPEC |
|------------------|---------------------------|
| **Autoplay Policy** (Chromium, WebKit, Gecko) | Sin `autoplay`. Play solo tras gesto de usuario (clic/tecla en el control). |
| **WCAG 2.2 — 1.4.2 Audio Control** | Nada suena solo > 3 s; control de pausa siempre disponible cuando suena. |
| **WCAG 2.2 — 2.1.1 Keyboard** | Control operable solo con teclado. |
| **WCAG 2.2 — 4.1.2 Name, Role, Value** | `button`, `aria-pressed`, `aria-label` por estado. |
| **Media best practice** | `preload="none"`; no descargar hasta el primer play; MP3 web &lt; 400 KB. |
| **Page Visibility** | Pausar en `document.hidden`; reanudar al visible solo si el usuario lo tenía activo **en esta sesión** (tras gesto previo). |
| **Sin cookies de terceros** | Solo `localStorage` de preferencia; no trackers de audio. |

---

## Calidad y fluidez de la pista

Activo: `public/music/Ropa Limpia-web.mp3` (ruta URL-encoded si hace falta por espacios).

| Requisito | Objetivo |
|-----------|----------|
| Tamaño | &lt; 400 KB (activo web actual ~264 KB) |
| Formato | MP3 (compatibilidad universal); sin segundo formato salvo bug medido |
| Volumen UI | `audio.volume` entre 0.28 y 0.4 (no 1.0) |
| Loop | Atributo `loop`; si hay click en el empalme, documentar; no crossfade Web Audio en MVP |
| Metadatos | Preferible sin artwork embebido (ya en versión -web) |
| Fluidez UX | Fade ~150–250 ms en play/pause vía rampa de `volume` (solo `transform`-equivalente de audio: property volume), respetando `prefers-reduced-motion` → corte instantáneo |

No reencodear en esta SPEC salvo que el archivo web falte o supere 400 KB.

---

## UI y comportamiento

Hereda SPEC-002 §1–2. Resumen:

- Botón fijo bottom-right, 44×44, pill, superficie clara, z-index bajo menú móvil
- Off por defecto; primer clic → set `src` si hace falta + `load` + `play()`
- Preferencia en `localStorage` no implica autoplay en visitas nuevas
- Sin JS: el control no aparece o no funciona; página 100% usable

---

## Acceptance Criteria

### Build

- [x] `npm run check` / `npm run build` OK

### Normativa / comportamiento

- [x] Carga inicial: silencio y **sin** request de red a la pista
- [x] Play solo tras gesto; pause/toggle correcto
- [x] Sin autoplay en reload aunque preferencia = on
- [x] Pause al ocultar pestaña; resume al volver solo si estaba playing en sesión
- [x] `preload="none"`; sin Howler; JS propio pequeño
- [x] Volumen &lt; 0.45; loop activo
- [x] WCAG: aria-pressed, aria-label, teclado, foco, sin sonido en hover/foco

### Visual

- [x] D-005 / D-006; no tapa CTA; no junto al logo

### Docs

- [x] SPEC-002 → `Done` con nota “implementada en SPEC-009”
- [x] Borrar `009.plan.md`

---

## Notas de implementación

1. `AmbientAudio.astro` en layout (`BaseLayout` o `index` + layout).
2. `src/scripts/ambient-audio.ts` importado con `<script>` diferido.
3. No tocar burbujas (D-009).
4. URL: `/music/Ropa%20Limpia-web.mp3` o renombrar a `ropa-limpia-web.mp3` (preferible sin espacios).

---

*Última actualización: agosto 2026*
