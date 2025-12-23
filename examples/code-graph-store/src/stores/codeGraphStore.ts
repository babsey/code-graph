// codeGraphStore.ts

import { reactive, type UnwrapRef } from "vue";
import type { IEditorState } from "@baklavajs/core";
import { defineStore } from "pinia";

export const useCodeGraphStore = defineStore(
  "code-graph",
  () => {
    const state: UnwrapRef<{
      editorStates: Record<string, IEditorState>;
    }> = reactive({
      editorStates: {},
    });

    return { state };
  },
  {
    persist: {
      storage: localStorage, // localStorage, sessionStorage
      pick: ["state.editorStates"],
    },
  },
);
