<template>
  <div style="display: flex; overflow: hidden; width: 100vw; height: 100vh">
    <!-- <div style="position: absolute; z-index: 10; color: white; background-color: black;">
      <div>Editor graph: {{ viewModel.editor.graph.shortId }}</div>
      <div>Displayed graph: {{ viewModel.displayedGraph.shortId }}</div>
      <div>Graphs: {{ viewModel.editor.graphIds }}</div>
      <div>Graph templates: {{ viewModel.editor.graphTemplateIds }}</div>
    </div> -->

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

import { CodeGraphEditor, registerCodeEngine, useCodeGraph } from "@babsey/code-graph";

import { MyCode } from "./code";
import { registerNodeTypes } from "./codeNodeTypes";
import CodeEditor from "./components/CodeEditor.vue";

const viewModel = useCodeGraph({ code: new MyCode() });
registerCodeEngine(viewModel);
registerNodeTypes(viewModel);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
