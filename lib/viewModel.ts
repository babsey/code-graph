// viewCodeModel.ts

import { type Ref, computed, nextTick, reactive, ref, shallowReadonly, watch } from "vue";
import type { IEditorState } from "@baklavajs/core";
import { SequentialHook } from "@baklavajs/events";
import {
  DEFAULT_SETTINGS,
  registerDeleteNodesCommand,
  // registerGraphCommands,
  registerSaveSubgraphCommand,
  registerSidebarCommands,
  registerSwitchToMainGraphCommand,
  registerZoomToFitCommands,
  setViewNodeProperties,
  type IClipboard,
  type ICommandHandler,
  type IHistory,
  type IViewSettings,
  useClipboard,
  useCommandHandler,
  useHistory,
} from "@baklavajs/renderer-vue";

import type { AbstractCodeNode, ICodeNodeState } from "./codeNode";
import type { CodeNodeInterface } from "./codeNodeInterfaces";
import { Code } from "./code";
import { CodeEditor } from "./codeEditor";
import { registerCodeEngine, type CodeEngine } from "./codeEngine";
import { registerCreateSubgraphCommand, SubgraphInputNode, SubgraphOutputNode } from "./subgraph";
import { registerCustomCommands, updateToolbarItems } from "./settings";
import { NODE_DEFAULT_WITH, useSwitchCodeGraph, type CodeGraph, type CodeGraphTemplate } from "./codeGraph";

export interface ICodeGraphViewModel {
  code: Code;
  editor: CodeEditor;
  /** Currently displayed graph */
  displayedGraph: CodeGraph;
  isReady: boolean;
  /** True if the currently displayed graph is a subgraph, false if it is the root graph */
  isSubgraph: Readonly<boolean>;
  settings: IViewSettings;
  commandHandler: ICommandHandler;
  history: IHistory;
  clipboard: IClipboard;
  hooks: {
    /** Called whenever a node is rendered */
    renderNode: SequentialHook<{ node: AbstractCodeNode; el: HTMLElement }, null>;
    /** Called whenever an interface is rendered */
    renderInterface: SequentialHook<{ intf: CodeNodeInterface<unknown>; el: HTMLElement }, null>;
  };
  showNodeId: boolean;
  switchGraph: (newGraph: CodeGraph | CodeGraphTemplate) => void;

  engine?: CodeEngine;
  loadEditor?: (editorState: IEditorState) => void;
  newGraph?: () => void;
  subscribe?: () => void;
  unsubscribe?: () => void;
  onMounted: () => void;
  onBeforeUnmount: () => void;
}

