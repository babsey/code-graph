<template>
  <nav class="navbar">
    <slot name="prepend" />

    <NavItem
      v-for="editorState in editorStates"
      :key="editorState.graph.id"
      :class="{ active: editorState.graph.id === viewModel.displayedGraph.id }"
      :to="{ name: routes?.edit ?? 'edit', params: { editorId: editorState.graph.id } }"
    >
      {{ editorState.graph.id.slice(0, 6) }}

      <template #appendIcon>
        <button class="remove" @click.prevent="remove(editorState.graph.id)">
          <X />
        </button>
      </template>
    </NavItem>

    <slot name="append">
      <NavItem :to="{ name: routes?.new ?? 'new' }" class="navItem">
        <Plus class="plus" />
      </NavItem>
    </slot>
  </nav>
</template>

<script setup lang="ts">
import type { IEditorState } from "baklavajs";

import { Plus, X } from "@/icons";
import type { ICodeGraphViewModel } from "@/viewModel";

import NavItem from "./NavItem.vue";

defineProps<{ viewModel: ICodeGraphViewModel; editorStates: IEditorState[]; routes?: { edit: string; new: string } }>();

const emit = defineEmits<{
  (e: "click:remove", graphId: string): void;
}>();

const remove = (graphId: string) => {
  emit("click:remove", graphId);
};
</script>

<style lang="scss">
.navbar {
  display: flex;
  margin: 0;
  padding: 0;

  svg.plus {
    height: 1.4rem;
  }

  .appendIcon {
    button.remove {
      background-color: transparent;
      border: 0;
      margin-right: -8px;
      padding: 2px 8px;
      cursor: pointer;

      svg {
        color: var(--baklava-toolbar-foreground);
      }

      &:hover svg {
        stroke-width: var(--icon-stroke, 4);
      }
    }
  }
}
</style>
