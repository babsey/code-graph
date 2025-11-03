<template>
  <div :title="intf.value">{{ intf.name }}</div>
</template>

<script setup lang="ts">
import type { CodeNodeInterface } from "./codeNodeInterface";

defineProps<{ intf: CodeNodeInterface }>();
</script>
