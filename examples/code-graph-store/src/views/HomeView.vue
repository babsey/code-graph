<template>
  <div class="home">
    <div class="card">
      <h3>Code Graph</h3>

      <nav>
        <NavItem :to="{ name: 'new' }">
          <template #prependIcon><Plus /></template>
          New graph
        </NavItem>

        <NavItem
          v-for="editor in codeGraphStore.state.editorStates"
          :key="editor.graph.id"
          :to="{ name: 'edit', params: { editorId: editor.graph.id } }"
        >
          {{ editor.graph.id.slice(0, 6) }}
        </NavItem>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavItem, Plus } from "@babsey/code-graph";

import { useCodeGraphStore } from "@/stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
</script>

<style lang="scss">
.home {
  display: flex;
  justify-items: center;
  height: 100vh;

  .card {
    margin: auto;
    min-width: 300px;
    background-color: var(--baklava-toolbar-foreground);
    color: black;
    border-radius: 12px;

    h3 {
      margin: 8px 20px;
      font-weight: bold;
    }

    nav {
      padding: 0;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      color: black;
    }
  }
}
</style>
