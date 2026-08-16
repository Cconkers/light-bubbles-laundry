// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

/** Debe coincidir con `site.url` en src/data/content.ts (D-025). */
const siteUrl = 'https://burbujasdeluz.es';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  vite: {
    plugins: [tailwindcss()]
  }
});
