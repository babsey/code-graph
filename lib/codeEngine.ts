// codeEngine.ts

import {
  Commands,
  DependencyEngine,
  type BeforeNodeCalculationEventData,
  type IConnection,
  type IEditorState,
  type INodeState,
  AbstractNode,
} from "baklavajs";
import { v4 as uuidv4 } from "uuid";

import { registerEngineCommands, type AbstractCodeNode, type ICodeGraphViewModel } from ".";

export interface IViewNodeState extends INodeState<unknown, unknown> {
  position: { x: number; y: number };
  width: number;
  twoColumn: boolean;
}

export function registerCodeEngine(viewModel: ICodeGraphViewModel): void {
  const token = Symbol("CodeEngineToken");

  viewModel.engine = new DependencyEngine(viewModel.editor);
  viewModel.code.registerEngine(viewModel.engine);

  registerEngineCommands(viewModel.displayedGraph, viewModel.commandHandler);

  /**
   * Initialize view model.
   */
  viewModel.init = () => {
    // unsubscribe old engine / graph events if existed.
    if (viewModel.subscribe) viewModel.subscribe();
  };

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

    // set new graph id
    viewModel.displayedGraph.id = uuidv4();

    viewModel.engine?.resume();
    viewModel.engine?.runOnce(null);
  };

  /**
   * Subscribe view model.
   */
  viewModel.subscribe = () => {
    viewModel.displayedGraph.events.addNode.subscribe(token, (node: AbstractCodeNode | AbstractNode) => {
      if (node.isCodeNode) node.code = viewModel.code;
    });

    viewModel.displayedGraph.events.addConnection.subscribe(token, (data: IConnection) => {
      const tgtNode = viewModel.displayedGraph.findNodeById(data.to.nodeId);
      if (tgtNode && tgtNode.isCodeNode) tgtNode.onConnected();
      const srcNode = viewModel.displayedGraph.findNodeById(data.from.nodeId);
      if (srcNode && srcNode.isCodeNode) srcNode.onConnected();
    });

    viewModel.displayedGraph.events.removeConnection.subscribe(token, (data: IConnection) => {
      const tgtNode = viewModel.displayedGraph.findNodeById(data.to.nodeId);
      if (tgtNode && tgtNode.isCodeNode) tgtNode.onUnconnected();
      const srcNode = viewModel.displayedGraph.findNodeById(data.from.nodeId);
      if (srcNode && srcNode.isCodeNode) srcNode.onUnconnected();
    });

    viewModel.engine?.events.beforeRun.subscribe(token, () => {
      viewModel.engine?.pause();

      // update code nodes
      viewModel.displayedGraph.updateCodeNodes();

      // sort code nodes using toposort
      viewModel.displayedGraph.sortNodes();

      // update code templates
      viewModel.displayedGraph.updateCodeTemplates();

      // reset scripts of input interfaces
      viewModel.displayedGraph.resetInputInterfaceScript();

      viewModel.engine?.resume();
    });

    viewModel.engine?.events.beforeNodeCalculation.subscribe(token, (data: BeforeNodeCalculationEventData) => {
      viewModel.engine?.pause();

      const codeNode = data.node as AbstractCodeNode;
      if (codeNode.isCodeNode) {
        // update variable name of output (outputs.code)
        codeNode.updateOutputNames();

        // update connected input interfaces (with code rendering of source nodes)
        codeNode.updateConnectedInputInterfaces();
      }

      viewModel.engine?.resume();
    });

    viewModel.engine?.events.afterRun.subscribe(token, () => {
      viewModel.engine?.pause();

      // apply results from calculation on editor
      // applyResult(result, viewModel.editor)

      // render code of the displayed graph
      viewModel.displayedGraph.renderCode();

      // render code from scripted code nodes
      viewModel.code.renderCode();

      viewModel.engine?.resume();
    });
  };

  /**
   * Unsubscribe view model.
   */
  viewModel.unsubscribe = () => {
    viewModel.displayedGraph.events.addNode.unsubscribe(token);
    viewModel.displayedGraph.events.addConnection.unsubscribe(token);
    viewModel.engine?.events.beforeRun.unsubscribe(token);
    viewModel.engine?.events.beforeNodeCalculation.unsubscribe(token);
    viewModel.engine?.events.afterRun.unsubscribe(token);
  };
}
