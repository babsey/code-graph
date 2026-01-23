<template>
  <div :title="intf.value as string">{{ intf.name }}</div>
</template>

<script setup lang="ts">
import type { CodeNodeInterface } from "../codeNode/codeNodeInterface";

defineProps<{ intf: CodeNodeInterface }>();
</script>
