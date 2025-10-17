<template>
  <div style="display: flex; overflow: hidden">
    <div style="width: 70vw; height: 100vh">
      <CodeGraphEditor :view-model="codeGraph">
        <template #sidebarCodeEditor="{ node }">
          <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
        </template>
      </CodeGraphEditor>
    </div>

    <div style="width: 30vw; height: 100vh">
      <CodeEditor
        v-model="codeGraph.code.script"
        :locked="codeGraph.code.lockCode"
        @update:locked="(v) => (codeGraph.code.lockCode = v)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CodeGraphEditor, useCodeGraph } from '@babsey/code-graph'

import { MyCode } from './code'
import { registerNodeTypes } from './codeNodeTypes'
import CodeEditor from './components/CodeEditor.vue'

const codeGraph = useCodeGraph({ code: MyCode })

registerNodeTypes(codeGraph)

codeGraph.init()
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
