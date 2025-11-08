<template>
  <div class="home">
    <div class="card">
      <h3>Code Graph</h3>

      <div style="display: flex; border-radius: 0; vertical-align: middle">
        <div style="text-wrap: nowrap; margin: auto; padding: 0 12px">Create new:</div>
        <VueSelect v-model="codeGraphStore.state.codeName" :options placeholder="Select a workspace" />

        <div style="text-wrap: nowrap; margin: auto; padding: 0 8px">
          <router-link :class="{ disabled: codeGraphStore.state.codeName == null }" :to="{ name: 'new' }">
            <Plus style="height: 20px; color: black" />
          </router-link>
        </div>
      </div>

      <nav>
        <NavItem
          v-for="editorState in codeGraphStore.state.editorStates"
          :key="editorState.graph.id"
          :to="{ name: 'edit', params: { editorId: editorState.graph.id } }"
        >
          {{ editorState.codeName }}:
          {{ editorState.graph.id.slice(0, 6) }}
        </NavItem>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VueSelect from "vue3-select-component";

import { NavItem, Plus } from "@babsey/code-graph";

import { useCodeGraphStore } from "@/stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();

const options = computed(() => Object.keys(codeGraphStore.codeGraphs).map((m) => ({ label: m, value: m })));
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

    .disabled {
      opacity: 0.5;
      pointer-events: none;
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
