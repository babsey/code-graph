<template>
  <div style="display: flex; overflow: hidden; width: 100vw; height: 100vh">
    <!-- <BaklavaEditor :viewModel /> -->

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
import { useBaklava, BaklavaEditor } from "baklavajs";

import {
  CodeGraphEditor,
  addToolbarItems,
  registerCodeEngine,
  registerCustomCommands,
  useCodeGraph,
} from "@babsey/code-graph";

import { MyCode } from "./code";
import { registerNodeTypes } from "./codeNodeTypes";
import CodeEditor from "./components/CodeEditor.vue";

// const viewModel = useBaklava();

const viewModel = useCodeGraph({ code: new MyCode() });
registerCodeEngine(viewModel);

// add custom commands to the toolbar
registerCustomCommands(viewModel.displayedGraph, viewModel.commandHandler, viewModel.settings);
addToolbarItems(viewModel.settings);

registerNodeTypes(viewModel);
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
