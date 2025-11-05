<template>
  <div style="height: 100vh">
    <CodeGraphInfo v-if="devMode" :viewModel />
    <NavBar />

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
          @update:locked="(v) => (viewModel.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { CodeGraphEditor, CodeGraphInfo } from "@babsey/code-graph";
import { Splitpanes, Pane } from "splitpanes";

import CodeEditor from "@/components/CodeEditor.vue";
import NavBar from "@/components/NavBar.vue";

import { useCodeGraphStore } from "../stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);

const devMode = ref(false);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);

onMounted(() => {
  codeGraphStore.subscribe()
  viewModel.value.subscribe();
  viewModel.value.engine?.start();
});

onUnmounted(() => {
  codeGraphStore.unsubscribe()
  viewModel.value.unsubscribe();
  viewModel.value.engine?.stop();
});
</script>
