<template>
  <div
    :id="node.id"
    ref="el"
    :class="classes"
    :data-node-type="node.type"
    :style="styles"
    class="baklava-node"
    @pointerdown="select"
  >
    <div v-if="viewModel.settings.nodes.resizable" class="__resize-handle" @mousedown="startResize" />

    <div class="__title" @pointerdown.self.stop="startDrag" @contextmenu.prevent="openContextMenu">
      <CodeGraphNodeInterface
        v-if="node.inputs._code"
        :node
        :intf="node.inputs._code"
        :title="node.inputs._code.value"
        class="--input"
        data-interface-type="node"
        style="flex-grow: 0"
      />

      <template v-if="!renaming">
        <div class="__title-label" style="flex-grow: 1">
          <span v-if="node.idx > -1">{{ node.idx + 1 }} - </span>{{ node.title }}
        </div>
        <div class="__menu" style="display: flex">
          <template v-if="node.isCodeNode">
            <LockCode class="--clickable mx-1" @click="node.lockCode = false" v-if="node.state.lockCode" />
            <CodeVariable class="--clickable mx-1" @click="setIntegrated(false)" v-if="node.state.integrated" />
            <TransitionBottom class="--clickable mx-1" @click="setIntegrated(true)" v-else />
            <LayoutSidebarRightExpand
              class="--clickable mx-1"
              @click="openSidebar"
              v-if="!viewModel.displayedGraph.sidebar.visible && viewModel.displayedGraph.sidebar.nodeId !== node.id"
            />
            <LayoutSidebarRight
              class="--clickable mx-1"
              @click="updateSidebar"
              v-else-if="
                viewModel.displayedGraph.sidebar.visible && viewModel.displayedGraph.sidebar.nodeId !== node.id
              "
            />
            <LayoutSidebarRightCollapse class="--clickable mx-1" @click="closeSidebar" v-else />
          </template>
          <DotsVertical class="--clickable mx-1" @click="openContextMenu" />
          <ContextMenu v-model="showContextMenu" :x="0" :y="0" :items="contextMenuItems" @click="onContextMenuClick" />
        </div>
      </template>
      <input
        v-else
        ref="renameInputEl"
        v-model="tempName"
        class="baklava-input"
        placeholder="Node Name"
        style="flex-grow: 1"
        type="text"
        @blur="doneRenaming"
        @keydown.enter="doneRenaming"
      />

      <CodeGraphNodeInterface
        v-if="node.outputs._code"
        :node
        :intf="node.outputs._code"
        class="--output"
        :title="node.outputs._code.value"
        data-interface-type="node"
      />
    </div>

    <div class="__content" :class="classesContent" @keydown.delete.stop @contextmenu.prevent>
      <!-- Outputs -->
      <div class="__outputs">
        <template v-for="output in displayedOutputs" :key="output.id">
          <div v-if="node.state?.hidden">
            <div
              v-if="output.port"
              :id="output.id"
              :title="output.name"
              class="baklava-node-interface --output --connected"
            >
              <div class="__port" />
            </div>
          </div>

          <slot v-else name="nodeInterface" type="output" :node :intf="output">
            <NodeInterface :node :intf="output" :title="output.type" />
          </slot>
        </template>
      </div>

      <!-- Inputs -->
      <div class="__inputs">
        <template v-for="input in displayedInputs" :key="input.id">
          <div v-if="node.state?.hidden">
            <div
              v-if="input.port"
              :id="input.id"
              :title="input.name"
              class="baklava-node-interface --input --connected"
            >
              <div class="__port" />
            </div>
          </div>

          <slot v-else :node :intf="input" name="nodeInterface" type="input">
            <NodeInterface :node :intf="input" :title="input.type" />
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUpdated, onMounted, onBeforeUnmount } from 'vue';
import { AbstractNode, Components, GRAPH_NODE_TYPE_PREFIX, type IGraphNode, useGraph, useViewModel } from 'baklavajs';

import type { AbstractCodeNode } from '@/codeNode';
import CodeGraphNodeInterface from '../nodeInterface/CodeGraphNodeInterface.vue';
import {
  CodeVariable,
  DotsVertical,
  LayoutSidebarRight,
  LayoutSidebarRightCollapse,
  LayoutSidebarRightExpand,
  LockCode,
  TransitionBottom,
} from '@/icons';

const ContextMenu = Components.ContextMenu;
const NodeInterface = Components.NodeInterface;

const props = withDefaults(
  defineProps<{
    node: AbstractCodeNode;
    selected?: boolean;
    dragging?: boolean;
  }>(),
  { selected: false },
);

const node = computed(() => props.node as AbstractCodeNode);

