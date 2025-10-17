<template>
  <BNav small>
    <BNavItem :to="{ name: 'home' }"> Home </BNavItem>

    <BNavItem
      v-for="editor in codeGraphStore.state.editorStates"
      :key="editor.graph.id"
      :to="{ name: 'edit', params: { editorId: editor.graph.id } }"
    >
      {{ editor.graph.id.slice(0, 6) }}

      <BButton @click.prevent="codeGraphStore.removeEditorState(editor.graph.id)" class="remove">
        <X />
      </BButton>
    </BNavItem>
    <BNavItem :to="{ name: 'new' }"><Plus style="height: 21px !important" /></BNavItem>
  </BNav>
</template>

<script setup lang="ts">
import { BNav, BNavItem } from 'bootstrap-vue-next'
import { Plus, X } from '../icons'

import { useCodeGraphStore } from '@/stores/codeGraphStore'
const codeGraphStore = useCodeGraphStore()
</script>

<style>
.active {
  color: #fff;
  background-color: #0d6efd;
}

.remove {
  margin-left: 12px;
  padding: 2px;
}

.remove svg {
  display: inline;
  height: 12px !important;
  width: 12px !important;
}

.remove:hover svg {
  stroke-width: var(--icon-stroke, 4);
}
</style>
