// settings.ts

import { computed, type Ref } from "vue";
import { DEFAULT_TOOLBAR_COMMANDS, type ICommandHandler, type IViewSettings } from "@baklavajs/renderer-vue";

import * as Icons from "./icons";
import type { CodeGraph } from "./codeGraph";

export const CLEAR_ALL_COMMAND = "CLEAR_ALL";
export const RUN_ENGINE_COMMAND = "RUN_ENGINE";
export const TOGGLE_MINIMAP_COMMAND = "TOGGLE_MINIMAP";
export const TOGGLE_PALETTE_COMMAND = "TOGGLE_PALETTE";

/**
 * Reister custom commands.
 * @param viewModel view model instance
 */
export const registerCustomCommands = (
  displayedGraph: Ref<CodeGraph>,
  handler: ICommandHandler,
  settings: IViewSettings,
) => {
  const defaultPaddingLeft = settings.zoomToFit.paddingLeft;

  // Toggle palette in the graph
  handler.registerCommand(TOGGLE_PALETTE_COMMAND, {
    execute: () => {
      settings.palette.enabled = !settings.palette.enabled;
      settings.zoomToFit.paddingLeft = settings.palette.enabled ? defaultPaddingLeft : 50;
    },
    canExecute: () => true,
  });

  // Clear all nodes from the graph
  handler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => displayedGraph.value.clear(),
    canExecute: () => displayedGraph.value.nodes.length > 0,
  });

  // Toggle minimap
  handler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (settings.enableMinimap = !settings.enableMinimap),
    canExecute: () => displayedGraph.value.nodes.length > 1,
  });
};

export const updateToolbarItems = (settings: IViewSettings) => {
  const run_engine = {
    command: RUN_ENGINE_COMMAND,
    title: "Run", // Tooltip text
    icon: computed(() => Icons.PlayerPlay),
  };

  const toggle_palette = {
    command: TOGGLE_PALETTE_COMMAND,
    title: "Toggle palette", // Tooltip text
    icon: computed(() => (settings.palette.enabled ? Icons.LayoutSidebarLeftCollapse : Icons.LayoutSidebarLeftExpand)),
  };

  const clear_all = {
    command: CLEAR_ALL_COMMAND,
    title: "Clear all", // Tooltip text
    icon: computed(() => Icons.TrashOff),
  };

  const toggle_minimap = {
    command: TOGGLE_MINIMAP_COMMAND,
    title: "Toggle minimap", // Tooltip text
    icon: computed(() => (settings.enableMinimap ? Icons.SchemaOff : Icons.Schema)),
  };

  settings.toolbar.commands = [toggle_palette, run_engine, ...DEFAULT_TOOLBAR_COMMANDS, clear_all, toggle_minimap];
};
