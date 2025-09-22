import {
  Node,
  NodeInterface,
  allowMultipleConnections,
  setType,
  type CalculationContext,
  type INodeDefinition,
  type NodeInterfaceDefinition,
} from 'baklavajs'

import { type AbstractCodeNode, CodeNode } from './codeNode'
import { nodeType } from '../../src/codeNodeTypes/default/interfaceTypes'
import { CodeNodeInterface } from '@/codeNodeInterfaces'

export type NodeConstructor<I, O> = new () => Node<I, O>
export type NodeInstanceOf<T> = T extends new () => Node<infer A, infer B> ? Node<A, B> : never

export type NodeInterfaceFactory<T> = () => NodeInterface<T>
export type InterfaceFactory<T> = {
  [K in keyof T]: NodeInterfaceFactory<T[K]>
}

export interface ICodeNodeDefinition<I, O> extends INodeDefinition<I, O> {
  codeTemplate?: (node?: AbstractCodeNode) => string
  modules?: string[]
  onCodeUpdate?: (node?: AbstractCodeNode) => void
  variableName?: string
}

export function defineCodeNode<I, O>(definition: ICodeNodeDefinition<I, O>): new () => CodeNode<I, O> {
  return class extends CodeNode<I, O> {
    public readonly type = definition.type
    public inputs: NodeInterfaceDefinition<I> = {} as NodeInterfaceDefinition<I>
    public outputs: NodeInterfaceDefinition<O> = {} as NodeInterfaceDefinition<O>

    constructor() {
      super()

      this._title = definition.title ?? definition.type
      this.updateModules(definition.modules)
      if (definition.codeTemplate) this.state.codeTemplate = definition.codeTemplate(this)
      if (definition.variableName) this.state.variableName = definition.variableName

      this.addInput(
        '_node',
        new CodeNodeInterface('', []).use(setType, nodeType).use(allowMultipleConnections).setHidden(true),
      )
      this.addOutput(
        '_node',
        new CodeNodeInterface('', []).use(setType, nodeType).use(allowMultipleConnections).setHidden(true),
      )

      this.executeFactory('input', definition.inputs)
      this.executeFactory('output', definition.outputs)

      definition.onCreate?.call(this)
    }

    public calculate = definition.calculate
      ? (inputs: I, globalValues: CalculationContext) => ({
          ...definition.calculate!.call(this, inputs, globalValues),
          _node: null,
        })
      : undefined

    public onPlaced() {
      definition.onPlaced?.call(this)
    }

    public onDestroy() {
      definition.onDestroy?.call(this)
    }

    public onCodeUpdate() {
      definition.onCodeUpdate?.call(this)
    }

    private executeFactory<V, T extends InterfaceFactory<V>>(type: 'input' | 'output', factory?: T): void {
      ;(Object.keys(factory || {}) as (keyof V)[]).forEach((k) => {
        const intf = factory![k]()
        if (type === 'input') {
          this.addInput(k as string, intf)
        } else {
          this.addOutput(k as string, intf)
        }
      })
    }
  }
}
