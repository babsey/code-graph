<template>
  <div style="height: 100vh">
    <CodeGraphInfo v-if="devMode" :viewModel />
    <NavBar
      :viewModel
      :editorStates="codeGraphStore.state.editorStates"
      @click:remove="codeGraphStore.removeEditorState"
    >
      <template #prepend>
        <NavItem :to="{ name: 'home' }">Home</NavItem>
      </template>
    </NavBar>

    <splitpanes
      class="default-theme"
      style="display: flex; overflow: hidden; height: calc(100vh - 40px)"
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
          @update:locked="(v: boolean) => (viewModel.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";

import { CodeEditor, CodeGraphEditor, CodeGraphInfo, NavBar, NavItem } from "@babsey/code-graph";

import { useCodeGraphStore } from "../stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);

const devMode = ref(false);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);

onMounted(() => {
  codeGraphStore.subscribe();
});

onBeforeUnmount(() => {
  codeGraphStore.unsubscribe();
});
</script>
