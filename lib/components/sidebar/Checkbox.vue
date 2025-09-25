<template>
  <div
    class="baklava-checkbox"
    :class="{ '--checked': inversed ? !modelValue : modelValue, '--disabled': disabled }"
    :title="name"
    @click="emit('update:modelValue', !modelValue)"
  >
    <div class="__checkmark-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
        <path class="__checkmark" d="M 6 5 L 6 10 L 16 10" transform="rotate(-45 10 10)" />
      </svg>
    </div>
    <div v-if="name" class="__label">
      {{ name }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean
  inversed?: boolean
  modelValue: boolean
  name?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()
</script>
