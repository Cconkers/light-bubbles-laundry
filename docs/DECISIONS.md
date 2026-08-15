# DECISIONS.md

Registro de decisiones del proyecto Burbujas de Luz.

## Cómo usar este documento

**Qué es.** La memoria técnica del proyecto. Recoge decisiones de producto, diseño y
arquitectura que ya se han tomado, junto con el motivo por el que se tomaron. No es
documentación de referencia: es el histórico de por qué el proyecto es como es.

**Cuándo consultarlo.** Antes de tomar cualquier decisión que pueda contradecir una
elección previa. Si estás a punto de añadir una dependencia, cambiar la dirección visual,
introducir un patrón nuevo o descartar una alternativa, este documento va primero.

**Cuándo añadir una decisión.** Cuando una elección vaya a condicionar tareas futuras.
Los criterios concretos están en [Cómo añadir una nueva decisión](#cómo-añadir-una-nueva-decisión).

**Una decisión existente no se cambia en silencio.** Si una decisión registrada deja de ser
válida, **no se edita ni se borra**: se añade una decisión nueva que la sustituye, y la
antigua pasa a `Superseded` con un enlace a la que la reemplaza. El registro es un
histórico, no un documento vivo que se reescribe. Perder el rastro de por qué se decidió
algo es exactamente el problema que este archivo evita.

### Responsabilidades documentales

Para no duplicar contenido, cada documento tiene un ámbito exclusivo:

| Documento | Responsabilidad |
|-----------|-----------------|
| [`PRODUCT.md`](./PRODUCT.md) | Qué producto construimos y para quién |
| [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) | Cómo debe sentirse y verse la marca |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Reglas visuales reutilizables y tokens |
| [`PLANNING.md`](../PLANNING.md) | Arquitectura técnica, roadmap y restricciones |
| `DECISIONS.md` | Decisiones ya tomadas y su motivo |
| [`docs/specs/`](./specs/) | Qué debe implementarse en cada tarea |
| [`AGENTS.md`](../AGENTS.md) | Cómo debe comportarse el agente |

### Campos

| Campo | Significado |
|-------|-------------|
| **Fecha** | Cuándo se tomó |
| **Estado** | `Accepted`, `Superseded`, `Deprecated` |
| **Área** | Taxonomía cerrada: `Process`, `Architecture`, `Design`, `Product`, `Accessibility`, `Brand`, `Content`, `Documentation` |

La taxonomía de áreas es **cerrada a propósito**. Un campo libre degenera en sinónimos en
pocas entradas y deja de servir para filtrar.

---

## D-001 — Adoptar desarrollo Spec-Driven

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Process

### Contexto

El desarrollo previo avanzó por peticiones conversacionales sucesivas. Eso produjo trabajo
que hubo que deshacer (una escena 3D completa que terminó retirada) y decisiones que se
volvieron a debatir varias veces. Sin un artefacto que fije el alcance antes de escribir
código, cada sesión reinterpreta el objetivo.

### Decisión

El desarrollo se organiza mediante especificaciones en [`docs/specs/`](./specs/). Toda
tarea relevante tiene una SPEC **antes** de implementarse. Las SPEC se numeran
incrementalmente (`001-home.md`, `002-....md`) y siguen
[`TEMPLATE.md`](./specs/TEMPLATE.md).

### Motivo

Una SPEC hace el alcance explícito y verificable. Permite que el trabajo se pida como
"implementa SPEC-001" sin renegociar el diseño, y da criterios de aceptación
comprobables en lugar de una valoración subjetiva de si algo está terminado.

### Consecuencias

- Cada tarea relevante requiere trabajo previo de especificación.
- Un cambio de alcance se hace editando la SPEC, no improvisando durante la implementación.
- Las correcciones triviales (un typo, un ajuste de padding) no requieren SPEC.
- Los criterios de aceptación se convierten en la definición de "terminado".

### Relacionado

- [`AGENTS.md`](../AGENTS.md) — Rule 1, Rule 2
- [`docs/specs/TEMPLATE.md`](./specs/TEMPLATE.md)

---

## D-002 — Separar PRODUCT, DESIGN, ARCHITECTURE y SPEC

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Documentation

### Contexto

`PLANNING.md` mezclaba arquitectura, decisiones de producto, paleta de color y roadmap. Al
crecer, resultaba imposible saber qué documento era autoritativo para una pregunta
concreta, y la misma información aparecía en varios sitios con versiones divergentes.

### Decisión

Se mantienen separadas las responsabilidades descritas en la tabla de
[Responsabilidades documentales](#responsabilidades-documentales). Ningún documento duplica
el contenido íntegro de otro; se enlazan entre sí.

### Motivo

Una pregunta debe tener un único sitio donde responderse. La duplicación garantiza
divergencia: dos copias de la misma regla acaban discrepando y nadie sabe cuál manda.

### Consecuencias

- Responder una pregunta puede exigir leer dos documentos.
- Al cambiar algo hay que actualizar un único sitio, y añadir enlaces en lugar de copiar.
- `AGENTS.md` actúa como orquestador de contexto y no repite el contenido de los demás.

### Relacionado

- [`AGENTS.md`](../AGENTS.md)
- Todos los documentos de [`docs/`](./)

---

## D-003 — Three.js aparcado en el MVP

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Architecture

### Contexto

Se construyó una escena 3D completa con Three.js: sistema de partículas de burbujas,
modelo GLTF de lavadoras, animación de puerta y tambor. El resultado no encajaba con la
dirección visual buscada y se retiró de la interfaz, sustituido por un fondo fotográfico.
El código sigue en el repositorio pero quedó huérfano: `BubbleCanvas.astro` no se importa
en ningún sitio y `BaseLayout.astro` ya no contiene `#bubble-canvas`.

### Decisión

La capa 3D se considera **aparcada (dormida)**, no eliminada:

- Se conservan `src/scripts/3d/` (`scene.ts`, `bubbles.ts`, `laundryRoom.ts`, `modelLoader.ts`, `performance.ts`) y `src/components/canvas/BubbleCanvas.astro`.
- Se conserva la dependencia `three`.
- **No forma parte de `SPEC-001`** ni de ninguna SPEC actual.
- La decoración de burbujas del MVP es **ligera, en CSS/SVG**, y no depende de esta capa.

### Motivo

Borrar el código destruiría trabajo que puede recuperarse, y la retirada era explícitamente
temporal ("de momento, nada de 3D"). A la vez, mantenerlo activo sumaba peso y complejidad
sin aportar nada a los objetivos del MVP. Aparcar preserva la opción sin pagar su coste.

### Consecuencias

- Queda código no utilizado en el repositorio. Es deliberado; no debe "limpiarse" sin registrar una decisión nueva.
- `three` sigue en `package.json` aunque nada lo importe en tiempo de ejecución. **El JavaScript no entra en el bundle** porque no existe ruta de importación.
- **Los assets del modelo sí pesan en producción.** `public/models/wash-machine/` ocupa unos **1.295 KB** (`scene.bin` más cuatro texturas PNG) y, al estar en `public/`, Astro lo copia a `dist/` en cada build aunque nada lo solicite. Es la única parte del aparcamiento con coste real de despliegue, y **está pendiente de resolver**: las opciones son moverlo fuera de `public/` o aceptar el peso. No borrarlo sin decidirlo.
- Las burbujas del MVP se implementan dos veces si algún día se reactiva el 3D. Coste aceptado.
- **Reversible.** Para reactivarla basta una SPEC que monte el canvas. El desencadenante sería una petición explícita de recuperar la experiencia inmersiva.

### Relacionado

- [`PLANNING.md`](../PLANNING.md) — §0 y §1.3
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Bubbles
- D-018

---

## D-004 — No añadir GSAP ni Howler sin necesidad

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Architecture

### Contexto

`PLANNING.md` describía GSAP + ScrollTrigger para animaciones y Howler.js para audio como
parte del stack, con pasos de roadmap dedicados. En la práctica **nunca se instalaron**:
solo existen en la documentación. Un agente que lea el planning puede concluir
razonablemente que forman parte del proyecto e instalarlas.

### Decisión

No se incorporan GSAP, Howler.js ni ninguna otra dependencia por el hecho de aparecer en
documentación histórica. Toda dependencia nueva exige:

1. Una necesidad concreta que la plataforma no cubra.
2. Justificación registrada como decisión.
3. Una SPEC que la contemple.

### Motivo

GSAP y Howler existían como aspiración, no como requisito. Las animaciones que el MVP
necesita se resuelven con transiciones CSS e `IntersectionObserver`, sin coste de bundle.
El audio no forma parte de los objetivos de producto. Añadir peso para cumplir un documento
antiguo es exactamente la clase de decisión que este registro debe impedir.

### Consecuencias

- Sin librería de animación: las animaciones complejas requieren más CSS a mano.
- Sin audio en el sitio, y `MuteButton` deja de tener sentido como componente previsto.
- Las secciones 1.4, 1.5 y los pasos 4-5 del roadmap de `PLANNING.md` quedan como registro histórico, no como trabajo pendiente.

> **Modificada por D-021 (agosto 2026).** La consecuencia sobre audio queda revisada: sí habrá
> audio ambiental opcional, y el control de silencio vuelve a ser necesario. Lo que **no**
> cambia es la regla de dependencias: se implementa con `<audio>` nativo, sin Howler.js. El
> texto original se conserva intacto conforme al criterio del registro.

### Relacionado

- [`PLANNING.md`](../PLANNING.md) — §0, §1.4, §1.5
- [`AGENTS.md`](../AGENTS.md) — Rule 9
- D-018

---

## D-005 — Dirección visual light-first

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Design

### Contexto

El nombre "Burbujas de Luz" y un motivo de burbujas iridiscentes empujan con facilidad
hacia neón sobre negro, resplandores y morados saturados. Una iteración previa del logo
llegó a tener un fondo negro con un estallido de arcoíris. El riesgo de deriva estética es
alto y recurrente.

### Decisión

La identidad visual es **luminosa, limpia, cercana y alegre**. Las superficies son blancas
o casi blancas con lavados pastel. `#1A1A2E` es color de texto, nunca de fondo. Se
prohíben explícitamente las estéticas *nightclub*, *cyberpunk*, casino y *sci-fi* oscura,
además del exceso de negro. No hay modo oscuro en esta fase.

### Motivo

Una lavandería vende limpieza, luz y confianza. Una interfaz oscura y saturada comunica lo
contrario. Y la dirección estaba definida por el negocio: moderno europeo, mediterráneo,
familiar, premium accesible.

### Consecuencias

- Sin modo oscuro. Añadirlo requiere una decisión nueva.
- Los contrastes se resuelven oscureciendo el texto, no el fondo.
- La legibilidad sobre fotografía se resuelve con superficies claras translúcidas, nunca con velos negros.
- Un bloque oscuro a ancho completo se considera error de implementación.

### Relacionado

- [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) — §0, §2, §13
- [`PRODUCT.md`](./PRODUCT.md) — Brand Personality
- D-017

---

## D-006 — Design tokens semánticos

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Design

### Contexto

La implementación existente escribía colores directamente en las clases de utilidad
(`text-sky-700`, `bg-black/40`, `bg-[#...]`), mezclando la paleta por defecto de Tailwind
con valores arbitrarios y con los tokens de marca declarados en `global.css`. El resultado
es imposible de reajustar de forma coherente.

### Decisión

Los componentes **no** dependen de hexadecimales arbitrarios ni de la paleta por defecto de
Tailwind. Se usa una arquitectura de dos capas: primitivos con hex (`--lb-violet-600`) y
tokens semánticos que los referencian (`--color-primary`). Los componentes solo consumen
tokens semánticos.

### Motivo

Un componente que declara `bg-primary` comunica intención y se reajusta desde un único
sitio. Uno que declara `bg-[#8B4BD1]` obliga a auditar todo el código para cambiar la
marca, y no dice nada sobre el papel de ese color.

### Consecuencias

- Hay que definir el token antes de usar un color nuevo.
- Un valor arbitrario en un componente se considera error de revisión.
- Los tokens viven en el bloque `@theme` de `global.css`, sin archivo de configuración de Tailwind.
- La migración de los tokens actuales forma parte de `SPEC-001` (ver D-015).

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Color System
- D-013, D-015

---

## D-007 — El contraste y la accesibilidad son restricciones de diseño

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Accessibility

### Contexto

Se midieron los colores de marca sobre blanco: violeta 3.69:1, rosa 2.63:1, naranja 2.18:1,
cian 2.07:1, menta 1.50:1. **Ninguno alcanza el 4.5:1 que exige WCAG AA para texto de
cuerpo.** Usar la paleta "tal cual" produce, inevitablemente, interfaz ilegible.

### Decisión

Los colores de marca pueden usarse como **decoración o titular grande**, pero cualquier uso
como texto pequeño o como superficie interactiva debe respetar los mínimos:

- Texto de cuerpo: 4.5:1 (pasos 700+, menta 800+)
- Texto grande: 3:1 (pasos 600+)
- Relleno con texto blanco: 4.5:1 (violeta 600+, rosa/cian/naranja 700+, menta 800+)
- Controles de formulario y anillo de foco: 3:1

Sobre gradiente o fotografía el contraste se **mide**, no se estima, tomando la zona más
clara del fondo.

### Motivo

La accesibilidad es un requisito legal y ético, y aquí también es una restricción de
diseño con consecuencias concretas: determina qué tono usar en cada contexto. Sin la regla
escrita con números, cualquier agente usará el tono `500` de la paleta porque es "el color
de marca", y el resultado no se podrá leer.

### Consecuencias

- Los tonos de marca visibles en el design board casi nunca son los que llevan texto.
- Menta es el tono más restrictivo: exige el paso 800 en cualquier uso con texto.
- Nunca texto blanco sobre un tono `500`.
- La información no se transmite solo por color.

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Contrast rules
- [`PLANNING.md`](../PLANNING.md) — §5
- [`AGENTS.md`](../AGENTS.md) — Rule 8

---

## D-008 — Responsive mobile-first

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Design

### Contexto

El uso realista de esta web es un teléfono: alguien en la calle o en casa decidiendo si
salir a lavar, comprobando horario y precio.

### Decisión

Toda interfaz se diseña para **mobile, tablet y desktop**, empezando por la vista estrecha
y enriqueciendo hacia arriba. Breakpoints y reglas por tier en
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Responsive. El suelo de pruebas es 320px.

### Motivo

Diseñar primero en desktop y comprimir después produce móviles con contenido amputado y
jerarquías rotas. El orden inverso obliga a priorizar contenido desde el principio.

### Consecuencias

- Lo decorativo es lo primero que se sacrifica al reducir espacio; el contenido nunca.
- Objetivos táctiles de 44px mínimo, también en desktop.
- Sin pérdida de contenido entre breakpoints: lo que hay en desktop existe en móvil, quizá reorganizado.
- Sin scroll horizontal en ningún tamaño.

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Responsive
- [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) — §12
- [`AGENTS.md`](../AGENTS.md) — Rule 7

---

## D-009 — Las burbujas son decoración, no ruido visual

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Design

### Contexto

La primera implementación de burbujas fue un sistema de partículas que cubría el viewport,
con varias iteraciones sobre cantidad y aspecto porque resultaba invasivo. Es el elemento
de marca con mayor riesgo de degradar la usabilidad.

### Decisión

Las burbujas son **sutiles y luminosas**, y no interfieren con lectura, navegación ni
interacción:

- Opacidad total entre 0.10 y 0.35
- Topes de densidad: 6 en móvil, 10 en tablet, 14 en desktop
- `pointer-events: none` y `aria-hidden="true"` siempre
- Nunca sobre texto, control o tarjeta con contenido, ni junto al logo
- Desactivadas por completo con `prefers-reduced-motion: reduce`

### Motivo

El motivo de marca no puede degradar la función del sitio. Pocas burbujas grandes y bien
colocadas leen mejor que un campo denso de partículas, que parece un salvapantallas.

### Consecuencias

- Los topes de densidad son máximos absolutos, no sugerencias.
- Las burbujas no participan en la interacción, así que no pueden ser la vía de ninguna acción.
- Sin burbujas junto al logo, porque el logo ya contiene burbujas.

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Bubbles
- [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) — §6
- D-003

---

## D-010 — Los datos de negocio sin confirmar son placeholders

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Content

### Contexto

Las referencias visuales incluyen precios (5,50€ / 8,00€ / 11,00€ / 13,50€), capacidades,
dirección, teléfono, email, horario y cifras de negocio (+500 clientes, +20 máquinas, +10
años). Son **contenido de maqueta** generado para ilustrar el diseño, no datos verificados
del local.

### Decisión

No se inventan precios, direcciones, teléfonos, horarios, estadísticas ni ningún otro dato
real. Todo dato sin confirmar se marca de forma explícita:

```
[PLACEHOLDER: precio carga pequeña]
```

El inventario de datos pendientes está en [`PRODUCT.md`](./PRODUCT.md) — Datos pendientes
de confirmación.

### Motivo

Publicar un precio incorrecto daña la confianza y puede tener consecuencias legales. Un
placeholder visible es un error evidente que alguien corregirá; un dato inventado y
plausible se cuela en producción sin que nadie lo detecte.

### Consecuencias

- La web no puede publicarse hasta sustituir los placeholders.
- Los placeholders deben ser **visualmente evidentes** en desarrollo, no texto que parezca real.
- Los eslóganes de las referencias son copy candidato del propio negocio; pueden usarse como punto de partida, pero no son datos operativos.

### Relacionado

- [`PRODUCT.md`](./PRODUCT.md) — Datos pendientes de confirmación
- [`docs/specs/001-home.md`](./specs/001-home.md)

---

## D-011 — MVP sin funcionalidades transaccionales

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Product

### Contexto

Burbujas de Luz es un autoservicio de acceso libre. No hay nada que reservar ni comprar en
línea. Aun así, es tentador añadir funcionalidad de producto por costumbre.

### Decisión

En esta fase **no** se implementan: reservas, cuentas de usuario, pagos online,
e-commerce, blog, PWA ni i18n. Lista completa en [`PRODUCT.md`](./PRODUCT.md) —
Non-goals. Reactivar cualquiera de estos puntos exige una SPEC que modifique
explícitamente esta decisión.

### Motivo

Ninguna de esas funciones responde a los objetivos de negocio, que son convertir búsqueda
local en visita física y resolver las dudas que frenan la primera visita. Cada función
añadida es superficie que mantener, y ninguna se sostiene con el modelo actual del local.

### Consecuencias

- Sin backend, sin base de datos y sin autenticación. El sitio permanece estático (SSG).
- El CTA principal es informativo ("Ver tarifas"), no transaccional.
- El contacto se resuelve con enlaces directos (teléfono, WhatsApp, email), no con formularios que requieran servidor.

### Relacionado

- [`PRODUCT.md`](./PRODUCT.md) — Non-goals, Primary CTA
- [`PLANNING.md`](../PLANNING.md) — §6

---

## D-012 — Validación antes de dar una tarea por terminada

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Process

### Contexto

Sin una definición de "terminado" comprobable, los cambios se dan por buenos por
inspección visual y los errores de tipos o de build aparecen más tarde, en CI o en otra
sesión.

### Decisión

Cuando sea aplicable, antes de considerar una tarea terminada hay que ejecutar:

```bash
npm run check
npm run build
```

y corregir lo que salga. `npm run check` ejecuta `astro check` (tipos y diagnósticos de
Astro); `npm run build` compila el sitio de producción.

> Nota: **no existe** un script llamado `npm run astro check`. El comando correcto es
> `npm run check`.

### Motivo

Son los dos comandos que ejecuta CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).
Ejecutarlos en local antes de cerrar una tarea evita romper `develop` y da un criterio
objetivo de finalización.

### Consecuencias

- Toda tarea de código termina con dos comandos y sus posibles correcciones.
- Un fallo de tipos o de build bloquea la tarea; no se entrega "para arreglar después".
- Las tareas exclusivamente documentales también los ejecutan, para confirmar que no han roto nada.

### Relacionado

- [`AGENTS.md`](../AGENTS.md) — Rule 10
- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

---

## D-013 — Astro 7 con Tailwind v4 y sin archivo de configuración

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Architecture

### Contexto

El proyecto ejecuta Astro **7.2.2** y Tailwind **4.3.3**, aunque `PLANNING.md` mencionaba
Astro 5.x. Tailwind v4 se integra mediante el plugin de Vite `@tailwindcss/vite` y se
configura con el bloque `@theme` dentro del CSS. **No existe `tailwind.config.mjs`, y es
correcto que no exista.**

### Decisión

Se mantiene Tailwind v4 configurado en CSS. Los tokens se declaran en el bloque `@theme` de
[`src/styles/global.css`](../src/styles/global.css). **No se crea archivo de configuración
de Tailwind.** No se migra ni se degrada la versión de Astro.

### Motivo

Es el modelo de configuración recomendado por Tailwind v4. Un agente que no encuentre
`tailwind.config.mjs` puede concluir razonablemente que falta y crearlo; eso partiría el
sistema de tokens en dos fuentes de verdad y reintroduciría un patrón de la v3.

### Consecuencias

- Los tokens de diseño se definen en CSS, no en JavaScript.
- La documentación de Tailwind v3 no aplica a este proyecto.
- Crear `tailwind.config.*` se considera error de implementación.
- Las utilidades se generan a partir de los nombres de token de `@theme`.

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Implementación en Tailwind v4
- [`PLANNING.md`](../PLANNING.md) — §0
- D-006

---

## D-014 — El drift documental se corrige de forma aditiva

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Documentation

### Contexto

`PLANNING.md` contenía afirmaciones desactualizadas: versión de Astro incorrecta,
dependencias que nunca se instalaron y una capa 3D descrita como central cuando ya estaba
retirada de la interfaz. Reescribirlo habría eliminado el rastro de las decisiones
originales y del razonamiento que las sostenía.

### Decisión

`PLANNING.md` **no se reescribe**. Las correcciones se añaden en una sección fechada
(`§0 Estado actual y decisiones revisadas`) situada al principio, que **prevalece** sobre
las secciones posteriores sin borrarlas. Las secciones originales permanecen como registro
histórico.

### Motivo

El histórico tiene valor: explica por qué el proyecto tomó ciertos caminos. Una sección que
prevalece corrige la información sin destruir el contexto, y hace visible que hubo un
cambio de rumbo, algo que una reescritura oculta.

### Consecuencias

- `PLANNING.md` contiene secciones desactualizadas **a propósito**. No deben "limpiarse".
- Al leerlo hay que empezar por §0, que indica qué queda superado.
- El mismo criterio aplica a este registro: las decisiones se sustituyen, no se editan.

### Relacionado

- [`PLANNING.md`](../PLANNING.md) — §0
- D-003, D-004, D-013

---

## D-015 — La migración de tokens vive dentro de SPEC-001

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Process

### Contexto

Los tokens actuales de `global.css` (`--font-display: Georgia serif`, `bubble-blue`,
`caramel-gold`) contradicen el design board, que especifica Poppins y una paleta de
violeta, rosa, naranja, cian y menta. Había que decidir quién ejecuta la migración. Se
valoró crear una SPEC previa de fundamentos (`000-foundations.md`) dedicada solo a tokens,
tipografía y primitivas base.

### Decisión

La migración de tokens se incorpora a [`SPEC-001`](./specs/001-home.md) como su **primera
tarea**. Se **descarta** crear `000-foundations.md`.

### Motivo

La home consume prácticamente todos los tokens del sistema, así que una SPEC separada
habría quedado acoplada a ella sin aportar independencia real. Mantenerlo en una sola SPEC
conserva la estructura de ficheros acordada y evita una entrega intermedia que no se puede
verificar visualmente por sí sola.

### Consecuencias

- `SPEC-001` es más grande de lo que sería solo maquetar la home.
- Los tokens quedan disponibles para SPECs posteriores como efecto de `SPEC-001`.
- Si en el futuro hace falta una capa de fundamentos independiente, requiere decisión nueva.
- La alternativa `SPEC-000` queda descartada de forma explícita para no volver a proponerla.

### Relacionado

- [`docs/specs/001-home.md`](./specs/001-home.md)
- D-006

---

## D-016 — Logo maestro en src/assets/brand vía astro:assets

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Brand

### Contexto

El logo en uso tenía un fondo negro cuadrado con un estallido de arcoíris, una marca de agua
"ai" visible en la esquina y el eslogan horneado en el bitmap. Existía duplicado en
`public/images/logo.png` y `src/assets/images/logo.png`, 353KB cada copia, y se servía sin
optimizar con `<img src="/images/logo.png">`.

Estado real en el momento de registrar esta decisión: la copia de `public/images/logo.png`
**ya se borró** en el commit `9c1b277`, pero
[`src/pages/index.astro`](../src/pages/index.astro) **sigue apuntando a ella** en la línea 29.
Es decir, **el logo de la cabecera está roto ahora mismo (404)**. La copia de
`src/assets/images/logo.png` sí permanece, con la marca de agua incluida.

El negocio entregó después un logo nuevo y limpio, sin marca de agua y sin el eslogan
horneado, pero **sin canal alfa**: aplanado sobre un blanco no uniforme (valores de fondo
entre 243 y 254). El aplanado viene de la exportación original, no de la compresión, así que
tampoco lo resuelve la copia PNG sin pérdida.

### Decisión

El maestro de marca es [`src/assets/brand/logo.webp`](../src/assets/brand/logo.webp)
(1230x1186, con canal alfa, 198KB), derivado de `public/images/logo_burbujas_de_luz.png`
(PNG sin pérdida, 1254x1254). Vive en `src/` para pasar por `astro:assets`. `SPEC-001`
repara la referencia rota de la cabecera y retira `src/assets/images/logo.png`. La
transparencia se reconstruyó con relleno por
inundación desde las esquinas (umbral 240) y el margen sobrante se recortó; el
procedimiento completo y su verificación están en
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Brand and Logo.

### Motivo

Un activo en `public/` se sirve tal cual: 353KB llegaban al navegador para mostrar un logo
de cabecera. Desde `src/`, Astro emite WebP dimensionado por uso. Y una marca de agua "ai"
en el logo de un negocio real es inaceptable, con independencia del peso.

### Consecuencias

- El logo se consume con `<Image>` de `astro:assets`, no con `<img>`.
- Reintroducir una copia en `public/` para el logo se considera error.
- El maestro actual es una **reconstrucción**, no un original. Sigue siendo deseable un SVG o un PNG con alfa real del diseñador.
- El eslogan se compone en texto real, nunca como bitmap.
- La transparencia no es apta para Open Graph: varias plataformas la componen sobre negro y hace falta una variante con fondo sólido.

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Brand and Logo
- [`docs/specs/001-home.md`](./specs/001-home.md)
- D-017

---

## D-017 — Presupuesto de saturación: el logo lo consume

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Design

### Contexto

D-005 fija una dirección light-first, pero el logo es intensamente saturado: burbujas
azules y violetas vivas y un rayo naranja de alto contraste. Existe una tentación razonable
de extender esa intensidad al resto de la interfaz para que "combine". El resultado
agregado sería la estética de discoteca que D-005 prohíbe, aunque cada elemento aislado
parezca defendible.

### Decisión

**El logo consume todo el presupuesto de saturación de la página.** Todo lo que lo rodea se
mantiene pastel y contenido: un único elemento saturado por zona visual, acentos de color
solo en superficies pequeñas (iconos, badges, indicadores) y sin burbujas decorativas junto
al logo.

### Motivo

D-005 dice qué evitar; esta decisión da la regla operativa que lo hace aplicable. Sin ella,
la dirección visual se degrada por acumulación de decisiones locales todas razonables. Es
el mecanismo que evita volver a discutir D-005 en cada componente nuevo.

### Consecuencias

- Los tonos `500` de la paleta se usan con moderación y casi siempre en superficie pequeña.
- Si el logo y un bloque saturado compiten en el mismo espacio, cede el bloque.
- El logo retirado (fondo negro con estallido de arcoíris) queda como ejemplo negativo explícito en la documentación.

### Relacionado

- [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) — §9
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Brand and Logo
- D-005, D-016

---

## D-018 — Revelados por scroll con IntersectionObserver y CSS

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Architecture

### Contexto

D-004 descarta GSAP, pero deja abierta la pregunta de **cómo** se implementan entonces las
animaciones de entrada al hacer scroll. Una prohibición sin alternativa sancionada acaba
resolviéndose improvisando, probablemente reintroduciendo una librería.

### Decisión

Los revelados por scroll se implementan con **`IntersectionObserver` y transiciones CSS**.
Umbral del 15% de visibilidad, animación **una sola vez** por elemento. Sin efectos ligados
a la posición del scroll (`scrub`), sin pines y sin parallax en móvil.

### Motivo

`IntersectionObserver` es API de plataforma: cero peso de bundle, rendimiento nativo y
soporte universal. Las animaciones que el MVP necesita (aparición suave de secciones) no
requieren una línea de tiempo. Reservar el scroll para animaciones simples también evita
mareo y problemas de rendimiento en móvil.

### Consecuencias

- Sin animaciones ligadas al progreso del scroll. Si alguna vez se necesitan, decisión nueva.
- El contenido debe ser legible **sin** JavaScript: el estado inicial no puede ser invisible de forma irrecuperable.
- El observer se desconecta tras disparar, para no dejar trabajo en el hilo principal.
- Con `prefers-reduced-motion` los elementos aparecen directamente en su estado final.

### Relacionado

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Motion
- D-004

---

## D-019 — Las referencias de diseño se versionan y no se eliminan

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Documentation

### Contexto

Las tres referencias visuales (hero, design board, responsive) son la fuente estética del
proyecto. Se guardan en `public/design/` como WebP, unos 250KB en total, y por tanto se
copian al build de producción aunque ningún usuario las visite.

### Decisión

Las referencias se versionan en [`public/design/`](../public/design/) como WebP y **no se
eliminan** en labores de optimización. Nombres estables: `hero-reference.webp`,
`design-board.webp`, `responsive-reference.webp`. No se usan como UI final salvo que una
SPEC lo indique explícitamente.

### Motivo

Sin ellas en el repositorio, la documentación visual pierde su fuente y las decisiones
estéticas dejan de ser verificables. Una ruta pública estable permite además consultarlas
en el navegador durante el desarrollo. 250KB que no están en ninguna ruta de renderizado es
un coste despreciable frente a perder la referencia.

### Consecuencias

- El build incluye unos 250KB de imágenes que ningún usuario solicita. Aceptado.
- Una tarea de reducción de peso **no** debe borrarlas.
- Si el peso de producción llegara a importar, la alternativa es moverlas a `docs/design/`, lo que exigiría actualizar los enlaces de la documentación.

### Relacionado

- [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md) — §1
- [`docs/specs/001-home.md`](./specs/001-home.md)

---

## D-020 — CLAUDE.md deja de ser un symlink a AGENTS.md

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Documentation

### Contexto

`CLAUDE.md` estaba versionado como **symlink** a `AGENTS.md` (modo `120000` en el índice de
Git), y en el árbol de trabajo existía como *reparse point* real de Windows apuntando a
`AGENTS.md`. La configuración del repositorio tiene `core.symlinks = false`, lo que hace que
el enlace resulte invisible en inspecciones normales: los dos archivos parecen tener el mismo
contenido en lugar de ser el mismo archivo.

Esto provocó un fallo concreto durante la creación de esta documentación: escribir en
`CLAUDE.md` siguió el enlace y **sobrescribió `AGENTS.md`**, destruyendo su contenido. Git
tampoco señalaba la modificación de `CLAUDE.md`, porque comparaba el destino del enlace en
lugar del contenido del archivo.

### Decisión

`CLAUDE.md` pasa a ser un **archivo regular** independiente. Contiene un puntero a
[`AGENTS.md`](../AGENTS.md) más las notas específicas de Claude, sin duplicar la
documentación compartida. El symlink queda eliminado.

### Motivo

Un symlink obliga a que ambos archivos sean idénticos, lo que impide alojar instrucciones
específicas de un agente concreto, que es justamente para lo que sirve `CLAUDE.md`. Y el modo
de fallo es grave y silencioso: cualquier herramienta que escriba en `CLAUDE.md` corrompe
`AGENTS.md` sin avisar, y Git no lo refleja en `git status`.

### Consecuencias

- `CLAUDE.md` y `AGENTS.md` pueden divergir, así que hay que evitar duplicar reglas entre ellos. `CLAUDE.md` enlaza en lugar de copiar.
- Git registra un cambio de tipo (`120000` → `100644`). Debe confirmarse en el commit para que el cambio se materialice.
- Al leer `AGENTS.md` ya no se está leyendo `CLAUDE.md`: si se añade una regla nueva, va en `AGENTS.md` y `CLAUDE.md` la hereda por referencia.
- **Precaución general:** el repositorio tiene `core.symlinks = false` con reparse points reales en el árbol. Antes de sobrescribir un archivo de la raíz conviene comprobar que no sea un enlace.

### Relacionado

- [`AGENTS.md`](../AGENTS.md)
- [`CLAUDE.md`](../CLAUDE.md)
- D-002

---

## D-021 — Audio ambiental opcional, desactivado por defecto

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Product
**Modifica a:** D-004 (solo su consecuencia sobre audio; la regla de dependencias sigue vigente)

### Contexto

D-004 registró que el audio quedaba fuera de los objetivos de producto, porque Howler.js
figuraba en `PLANNING.md` sin haberse instalado nunca. Después se incorporó al repositorio una
pista real (`public/music/Ropa Limpia.mp3`, 2,5MB original, no comprometida), con intención de
usarla en el sitio. Eso
reabre la cuestión, que ya no es "¿instalamos una librería de audio?" sino "¿qué papel tiene
el audio en el producto y cómo se implementa sin dañar la accesibilidad ni el rendimiento?".

### Decisión

Se acepta audio ambiental en el sitio, especificado en
[`SPEC-002`](./specs/002-audio.md), con tres condiciones no negociables:

1. **Desactivado por defecto.** Nunca se reproduce sin una acción explícita del usuario.
2. **Control accesible y persistente.** Operable por teclado, con estado anunciado, y la preferencia se recuerda entre visitas.
3. **Carga diferida.** El archivo no se descarga hasta que el usuario decide reproducirlo.

Se implementa con el elemento nativo `<audio>`. **No se añade Howler.js ni ninguna otra
librería de audio**: la regla de dependencias de D-004 sigue plenamente vigente.

### Motivo

WCAG 1.4.2 exige un mecanismo de pausa o parada para cualquier audio que suene más de 3
segundos de forma automática; arrancar apagado cumple el criterio de la forma más simple y
respeta al usuario que llega desde un espacio compartido. Los navegadores además bloquean el
autoplay con sonido, así que un diseño que dependa de ello no funcionaría.

La carga diferida es lo que hace viable la decisión: 2,5MB en la carga inicial arruinarían el
objetivo de LCP y contradirían el principio de producto de que la ligereza es un rasgo del
producto. Si el audio solo se descarga cuando se pide, su coste es cero para quien no lo usa.

### Consecuencias

- El audio nunca puede ser la única vía de transmitir información.
- Hace falta un control visible y persistente, con su propio espacio en la interfaz.
- La pista se reencodó a `public/music/Ropa Limpia-web.mp3` (264KB, 45s, mono 48kbps). Está dentro del límite de 400KB especificado en `SPEC-002`.
- La consecuencia de D-004 "sin audio en el sitio, y `MuteButton` deja de tener sentido" queda modificada: el control de silencio vuelve a ser un componente necesario.
- La prohibición de sonido asociada a las burbujas (D-009) **no cambia**: las burbujas siguen siendo silenciosas y no interactivas. El audio es ambiental, no reactivo.

### Relacionado

- [`docs/specs/002-audio.md`](./specs/002-audio.md)
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — Otros activos de marca
- D-004, D-009, D-011

---

## D-022 — Atmósfera de sección: wash + burbujas + blobs (no planos)

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Design
**Modifica a:** nada (complementa D-005, D-009)

### Contexto

Tras SPEC-003, la sección Tarifas usaba solo `--gradient-wash` plano. El mockup y el Hero
comparten un vocabulario más vivo (burbujas CSS, manchas orgánicas, profundidad suave). Sin
una regla explícita, cada sección nueva tendía a un fondo monocromo distinto.

### Decisión

Las secciones de marketing posteriores al Hero **reutilizan el mismo vocabulario atmosférico**:

1. Base `--gradient-wash` (u otro token de wash light-first).
2. Burbujas CSS existentes (`Bubbles.astro`) a opacidad percibida ~8–12 % (menos en móvil).
3. Blobs orgánicos con tokens / `color-mix` (sin hex arbitrarios, D-006).

No se usan fondos planos monocromos como única atmósfera. Los valores numéricos de tipografía
y espaciado de pulido viven en [`SPEC-004`](./specs/004-visual-polish.md) hasta promoverse al
design system.

### Motivo

Una sola pieza visual home aumenta reconocimiento de marca y evita el look “dashboard”.
Reutilizar `Bubbles.astro` cumple D-009 (decoración, no ruido) y D-004 (sin dependencias).

### Consecuencias

- Tarifas y secciones futuras deben incluir capa atmosférica, no solo color de fondo.
- Opacidad baja obligatoria: las burbujas no compiten con el contenido (D-009).
- SPEC-004 es la checklist de valores hasta que existan tokens `--text-price-*` etc.

### Relacionado

- [`docs/specs/004-visual-polish.md`](./specs/004-visual-polish.md)
- D-005, D-006, D-009

---

## D-023 — Hosting de previews y producción en Vercel

**Fecha:** agosto 2026
**Estado:** Accepted
**Área:** Architecture
**Modifica a:** nada

### Contexto

El CI de GitHub Actions solo valida (`check` + `build`). Para revisar la landing publicada
durante el desarrollo hace falta un hosting de estáticos con previews por rama, sin coste
en el plan hobby.

### Decisión

Se despliega en **Vercel** (cuenta del equipo, integración con el repo de GitHub):

1. **Producción** desde la rama base acordada (`main` o `develop`).
2. **Preview deployments** automáticos en cada push/PR (p. ej. `cursor/hero-fondo-responsive`).
3. Sitio **estático** Astro (`output` por defecto / `dist/`). Sin `@astrojs/vercel` adapter
   mientras no se necesiten Functions, Image Optimization de Vercel o SSR.
4. `installCommand`: `npm install` (no hay `package-lock.json` en el repo).
5. Config mínima en [`vercel.json`](../vercel.json).

### Motivo

Encaja con Astro estático, previews gratis por rama, y el usuario ya tiene cuenta y acceso
GitHub. No introduce dependencias npm nuevas (D-004).

### Consecuencias

- Cada push a una rama genera URL de preview en Vercel.
- Si más adelante se necesitan Functions/SSR, se añade `@astrojs/vercel` y se registra.
- El CI de GitHub Actions sigue siendo la puerta de tipos/build; Vercel es el hosting.

### Relacionado

- [`vercel.json`](../vercel.json)
- D-004, D-011, D-012

---

## Cómo añadir una nueva decisión

### Cuándo registrar

Registra una decisión nueva cuando:

- **Cambia una decisión arquitectónica.** Nueva dependencia, cambio de patrón, alteración de la estructura del proyecto.
- **Se establece una regla visual global.** Algo que afectará a todos los componentes futuros, no solo al que tienes entre manos.
- **Se elimina una alternativa importante.** Si has evaluado dos caminos y descartado uno, el descarte es la información valiosa.
- **Se toma una decisión de producto que afectará a futuras specs.** Alcance, CTA, público, funcionalidad dentro o fuera.
- **Existe riesgo de que futuros agentes vuelvan a tomar la misma decisión.** Este es el criterio decisivo: si alguien sin tu contexto podría razonablemente decidir lo contrario, regístralo.

No registres: correcciones de bugs, ajustes de estilo puntuales, detalles de implementación
que solo afectan a un componente, ni nada que ya esté cubierto por una decisión vigente.

### Formato

Cada decisión debe:

- Tener un **ID incremental** (`D-020`, `D-021`, ...). Los IDs no se reutilizan nunca.
- Indicar **fecha**.
- Indicar **estado**: `Accepted`, `Superseded`, `Deprecated`.
- Indicar **área**, de la taxonomía cerrada: `Process`, `Architecture`, `Design`, `Product`, `Accessibility`, `Brand`, `Content`, `Documentation`.
- Explicar el **contexto**: qué situación obligó a decidir. Incluye datos concretos si los hay.
- Registrar la **decisión** en términos accionables.
- Explicar el **motivo**, brevemente. Es la parte que más se agradece meses después.
- Indicar las **consecuencias**, incluidas las incómodas y, si la decisión es reversible, en qué condiciones.
- Enlazar **documentos relacionados** y decisiones vinculadas.

Plantilla:

```md
## D-0XX — Título en una línea

**Fecha:** mes año
**Estado:** Accepted
**Área:** Architecture

### Contexto
Qué situación obligó a decidir.

### Decisión
Qué se decidió, en términos accionables.

### Motivo
Por qué esta opción y no otra.

### Consecuencias
Qué implica, incluido lo incómodo. Si es reversible, bajo qué condiciones.

### Relacionado
- `docs/DESIGN_SYSTEM.md`
- D-0YY
```

### Sustituir una decisión

Cuando una decisión deja de ser válida:

1. **No la edites ni la borres.**
2. Añade una decisión nueva con ID nuevo, incluyendo `**Sustituye a:** D-0XX`.
3. Cambia el estado de la antigua a `Superseded` y añade `**Sustituida por:** D-0YY`.
4. Deja intacto el resto del contenido de la antigua.

Así el registro sigue explicando por qué el proyecto es como es, incluidos los caminos que
se abandonaron y el motivo.

---

*Última actualización: agosto 2026*
