import {
  AbstractNode,
  Connection,
  Graph,
  NodeInterface,
  sortTopologically,
  type CalculateFunction,
  type INodeState,
  type NodeInterfaceDefinition,
} from 'baklavajs'
import mustache from 'mustache'
import { reactive, type UnwrapRef } from 'vue'

import type { Code } from '@/code'
import type { CodeNodeInputInterface, CodeNodeInterface } from '@/codeNodeInterfaces'

interface IAbstractCodeNodeState {
  codeTemplate: string
  hidden: boolean
  integrated: boolean
  modules: string[]
  props?: unknown
  script: string
  variableName: string
}

export abstract class AbstractCodeNode extends AbstractNode {
  public state: UnwrapRef<IAbstractCodeNodeState>
  public code: Code | undefined
  public isCodeNode = true
  public codeTemplate: () => string = () => '{{ &outputs.code }}'

  public inputs: Record<string, NodeInterface<unknown>> = {}
  public outputs: Record<string, NodeInterface<unknown>> = {}

  public constructor() {
    super()
    this.initializeIo()
    this.width = 400
    this.twoColumn = true

    this.state = reactive({
      codeTemplate: '',
      hidden: false,
      integrated: false,
      modules: [],
      script: '',
      variableName: '',
    })
  }

  get codeNodeInputs(): Record<string, CodeNodeInputInterface> {
    return Object.fromEntries(Object.entries(this.inputs).filter(([_, intf]) => intf.type != 'node')) as Record<
      string,
      CodeNodeInputInterface
    >
  }

  get idx(): number {
    return this.code?.codeNodes.filter((node: AbstractCodeNode) => !node.state.integrated).indexOf(this) ?? -1
  }

  get idxByVariableNames(): number {
    return this.code?.getNodesBySameVariableNames(this.state.variableName).indexOf(this) ?? -1
  }

  get optionalInputs(): Record<string, CodeNodeInputInterface> {
    return Object.fromEntries(Object.entries(this.codeNodeInputs).filter(([_, intf]) => intf.optional))
  }

  get requiredInputs(): Record<string, CodeNodeInputInterface> {
    return Object.fromEntries(Object.entries(this.codeNodeInputs).filter(([_, intf]) => !intf.optional))
  }

  get script(): string {
    return this.state.script
  }

  get shortId(): string {
    return this.id.slice(0, 6)
  }

  get variableName(): string {
    return this.state.variableName ? this.state.variableName + (this.idxByVariableNames + 1) : ''
  }

  abstract onCodeUpdate(): void

  /**
   * Get connected nodes to the node.
   * @param type inputs or outputs
   * @returns code node instances
   */
  getConnectedNodes(type?: 'inputs' | 'outputs'): AbstractCodeNode[] {
    let nodeIds: string[] = []

    if (type !== 'inputs') {
      const targets = this.graph?.connections
        .filter((c: Connection) => c.from.name !== '_node')
        .filter((c: Connection) => c.from.nodeId === this.id)
        .map((c: Connection) => c.to.nodeId)
      if (targets) nodeIds = nodeIds.concat(targets)
    }

    if (type !== 'outputs') {
      const sources = this.graph?.connections
        .filter((c: Connection) => c.from.name !== '_node')
        .filter((c: Connection) => c.to.nodeId === this.id)
        .map((c: Connection) => c.from.nodeId)

      if (sources) nodeIds = nodeIds.concat(sources)
    }

    if (!nodeIds || nodeIds.length == 0) return []
    return nodeIds.map((nodeId: string) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[]
  }

  registerCode(code: Code) {
    this.code = code
  }

  /**
   * Render code of this node.
   */
  renderCode(): void {
    this.state.codeTemplate = this.codeTemplate.call(this)

    const inputs: Record<string, unknown> = {}
    Object.keys(this.inputs).forEach((intfKey: string) => {
      if (intfKey === '_node') return
      const intf = this.inputs[intfKey] as CodeNodeInterface
      const value = serializeValue(intf)

      if (intf && intf.state) inputs[intfKey] = intf.state.script.length > 0 ? intf.state.script : value
    })

    const outputs: Record<string, unknown> = {}
    Object.keys(this.outputs).forEach((intfKey: string) => {
      if (intfKey === '_node') return
      const intf = this.outputs[intfKey] as CodeNodeInterface
      const value = serializeValue(intf)

      if (intf && intf.state) outputs[intfKey] = value
      // if (intf && intf.state) outputs[intfKey] = intf.state.script.length > 0 ? intf.state.script : value;
    })

    this.state.script = mustache.render(this.state.codeTemplate, { inputs, outputs })
    if (this.outputs.code) this.outputs.code.state.script = this.state.script
  }

  updateCodeNodeInputInterfaces() {
    if (!this.graph) return

    const { connectionsFromNode } = sortTopologically(this.graph)

    if (!connectionsFromNode.has(this)) return

    connectionsFromNode.get(this)!.forEach((c) => {
      const srcNode = this.graph?.findNodeById(c.from.nodeId) as AbstractCodeNode
      if (!srcNode) return

      srcNode.renderCode()
      if (c.from.isCodeNode && c.to.isCodeNode) c.to.state.script = c.from.script
    })
  }

  updateOutputVariableName(): void {
    if (this.outputs.code) this.outputs.code.name = this.variableName
  }
}

export interface ICodeNodeState<I, O> extends INodeState<I, O>, IAbstractCodeNodeState {}

export abstract class CodeNode<I, O> extends AbstractCodeNode {
  abstract inputs: NodeInterfaceDefinition<I>
  abstract outputs: NodeInterfaceDefinition<O>

  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  public calculate?: CalculateFunction<I, O>

