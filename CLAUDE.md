# CLAUDE.md

**Lee [`AGENTS.md`](AGENTS.md) primero. Es la fuente de verdad para trabajar en este repositorio.**

Contiene el mapa de contexto, el flujo obligatorio de 14 pasos, las 14 reglas de desarrollo,
los comandos de verificación y la lista de restricciones que se incumplen con frecuencia.
Este archivo no repite nada de eso a propósito: dos copias de las mismas reglas acaban
divergiendo.

> **Nota histórica.** Hasta agosto de 2026 este archivo era un **symlink** a `AGENTS.md`.
> Ahora es un archivo propio, para poder alojar notas específicas de Claude sin duplicar la
> documentación compartida. Si lo editas, no esperes que el cambio afecte a `AGENTS.md`.
> Ver [`docs/DECISIONS.md`](docs/DECISIONS.md) D-020.

---

## Notas específicas para Claude

- **Lee antes de editar.** El flujo de `AGENTS.md` no es opcional: `PLANNING.md` §0 y `docs/DECISIONS.md` existen precisamente porque este proyecto contiene documentación desactualizada a propósito y código aparcado a propósito. Sin leerlos, las conclusiones razonables suelen ser las equivocadas.
- **Lee `docs/DECISIONS.md` antes de proponer cualquier mejora.** Muchas de las mejoras evidentes (crear `tailwind.config.mjs`, borrar código sin usar, instalar GSAP) ya se evaluaron y se descartaron con motivo. Ver la tabla de restricciones frecuentes de `AGENTS.md`.
- **No amplíes el alcance.** Si detectas algo que merece hacerse fuera de la SPEC, menciónalo al final de tu respuesta en lugar de implementarlo (Rule 2).
- **Verifica de verdad.** Ejecuta `npm run check` y `npm run build`, y repasa los criterios de aceptación de la SPEC uno a uno. No des por buena una tarea por inspección visual (Rule 10).
- **Mide el contraste, no lo estimes.** Ningún color de marca al tono `500` sirve para texto de cuerpo. Los valores verificados están en `docs/DESIGN_SYSTEM.md` — Contrast rules.
- **Señala las contradicciones.** Si la documentación y el código discrepan, dilo y propón la corrección aditiva en lugar de elegir en silencio (Rule 12).
- **Cuidado con los symlinks en este repositorio.** `core.symlinks` está configurado a `false`, pero existen reparse points reales en el árbol de trabajo. Escribir en un symlink sobrescribe su destino. Antes de sobrescribir un archivo de la raíz, comprueba que no sea un enlace.

---

## Development

Al arrancar el servidor de desarrollo, usa modo background:

```
astro dev --background
```

Gestiona el servidor con `astro dev stop`, `astro dev status` y `astro dev logs`.

Verificación: `npm run check` y `npm run build`. **No existe** `npm run astro check`.

---

## Documentation

Documentación completa: https://docs.astro.build

El índice de guías por tarea está en [`AGENTS.md`](AGENTS.md) — Documentation.
