// viewModel.ts

import {
  AbstractNode,
  Commands,
  DependencyEngine,
  Editor,
  GraphTemplate,
  type BeforeNodeCalculationEventData,
  type IBaklavaViewModel,
  type IConnection,
  type IEditorState,
  useBaklava,
} from "baklavajs";
import { type UnwrapRef, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";

import { Code } from "./code";
import { addToolbarItems, registerCustomCommands, type AbstractCodeNode } from ".";
import { createCodeGraphNodeType } from "./codeNode";

export interface ICodeGraphViewModel extends IBaklavaViewModel {
  code: Code;
  engine: DependencyEngine;
  loadEditor(editorState: IEditorState): void;
  newGraph(): void;
  state: UnwrapRef<{
    modules: Record<string, string>;
    token: symbol | null;
  }>;
  subscribe(): void;
  unsubscribe(): void;
}

export function useCodeGraph(props?: { existingEditor?: Editor; code?: new () => Code }): ICodeGraphViewModel {
  // const editor = new CodeEditor();
  const viewModel = useBaklava(props?.existingEditor) as ICodeGraphViewModel;
  viewModel.code = props?.code ? new props.code() : new Code();
  viewModel.code.registerGraph(viewModel.displayedGraph);

  // TODO: Use custom editor with own code graph and nodes.
  viewModel.editor.addGraphTemplate = function (template: GraphTemplate): void {
    if (this.events.beforeAddGraphTemplate.emit(template).prevented) {
      return;
    }
    this._graphTemplates.push(template);
    this.graphTemplateEvents.addTarget(template.events);
    this.graphTemplateHooks.addTarget(template.hooks);

    const nt = createCodeGraphNodeType(template);
    this.registerNodeType(nt, { category: "Subgraphs", title: template.name });

    this.events.addGraphTemplate.emit(template);
  };

  // viewModel.settings = reactive(DEFAULT_SETTINGS());
  viewModel.settings.nodes.defaultWidth = 400;
  registerCustomCommands(viewModel.displayedGraph, viewModel.commandHandler, viewModel.settings);
  addToolbarItems(viewModel.settings);

  viewModel.state = reactive({
    modules: {},
    token: null,
  });

  viewModel.engine = new DependencyEngine(viewModel.editor);

  /**
   * Load editor from editor state
   */
  viewModel.loadEditor = (editorState: IEditorState) => {
    viewModel.engine?.pause();
    viewModel.code.clear();

    viewModel.editor.load(editorState);

    // needs to clear clipboard and history after loading editor.
    viewModel.commandHandler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND);
    viewModel.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);

    viewModel.engine?.resume();
    viewModel.engine?.runOnce(undefined);
  };

  /**
   * Create a new graph (new ID).
   */
  viewModel.newGraph = () => {
    viewModel.engine?.pause();
    viewModel.code.clear();

    // needs to clear clipboard and history after loading editor.
    viewModel.commandHandler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND);
    viewModel.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);

    // set new graph id
    viewModel.editor.graph.id = uuidv4();

    viewModel.engine?.resume();
    viewModel.engine?.runOnce(undefined);
  };

  /**
   * Subscribe view model.
   */
  viewModel.subscribe = () => {
    if (viewModel.state.token) viewModel.unsubscribe();

    const token = Symbol();
    const graph = viewModel.displayedGraph;

    graph.events.addNode.subscribe(token, (node: AbstractNode) => {
      if (!node.subgraph && node.isCodeNode) node.code = viewModel.code;
    });

    graph.events.addConnection.subscribe(token, (data: IConnection) => {
      const tgtNode = viewModel.code.findNodeById(data.to.nodeId);
      if (tgtNode && tgtNode.isCodeNode) tgtNode.onConnected();
      const srcNode = viewModel.code.findNodeById(data.from.nodeId);
      if (srcNode && srcNode.isCodeNode) srcNode.onConnected();
    });

    graph.events.removeConnection.subscribe(token, (data: IConnection) => {
      const tgtNode = viewModel.code.findNodeById(data.to.nodeId);
      if (tgtNode && tgtNode.isCodeNode) tgtNode.onUnconnected();
      const srcNode = viewModel.code.findNodeById(data.from.nodeId);
      if (srcNode && srcNode.isCodeNode) srcNode.onUnconnected();
    });

    viewModel.engine.events.beforeRun.subscribe(token, () => {
      viewModel.engine.pause();

      if (viewModel.code) {
        // update code nodes
        viewModel.code.updateCodeNodes();

        // sort code nodes using toposort
        viewModel.code.sortNodes();

        // update code templates
        viewModel.code.updateCodeTemplates();

        // reset scripts of input interfaces
        viewModel.code.resetInputInterfaceScript();
      }

      viewModel.engine.resume();
    });

    viewModel.engine.events.beforeNodeCalculation.subscribe(token, (data: BeforeNodeCalculationEventData) => {
      viewModel.engine.pause();

      const codeNode = data.node as AbstractCodeNode;
      if (codeNode.isCodeNode) {
        // update variable name of output (outputs.code)
        codeNode.updateOutputNames();

        // update connected input interfaces (with code rendering of source nodes)
        codeNode.updateConnectedInputInterfaces();
      }

      viewModel.engine.resume();
    });

    viewModel.engine.events.afterRun.subscribe(token, () => {
      viewModel.engine.pause();

      // apply results from calculation on editor
      // applyResult(result, viewModel.editor)

      if (viewModel.code) {
        // render code nodes using its code templates
        viewModel.code.renderNodeCodes();

        // render code from scripted code nodes
        viewModel.code.renderCode();
      }

      viewModel.engine.resume();
    });

    viewModel.state.token = token;
  };

  /**
   * Unsubscribe view model.
   */
  viewModel.unsubscribe = () => {
    if (!viewModel.state.token) return;

    const token = viewModel.state.token;

    viewModel.displayedGraph.events.addNode.unsubscribe(token);
    viewModel.displayedGraph.events.addConnection.unsubscribe(token);
    viewModel.engine.events.beforeRun.unsubscribe(token);
    viewModel.engine.events.beforeNodeCalculation.unsubscribe(token);
    viewModel.engine.events.afterRun.unsubscribe(token);

    viewModel.state.token = null;
  };

  return viewModel as ICodeGraphViewModel;
}
