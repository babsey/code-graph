// settings.ts

import { computed } from "vue";
import { DEFAULT_TOOLBAR_COMMANDS, type ICommandHandler, type IViewSettings } from "baklavajs";

import { LayoutSidebarLeftCollapse, LayoutSidebarLeftExpand, Schema, SchemaOff, TrashOff } from "./icons";
import type { CodeGraph } from "./codeGraph/codeGraph";

export const DEFAULT_SETTINGS: () => IViewSettings = () => ({
  useStraightConnections: false,
  enableMinimap: false,
  toolbar: {
    enabled: true,
    commands: [],
    subgraphCommands: [],
  },
  palette: {
    enabled: true,
  },
  background: {
    gridSize: 100,
    gridDivision: 5,
    subGridVisibleThreshold: 0.6,
  },
  sidebar: {
    enabled: true,
    width: 300,
    resizable: true,
  },
  displayValueOnHover: false,
  nodes: {
    defaultWidth: 400,
    maxWidth: 320,
    minWidth: 150,
    resizable: false,
    reverseY: false,
  },
  contextMenu: {
    enabled: true,
    additionalItems: [],
  },
  panZoom: {
    minScale: 0.1,
    maxScale: 2,
  },
  zoomToFit: {
    paddingLeft: 300,
    paddingRight: 50,
    paddingTop: 110,
    paddingBottom: 50,
  },
});

const CLEAR_ALL_COMMAND = "CLEAR_ALL";
const RUN_ENGINE_COMMAND = "RUN_ENGINE";
const TOGGLE_MINIMAP_COMMAND = "TOGGLE_MINIMAP";
const TOGGLE_PALETTE_COMMAND = "TOGGLE_PALETTE";

/**
 * Reister custom commands.
 * @param viewModel view model instance
 */
export const registerCustomCommands = (
  displayedGraph: CodeGraph,
  handler: ICommandHandler,
  settings: IViewSettings,
) => {
  // Toggle palette in the graph
  handler.registerCommand(TOGGLE_PALETTE_COMMAND, {
    execute: () => (settings.palette.enabled = !settings.palette.enabled),
    canExecute: () => true,
  });

  // Clear all nodes from the graph
  handler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => displayedGraph.clear(),
    canExecute: () => displayedGraph.nodes.length > 0,
  });

  // Toggle minimap
  handler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (settings.enableMinimap = !settings.enableMinimap),
    canExecute: () => displayedGraph.nodes.length > 1,
  });
};

/**
 * Reister custom commands.
 * @param viewModel view model instance
 */
export const registerEngineCommands = (displayedGraph: CodeGraph, handler: ICommandHandler) => {
  // Toggle minimap
  handler.registerCommand(RUN_ENGINE_COMMAND, {
    execute: () => displayedGraph.code.engine?.runOnce(null),
    canExecute: () => true,
  });
};

export const addToolbarItems = (settings: IViewSettings) => {
  const run_engine = {
    command: RUN_ENGINE_COMMAND,
    title: "Run", // Tooltip text
    icon: computed(() => Schema),
  };

  const toggle_palette = {
    command: TOGGLE_PALETTE_COMMAND,
    title: "Toggle palette", // Tooltip text
    icon: computed(() => (settings.palette.enabled ? LayoutSidebarLeftCollapse : LayoutSidebarLeftExpand)),
  };

  const clear_all = {
    command: CLEAR_ALL_COMMAND,
    title: "Clear all", // Tooltip text
    icon: computed(() => TrashOff),
  };

  const toggle_minimap = {
    command: TOGGLE_MINIMAP_COMMAND,
    title: "Toggle minimap", // Tooltip text
    icon: computed(() => (settings.enableMinimap ? SchemaOff : Schema)),
  };

  settings.toolbar.commands = [toggle_palette, run_engine, ...DEFAULT_TOOLBAR_COMMANDS, clear_all, toggle_minimap];
};
