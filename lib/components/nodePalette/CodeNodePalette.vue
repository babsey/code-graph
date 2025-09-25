<template>
  <div class="baklava-node-palette" @contextmenu.stop.prevent :class="{ '--open': viewModel.settings.palette.enabled }">
    <div class="baklava-node --palette" style="margin-top: -20px; margin-bottom: 20px">
      <input
        v-model="searchQuery"
        type="text"
        class="baklava-input"
        title="Filter nodes"
        @keyup="filterCategoryBySearch"
      />
    </div>

    <section v-for="c in filterCategoryBySearch()" :key="c.name">
      <h3 v-if="c.name !== 'default'" style="display: flex; justify-content: space-between;">
        <div @click="searchQuery=c.name" style="cursor: pointer;">{{ c.name }}</div>

        <div
          v-if="filterNodesBySearch(c.nodeTypes).length < Object.values(c.nodeTypes).length"
          style="margin: auto 0; font-size: 12px"
        >
          ( {{ filterNodesBySearch(c.nodeTypes).length }} / {{ Object.values(c.nodeTypes).length }} )
        </div>
      </h3>

      <PaletteEntry
        v-for="n in filterNodesBySearch(c.nodeTypes)"
        :key="n.type"
        :type="n.type"
        :title="n.title"
        @pointerdown="onDragStart(n.type, n)"
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

type NodeTypeInformations = Record<string, INodeTypeInformation>
interface ICategory {
  name: string
  nodeTypes: NodeTypeInformations
}

const { viewModel } = useViewModel()
const { x: mouseX, y: mouseY } = usePointer()
const { transform } = useTransform()
const categories = useNodeCategories(viewModel)

const editorEl = inject<Ref<HTMLElement | null>>('editorEl')

const searchQuery = ref<string>('')
const draggedNode = ref<IDraggedNode | null>(null)

const filterCategoryBySearch = () => {
  if (!searchQuery.value) return categories.value

  return categories.value.filter(
    (c: ICategory) =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      Object.values(c.nodeTypes).some((nodeType: INodeTypeInformation) =>
        nodeType.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
  )
}

const filterNodesBySearch = (nodeTypes: NodeTypeInformations) => {
  if (!searchQuery.value) return Object.values(nodeTypes)

  return Object.values(nodeTypes).filter(
    (nt: INodeTypeInformation) =>
      nt.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      nt.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
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
