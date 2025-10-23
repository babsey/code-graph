// code.ts

import mustache from 'mustache';
import toposort from 'toposort';
import { AbstractNode, Commands, Connection, Graph, NodeInterface } from 'baklavajs';
import { reactive, type UnwrapRef } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { AbstractCodeNode } from './codeNode';
import type { CodeNodeInterface } from './codeNodeInterfaces';
import type { ICodeGraphViewModel } from './viewModel';

mustache.escape = (value: string) => value;

interface IPosition {
  x: number;
  y: number;
}

export interface ICodeState {
  autosort: boolean;
  lockCode: boolean;
  modules: Record<string, string>;
  script: string;
  template: string;
  token: symbol | null;
}

export class Code {
  private _id: string;
  private _viewModel: ICodeGraphViewModel;
  private _state: UnwrapRef<ICodeState>;

  constructor(viewModel: ICodeGraphViewModel) {
    this._id = uuidv4();
    this._viewModel = viewModel;

    this._state = reactive({
      autosort: false,
      lockCode: false,
      modules: {},
      script: '',
      template: '',
      token: null,
    });
  }

  get codeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this.graph) as AbstractCodeNode[];
  }

  get codeNodeIds(): string[] {
    return this.codeNodes.map((node: AbstractCodeNode) => node.id);
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  set connections(values: Connection[]) {
    this.graph._connections = values as Connection[];
  }

  get graph(): Graph {
    return this.viewModel.displayedGraph as Graph;
  }

  get id(): string {
    return this._id;
  }

  get lockCode(): boolean {
    return this.state.lockCode;
  }

  set lockCode(value: boolean) {
    this.state.lockCode = value;
    this.viewModel.engine.runOnce(null);
  }

  get modules(): string[] {
    const categories: string[] = [];

    this.codeNodes
      .filter((node: AbstractCodeNode) => node.state.modules?.length > 0)
      .forEach((node: AbstractCodeNode) => categories.push(...node.state.modules));

    if (!categories) return [];

    categories.sort();
    return Array.from(
      new Set(categories.map((category: string) => this.viewModel.state.modules[category])),
    ) as string[];
  }

  get nodeIds(): string[] {
    return this.nodes.map((node: AbstractCodeNode) => node.id);
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values as AbstractCodeNode[];
  }

  get script(): string {
    return this.state.script;
  }

  set script(value: string) {
    this.state.script = value;
    // if (this.viewModel.engine) this.viewModel.engine.runOnce(null);
  }

  get scriptedCodeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this.graph).filter(
      (codeNode: AbstractCodeNode) => !codeNode.state?.integrated,
    ) as AbstractCodeNode[];
  }

  get shortId(): string {
    return this.id.slice(0, 6);
  }

  get state(): UnwrapRef<ICodeState> {
    return this._state;
  }

  get viewModel(): ICodeGraphViewModel {
    return this._viewModel;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.hidden) as AbstractCodeNode[];
  }

  /**
   * Add code node to graph.
   * @param node code node
   * @param props optional
   */
  addNode(node: AbstractCodeNode, props?: unknown): AbstractCodeNode | undefined {
    if (!node.code) node.code = this;
    if (props) node.state.props = props;
    return this.graph.addNode(node as AbstractNode) as AbstractCodeNode;
  }

  /**
   * Add code node at coordinates.
   * @param node code node
   * @param position position
   * @param props optional
   * @returns code node
   */
  addNodeAtCoordinates = (
    node: AbstractCodeNode,
    position: IPosition = { x: 0, y: 0 },
    props?: unknown,
  ): AbstractCodeNode => {
    this.addNode(node, props);
    if (node.position) node.position = position;
    return node;
  };

  /**
   * Add connection of code nodes
   * @param from code node interface
   * @param to code node interface
   */
  addConnection(from: CodeNodeInterface | NodeInterface, to: CodeNodeInterface | NodeInterface): void {
    if (from.name !== '_code') from.hidden = false;
    if (to.name !== '_code') to.hidden = false;
    this.graph.addConnection(from, to);
  }

  /**
   * Clear code graph.
   */
  clear(): void {
    this.viewModel.commandHandler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND);
    this.viewModel.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND);

    this.state.modules = {};
    this.nodes = [];
    this.connections = [];
    this.state.script = '';
  }

  /**
   * Find node by ID.
   * @param id node ID
   * @returns node instance
   */
  findNodeById(id: string): AbstractCodeNode | undefined {
    return this.graph.findNodeById(id) as AbstractCodeNode | undefined;
  }

  /**
   * Find node by type.
   * @param nodeType node type
   * @returns node instance
   */
  findNodeByType(nodeType: string): AbstractCodeNode | undefined {
    return this.codeNodes.find((codeNode: AbstractCodeNode) => codeNode.type === nodeType);
  }

  /**
   * Get nodes of the same type.
   * @param type node type
   * @returns a list of node instances
   */
  getNodesBySameType(type: string): AbstractCodeNode[] {
    return this.codeNodes.filter((codeNode: AbstractCodeNode) => codeNode.type === type) as AbstractCodeNode[];
  }

  /**
   * Get nodes of the same variable name.
   * @param variableName variable name
   * @returns a list of node instances
   */
  getNodesBySameVariableNames(variableName: string): AbstractCodeNode[] {
    return this.codeNodes.filter(
      (codeNode: AbstractCodeNode) => codeNode.state.variableName === variableName,
    ) as AbstractCodeNode[];
  }

  /**
   * Check whether the graph has this connection.
   * @param from node interface
   * @param to node interface
   * @returns boolean
   */
  hasConnection(from: NodeInterface, to: NodeInterface): boolean {
    return this.connections.some(
      (connection: Connection) => connection.from.id === from.id && connection.to.id === to.id,
    );
  }

  /**
   * Load template from the file.
   * @param resolve: default string in promise resolve (from import)
   */
  async loadTemplate(resolve: Promise<{ default: string }>) {
    resolve.then((template: { default: string }) => {
      this._state.template = template.default ?? '';
    });
  }

  /**
   * Remove connection from the graph
   * @param connection connection between code nodes
   */
  removeConnection(connection: Connection): void {
    this.graph.removeConnection(connection);
  }

  /**
   * Remove node from the graph.
   * @param codeNode code node
   */
  removeNode(codeNode: AbstractCodeNode): void {
    this.graph.removeNode(codeNode as AbstractNode);
  }

  /**
   * Render code script of code nodes.
   */
  renderNodeCodes(): void {
    if (this.state.lockCode || this.codeNodes.length === 0) return;
    this.codeNodes.forEach((node: AbstractCodeNode) => node.renderCode());
  }

  /**
   * Render code script.
   */
  renderCode(): void {
    if (this.state.lockCode) return;
    const nodes = this.scriptedCodeNodes;
    const modules = this.modules;
    this.state.script = mustache.render(this.state.template || '', { nodes, modules });
  }

  /**
   * Reset scripts of intput interfaces.
   */
  resetInputInterfaceScript(): void {
    this.codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.resetInputInterfaceScript());
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    if (this.nodes.length === 0 || this.connections.length === 0) return;

    try {
      // Get a list of node
      let nodeIds = this.nodeIds;

      // Get a list of edges
      const edges: [string, string | undefined][] = this.connections
        .filter(
          (connection: Connection) =>
            nodeIds.includes(connection.to.nodeId) && nodeIds.includes(connection.from.nodeId),
        )
        .map((connection: Connection) => [connection.to.nodeId, connection.from.nodeId]);

      nodeIds.reverse();

      // Get sorted node ids
      nodeIds = toposort.array(nodeIds, edges);

      nodeIds.reverse();

      const unconnected = this.graph.nodes.map((node) => node.id).filter((nodeId: string) => !nodeIds.includes(nodeId));

      nodeIds = [...nodeIds, ...unconnected];

      // Get sorted nodes
      const nodes = nodeIds.map((nodeId: string) => this.findNodeById(nodeId));

      if (nodes) this.nodes = nodes as AbstractCodeNode[];
    } catch {
      console.warn('Failed to sort nodes.');
    }
  }

  /**
   * Update code nodes.
   */
  updateCodeNodes(): void {
    this.codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.update());
  }

  /**
   * Update code templates.
   */
  updateCodeTemplates(): void {
    this.codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.updateCodeTemplate());
  }
}

/**
 * Get code nodes of current graph.
 * @param graph graph / subgraph
 * @returns list of code nodes
 */
export const getCodeNodes = (graph: Graph): AbstractCodeNode[] => {
  const nodes: AbstractCodeNode[] = [];
  if (graph.nodes.length === 0) return nodes;

  graph.nodes.forEach((node: AbstractNode | AbstractCodeNode) => {
    if (!node) return;

    if (node.hasOwnProperty('subgraph')) {
      nodes.push(...getCodeNodes(node.subgraph));
    } else if (node.hasOwnProperty('isCodeNode')) {
      nodes.push(node as AbstractCodeNode);
    }
  });

  return nodes;
};

/**
 * Get position at specific column.
 * @param col column
 * @param offset number
 * @returns position
 */
export const getPositionAtColumn = (col: number = 0, offset: number = 100): IPosition => {
  const width = 350;
  const padding = 70;

  return {
    x: col * (width + padding),
    y: offset,
  };
};

/**
 * Get position before target node.
 * @param node code node
 * @returns position
 */
export const getPositionBeforeNode = (node: AbstractCodeNode): IPosition => {
  const position = { ...node.position };

  position.x -= 440;
  position.y += 50;

  return position;
};
