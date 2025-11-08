<template>
  <div class="code-graph-info">
    <div>Editor graph: {{ viewModel.editor.graph.shortId }}</div>
    <div>Displayed graph: {{ viewModel.displayedGraph.shortId }}</div>
    <div>Graphs: {{ viewModel.editor.graphIds }}</div>
    <div>Graph templates: {{ viewModel.editor.graphTemplateIds }}</div>
    <div>Engine status: {{ viewModel.engine?.status }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ICodeGraphViewModel } from "@/viewModel";

defineProps<{ viewModel: ICodeGraphViewModel }>();
</script>

<style lang="scss">
.code-graph-info {
  background-color: var(--baklava-toolbar-background);
  color: var(--baklava-toolbar-foreground);
  padding: 4px;
  position: absolute;
  z-index: 10;
}
</style>