const emit = defineEmits<{
  (e: 'select'): void;
  (e: 'start-drag', ev: PointerEvent): void;
  (e: 'update'): void;
}>();

const { viewModel } = useViewModel();
const { graph, switchGraph } = useGraph();

const el = ref<HTMLElement | null>(null);
const renaming = ref(false);
const tempName = ref('');
const renameInputEl = ref<HTMLInputElement | null>(null);
const isResizing = ref(false);
let resizeStartWidth = 0;
let resizeStartMouseX = 0;

const showContextMenu = ref(false);
const contextMenuItems = computed(() => {
  const items = [
    { value: 'edit', label: 'Edit' },
    { value: 'rename', label: 'Rename' },
    { value: 'delete', label: 'Delete' },
  ];

  if (props.node.type.startsWith(GRAPH_NODE_TYPE_PREFIX)) {
    items.push({ value: 'editSubgraph', label: 'Edit Subgraph' });
  }

  return items;
});

const classes = computed(() => ({
  '--selected': props.selected,
  '--dragging': props.dragging,
  '--two-column': !!props.node.twoColumn,
  '--hidden': node.value.state?.hidden,
}));

const classesContent = computed(() => ({
  '--reverse-y': props.node.reverseY ?? viewModel.value.settings.nodes.reverseY,
}));

const styles = computed(() => ({
  'top': `${props.node.position?.y ?? 0}px`,
  'left': `${props.node.position?.x ?? 0}px`,
  '--width': `${props.node.width ?? viewModel.value.settings.nodes.defaultWidth}px`,
}));

const displayedInputs = computed(() => Object.values(props.node.inputs).filter((ni) => !ni.hidden));
const displayedOutputs = computed(() => Object.values(props.node.outputs).filter((ni) => !ni.hidden));

const select = () => {
  emit('select');
};

const startDrag = (ev: PointerEvent) => {
  if (!props.selected) {
    select();
  }

  emit('start-drag', ev);
};

const openContextMenu = () => {
  showContextMenu.value = true;
};

const closeSidebar = () => {
  const sidebar = viewModel.value.displayedGraph.sidebar;
  sidebar.nodeId = '';
  sidebar.visible = false;
};

const openSidebar = () => {
  const sidebar = viewModel.value.displayedGraph.sidebar;
  sidebar.nodeId = props.node.id;
  // sidebar.optionName = props.intf.name;
  sidebar.visible = true;
};

const updateSidebar = () => {
  const sidebar = viewModel.value.displayedGraph.sidebar;
  sidebar.nodeId = props.node.id;
};

const onContextMenuClick = async (action: string) => {
  switch (action) {
    case 'edit':
      openSidebar();
      break;
    case 'delete':
      graph.value.removeNode(props.node);
      break;
    case 'rename':
      tempName.value = props.node.title;
      renaming.value = true;
      await nextTick();
      renameInputEl.value?.focus();
      break;
    case 'editSubgraph':
      switchGraph((props.node as AbstractNode & IGraphNode).template);
      break;
  }
};

const doneRenaming = () => {
  node.value.title = tempName.value;
  renaming.value = false;
};

const onRender = () => {
  if (el.value) {
    viewModel.value.hooks.renderNode.execute({ node: props.node, el: el.value });
  }
};

const startResize = (ev: MouseEvent) => {
  isResizing.value = true;
  resizeStartWidth = props.node.width;
  resizeStartMouseX = ev.clientX;
  ev.preventDefault();
};

// const toggleCommented = () => {
//   if (!node.value.state) return;
//   node.value.state.commented = !node.value.state.commented;
//   emit("update");
// };

// const toggleHidden = () => {
//   node.value.state.hidden = !node.value.state.hidden;
//   emit("update");
// };

const setIntegrated = (value: boolean) => {
  if (!node.value.state) return;
  node.value.state.integrated = value;
  emit('update');
};

const doResize = (ev: MouseEvent) => {
  if (!isResizing.value) return;
  const deltaX = ev.clientX - resizeStartMouseX;
  const newWidth = resizeStartWidth + deltaX / graph.value.scaling;
  const minWidth = viewModel.value.settings.nodes.minWidth;
  const maxWidth = viewModel.value.settings.nodes.maxWidth;
  node.value.width = Math.max(minWidth, Math.min(maxWidth, newWidth));
};

const stopResize = () => {
  isResizing.value = false;
};

onMounted(() => {
  onRender();

  window.addEventListener('mousemove', doResize);
  window.addEventListener('mouseup', stopResize);
});
onUpdated(onRender);

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', doResize);
  window.removeEventListener('mouseup', stopResize);
});
</script>
