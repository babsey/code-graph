// vite.config.ts

import { dirname, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import vueDevTools from 'vite-plugin-vue-devtools'
// import dts from 'unplugin-dts/vite'

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "@babsey/code-graph",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: [
        "@baklavajs/core",
        "@baklavajs/engine",
        "@baklavajs/events",
        "@baklavajs/interface-types",
        "@baklavajs/renderer-vue",
        "@baklavajs/themes",
        "@vueuse/core",
        "baklavajs",
        "codemirror",
        "mustache",
        "splitpanes",
        "toposort",
        "uuid",
        "vue",
        "vue-codemirror"
      ],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          "@baklavajs/core": "@baklavajs/core",
          "@baklavajs/engine": "@baklavajs/engine",
          "@baklavajs/events": "@baklavajs/events",
          "@baklavajs/interface-types": "@baklavajs/interface-types",
          "@baklavajs/renderer-vue": "@baklavajs/renderer-vue",
          "@baklavajs/themes": "@baklavajs/themes",
          "@vueuse/core": "@vueuse/core",
          "baklavajs": "baklavajs",
          "codemirror": "codemirror",
          "mustache": "mustache",
          "splitpanes": "splitpanes",
          "toposort": "toposort",
          "uuid": "uuid",
          "vue": "vue",
          "vue-codemirror": "vue-codemirror",
        },
      },
    },
    minify: true,
  },
  plugins: [
    vue(),
    // vueDevTools(),
    // dts({ exclude: ['./lib/main.ts'], processor: 'vue', tsconfigPath: './tsconfig.app.json' }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./lib", import.meta.url)),
      "@babsey/code-graph": fileURLToPath(new URL("./lib", import.meta.url)),
    },
  },
  server: {
    watch: {
      ignored: ["**/examples/**"],
    },
  },
});
