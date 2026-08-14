# SPEC-XXX — Título

| | |
|---|---|
| **ID** | SPEC-XXX |
| **Título** | |
| **Estado** | `Draft` / `Ready for implementation` / `In progress` / `Done` |
| **Fecha** | mes año |
| **Ruta** | Ruta o componente afectado |

> **Leer antes de implementar:** [`PRODUCT.md`](../PRODUCT.md),
> [`VISUAL_DIRECTION.md`](../VISUAL_DIRECTION.md), [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md),
> [`DECISIONS.md`](../DECISIONS.md), [`PLANNING.md`](../../PLANNING.md).
> El protocolo de trabajo está en [`AGENTS.md`](../../AGENTS.md).

---

## Cómo usar esta plantilla

1. Copia el archivo a `docs/specs/NNN-nombre-corto.md` con el siguiente número libre.
2. Rellena cada sección. Si una no aplica, escribe "No aplica" y por qué; no la borres.
3. Borra esta sección "Cómo usar esta plantilla" del archivo nuevo.
4. Los criterios de aceptación deben ser **comprobables**. "Se ve bien" no es un criterio; "contraste ≥ 4.5:1 medido" sí.
5. Marca todo dato de negocio sin confirmar como `[PLACEHOLDER: ...]` (D-010).
6. Si la SPEC obliga a una decisión global, regístrala en [`DECISIONS.md`](../DECISIONS.md) antes de implementar.

---

## Objective

Qué problema resuelve esta SPEC y por qué merece la pena. Una o dos frases sobre el
resultado buscado, no sobre la implementación.

### Alcance

Incluye:

- ...

Excluye:

- ... (y, si procede, a qué SPEC futura corresponde)

---

## User

A qué perfil de [`PRODUCT.md`](../PRODUCT.md) — Target Users sirve esto, y qué necesita.
Incluye la implicación de diseño de cada perfil; si no la hay, el perfil probablemente no
es relevante para esta SPEC.

| Perfil | Qué necesita | Implicación de diseño |
|--------|--------------|-----------------------|
| | | |

---

## Visual references

Referencias aplicables de [`public/design/`](../../public/design/) y qué aporta cada una.
Si esta SPEC no tiene componente visual, indícalo.

---

## Information Architecture

Estructura y contenido, en orden. Una sección por pregunta del usuario.

### 1. Nombre de la sección

- Elementos que la componen
- Contenido, con `[PLACEHOLDER: ...]` donde el dato no esté confirmado
- Comportamiento
- `id` si necesita ancla

---

## Responsive requirements

Solo lo específico de esta SPEC; las reglas generales están en
[`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) — Responsive.

### Mobile (< 768px)

### Tablet (768-1023px)

### Desktop (≥ 1024px)

---

## Accessibility

Requisitos concretos: landmarks, jerarquía de encabezados, contraste, teclado, foco,
lectores de pantalla, `prefers-reduced-motion`, objetivos táctiles, zoom.

---

## Performance

Objetivos y restricciones. Dependencias nuevas (idealmente ninguna, ver D-004), estrategia
de imágenes, presupuesto de JavaScript, comportamiento sin JavaScript.

---

## SEO

Metadatos, semántica, contenido indexable. Indica qué queda fuera de alcance.

---

## Acceptance Criteria

Agrupados y verificables. Todos deben cumplirse.

### Build y tipos

- [ ] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [ ] `npm run build` completa sin errores.
- [ ] Sin errores en la consola del navegador.

### Estructura y contenido

- [ ] ...

### Visual

- [ ] Ninguna superficie oscura a ancho completo (D-005).
- [ ] Solo tokens semánticos, sin hex arbitrarios (D-006).
- [ ] ...

### Responsive

- [ ] Correcto a 320px, 375px, 768px, 1024px y 1440px.
- [ ] Sin scroll horizontal en ningún ancho.
- [ ] ...

### Accesibilidad

- [ ] Navegación completa por teclado, con foco visible.
- [ ] Contraste medido conforme a `DESIGN_SYSTEM.md` — Contrast rules.
- [ ] Correcto con `prefers-reduced-motion: reduce`.
- [ ] ...

### Rendimiento

- [ ] Sin dependencias nuevas no justificadas.
- [ ] Imágenes con dimensiones explícitas.
- [ ] ...

---

## Notas de implementación

Pistas útiles: componentes a reutilizar, orden sugerido de tareas, riesgos conocidos,
qué **no** tocar y por qué.

---

*Última actualización: mes año*
