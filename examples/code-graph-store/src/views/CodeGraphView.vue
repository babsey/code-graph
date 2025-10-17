<template>
  <div style="height: 100vh">
    <NavBar data-bs-theme="dark" />

    <div style="display: flex; overflow: hidden; height: calc(100vh - 38.4px)">
      <div style="width: 70vw; height: 100%">
        <CodeGraphEditor :view-model="codeGraph">
          <template #sidebarCodeEditor="{ node }">
            <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
          </template>
        </CodeGraphEditor>
      </div>

      <div style="width: 30vw; height: 100%">
        <CodeEditor
          v-model="codeGraph.code.script"
          :locked="codeGraph.code.lockCode"
          @update:locked="(v) => (codeGraph.code.lockCode = v)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CodeGraphEditor } from '@babsey/code-graph'

import CodeEditor from '../components/CodeEditor.vue'
import NavBar from '@/components/NavBar.vue'

import { useCodeGraphStore } from '../stores/codeGraphStore'
const codeGraphStore = useCodeGraphStore()
const codeGraph = computed(() => codeGraphStore.state.codeGraph)
</script>
