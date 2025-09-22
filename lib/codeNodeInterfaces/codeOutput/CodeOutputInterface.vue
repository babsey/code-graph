<template>
  <div :title="intf.state?.script">{{ intf.name }}</div>
</template>

<script setup lang="ts">
import type { CodeOutputInterface } from './codeOutputInterface'

defineProps<{ intf: CodeOutputInterface }>()
</script>
