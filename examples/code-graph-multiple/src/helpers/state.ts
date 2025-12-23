// state.ts

import { ref, type Ref } from "vue";
import { type ICodeGraphViewModel } from "@babsey/code-graph";

import { useDefaultCodeGraph, useExampleCodeGraph, useNumpyCodeGraph } from "@/helpers/codeGraphs";
import { saveEditor } from "./editor";
import type { IEditorState } from "baklavajs";

export const codeGraphs: Record<string, ICodeGraphViewModel> = {
  default: useDefaultCodeGraph(),
  example: useExampleCodeGraph(),
  numpy: useNumpyCodeGraph(),
};

export const viewModel = ref(codeGraphs.default) as Ref<ICodeGraphViewModel>;

const token = Symbol("CodeGraphState");

viewModel.value.onMounted = () => {
  if (viewModel.value.subscribe) viewModel.value.subscribe();
  viewModel.value.engine?.events.afterRun.subscribe(token, saveEditor);

  viewModel.value.editor.hooks.save.subscribe(token, (editorState: IEditorState) => {
    return { codeName: viewModel.value.code.name, ...editorState };
  });

  viewModel.value.engine?.start();
  viewModel.value.engine?.runOnce(null);
};

viewModel.value.onBeforeUnmount = () => {
  viewModel.value.engine?.stop();

  viewModel.value.engine?.events.afterRun.unsubscribe(token);
  viewModel.value.editor.hooks.save.unsubscribe(token);

  if (viewModel.value.unsubscribe) viewModel.value.unsubscribe();
};

/**
 * Load view model of code graph.
 * @param codeName code name
 */
export const loadCodeGraph = (codeName: string) => {
  if (!viewModel.value) return;

  viewModel.value.onBeforeUnmount();

  if (viewModel.value.code.name !== codeName && Object.keys(codeGraphs).includes(codeName))
    viewModel.value = codeGraphs[codeName];

  viewModel.value.onMounted();
};
