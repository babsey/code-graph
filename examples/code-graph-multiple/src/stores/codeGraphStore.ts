// codeGraphStore.ts

import { defineStore } from "pinia";
import { reactive, type UnwrapRef } from "vue";
import type { IEditorState } from "@baklavajs/core";

export const useCodeGraphStore = defineStore(
  "code-graph",
  () => {
    const state: UnwrapRef<{
      codeName: string;
      editorStates: Record<string, IEditorState>;
    }> = reactive({
      codeName: "example",
      editorStates: {},
    });

    return { state };
  },
  {
    persist: {
      storage: sessionStorage, // localStorage
      pick: ["state.codeName", "state.editorStates"],
    },
  },
);
