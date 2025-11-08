<template>
  <div style="height: 100vh">
    <CodeGraphInfo v-if="devMode" :view-model />
    <NavBar
      :view-model
      :editor-states="codeGraphStore.state.editorStates"
      @click:remove="codeGraphStore.removeEditorState"
    >
      <template #prepend>
        <NavItem :to="{ name: 'home' }">Home</NavItem>
      </template>
    </NavBar>

    <splitpanes
      :maximize-panes="false"
      class="default-theme"
      style="display: flex; overflow: hidden; height: calc(100vh - 40px)"
      @splitter-dblclick="() => resize()"
    >
      <pane :size>
        <CodeGraphEditor :view-model>
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
          v-model="viewModel.code.script"
          :locked="viewModel.code.lockCode"
          @update:locked="(v: boolean) => (viewModel.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";

import { CodeEditor, CodeGraphEditor, CodeGraphInfo, NavBar, NavItem } from "@babsey/code-graph";

import { useCodeGraphStore } from "../stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);

const devMode = ref(false);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);
</script>
