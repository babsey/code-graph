<template>
  <div :title="intf.state?.script">{{ intf.name }}</div>
</template>

<script setup lang="ts">
import type { CodeNodeInterface } from "./codeNodeInterface";

defineProps<{ intf: CodeNodeInterface }>();
</script>
