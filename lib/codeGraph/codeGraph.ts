// codeGraph.ts

import mustache from "mustache";
import { Graph, type GraphTemplate, Connection, NodeInterface, AbstractNode } from "baklavajs";
import { type IBaklavaEventEmitter, type IBaklavaTapable } from "@baklavajs/events";
import { reactive, type UnwrapRef } from "vue";

import type { AbstractCodeNode, Code, CodeNodeInterface } from "..";
import type { CodeEditor } from "@/codeEditor";
import toposort from "toposort";

interface IPosition {
  x: number;
  y: number;
}

export interface ICodeGraphState {
  lockCode: boolean;
  script: string;
}

export class CodeGraph extends Graph implements IBaklavaEventEmitter, IBaklavaTapable {
  public code: Code;
  public editor: CodeEditor;

  public _state: UnwrapRef<ICodeGraphState> = reactive({
    lockCode: false,
    script: "",
  });

  public constructor(editor: CodeEditor, template?: GraphTemplate) {
    super(editor, template);
    this.editor = editor;
    // editor.registerGraph(this);
    if (editor.code) this.registerCode(editor.code);
  }

  get codeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this) as AbstractCodeNode[];
  }

  get connections(): Connection[] {
    return super.connections as Connection[];
  }

  set connections(values: Connection[]) {
    this._connections = values as Connection[];
  }

  get nodeIds(): string[] {
    return this.nodes.map((node: AbstractCodeNode) => node.id);
  }

  get nodes(): AbstractCodeNode[] {
    return super.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this._nodes = values as AbstractCodeNode[];
  }

  get scriptedCodeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this).filter((codeNode: AbstractCodeNode) => !codeNode.state?.integrated) as AbstractCodeNode[];
  }

  get shortId(): string {
    return this.id.slice(0, 6);
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.hidden) as AbstractCodeNode[];
  }

  /**
   * Add code node to graph.
   * @param node code node
   * @param props optional
   */
  override addNode(node: AbstractCodeNode, props?: unknown): AbstractCodeNode | undefined {
    if (!node.code) node.code = this.code;
    if (props) node.state.props = props;
    return super.addNode(node as AbstractNode) as AbstractCodeNode;
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
  override addConnection(from: CodeNodeInterface, to: CodeNodeInterface): void {
    if (from.name !== "_code") from.hidden = false;
    if (to.name !== "_code") to.hidden = false;
    super.addConnection(from, to);
  }

  /**
   * Clear code graph.
   */
  clear(): void {
    this.selectedNodes = [];

    this._nodes = [];
    this._connections = [];
    this.state.script = "";
  }

  // /**
  //  * Find node by ID.
  //  * @param id node ID
  //  * @returns node instance
  //  */
  // override findNodeById(id: string): AbstractCodeNode | undefined {
  //   return super.findNodeById(id) as AbstractCodeNode | undefined;
  // }

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

  registerCode(code: Code): void {
    this.code = code;
    this.code.registerGraph(this);
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

      const unconnected = this.nodes.map((node) => node.id).filter((nodeId: string) => !nodeIds.includes(nodeId));

      nodeIds = [...nodeIds, ...unconnected];

      // Get sorted nodes
      const nodes = nodeIds.map((nodeId: string) => this.findNodeById(nodeId));

      if (nodes) this.nodes = nodes as AbstractCodeNode[];
    } catch {
      console.warn("Failed to sort nodes.");
    }
  }

  // /**
  //  * Remove connection from the graph
  //  * @param connection connection between code nodes
  //  */
  // removeConnection(connection: Connection): void {
  //   super.removeConnection(connection);
  // }

  // /**
  //  * Remove node from the graph.
  //  * @param codeNode code node
  //  */
  // removeNode(codeNode: AbstractCodeNode): void {
  //   super.removeNode(codeNode as AbstractNode);
  // }

  /**
   * Render code script.
   */
  renderCode(): void {
    if (this.state.lockCode) return;

    // render code script of nodes.
    this.nodes.forEach((node: AbstractCodeNode) => node.renderCode());

    const nodes = this.nodes;
    this.state.script = mustache.render(this.code.state.template || "", { nodes });
  }

  /**
   * Reset scripts of intput interfaces.
   */
  resetInputInterfaceScript(): void {
    this.codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.resetInputInterfaceScript());
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
export const getCodeNodes = (graph: CodeGraph): AbstractCodeNode[] => {
  const nodes: AbstractCodeNode[] = [];
  if (graph.nodes.length === 0) return nodes;

  graph.nodes.forEach((node: AbstractNode) => {
    if (!node) return;

    if (node.hasOwnProperty("subgraph")) {
      nodes.push(...getCodeNodes(node.subgraph));
    } else if (node.hasOwnProperty("isCodeNode")) {
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
