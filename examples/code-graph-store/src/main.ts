// main.ts

import { createApp } from 'vue';
import VueCodemirror from 'vue-codemirror';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from './App.vue';
import router from './router';

import { basicSetup, EditorView } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';

import 'splitpanes/dist/splitpanes.css';

// import '@baklavajs/themes/dist/classic.css'
import '@baklavajs/themes/dist/syrup-dark.css';
import '@babsey/code-graph/style.css';

import './assets/main.css';

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(router)

app.use(VueCodemirror, { tabSize: 2, extensions: [basicSetup, EditorView.lineWrapping, oneDark, python()] })

// mount after the initial navigation is ready
await router.isReady()

app.mount('#app')
