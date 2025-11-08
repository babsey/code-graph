<template>
  <div style="display: flex; overflow: hidden; width: 100vw; height: 100vh">
    <CodeGraphInfo v-if="devMode" :viewModel />

    <splitpanes
      class="default-theme"
      style="display: flex; overflow: hidden; height: 100vh"
      :maximize-panes="false"
      @splitterDblclick="() => resize()"
    >
      <pane :size>
        <CodeGraphEditor :viewModel>
          <template #sidebarCodeEditor="{ node }">
            <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
          </template>
        </CodeGraphEditor>
      </pane>

      <pane :size="100 - size">
        <CodeEditor
          v-if="viewModel.code"
          v-model="viewModel.code.script"
          :locked="viewModel.code.lockCode"
          @update:locked="(v) => (viewModel.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";

import { CodeEditor, CodeGraphEditor, CodeGraphInfo, PythonCode, useCodeGraph } from "@babsey/code-graph";

import { registerNodeTypes } from "./codeNodeTypes";

const viewModel = useCodeGraph({ code: new PythonCode() });
registerNodeTypes(viewModel);

const devMode = ref(false);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
