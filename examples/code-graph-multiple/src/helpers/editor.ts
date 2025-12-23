// editor.ts

import { loadCodeGraph, viewModel } from "./state";
import { useCodeGraphStore } from "../stores/codeGraphStore";

export const hasEditorState = (editorId?: string) => {
  if (!editorId) return false;
  const codeGraphStore = useCodeGraphStore();
  const editorIds = Object.keys(codeGraphStore.state.editorStates);
  return editorIds.includes(editorId);
};

/**
 * Load editor.
 * @param editorId editor ID
 */
export const loadEditor = (editorId?: string) => {
  if (!editorId || !hasEditorState(editorId)) return newEditor();
  const codeGraphStore = useCodeGraphStore();

  const editorState = codeGraphStore.state.editorStates[editorId];

  if (editorState) {
    // load code graph from the state
    loadCodeGraph(editorState.codeName ?? "default");

    // load editor from editor state
    viewModel.value.loadEditor(editorState);
  }

  return true;
};

/**
 * Create new editor.
 */
export const newEditor = (codeName?: string) => {
  const codeGraphStore = useCodeGraphStore();
  // load code graph.
  loadCodeGraph(codeName ?? codeGraphStore.state.codeName);

  // create new graph.
  viewModel.value.newGraph();
  saveEditor();
  return { name: "edit", params: { editorId: viewModel.value.editor.id } };
};

/**
 * Remove editor state.
 * @param editorId editor ID
 */
export const removeEditorState = (editorId: string) => {
  const codeGraphStore = useCodeGraphStore();
  delete codeGraphStore.state.editorStates[editorId];
};

/**
 * Save editor.
 */
export const saveEditor = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.editorStates[viewModel.value.editor.graph.id] = viewModel.value.editor.save();
};
