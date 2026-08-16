# SPEC-012 — Dirección con número de portal

| | |
|---|---|
| **ID** | SPEC-012 |
| **Título** | Fijar dirección postal con número y enlaces Maps |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | [`src/data/content.ts`](../../src/data/content.ts) · schema en [`BaseLayout.astro`](../../src/layouts/BaseLayout.astro) |

> **Leer antes:** D-010, SPEC-006, SPEC-010. Protocolo en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Que la web, el mapa embebido y “Abrir en Google Maps” apunten al portal concreto del local,
no a la calle sin número.

### Alcance

Incluye:

- `contact.address` = `C. Virgen de la Cinta, 20, 41011 Sevilla` (confirmado por negocio)
- URLs de Maps derivadas de esa cadena (ya en `locationIntro`)
- `PostalAddress` en JSON-LD con calle+número, CP y localidad

Excluye:

- Legal, FAQPage, polish 004, Suno
- Coordenadas GPS inventadas
- Cambiar dominio (D-025)

---

## User

| Perfil | Qué necesita | Implicación |
|--------|--------------|-------------|
| Primera visita / prisa | Llegar al local correcto | Pin Maps y texto con nº 20 |

---

## Visual references

No aplica (dato de contenido).

---

## Information Architecture

- Fuente única: `contact.address` en `content.ts`
- Footer, Location, FAQ y schema leen ese valor

---

## Responsive / Accessibility / Performance

No aplica más allá de no romper el HTML existente.

---

## SEO

Actualizar `streetAddress` del LocalBusiness al incluir el número.

---

## Acceptance Criteria

- [x] `npm run check` / `npm run build` OK
- [x] Texto visible de dirección incluye `, 20,`
- [x] `mapsOpenUrl` / embed / directions usan la dirección con 20
- [x] JSON-LD `streetAddress` incluye el 20; `postalCode` = `41011`

---

## Notas de implementación

El local está junto a Generali (nº 18); el negocio confirma portal **20**.

---

*Última actualización: agosto 2026*
