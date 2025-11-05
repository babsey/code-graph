<template>
  <BaklavaEditor :viewModel="viewModelRef">
    <template #palette>
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
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRef } from "vue";
import { BaklavaEditor } from "@baklavajs/renderer-vue";

import type { AbstractCodeNode } from "@/codeNode";
import type { ICodeGraphViewModel } from "@/viewModel";
import { CodeGraphNode, CodeGraphSidebar, CodeNodePalette } from "@/components";

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
