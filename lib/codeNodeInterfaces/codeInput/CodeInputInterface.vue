<template>
  <div :title="intf.state?.script">{{ intf.name }}</div>
</template>

<script setup lang="ts">
import type { CodeInputInterface } from './codeInputInterface'

defineProps<{ intf: CodeInputInterface }>()
</script>
