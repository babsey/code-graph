// code.ts

import mustache from 'mustache'
import toposort from 'toposort'
import {
  AbstractNode,
  Connection,
  Graph,
  type IEditorState,
  type INodeState,
  NodeInterface,
  sortTopologically,
} from 'baklavajs'
import { reactive, type UnwrapRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import type { AbstractCodeNode } from './codeNode'
import type { CodeNodeInterface } from './codeNodeInterfaces'
import type { ICodeGraphViewModel } from './viewModel'

interface IPosition {
  x: number
  y: number
}

interface ICodeState {
  autosort: boolean
  modules: Record<string, string>
  script: string
  template: string
  token: symbol | null
}

export class Code {
  private _id: string
  private _viewModel: ICodeGraphViewModel
  private _state: UnwrapRef<ICodeState>

  constructor(viewModel: ICodeGraphViewModel) {
    this._id = uuidv4()
    this._viewModel = viewModel

    this._state = reactive({
      autosort: false,
      modules: {},
      script: '',
      token: null,
      template: '',
    })
  }

  get codeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this.graph) as AbstractCodeNode[]
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[]
  }

  set connections(values: Connection[]) {
    this.graph._connections = values as Connection[]
  }

  get graph(): Graph {
    return this.viewModel.displayedGraph as Graph
  }

  get id(): string {
    return this._id
  }

  get modules(): string[] {
    let categories: string[] = []

    this.codeNodes
      .filter((node: AbstractCodeNode) => node.state.modules?.length > 0)
      .forEach((node: AbstractCodeNode) => {
        categories = categories.concat(node.state.modules)
      })

    if (!categories) return []

    categories.sort()
    return Array.from(new Set(categories.map((category: string) => this.viewModel.state.modules[category]))) as string[]
  }

  get nodeIds(): string[] {
    return this.codeNodes.map((node: AbstractCodeNode) => node.id)
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[]
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values as AbstractCodeNode[]
  }

  get scriptedCodeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this.graph).filter(
      (codeNode: AbstractCodeNode) => codeNode.state?.script.length > 0,
    ) as AbstractCodeNode[]
  }

  get shortId(): string {
    return this.id.slice(0, 6)
  }

  get state(): UnwrapRef<ICodeState> {
    return this._state
  }

  get viewModel(): ICodeGraphViewModel {
    return this._viewModel
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.hidden) as AbstractCodeNode[]
  }

  /**
   * Add code node to graph.
   * @param node code node
   * @param props optional
   */
  addNode(node: AbstractCodeNode, props?: unknown): AbstractCodeNode | undefined {
    if (!node.code) node.code = this
    if (props) node.state.props = props
    return this.graph.addNode(node as AbstractNode) as AbstractCodeNode
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
    this.addNode(node, props)
    if (node.position) node.position = position
    return node
  }

  /**
   * Add connection of code nodes
   * @param from code node interface
   * @param to code node interface
   */
  addConnection(from: CodeNodeInterface | NodeInterface, to: CodeNodeInterface | NodeInterface): void {
    if (from.name !== '_node') from.hidden = false
    if (to.name !== '_node') to.hidden = false
    this.graph.addConnection(from, to)
  }

  /**
   * Clear code graph.
   */
  clear(): void {
    this.nodes = []
    this.connections = []
  }

  findNodeById(id: string): AbstractCodeNode | undefined {
    return this.graph.findNodeById(id) as AbstractCodeNode | undefined
  }

  findNodeByType(nodeType: string): AbstractCodeNode | undefined {
    return this.codeNodes.find((codeNode: AbstractCodeNode) => codeNode.type === nodeType)
  }

  getNodesBySameType(type: string): AbstractCodeNode[] {
    return this.codeNodes.filter((codeNode: AbstractCodeNode) => codeNode.type === type) as AbstractCodeNode[]
  }

  getNodesBySameVariableNames(variableName: string): AbstractCodeNode[] {
    return this.codeNodes.filter(
      (codeNode: AbstractCodeNode) => codeNode.state.variableName === variableName,
    ) as AbstractCodeNode[]
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
    )
  }

  /**
   * Load template from the file.
   */
  loadTemplate(resolve: Promise<{ default: string }>): void {
    resolve.then((template: { default: string }) => {
      this._state.template = template.default ?? ''
    })
  }

  onCodeUpdate(): void {
    this.codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.onCodeUpdate())
  }

  /**
   * Remove connection from the graph
   * @param connection connection between code nodes
   */
  removeConnection(connection: Connection): void {
    this.graph.removeConnection(connection)
  }

  /**
   * Remove node from the graph.
   * @param codeNode code node
   */
  removeNode(codeNode: AbstractCodeNode): void {
    this.graph.removeNode(codeNode as AbstractNode)
  }

  /**
   * Render node codes.
   */
  renderNodeCodes(): void {
    if (this.codeNodes.length === 0) return
    this.codeNodes.forEach((node: AbstractCodeNode) => node.renderCode())
  }

  /**
   * Render code.
   */
  renderCode(): void {
    this.state.script = mustache.render(this.state.template || '', this)
  }

  /**
   * Save code graph.
   * @returns graph state
   */
  save(): IEditorState {
    if (this.state.autosort) this.sortNodes()

    const editorState = this.viewModel.editor.save()
    editorState.graph.id = this.id

    this.saveNodeStates(editorState.graph.nodes)

    return JSON.parse(JSON.stringify(editorState))
  }

  /**
   * Save node states.
   * @param nodeStates a list of node state.
   */
  saveNodeStates(nodeStates: INodeState<unknown, unknown>[]): void {
    nodeStates.forEach((nodeState: INodeState<unknown, unknown>, nodeIdx) => {
      const node = this.nodes[nodeIdx] as AbstractCodeNode
      // nodeState.integrated = node.state.integrated;
      // nodeState.props = node.state.props;

      Object.entries(nodeState.inputs).forEach(([inputKey]) => {
        if (nodeState.inputs && node.inputs[inputKey]) nodeState.inputs[inputKey].hidden = node.inputs[inputKey].hidden
      })

      Object.entries(nodeState.outputs).forEach(([outputKey]) => {
        if (nodeState.outputs && node.outputs[outputKey])
          nodeState.outputs[outputKey].hidden = node.outputs[outputKey].hidden
      })
    })
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    if (this.nodes.length === 0 || this.connections.length === 0) return

    try {
      // Get a list of edges
      const edges: [string, string | undefined][] = this.connections.map((connection: Connection) => [
        connection.to.nodeId,
        connection.from.nodeId,
      ])

      // Get a list of node
      let nodeIds = [...this.nodeIds]

      nodeIds.reverse()

      // Get sorted node ids
      nodeIds = toposort.array(nodeIds, edges)

      nodeIds.reverse()

      const unconnected = this.graph.nodes.map((node) => node.id).filter((nodeId: string) => !nodeIds.includes(nodeId))

      nodeIds = nodeIds.concat(unconnected)

      // Get sorted nodes
      const nodes = nodeIds.map((nodeId: string) => this.findNodeById(nodeId))

      if (nodes) this.nodes = nodes as AbstractCodeNode[]
    } catch {
      console.warn('Failed to sort nodes.')
    }
  }

  updateOutputVariableNames(): void {
    this.codeNodes.forEach((codeNode: AbstractCodeNode) => codeNode.updateOutputVariableName())
  }
}

