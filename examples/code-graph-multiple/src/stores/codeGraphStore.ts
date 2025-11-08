// codeGraphStore.ts

import { defineStore } from "pinia";
import { reactive, ref, type Ref, type UnwrapRef } from "vue";
import type { IEditorState } from "@baklavajs/core";

import type { ICodeGraphViewModel } from "@babsey/code-graph";

import { useDefaultCodeGraph, useExampleCodeGraph, useNumpyCodeGraph } from "@/codeGraphs";

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

    const token = Symbol("CodeGraphStore");

    const codeGraphs: Record<string, ICodeGraphViewModel> = {
      default: useDefaultCodeGraph(),
      example: useExampleCodeGraph(),
      numpy: useNumpyCodeGraph(),
    };

    const viewModel = ref(codeGraphs[state.codeName]) as Ref<ICodeGraphViewModel>;

    /**
     * Load view model of code graph.
     * @param codeName code name
     */
    const loadCodeGraph = (codeName: string) => {

      unsubscribe();

      if (viewModel.value) {
        viewModel.value.engine.stop();
        viewModel.value.unsubscribe();
      }

      if (!viewModel.value || (viewModel.value.code.name !== codeName && Object.keys(codeGraphs).includes(codeName)))
        viewModel.value = codeGraphs[codeName];

      viewModel.value.engine.start();
      viewModel.value.subscribe();

      subscribe();
    };

    /**
     * Load editor.
     * @param editorId editor id
     */
    const loadEditor = (editorId?: string) => {

      const editorIds = Object.keys(state.editorStates);
      if (!editorId || !editorIds.includes(editorId)) return newEditor();

      const editorState = state.editorStates[editorId];

      if (editorState) {
        // load code graph from the state
        loadCodeGraph(editorState.codeName ?? "default");

        // load editor from editor state
        viewModel.value.loadEditor(editorState);
      }

      return true;
    };

    /**
     * Create new editor
     */
    const newEditor = (codeName?: string) => {

      // load code graph.
      loadCodeGraph(codeName ?? state.codeName);

      // create new graph.
      viewModel.value.newGraph();

      return { name: "edit", params: { editorId: saveEditor() } };
    };

    /**
     * Remove editor state.
     * @param editorId editor ID
     */
    const removeEditorState = (editorId: string) => {
      delete state.editorStates[editorId];
    };

    /**
     * Save editor.
     */
    const saveEditor = () => {
      state.editorStates[viewModel.value.editor.graph.id] = viewModel.value.editor.save();
      return viewModel.value.editor.graph.id;
    };

    /**
     * Subscribe view model.
     */
    const subscribe = () => {
      if (viewModel.value) unsubscribe();

      viewModel.value.engine.events.afterRun.subscribe(token, saveEditor);
      viewModel.value.editor.hooks.save.subscribe(token, (editorState: IEditorState) => {
        return { codeName: viewModel.value.code.name, ...editorState };
      });
    };

    /**
     * Unsubscribe view model.
     */
    const unsubscribe = () => {
      if (!viewModel.value) return;

      viewModel.value.engine.events.afterRun.unsubscribe(token);
      viewModel.value.editor.hooks.save.unsubscribe(token);
    };

    return {
      codeGraphs,
      loadCodeGraph,
      loadEditor,
      newEditor,
      removeEditorState,
      state,
      viewModel,
    };
  },
  {
    persist: {
      storage: sessionStorage, // localStorage
      pick: ["state.codeName", "state.editorStates"],
    },
  },
);
