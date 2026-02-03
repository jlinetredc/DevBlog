// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import typography from '@tailwindcss/typography';

// https://astro.build/config
export default defineConfig({
    site: 'https://jlinetredc.github.io',
    base: '/DevBlog',
    trailingSlash: 'always',
    build: {
        format: 'directory',
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
