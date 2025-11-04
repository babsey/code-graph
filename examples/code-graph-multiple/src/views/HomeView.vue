<template>
  <div class="home">
    <div class="card">
      <h3>Code Graph</h3>

      <div style="display: flex; border-radius: 0; vertical-align: middle">
        <div style="text-wrap: nowrap; margin: auto; padding: 0 12px">Create new:</div>
        <VueSelect
          v-model="codeGraphStore.state.codeName"
          :options="[
            { label: 'example', value: 'example' },
            { label: 'numpy', value: 'numpy' },
            { label: 'norse', value: 'norse' },
          ]"
          placeholder="Select a workspace"
        />

        <div style="text-wrap: nowrap; margin: auto; padding: 0 8px">
          <router-link
            :class="{ disabled: codeGraphStore.state.codeName == null }"
            :to="{ name: 'new', params: { codeName: codeGraphStore.state.codeName } }"
          >
            <Plus style="height: 20px; color: black" />
          </router-link>
        </div>
      </div>

      <nav>
        <NavItem
          v-for="editor in codeGraphStore.state.editorStates"
          :key="editor.graph.id"
          :to="{ name: 'edit', params: { editorId: editor.graph.id } }"
        >
          {{ editor.codeName }}:
          {{ editor.graph.id.slice(0, 6) }}
        </NavItem>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueSelect from "vue3-select-component";

import { Plus } from "../icons";
import NavItem from "@/components/NavItem.vue";

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
