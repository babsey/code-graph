// main.ts

import { createApp } from 'vue'
import VueCodemirror from 'vue-codemirror'
import { basicSetup } from 'codemirror'

import App from './App.vue'

import { oneDark } from '@codemirror/theme-one-dark'
// import "@baklavajs/themes/dist/classic.css";
import '@baklavajs/themes/dist/syrup-dark.css'

import '@code-graph/style.scss'

const extensions = [basicSetup, oneDark]

const app = createApp(App)

app.use(VueCodemirror, { extensions })


app.mount('#app')
