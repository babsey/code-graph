<template>
  <div style="display: flex; justify-items: center; height: 100vh">
    <BCard title="Code graph" style="margin: auto; min-width: 300px">
      <BCardText>
        <BListGroup>
          <BListGroupItem :to="{ name: 'new' }">
            <Plus style="height: 21px !important; display: inline" />
          </BListGroupItem>

          <BListGroupItem
            v-for="editor in codeGraphStore.state.editorStates"
            :key="editor.graph.id"
            :to="{ name: 'edit', params: { editorId: editor.graph.id } }"
          >
            {{ editor.graph.id.slice(0, 6) }}
          </BListGroupItem>
        </BListGroup>
      </BCardText>
    </BCard>
  </div>
</template>

<script setup lang="ts">
import { BCard, BCardText, BListGroup, BListGroupItem } from 'bootstrap-vue-next'

import { Plus } from '@/icons'

import { useCodeGraphStore } from '@/stores/codeGraphStore'
const codeGraphStore = useCodeGraphStore()
</script>
