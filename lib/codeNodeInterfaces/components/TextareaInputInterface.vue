<template>
  <div>
    <label
      style="
        font-size: 12px;
        padding: 0 6px;
        position: absolute;
        top: -6px;
        background-color: var(--baklava-node-color-background);
      "
    >
      {{ intf.name }}
    </label>

    <textarea v-model="v" rows="5" class="baklava-input" :placeholder="intf.name" :title="intf.name" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import type { TextareaInputInterface } from "../textareaInput/textareaInputInterface";

export default defineComponent({
  props: {
    intf: {
      type: Object as () => TextareaInputInterface,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const v = computed({
      get: () => props.modelValue,
      set: (v) => {
        emit("update:modelValue", v);
      },
    });
    return { v };
  },
});
</script>