export function useCodeGraph(props?: { existingEditor?: CodeEditor; code?: Code }): ICodeGraphViewModel {
  const code: Ref<Code> = ref(props?.code ?? new Code()) as Ref<Code>;

  const editor: Ref<CodeEditor> = ref(props?.existingEditor ?? new CodeEditor(code.value)) as Ref<CodeEditor>;
  const token = Symbol("ViewModelToken");

  const _displayedGraph = ref(null as unknown) as Ref<CodeGraph>;
  const displayedGraph = shallowReadonly(_displayedGraph);
  const { switchGraph } = useSwitchCodeGraph(editor, _displayedGraph);

  const isSubgraph = computed(() => displayedGraph.value && displayedGraph.value !== editor.value.graph);

  const settings: IViewSettings = reactive(DEFAULT_SETTINGS());
  settings.nodes.defaultWidth = NODE_DEFAULT_WITH;

  const commandHandler = useCommandHandler();
  const history = useHistory(displayedGraph, commandHandler);
  const clipboard = useClipboard(displayedGraph, editor, commandHandler);

  const hooks = {
    /** Called whenever a node is rendered */
    renderNode: new SequentialHook<{ node: AbstractCodeNode; el: HTMLElement }, null>(null),
    /** Called whenever an interface is rendered */
    renderInterface: new SequentialHook<{ intf: CodeNodeInterface<unknown>; el: HTMLElement }, null>(null),
  };

  const viewModel = reactive({
    clipboard,
    code,
    commandHandler,
    displayedGraph,
    editor,
    history,
    hooks,
    isReady: false,
    isSubgraph,
    onBeforeUnmount: () => {},
    onMounted: () => {},
    settings,
    showNodeId: false,
    switchGraph,
  }) as ICodeGraphViewModel;

  code.value.registerViewModel(viewModel);
  registerCodeEngine(viewModel);

  // registerGraphCommands(displayedGraph, commandHandler, switchGraph)
  registerDeleteNodesCommand(displayedGraph, commandHandler);
  registerCreateSubgraphCommand(displayedGraph, commandHandler, switchGraph);
  registerSaveSubgraphCommand(displayedGraph, commandHandler);
  registerSwitchToMainGraphCommand(displayedGraph, commandHandler, switchGraph);

  registerSidebarCommands(displayedGraph, commandHandler);
  registerZoomToFitCommands(displayedGraph, commandHandler, settings);

  // add custom commands to the toolbar
  registerCustomCommands(displayedGraph, commandHandler, settings);
  updateToolbarItems(settings);

  watch(
    editor,
    (newValue, oldValue) => {
      if (oldValue) {
        oldValue.events.registerGraph.unsubscribe(token);
        oldValue.graphEvents.beforeAddNode.unsubscribe(token);
        newValue.nodeHooks.beforeLoad.unsubscribe(token);
        newValue.nodeHooks.afterSave.unsubscribe(token);
        newValue.graphTemplateHooks.beforeLoad.unsubscribe(token);
        newValue.graphTemplateHooks.afterSave.unsubscribe(token);
        newValue.graph.hooks.load.unsubscribe(token);
        newValue.graph.hooks.save.unsubscribe(token);
      }
      if (newValue) {
        newValue.nodeHooks.beforeLoad.subscribe(token, (state: ICodeNodeState, node: AbstractCodeNode) => {
          node.position = state.position ?? { x: 0, y: 0 };

          if (node.state) {
            node.state.integrated = state.integrated;
            if (state.props) node.state.props = state.props;
            if (state.variableName) node.state.variableName = state.variableName;
          }

          return state;
        });
        newValue.nodeHooks.afterSave.subscribe(token, (state: ICodeNodeState, node: AbstractCodeNode) => {
          state.position = node.position;

          if (node.state) {
            state.integrated = node.state.integrated;
            if (node.state.props) state.props = node.state.props;
            if (node.state.variableName) state.variableName = node.state.variableName;
          }

          return state;
        });
        newValue.graphTemplateHooks.beforeLoad.subscribe(token, (state, template) => {
          template.panning = state.panning;
          template.scaling = state.scaling;
          return state;
        });
        newValue.graphTemplateHooks.afterSave.subscribe(token, (state, template) => {
          state.panning = template.panning;
          state.scaling = template.scaling;
          return state;
        });
        newValue.graph.hooks.load.subscribe(token, (state, graph) => {
          graph.panning = state.panning;
          graph.scaling = state.scaling;
          return state;
        });
        newValue.graph.hooks.save.subscribe(token, (state, graph) => {
          state.panning = graph.panning;
          state.scaling = graph.scaling;
          return state;
        });

        newValue.graphEvents.beforeAddNode.subscribe(token, (node) =>
          setViewNodeProperties(node, { defaultWidth: settings.nodes.defaultWidth }),
        );

        editor.value.registerNodeType(SubgraphInputNode, { category: "Subgraphs" });
        editor.value.registerNodeType(SubgraphOutputNode, { category: "Subgraphs" });

        switchGraph(newValue.graph);
      }
    },
    { immediate: true },
  );

  nextTick(() => (viewModel.isReady = true));

  return viewModel;
}
