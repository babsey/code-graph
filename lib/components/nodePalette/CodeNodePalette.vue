<template>
  <div
    class="baklava-node-palette"
    @contextmenu.stop.prevent=""
    :class="{ '--open': viewModel.settings.palette.enabled }"
  >
    <div class="baklava-node --palette" style="margin-top: -20px; margin-bottom: 30px">
      <input v-model="searchQuery" type="text" class="baklava-input" title="Filter node types" />
    </div>

    <section v-for="c in filterCategoryBySearch(categories)" :key="c.name">
      <h3 v-if="c.name !== 'default'">
        {{ c.name }}
      </h3>
      <PaletteEntry
        v-for="(ni, nt) in filterNodesBySearch(c.nodeTypes)"
        :key="nt"
        :type="nt"
        :title="ni.title"
        @pointerdown="onDragStart(nt, ni)"
      />
    </section>
  </div>

  <transition name="fade">
    <div v-if="draggedNode" class="baklava-dragged-node" :style="draggedNodeStyles">
      <PaletteEntry :type="draggedNode.type" :title="draggedNode.nodeInformation.title" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { type CSSProperties, type Ref, computed, inject, reactive, ref } from 'vue'
import { usePointer } from '@vueuse/core'
import { AbstractNode, type INodeTypeInformation, useNodeCategories, useTransform, useViewModel } from 'baklavajs'

import PaletteEntry from './PaletteEntry.vue'

interface IDraggedNode {
  type: string
  nodeInformation: INodeTypeInformation
}

const { viewModel } = useViewModel()
const { x: mouseX, y: mouseY } = usePointer()
const { transform } = useTransform()
const categories = useNodeCategories(viewModel)

const editorEl = inject<Ref<HTMLElement | null>>('editorEl')

const searchQuery = ref<string | null>('')
const draggedNode = ref<IDraggedNode | null>(null)

const filterCategoryBySearch = (categories: { name: string; nodeTypes: NodeTypeInformations }[]) => {
  if (searchQuery.value) {
    return categories.filter((c) =>
      Object.values(c.nodeTypes).some((nodeType: INodeTypeInformation) =>
        nodeType.title.toLowerCase().includes(searchQuery.value?.toLowerCase()),
      ),
    )
  }
  return categories
}

const filterNodesBySearch = (nodeTypes: NodeTypeInformations) => {
  if (searchQuery.value) {
    return Object.values(nodeTypes).filter((nt: INodeTypeInformation) =>
      nt.title.toLowerCase().includes(searchQuery.value?.toLowerCase()),
    )
  }
  return Object.values(nodeTypes)
}

const draggedNodeStyles = computed<CSSProperties>(() => {
  if (!draggedNode.value || !editorEl?.value) return {}

  const { left, top } = editorEl.value.getBoundingClientRect()
  return {
    top: `${mouseY.value - top}px`,
    left: `${mouseX.value - left}px`,
  }
})

const onDragStart = (type: string, nodeInformation: INodeTypeInformation) => {
  draggedNode.value = {
    type,
    nodeInformation,
  }

  const onDragEnd = () => {
    const instance = reactive(new nodeInformation.type()) as AbstractNode
    viewModel.value.displayedGraph.addNode(instance)

    const rect = editorEl!.value!.getBoundingClientRect()
    const [x, y] = transform(mouseX.value - rect.left, mouseY.value - rect.top)
    instance.position.x = x
    instance.position.y = y

    draggedNode.value = null
    document.removeEventListener('pointerup', onDragEnd)
  }
  document.addEventListener('pointerup', onDragEnd)
}
</script>

<style lang="scss">
.baklava-node-palette {
  transform: translateX(-300px);
  transition: transform 0.5s;

  &.--open {
    transform: translateX(0);
  }

  .v-expansion-panel {
    background-color: transparent;
    color: rgba(var(--v-theme-surface), var(--v-high-emphasis-opacity));
  }
}
</style>
