<template>
  <div v-if="viewModel.isReady" style="display: flex; overflow: hidden; width: 100vw; height: 100vh">
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
            <CodeEditor
              v-model="node.script"
              :locked="node.lockCode"
              @update:locked="(v: boolean) => (node.lockCode = v)"
            />
          </template>
        </CodeGraphEditor>
      </pane>

      <pane :size="100 - size">
        <CodeEditor
          v-if="viewModel.code"
          v-model="viewModel.code.script"
          :locked="viewModel.code.lockCode"
          @update:locked="(v: boolean) => (viewModel.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";

import { components } from "@babsey/code-graph";
const { CodeEditor, CodeGraphEditor, CodeGraphInfo } = components;

import { viewModel } from "./state";

const devMode = ref(false);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);
</script>

<style>
body {
  margin: 0;
}
</style>
