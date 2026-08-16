# SPEC-002 — Audio ambiental

| | |
|---|---|
| **ID** | SPEC-002 |
| **Título** | Audio ambiental con control accesible |
| **Estado** | `Done` — implementada en [`SPEC-009`](./009-audio.md) |
| **Fecha** | agosto 2026 |
| **Ruta** | Control global en [`src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro) |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

> **Depende de [`SPEC-001`](./001-home.md).** Necesita los tokens de diseño y las primitivas de
> botón que `SPEC-001` establece. No implementar antes.

---

## Objective

Añadir una capa de audio ambiental opcional que refuerce la sensación de calma y cuidado de la
marca, **sin comprometer accesibilidad, rendimiento ni la confianza del usuario**.

El audio es un adorno, no un canal de información. El éxito de esta SPEC se mide por que quien
no lo quiera **no pague ningún coste**: ni bytes descargados, ni sonido inesperado, ni un
control que estorbe.

Decisión de producto que la habilita y sus tres condiciones no negociables: D-021.

### Alcance

Incluye:

- Reproducción de una pista ambiental en bucle, mediante `<audio>` nativo
- Control persistente de reproducción y silencio, accesible
- Persistencia de la preferencia del usuario entre visitas
- Carga diferida del archivo de audio
- Optimización de la pista actual

Excluye:

- Efectos de sonido en interacciones (clic, hover, burbujas). Las burbujas siguen siendo silenciosas por D-009.
- Cualquier librería de audio. Se usa `<audio>` nativo; la regla de dependencias de D-004 sigue vigente.
- Audio ligado al scroll o a la posición del cursor
- Múltiples pistas, control de volumen granular o selector de temas
- Narración, subtítulos o transcripciones: la pista es música, no contiene voz ni información

---

## User

Ningún perfil de [`PRODUCT.md`](../PRODUCT.md) — Target Users **necesita** audio: nadie visita
una lavandería por su banda sonora. Por eso el diseño se orienta a no molestar antes que a
deleitar.

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| **Con prisa** | Nada del audio; no quiere distracción | Arranca apagado; el control no compite con los CTA |
| **En espacio compartido** | No emitir sonido sin querer | Sin autoplay, en absoluto |
| **Con datos limitados** | No descargar 2,5MB inútiles | Carga diferida obligatoria |
| **Usuario de lector de pantalla** | Que el audio no tape la síntesis de voz | Arranca apagado; estado del control anunciado |
| **Curioso / receptivo** | Un detalle agradable | Control descubrible, no intrusivo |

---

## Visual references

Ninguna referencia de [`public/design/`](../../public/design/) contempla un control de audio; es
un elemento nuevo. Su aspecto se deriva de la variante **Icon** de
[`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Buttons, sin inventar un lenguaje visual propio.

---

## Information Architecture

### 1. Control de audio

Único elemento de interfaz que introduce esta SPEC.

- **Posición:** fijo, esquina inferior derecha, por encima del contenido y por debajo de cualquier overlay o menú móvil.
- **Forma:** botón de icono de 44x44px mínimo, `--radius-pill`, superficie clara con `--shadow-sm`. Nunca superficie oscura (D-005).
- **Estados:** apagado (por defecto) y reproduciendo. El icono cambia; el color de fondo no salta a un tono saturado.
- **Etiqueta:** `aria-label` descriptivo, y `aria-pressed` para reflejar el estado.
- **Nunca solapado por burbujas** ni adyacente al logo (D-009, D-017).
- En móvil no debe tapar ningún CTA ni el footer; conviene comprobarlo a 320px.

### 2. Comportamiento

| Momento | Comportamiento |
|---------|----------------|
| Primera visita | Silencio. El archivo **no** se descarga. |
| Clic en el control | Se descarga la pista y comienza la reproducción en bucle |
| Clic de nuevo | Pausa. La preferencia se guarda. |
| Visita posterior con preferencia "activo" | **No** arranca solo: el control aparece indicando que el audio está disponible y esperando confirmación |
| Pestaña oculta | Se pausa; se reanuda al volver, si estaba activo |
| Fallo de red o de decodificación | El control se oculta o se deshabilita. Nunca un error visible. |

La cuarta fila es deliberada y merece justificación: recordar la preferencia **no** autoriza a
reproducir sin gesto en una carga nueva. Los navegadores bloquean el autoplay con sonido, y
depender de él daría un comportamiento inconsistente además de invasivo.

### 3. Pista de audio

Activo listo para web: `public/music/Ropa Limpia-web.mp3`, **264KB**, 45 s, mono 48 kbps,
sin metadatos ni artwork incrustado. Está dentro del límite de 400 KB.

El original (`public/music/Ropa Limpia.mp3`, 2,5MB) permanece fuera del repositorio.

- Procedencia: pista generada con **Suno**. Los términos de Suno (plan gratuito vs Pro/commercial)
  condicionan el uso comercial y la atribución; **no están verificados** en este proyecto.
- `[PLACEHOLDER: confirmar derechos de uso de la pista Suno antes de publicar]` — bloqueante
  comercial; la UI puede seguir en staging/preview.
- El bucle actual dura 45 s. Si el punto de empalme produce un corte audible, acortarlo
  hasta el compás anterior o utilizar un crossfade corto.
- Volumen normalizado y conservador: el audio ambiental se sitúa claramente por debajo del nivel de una voz.
- Formato: MP3 basta por compatibilidad universal. Añadir OGG/AAC solo si se mide un problema real.

---

## Responsive requirements

Reglas generales en [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Responsive.

### Mobile (< 768px)

- Objetivo táctil de 44x44px, con 8px de separación respecto a cualquier otro control.
- No debe tapar CTA, enlaces del footer ni el menú abierto.
- Verificar a 320px.

### Tablet (768-1023px)

- Sin cambios respecto a móvil más allá del margen.

### Desktop (≥ 1024px)

- Hover habilitado, con una sola señal de cambio (elevación **o** color, no ambas).
- El control no entra en la zona reservada al contenido dentro de `--content-max`.

---

## Accessibility

Es la parte crítica de esta SPEC. Un control de audio mal hecho es peor que no tener audio.

- **WCAG 1.4.2 (Audio Control).** Se cumple del modo más simple: nada suena automáticamente. Si en el futuro algo llegara a sonar solo más de 3 segundos, el mecanismo de pausa es obligatorio.
- **`aria-pressed`** refleja el estado real del botón, y se actualiza al cambiar.
- **`aria-label`** descriptivo, por ejemplo "Activar música ambiental" / "Silenciar música ambiental". El icono nunca es la única indicación.
- **Operable por teclado**, alcanzable en un orden de foco lógico, con foco visible mediante `--shadow-focus`.
- **Cambios de estado anunciados** a tecnologías de asistencia, sin recurrir a un `aria-live` ruidoso: basta con que `aria-pressed` y la etiqueta sean correctos.
- **El audio no transmite información.** Nada de lo que comunica el sitio depende de oírlo.
- **Sin sonido en respuesta a hover ni a foco**, jamás: provocaría disparos accidentales al navegar con teclado.
- El control **no** es el primer elemento focusable; el skip link mantiene esa posición.
- `prefers-reduced-motion` no gobierna el audio, pero si está activo tampoco se anima el icono del control.

---

## Performance

- **Carga diferida obligatoria.** Elemento `<audio>` con `preload="none"`. El archivo no se solicita hasta que el usuario pulsa el control.
- **Cero impacto en LCP y CLS.** El control se reserva su espacio desde el primer render, sin desplazar nada.
- **Cero dependencias.** `<audio>` nativo, sin Howler ni equivalentes (D-004, D-021).
- **Presupuesto de la pista: < 400KB** tras reencodear. Los 2,5MB actuales no son aceptables ni siquiera diferidos, porque penalizan a quien sí activa el audio.
- JavaScript del control por debajo de **2KB**, sin dependencias.
- Sin audio, la página sigue funcionando por completo; el control es una mejora progresiva y se oculta si el navegador no soporta la reproducción.

---

## SEO

No aplica. El audio no aporta contenido indexable y no debe afectar a los metadatos.

Única precaución: la pista **no** se referencia en el HTML de forma que un rastreador la
interprete como contenido principal, ni se precarga con `<link rel="preload">`.

---

## Acceptance Criteria

### Build y tipos

- [ ] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [ ] `npm run build` completa sin errores.
- [ ] Sin errores en la consola del navegador, ni al cargar ni al alternar el audio.

### Comportamiento

- [ ] En la primera carga no se reproduce ningún sonido.
- [ ] En la primera carga **la pista no se descarga**, verificado en la pestaña de red.
- [ ] El primer clic descarga y reproduce; el segundo pausa.
- [ ] La pista se repite en bucle sin corte audible.
- [ ] La preferencia persiste entre recargas, pero **nunca arranca sola** sin gesto del usuario.
- [ ] Al ocultar la pestaña se pausa, y se reanuda al volver si estaba activa.
- [ ] Si el archivo falla, el control se deshabilita u oculta sin mostrar error.

### Accesibilidad

- [ ] `aria-pressed` refleja el estado y se actualiza al cambiar.
- [ ] `aria-label` descriptivo y coherente con el estado.
- [ ] Operable solo con teclado, con foco visible.
- [ ] El control no es el primer elemento focusable; el skip link lo precede.
- [ ] Sin sonido disparado por hover o foco.
- [ ] Contraste del control conforme a la tabla normativa de `DESIGN_SYSTEM.md`.
- [ ] Objetivo táctil ≥ 44x44px.
- [ ] Ninguna información del sitio depende del audio.

### Visual

- [ ] Superficie clara; ninguna superficie oscura (D-005).
- [ ] Solo tokens semánticos, sin hex arbitrarios (D-006).
- [ ] Ninguna burbuja se solapa con el control (D-009).
- [ ] El control no queda adyacente al logo (D-017).
- [ ] No tapa ningún CTA ni enlace en ningún breakpoint.

### Responsive

- [ ] Correcto a 320px, 375px, 768px, 1024px y 1440px.
- [ ] Sin scroll horizontal en ningún ancho.
- [ ] No colisiona con el menú móvil abierto.

### Rendimiento

- [ ] Pista final por debajo de 400KB.
- [ ] `preload="none"` en el elemento `<audio>`.
- [ ] Sin dependencias nuevas.
- [ ] JavaScript del control por debajo de 2KB.
- [ ] Sin impacto medible en LCP ni en CLS frente al estado previo.
- [ ] La página es plenamente funcional con JavaScript desactivado.

### Contenido

- [ ] Derechos de uso de la pista Suno confirmados (plan/licencia) y documentados. **Bloqueante para publicar.**

---

## Notas de implementación

- Reutilizar la primitiva de botón de icono creada en `SPEC-001` en lugar de crear un componente nuevo (Rule 5).
- El control vive en el layout, no en la página, para sobrevivir a futuras navegaciones entre rutas.
- La persistencia encaja en `localStorage`, siguiendo el patrón de clave `lb-*` que `PLANNING.md` §1.5 ya contemplaba para el estado de silencio. Ese patrón de nombrado sigue siendo válido aunque su implementación con Howler no lo sea.
- No reintroducir `src/audio/audioManager.ts` ni la estructura de `PLANNING.md` §1.5: estaba diseñada alrededor de Howler y de efectos de sonido por interacción, que quedan fuera de alcance.
- Riesgo principal: la tentación de añadir efectos de sonido "ya que hay audio". Está explícitamente fuera de alcance (Rule 2, D-009).

---

*Última actualización: agosto 2026*
