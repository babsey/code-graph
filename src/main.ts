// main.ts

import { createApp } from 'vue'
import VueCodemirror from 'vue-codemirror'

import App from './App.vue'

import { basicSetup } from 'codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { python } from '@codemirror/lang-python'

// import '@baklavajs/themes/dist/classic.css'
import '@baklavajs/themes/dist/syrup-dark.css'
import '@babsey/code-graph/style.scss'

const app = createApp(App)

app.use(VueCodemirror, { tabSize: 2, extensions: [basicSetup, oneDark, python()] })

app.mount('#app')
