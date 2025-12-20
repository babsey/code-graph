<template>
  <div v-if="viewModel.isReady">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useCodeGraphStore } from "./stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
