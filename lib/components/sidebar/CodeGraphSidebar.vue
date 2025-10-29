<template>
  <div :class="{ '--open': graph.sidebar.visible }" :style="styles" class="baklava-sidebar" ref="el">
    <div v-if="resizable" class="__resizer" @mousedown="startResize" />

    <template v-if="node">
      <div class="__header">
        <button tabindex="-1" class="__close" @click="close">&times;</button>
        <div class="__node-name">
          <b>{{ node.title }}</b>
        </div>
      </div>

      <div class="__interfaces">
        <div class="__inputs">
          <div v-for="intf in displayedInputInterfaces" :key="intf.id" class="__interface">
            <div style="display: flex">
              <Checkbox
                v-model="intf.hidden"
                :disabled="!intf.optional"
                inversed
                style="padding-right: 8px"
                @update:model-value="() => node?.events.update.emit(null)"
              />
              <component :is="intf.component" v-model="intf.value" :node="node" :intf="intf" style="width: 100%" />
            </div>
          </div>
        </div>

        <div class="__outputs">
          <template v-if="codeNode && codeNode.state">
            <div class="__interface">
              <label>Variable name</label>
              <input
                v-model="codeNode.state.variableName"
                type="text"
                class="baklava-input"
                title="Variable name"
                @blur="doneRenaming"
                @keydown.enter="doneRenaming"
              />
            </div>
          </template>

          <div v-for="intf in displayedOutputInterfaces" :key="intf.id" class="__interface">
            <div style="display: flex">
              <Checkbox
                v-model="intf.hidden"
                :disabled="!intf.optional"
                inversed
                style="padding-right: 8px"
                @update:model-value="() => node?.events.update.emit(null)"
              />
              <component :is="intf.component" v-model="intf.value" :node="node" :intf="intf" style="width: 100%" />
            </div>
          </div>
        </div>
      </div>

      <slot name="codeEditor" :node />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { useGraph, useViewModel } from "baklavajs";

import Checkbox from "./Checkbox.vue";
import type { AbstractCodeNode } from "@/codeNode/codeNode";

const { viewModel } = useViewModel();
const { graph } = useGraph();

const el = ref<HTMLElement | null>(null);

const width = toRef(viewModel.value.settings.sidebar, "width");
const resizable = computed(() => viewModel.value.settings.sidebar.resizable);
let resizeStartWidth = 0;
let resizeStartMouseX = 0;

const node = computed(() => {
  const id = graph.value.sidebar.nodeId;
  return graph.value.nodes.find((x) => x.id === id);
});

const codeNode = computed(() => node.value as AbstractCodeNode);

const styles = computed(() => ({
  width: `${width.value}px`,
}));

const displayedInputInterfaces = computed(() => {
  if (!codeNode.value) return [];

  return Object.values(codeNode.value.inputs).filter((intf) => intf.displayInSidebar && intf.component);
});

const displayedOutputInterfaces = computed(() => {
  if (!codeNode.value) return [];

  return Object.values(codeNode.value.outputs).filter((intf) => intf.displayInSidebar && intf.component);
});

const close = () => {
  graph.value.sidebar.visible = false;
};

const doneRenaming = () => {
  node.value?.events.update.emit(null);
};

const startResize = (event: MouseEvent) => {
  resizeStartWidth = width.value;
  resizeStartMouseX = event.clientX;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener(
    "mouseup",
    () => {
      window.removeEventListener("mousemove", onMouseMove);
    },
    { once: true },
  );
};

const onMouseMove = (event: MouseEvent) => {
  const maxwidth = el.value?.parentElement?.getBoundingClientRect().width ?? 500;
  const deltaX = event.clientX - resizeStartMouseX;
  let newWidth = resizeStartWidth - deltaX;
  if (newWidth < 300) {
    newWidth = 300;
  } else if (newWidth > 0.9 * maxwidth) {
    newWidth = 0.9 * maxwidth;
  }
  width.value = newWidth;
};
</script>

<style lang="scss">
.__interfaces {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
