// codeGraphStore.ts

import { defineStore } from "pinia";
import { reactive, ref, type Ref, type UnwrapRef } from "vue";
import type { IEditorState } from "@baklavajs/core";

import type { ICodeGraphViewModel } from "@babsey/code-graph";

import { registerExampleCodeGraph, registerNumpyCodeGraph } from "@/codes";

export const useCodeGraphStore = defineStore(
  "code-graph",
  () => {
    const state: UnwrapRef<{
      codeName: string;
      editorStates: Record<string, IEditorState>;
      token: symbol | null;
    }> = reactive({
      codeName: "example",
      editorStates: {},
      token: null,
    });

    const token = Symbol("CodeGraphStore");

    const viewModel = ref(null) as Ref<ICodeGraphViewModel>;

    const codeGraphs = {
      example: registerExampleCodeGraph(),
      numpy: registerNumpyCodeGraph(),
    } as Record<string, ICodeGraphViewModel>;

    const loadCodeGraph = (codeName: string) => {
      // console.log('load code graph', codeName)

      // unsubscribe()

      if (viewModel.value) {
        // viewModel.value.unsubscribe();
        viewModel.value.engine.stop();
      }

      if (!viewModel.value || viewModel.value.code.name !== codeName) viewModel.value = codeGraphs[codeName];

      // viewModel.value.unsubscribe();
      // viewModel.value.engine.stop();

      // viewModel.value.subscribe();
      viewModel.value.engine.start();

      // subscribe()
    };

    const loadEditor = (editorId?: string) => {
      // console.log('load editor', editorId)

      unsubscribe()

      const editorIds = Object.keys(state.editorStates);
      if (!editorId || !editorIds.includes(editorId)) return newEditor(viewModel.value.code.name);

      const editorState = state.editorStates[editorId];

      if (editorState) {
        // load code graph from the state
        if (editorState.codeName) loadCodeGraph(editorState.codeName as string);

        // load editor from editor state
        if (viewModel.value.displayedGraph.id !== editorId) viewModel.value.loadEditor(editorState);
      }

      subscribe()

      return true;
    };

    const newEditor = (codeName: string) => {
      // console.log('new editor', codeName)
      loadCodeGraph(codeName as string);

      // create new graph
      viewModel.value.newGraph();

      const editorId = saveEditor();
      return { name: "edit", params: { editorId } };
    };

    const removeEditorState = (editorId: string) => {
      // console.log('remove editor', editorId)
      delete state.editorStates[editorId];
    };

    const saveEditor = () => {
      // console.log('save editor', viewModel.value.editor.graph.id)
      state.editorStates[viewModel.value.editor.graph.id] = viewModel.value.editor.save();
      return viewModel.value.editor.graph.id;
    };

    const subscribe = () => {
      // console.log("subscribe");
      if (!viewModel.value) return;

      viewModel.value.engine.events.afterRun.subscribe(token, saveEditor);
      viewModel.value.editor.hooks.save.subscribe(token, (editorState: IEditorState) => {
        editorState.codeName = viewModel.value.code.name;
        return editorState;
      });
    };

    const unsubscribe = () => {
      // console.log("unsubscribe");
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
      subscribe,
      unsubscribe,
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
