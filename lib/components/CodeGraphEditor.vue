<template>
  <BaklavaEditor :viewModel="viewModelRef" :key="viewModelRef.displayedGraph.id">
    <!-- <template #palette>
      <CodeNodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node as AbstractCodeNode)" />
    </template>

    <template #sidebar="sidebarProps">
      <CodeGraphSidebar v-bind="sidebarProps">
        <template #codeEditor="{ node }">
          <slot name="sidebarCodeEditor" :node />
        </template>
      </CodeGraphSidebar>
    </template> -->
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRef } from "vue";
// import { BaklavaEditor } from "baklavajs";
import { BaklavaEditor } from "@baklavajs/renderer-vue";

import type { AbstractCodeNode } from "@/codeNode";
import type { ICodeGraphViewModel } from "@/viewModel";

import CodeGraphNode from "./node/CodeGraphNode.vue";
import CodeGraphSidebar from "./sidebar/CodeGraphSidebar.vue";
import CodeNodePalette from "./nodePalette/CodeNodePalette.vue";

const props = defineProps<{ viewModel: ICodeGraphViewModel }>();
const viewModelRef = toRef(props, "viewModel");

const onUpdate = (node: AbstractCodeNode) => node.events.update.emit(null);

onMounted(() => {
  if (viewModelRef.value.subscribe) viewModelRef.value.subscribe();
  viewModelRef.value.engine?.start();
});

onUnmounted(() => {
  if (viewModelRef.value.unsubscribe) viewModelRef.value.unsubscribe();
  viewModelRef.value.engine?.stop();
});
</script>