  public load(state: ICodeNodeState<I, O>): void {
    super.load(state)
    loadNodeState(this.graph, state)
  }

  public save(): ICodeNodeState<I, O> {
    const state = super.save() as ICodeNodeState<I, O>
    saveNodeState(this.graph, state)
    return state
  }

  updateModules(modules?: string[]): void {
    if (modules) {
      this.state.modules = modules
    } else if (this.type.includes('.')) {
      const modules = this.type.split('.')
      this.state.modules.push(modules.slice(0, modules.length - 1).join('.'))
    }
  }
}

export type AbstractCodeNodeConstructor = new () => AbstractCodeNode

/**
 * Format inputs for mustache templates.
 * @param intfs code node input interfaces
 * @returns a list of string
 */
export const formatInputs = (intfs: Record<string, CodeNodeInputInterface>): string[] => {
  const args: string[] = []

  const inputKeys = Object.keys(intfs)
  inputKeys.forEach((inputKey: string) => {
    const intf = intfs[inputKey]
    if (intf?.hidden) return

    const keyword = args.length < inputKeys.indexOf(inputKey) ? `${inputKey}=` : ''
    args.push(`${keyword}{{& inputs.${inputKey} }}`)
  })

  return args
}

/**
 * Load node state.
 * @param graph code graph
 * @param nodeState node state
 */
export const loadNodeState = (graph: Graph | undefined, nodeState: ICodeNodeState<unknown, unknown>): void => {
  if (!graph) return

  const node = graph.findNodeById(nodeState.id)
  if (!node || node.subgraph) return

  const codeNode = node as AbstractCodeNode

  if (codeNode.state) {
    codeNode.state.integrated = nodeState.integrated
    codeNode.state.modules = nodeState.modules
    codeNode.state.props = nodeState.props
  }

  Object.entries(nodeState.inputs).forEach(([inputKey, inputItem]) => {
    if (inputKey === '_node') return
    if (codeNode.inputs[inputKey]) codeNode.inputs[inputKey].hidden = inputItem.hidden
  })

  Object.entries(nodeState.outputs).forEach(([outputKey, outputItem]) => {
    if (outputKey === '_node') return
    if (codeNode.outputs[outputKey]) codeNode.outputs[outputKey].hidden = outputItem.hidden
  })
}

/**
 * Save state of node.
 * @param graph code graph
 * @param nodeState node state
 */
export const saveNodeState = (graph: Graph | undefined, nodeState: ICodeNodeState<unknown, unknown>): void => {
  if (!graph) return

  const node = graph.findNodeById(nodeState.id)
  if (!node || node.subgraph) return

  const codeNode = node as AbstractCodeNode

  if (codeNode.state) {
    nodeState.integrated = codeNode.state.integrated
    nodeState.modules = codeNode.state.modules
  }

  Object.entries(nodeState.inputs).forEach(([inputKey, inputItem]) => {
    if (inputKey === '_node') return
    if (codeNode.inputs[inputKey]) inputItem.hidden = codeNode.inputs[inputKey].hidden
  })

  Object.entries(nodeState.outputs).forEach(([outputKey, outputItem]) => {
    if (outputKey === '_node') return
    if (codeNode.outputs[outputKey]) outputItem.hidden = codeNode.outputs[outputKey].hidden
  })
}

/**
 * Serialize value of code node interface
 * @param intf code node interface
 * @returns pythonic string
 */
const serializeValue = (intf: CodeNodeInterface): string => {
  let value: string

  if (intf.value == undefined) return 'None'

  switch (intf.type) {
    case 'boolean':
      value = intf.value ? 'True' : 'False'
      break
    case 'string':
      value = `'${intf.value}'`
      break
    case undefined:
      value = 'None'
      break
    default:
      value = `${intf.value}`
  }
  return value
}
