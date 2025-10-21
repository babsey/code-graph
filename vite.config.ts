// vite.config.ts

import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'unplugin-dts/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: '@babsey/code-graph',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: ['@baklavajs/themes', '@vueuse/core', 'baklavajs', 'mustache', 'toposort', 'uuid', 'vue'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          '@vueuse/core': '@vueuse/core',
          'baklavajs': 'baklavajs',
          'mustache': 'mustache',
          'toposort': 'toposort',
          'uuid': 'uuid',
          'vue': 'Vue',
        },
      },
    },
    minify: true,
  },
  plugins: [
    vue(),
    // vueDevTools(),
    dts({ exclude: ['./lib/main.ts'], processor: 'vue', tsconfigPath: './tsconfig.app.json' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
      '@babsey/code-graph': fileURLToPath(new URL('./lib', import.meta.url)),
    },
  },
  server: {
    watch: {
      ignored: ['**/examples/**'],
    },
  },
})
