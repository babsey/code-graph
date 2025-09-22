<template>
  <div style="display: flex; overflow: hidden">
    <div style="width: 70vw; height: 100vh">
      <CodeGraphEditor :view-model="codeGraph" />
    </div>
    <div style="width: 30vw; height: 100vh">
      <codemirror v-model="codeGraph.code.state.script" class="codemirror" style="height: 100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CodeGraphEditor, useCodeGraph } from '@code-graph'
import { registerDefaultNodeTypes, registerExampleNodeTypes } from './codeNodeTypes'

const codeGraph = useCodeGraph()
codeGraph.code.loadTemplate(import('./templates/python.mustache?raw'))

registerDefaultNodeTypes(codeGraph)
registerExampleNodeTypes(codeGraph)
</script>

<style>
body {
  margin: 0;
}

.codemirror {
  padding: 0;
  border: 0;
}
</style>
