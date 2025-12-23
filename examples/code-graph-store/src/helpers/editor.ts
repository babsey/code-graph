// editor.ts

import { viewModel } from "./state";
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

  // load editor from editor state
  if (editorState) viewModel.loadEditor(editorState);

  return true;
};

/**
 * Create new editor.
 */
export const newEditor = () => {
  viewModel.newGraph();
  saveEditor();
  return { name: "edit", params: { editorId: viewModel.editor.graph.id } };
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
  codeGraphStore.state.editorStates[viewModel.editor.graph.id] = viewModel.editor.save();
};
