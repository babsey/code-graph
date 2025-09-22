// vite.config.ts

import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
// import vueDevTools from 'vite-plugin-vue-devtools'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: '@code-graph',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: ['@baklavajs/themes', '@vueuse/core', 'baklavajs', 'mustache', 'toposort', 'uuid', 'vue'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          '@vueuse/core': '@vueuse/core',
          baklavajs: 'baklavajs',
          mustache: 'mustache',
          toposort: 'toposort',
          uuid: 'uuid',
          vue: 'Vue',
        },
      },
    },
    minify: false,
  },
  plugins: [
    vue(),
    // vueDevTools(),
    dts({ include: ['lib'] }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
      '@code-graph': fileURLToPath(new URL('./lib', import.meta.url)),
    },
  },
})
