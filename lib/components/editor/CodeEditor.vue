<template>
  <div class="code-editor">
    <div class="code-buttons">
      <button v-if="locked" class="baklava-button" title="The code is locked." @click="lockCode(false)">
        <LockCode />
      </button>

      <CopyToClipboard :text="modelValue" />
    </div>

    <codemirror v-model="model" :extensions class="codemirror" style="height: 100%" @keydown="lockCode(true)" />
  </div>
</template>

<script setup lang="ts">
import type { Extension } from "@codemirror/state";

import { LockCode } from "@/icons";
import CopyToClipboard from "./CopyToClipboard.vue";

const model = defineModel({ required: true, type: String });
defineProps<{ locked: boolean; extensions?: Extension[] }>();

const emit = defineEmits<{
  (e: "update:locked", v: boolean): void;
}>();

const lockCode = (v: boolean) => emit("update:locked", v);
</script>

<style lang="scss">
.code-editor {
  height: 100%;
  min-height: 60px;
  position: relative;
  width: 100%;

  .code-buttons {
    position: absolute;
    display: flex;
    right: 0;
    z-index: 1;
    margin: 8px;

    .baklava-button {
      border-radius: 8px;
      margin: 0 2px;
    }
  }

  .codemirror {
    border: 0;
    font-size: 13px !important;
    padding: 0;
  }
}
</style>
