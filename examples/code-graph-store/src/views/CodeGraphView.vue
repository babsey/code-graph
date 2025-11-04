<template>
  <div style="height: 100vh">
    <NavBar data-bs-theme="dark" />

    <splitpanes
      class="default-theme"
      style="display: flex; overflow: hidden; height: calc(100vh - 40px)"
      :maximize-panes="false"
      @splitterDblclick="() => resize()"
    >
      <pane :size>
        <CodeGraphEditor :view-model="codeGraph">
          <template #sidebarCodeEditor="{ node }">
            <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
          </template>
        </CodeGraphEditor>
      </pane>

      <pane :size="100 - size">
        <CodeEditor
          v-model="codeGraph.code.script"
          :locked="codeGraph.code.lockCode"
          @update:locked="(v) => (codeGraph.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { CodeGraphEditor } from "@babsey/code-graph";
import { Splitpanes, Pane } from "splitpanes";

import CodeEditor from "../components/CodeEditor.vue";
import NavBar from "@/components/NavBar.vue";

import { useCodeGraphStore } from "../stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const codeGraph = computed(() => codeGraphStore.state.codeGraph);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);
</script>
