<template>
  <nav class="navbar">
    <NavItem>Home</NavItem>

    <NavItem
      v-for="editorState in codeGraphStore.state.editorStates"
      :key="editorState.graph.id"
      :to="{ name: 'edit', params: { editorId: editorState.graph.id } }"
      :class="{ active: editorState.graph.id === viewModel.displayedGraph.id }"
      :editor="editorState"
      :title="editorState.codeName"
    >
      {{ editorState.graph.id.slice(0, 6) }}

      <template #appendIcon>
        <button @click.prevent="codeGraphStore.removeEditorState(editorState.graph.id)" class="remove">
          <X />
        </button>
      </template>
    </NavItem>

    <NavItem :to="{ name: 'new', params: { codeName: codeGraphStore.state.codeName } }" class="navItem">
      <Plus class="plus" />
    </NavItem>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Plus, X } from "../icons";

import NavItem from "./NavItem.vue";

import { useCodeGraphStore } from "@/stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);
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
