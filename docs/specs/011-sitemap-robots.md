# SPEC-011 — Sitemap y robots.txt

| | |
|---|---|
| **ID** | SPEC-011 |
| **Título** | `sitemap.xml` y `robots.txt` estáticos |
| **Estado** | `Done` |
| **Fecha** | agosto 2026 |
| **Ruta** | [`public/sitemap.xml`](../../public/sitemap.xml) · [`public/robots.txt`](../../public/robots.txt) |

> **Leer antes:** D-004, D-010, D-023, D-025, D-026, [`010-seo-local.md`](./010-seo-local.md).
> Protocolo en [`AGENTS.md`](../../AGENTS.md).

---

## Objective

Que los crawlers descubran la URL canónica de la home y sepan que el sitio permite indexación
en producción, cerrando el hueco SEO aplazado en SPEC-001 / SPEC-010.

### Alcance

Incluye:

- `public/robots.txt` con `Allow: /` y `Sitemap:` absoluto
- `public/sitemap.xml` con un único `<url>` apuntando a `site.url`
- Documentación D-026 y referencias cruzadas

Excluye:

- `@astrojs/sitemap` u otras dependencias (D-004)
- Multi-página / i18n
- Aviso legal, FAQPage, polish 004, derechos Suno
- Cambiar el dominio placeholder (D-025)
- Anular el `X-Robots-Tag: noindex` de previews Vercel (plataforma)

---

## User

No hay UI. Beneficia a quien llega desde Google cuando el deployment de **producción**
está indexable.

| Perfil | Qué necesita | Implicación |
|--------|--------------|-------------|
| Buscadores | Mapa de URLs y permiso de rastreo | Archivos en la raíz del sitio |

---

## Visual references

No aplica.

---

## Information Architecture

### 1. robots.txt

```
User-agent: *
Allow: /

Sitemap: https://burbujasdeluz.es/sitemap.xml
```

La URL del Sitemap debe coincidir con `site.url` / `astro.config` `site` (placeholder hasta
dominio real).

### 2. sitemap.xml

Un `urlset` con `loc` = origen del sitio (con o sin barra final coherente: preferir
`https://…/` o sin barra, una sola entrada), `changefreq` weekly, `priority` 1.0.

---

## Responsive requirements

No aplica.

---

## Accessibility

No aplica (archivos de crawler).

---

## Performance

Cero JS, cero dependencias. Dos archivos estáticos copiados a `dist/` en el build.

---

## SEO

Esta SPEC **es** el bloque sitemap/robots aplazado en 001/010.

---

## Acceptance Criteria

### Build y tipos

- [x] `npm run check` termina con 0 errores, 0 warnings y 0 hints.
- [x] `npm run build` completa sin errores.
- [x] Existen `dist/robots.txt` y `dist/sitemap.xml`.

### Contenido

- [x] `robots.txt` permite `/` y declara `Sitemap:` absoluto bajo `site.url`.
- [x] `sitemap.xml` lista exactamente la home canónica (una URL).
- [x] Sin `@astrojs/sitemap` ni dependencias nuevas.

---

## Notas de implementación

1. Escribir los archivos en `public/` a mano.
2. Al cambiar dominio, actualizar `site.url`, `astro.config`, `robots.txt` y `sitemap.xml`
   juntos (D-025 / D-026).
3. Previews Vercel pueden seguir con `noindex` por cabecera; no es fallo de esta SPEC.

---

*Última actualización: agosto 2026*
