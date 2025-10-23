// settings.ts

import { computed } from 'vue';

import { type ICodeGraphViewModel } from './viewModel';
import { LayoutSidebarLeftCollapse, LayoutSidebarLeftExpand, Schema, SchemaOff, TrashOff } from './icons';
import { DEFAULT_TOOLBAR_COMMANDS } from 'baklavajs';

/**
 * Add commands to toolbar.
 * @param viewModel view model instance
 */
export const addToolbarCommands = (viewModel: ICodeGraphViewModel) => {
  // Toggle palette in the graph
  const TOGGLE_PALETTE_COMMAND = 'TOGGLE_PALETTE';
  viewModel.commandHandler.registerCommand(TOGGLE_PALETTE_COMMAND, {
    execute: () => (viewModel.settings.palette.enabled = !viewModel.settings.palette.enabled),
    canExecute: () => true,
  });

  const toggle_palette = {
    command: TOGGLE_PALETTE_COMMAND,
    title: 'Toggle palette', // Tooltip text
    icon: computed(() => (viewModel.settings.palette.enabled ? LayoutSidebarLeftCollapse : LayoutSidebarLeftExpand)),
  };

  // Clear all nodes from the graph
  const CLEAR_ALL_COMMAND = 'CLEAR_ALL';
  viewModel.commandHandler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => viewModel.code.clear(),
    canExecute: () => viewModel.displayedGraph.nodes.length > 0,
  });

  const clear_all = {
    command: CLEAR_ALL_COMMAND,
    title: 'Clear all', // Tooltip text
    icon: computed(() => TrashOff),
  };

  // Toggle minimap
  const TOGGLE_MINIMAP_COMMAND = 'TOGGLE_MINIMAP';
  viewModel.commandHandler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (viewModel.settings.enableMinimap = !viewModel.settings.enableMinimap),
    canExecute: () => viewModel.displayedGraph.nodes.length > 1,
  });

  const toggle_minimap = {
    command: TOGGLE_MINIMAP_COMMAND,
    title: 'Toggle minimap', // Tooltip text
    icon: computed(() => (viewModel.settings.enableMinimap ? SchemaOff : Schema)),
  };

  viewModel.settings.toolbar.commands = [toggle_palette, ...DEFAULT_TOOLBAR_COMMANDS, clear_all, toggle_minimap];
};

/**
 * Update settings of view model.
 * @param viewModel view model instance
 */
export const updateSettings = (viewModel: ICodeGraphViewModel) => {
  viewModel.settings.nodes.defaultWidth = 400;
};
