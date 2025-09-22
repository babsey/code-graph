<template>
  <BaklavaEditor :view-model>
    <template #palette>
      <CodeNodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node as AbstractCodeNode)" />
    </template>

    <template #sidebar="nodeProps">
      <CodeGraphSidebar v-bind="nodeProps" />
    </template>
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRef } from 'vue'
import { BaklavaEditor } from 'baklavajs'

import type { AbstractCodeNode } from '@/codeNode'

import CodeGraphNode from './node/CodeGraphNode.vue'
import CodeGraphSidebar from './sidebar/CodeGraphSidebar.vue'
import CodeNodePalette from './nodePalette/CodeNodePalette.vue'
import type { ICodeGraphViewModel } from '@/viewModel'

const props = defineProps<{ viewModel: ICodeGraphViewModel }>()
const viewModel = toRef(props, 'viewModel')

const onUpdate = (node: AbstractCodeNode) => node.events.update.emit(null)

onMounted(() => {
  viewModel.value.subscribe()
  viewModel.value.engine.start()
})

onUnmounted(() => {
  viewModel.value.unsubscribe()
  viewModel.value.engine.stop()
})
</script>
