// codeEngine.ts

import type { CalculationResult, Editor, IConnection, IEditorState, INodeState } from "@baklavajs/core";
import { applyResult } from "@baklavajs/engine";
import { Commands } from "@baklavajs/renderer-vue";
import { v4 as uuidv4 } from "uuid";

import type { AbstractCodeNode } from "@/codeNode";
import type { ICodeGraphViewModel } from "@/viewModel";

import { CodeEngine } from "./codeEngine";
import { registerRunEngineCommands } from "./runEngine.command";

export interface IViewNodeState extends INodeState<unknown, unknown> {
  position: { x: number; y: number };
  width: number;
  twoColumn: boolean;
}

export function registerCodeEngine(viewModel: ICodeGraphViewModel): void {
  const _token = Symbol("CodeEngineToken");

  viewModel.engine = new CodeEngine(viewModel.editor);
  registerRunEngineCommands(viewModel.editor.graph, viewModel.engine, viewModel.commandHandler);

  /**
   * Load editor from editor state
   */
  viewModel.loadEditor = (editorState: IEditorState) => {
    viewModel.engine?.pause();
    viewModel.displayedGraph.clear();

    viewModel.editor.load(editorState);

    // needs to clear clipboard and history after loading editor.
    viewModel.commandHandler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND);
    viewModel.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);

    viewModel.engine?.resume();
    viewModel.engine?.runOnce(null);
  };

  /**
   * Create a new graph (new ID).
   */
  viewModel.newGraph = () => {
    viewModel.engine?.pause();
    viewModel.displayedGraph.clear();

    // needs to clear clipboard and history after loading editor.
    viewModel.commandHandler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND);
    viewModel.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);

    // set new graph id.
    viewModel.displayedGraph.id = uuidv4();

    viewModel.engine?.resume();
    viewModel.engine?.runOnce(null);
  };

  /**
   * Subscribe view model.
   */
  viewModel.subscribe = (token = _token) => {
    // console.log("subscribe");

    viewModel.displayedGraph.nodeEvents.titleChanged.subscribe(token, () => {
      viewModel.engine?.runOnce(null);
    });

    viewModel.displayedGraph.events.addConnection.subscribe(token, (data: IConnection) => {
      const tgtNode = viewModel.displayedGraph.findNodeById(data.to.nodeId) as AbstractCodeNode;
      if (tgtNode && tgtNode.isCodeNode) tgtNode.onConnected();
      const srcNode = viewModel.displayedGraph.findNodeById(data.from.nodeId) as AbstractCodeNode;
      if (srcNode && srcNode.isCodeNode) srcNode.onConnected();
    });

    viewModel.displayedGraph.events.removeConnection.subscribe(token, (data: IConnection) => {
      const tgtNode = viewModel.displayedGraph.findNodeById(data.to.nodeId) as AbstractCodeNode;
      if (tgtNode && tgtNode.isCodeNode) tgtNode.onUnconnected();
      const srcNode = viewModel.displayedGraph.findNodeById(data.from.nodeId) as AbstractCodeNode;
      if (srcNode && srcNode.isCodeNode) srcNode.onUnconnected();
    });

    viewModel.engine?.events.beforeRun.subscribe(token, () => {
      viewModel.displayedGraph.onUpdate();

      viewModel.engine?.pause();

      // sort code nodes using toposort.
      viewModel.displayedGraph.sortNodes();

      viewModel.engine?.resume();
    });

    viewModel.engine?.events.afterRun.subscribe(token, (result: CalculationResult) => {
      viewModel.engine?.pause();

      // apply results from calculation on editor.
      applyResult(result, viewModel.editor as Editor);

      // render code from scripted code nodes.
      if (!viewModel.code.state.lockCode)
        viewModel.code.renderCode({
          nodes: viewModel.editor.graph.scriptedCodeNodes,
          modules: viewModel.editor.code.modules,
        });

      viewModel.engine?.resume();
    });
  };

  /**
   * Unsubscribe view model.
   */
  viewModel.unsubscribe = (token = _token) => {
    // console.log("unsubscribe");

    viewModel.displayedGraph.events.addConnection.unsubscribe(token);
    viewModel.displayedGraph.events.removeConnection.unsubscribe(token);
    viewModel.engine?.events.beforeRun.unsubscribe(token);
    viewModel.engine?.events.afterRun.unsubscribe(token);
  };
}
