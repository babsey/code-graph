// settings.ts

import { DEFAULT_TOOLBAR_COMMANDS, type IViewSettings } from 'baklavajs'
import { computed } from 'vue'

import { type ICodeGraphViewModel } from './viewModel'
import { LayoutSidebarLeftCollapse, LayoutSidebarLeftExpand, Schema, SchemaOff, TrashOff } from './icons'

interface ICodeViewSettings extends Partial<IViewSettings> {
  toolbar?: Partial<IViewSettings['toolbar']>
  nodes?: Partial<IViewSettings['nodes']>
  sidebar?: Partial<IViewSettings['sidebar']>
}

export const addToolbarCommands = (viewModel: ICodeGraphViewModel) => {
  // Toggle palette in the graph
  const TOGGLE_PALETTE_COMMAND = 'TOGGLE_PALETTE'
  viewModel.commandHandler.registerCommand(TOGGLE_PALETTE_COMMAND, {
    execute: () => (viewModel.settings.palette.enabled = !viewModel.settings.palette.enabled),
    canExecute: () => true,
  })

  // Clear all nodes from the graph
  const CLEAR_ALL_COMMAND = 'CLEAR_ALL'
  viewModel.commandHandler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => viewModel.code.clear(),
    canExecute: () => viewModel.displayedGraph.nodes.length > 0,
  })

  // Toggle minimap
  const TOGGLE_MINIMAP_COMMAND = 'TOGGLE_MINIMAP'
  viewModel.commandHandler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (viewModel.settings.enableMinimap = !viewModel.settings.enableMinimap),
    canExecute: () => viewModel.displayedGraph.nodes.length > 1,
  })

  viewModel.settings.toolbar.commands = [
    {
      command: TOGGLE_PALETTE_COMMAND,
      title: 'Toggle palette', // Tooltip text
      icon: computed(() => (viewModel.settings.palette.enabled ? LayoutSidebarLeftCollapse : LayoutSidebarLeftExpand)),
    },
    ...DEFAULT_TOOLBAR_COMMANDS,
    {
      command: CLEAR_ALL_COMMAND,
      title: 'Clear all', // Tooltip text
      icon: TrashOff,
    },
    {
      command: TOGGLE_MINIMAP_COMMAND,
      title: 'Toggle minimap', // Tooltip text
      icon: computed(() => (viewModel.settings.enableMinimap ? SchemaOff : Schema)),
    },
  ]
}

export const DEFAULT_SETTINGS: ICodeViewSettings = {
  enableMinimap: false,
  toolbar: {
    enabled: true,
  },
  palette: {
    enabled: true,
  },
  sidebar: {
    enabled: true,
    resizable: true,
    width: 350,
  },
  displayValueOnHover: false,
}