/**
 * Get nodes of current graph.
 * @param graph graph / subgraph
 * @returns list of code nodes
 */
export const getCodeNodes = (graph: Graph): AbstractCodeNode[] => {
  let nodes: AbstractCodeNode[] = []

  graph.nodes.forEach((node: AbstractCodeNode | AbstractNode) => {
    if (node.subgraph) {
      nodes = nodes.concat(getCodeNodes(node.subgraph))
    } else if (node.isCodeNode) {
      nodes.push(node)
    }
  })

  return nodes
}

/**
 * Get position at specific column.
 * @param col column
 * @param offset number
 * @returns position
 */
export const getPositionAtColumn = (col: number = 0, offset: number = 100): IPosition => {
  const width = 350
  const padding = 70

  return {
    x: col * (width + padding),
    y: offset,
  }
}

/**
 * Get position before target node.
 * @param node code node
 * @returns position
 */
export const getPositionBeforeNode = (node: AbstractCodeNode): IPosition => {
  const position = { ...node.position }

  position.x -= 400
  position.y += 50

  return position
}

export const transferCodeScript = (graph: Graph): void => {
  const { calculationOrder, connectionsFromNode } = sortTopologically(graph)

  calculationOrder.forEach((node: AbstractNode) => {
    if (!node.isCodeNode) return
    const codeNode = node as AbstractCodeNode

    if (connectionsFromNode.has(codeNode)) {
      connectionsFromNode.get(codeNode)!.forEach((c) => {
        if (c.to.state && c.from.script) c.to.state.script = c.from.script
      })
    }
  })
}
