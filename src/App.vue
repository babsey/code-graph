<template>
  <div style="display: flex; overflow: hidden; width: 100vw; height: 100vh">
    <div style="position: absolute; z-index: 1; color: white">
      {{ viewModel.editor.graph.shortId }}
      {{ viewModel.displayedGraph.shortId }}
    </div>

    <div style="width: 70vw; height: 100vh">
      <CodeGraphEditor :viewModel>
        <template #sidebarCodeEditor="{ node }">
          <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
        </template>
      </CodeGraphEditor>
    </div>

    <div style="width: 30vw; height: 100vh">
      <CodeEditor
        v-if="viewModel.code"
        v-model="viewModel.code.script"
        :locked="viewModel.code.lockCode"
        @update:locked="(v) => (viewModel.code.lockCode = v)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CodeGraphEditor,
  registerCodeEngine,
  registerCustomCommands,
  updateToolbarItems,
  useCodeGraph,
} from "@babsey/code-graph";

import { MyCode } from "./code";
import { registerNodeTypes } from "./codeNodeTypes";
import CodeEditor from "./components/CodeEditor.vue";

const viewModel = useCodeGraph({ code: new MyCode() });
registerCodeEngine(viewModel);
registerNodeTypes(viewModel);
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
