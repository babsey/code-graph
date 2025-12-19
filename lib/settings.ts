// settings.ts

import { computed, type Ref } from "vue";
import { Commands, DEFAULT_TOOLBAR_COMMANDS, type ICommandHandler, type IViewSettings } from "@baklavajs/renderer-vue";

import * as Icons from "./icons";
import type { CodeGraph } from "./codeGraph";
import { download, upload } from "./utils/download";

export const CLEAR_ALL_COMMAND = "CLEAR_ALL";
export const DOWNLOAD_EDITOR_STATE_COMMAND = "DOWNLOAD_EDITOR_STATE";
export const RUN_ENGINE_COMMAND = "RUN_ENGINE";
export const TOGGLE_MINIMAP_COMMAND = "TOGGLE_MINIMAP";
export const TOGGLE_PALETTE_COMMAND = "TOGGLE_PALETTE";
export const UPLOAD_EDITOR_STATE_COMMAND = "UPLOAD_EDITOR_STATE";

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

  // Clear all nodes from the graph
  handler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => {
      // clear clipboard and history before clearing graph.
      handler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND);
      handler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);

      displayedGraph.value.clear();
      displayedGraph.value.editor.code.clear();
    },
    canExecute: () => displayedGraph.value.nodes.length > 0,
  });

  // Download editor state.
  handler.registerCommand(DOWNLOAD_EDITOR_STATE_COMMAND, {
    execute: () => {
      const editorState = displayedGraph.value.editor.save();
      download(JSON.stringify(editorState, null, 2), displayedGraph.value.shortId);
    },
    canExecute: () => displayedGraph.value.nodes.length > 0,
  });

  // Toggle palette in the graph
  handler.registerCommand(TOGGLE_PALETTE_COMMAND, {
    execute: () => {
      settings.palette.enabled = !settings.palette.enabled;
      settings.zoomToFit.paddingLeft = settings.palette.enabled ? defaultPaddingLeft : 50;
    },
    canExecute: () => true,
  });

  // Toggle minimap
  handler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (settings.enableMinimap = !settings.enableMinimap),
    canExecute: () => displayedGraph.value.nodes.length > 1,
  });

  // Upload editor state.
  handler.registerCommand(UPLOAD_EDITOR_STATE_COMMAND, {
    execute: () => {
      const fileElem = upload();

      fileElem.addEventListener("change", () => {
        document.body.removeChild(fileElem);

        const files = fileElem.files;
        if (!files || files.length <= 0) return false;
        const fr = new FileReader();

        fr.onload = (e) => {
          if (e.target?.result) {
            const result = e.target.result as string;
            if (result.length === 0) return;
            const editorState = JSON.parse(result);
            displayedGraph.value.editor.load(editorState);
            displayedGraph.value.code?.engine?.runOnce(null);
          }
        };

        fr.readAsText(files.item(0) as Blob);
      });
    },
    canExecute: () => true,
  });
};

export const updateToolbarItems = (settings: IViewSettings) => {
  const clear_all = {
    command: CLEAR_ALL_COMMAND,
    title: "Clear all",
    icon: computed(() => Icons.Restore),
  };

  const download_editor_state = {
    command: DOWNLOAD_EDITOR_STATE_COMMAND,
    title: "Download editor state",
    icon: computed(() => Icons.Download),
  };

  // const run_engine = {
  //   command: RUN_ENGINE_COMMAND,
  //   title: "Run", // Tooltip text
  //   icon: computed(() => Icons.PlayerPlay),
  // };

  const toggle_minimap = {
    command: TOGGLE_MINIMAP_COMMAND,
    title: "Toggle minimap",
    icon: computed(() => (settings.enableMinimap ? Icons.SchemaOff : Icons.Schema)),
  };

  const toggle_palette = {
    command: TOGGLE_PALETTE_COMMAND,
    title: "Toggle palette",
    icon: computed(() => (settings.palette.enabled ? Icons.LayoutSidebarLeftCollapse : Icons.LayoutSidebarLeftExpand)),
  };

  const upload_editor_state = {
    command: UPLOAD_EDITOR_STATE_COMMAND,
    title: "Upload editor state",
    icon: computed(() => Icons.Upload),
  };

  settings.toolbar.commands = [
    toggle_palette,
    clear_all,
    upload_editor_state,
    download_editor_state,
    ...DEFAULT_TOOLBAR_COMMANDS,
    // run_engine,
    toggle_minimap,
  ];
};
