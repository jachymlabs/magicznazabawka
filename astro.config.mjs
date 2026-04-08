import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://sklep.jachymlabs.pl',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PUBLIC_', 'VENDURE_', 'META_'],
  },
  server: {
    port: 4321,
    host: true,
  },
});
