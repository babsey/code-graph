// defineCodeNode.ts

import {
  Node,
  NodeInterface,
  allowMultipleConnections,
  setType,
  type INodeDefinition,
  type NodeInterfaceDefinition,
} from 'baklavajs';

import { CodeNode, type AbstractCodeNode } from './codeNode';
import { CodeNodeInterface } from '@/codeNodeInterfaces';
import { nodeType } from '../interfaceTypes';

export type NodeConstructor<I, O> = new () => Node<I, O>;
export type NodeInstanceOf<T> = T extends new () => Node<infer A, infer B> ? Node<A, B> : never;

export type NodeInterfaceFactory<T> = () => NodeInterface<T>;
export type InterfaceFactory<T> = {
  [K in keyof T]: NodeInterfaceFactory<T[K]>;
};

export interface ICodeNodeDefinition<I, O> extends INodeDefinition<I, O> {
  codeTemplate?: (node?: AbstractCodeNode) => string;
  modules?: string[];
  name?: string;
  onConnected?: () => void;
  onUnconnected?: () => void;
  update?: (node?: AbstractCodeNode) => void;
  variableName?: string;
}

export function defineCodeNode<I, O>(definition: ICodeNodeDefinition<I, O>): new () => CodeNode<I, O> {
  return class extends CodeNode<I, O> {
    public readonly type = definition.type;
    public inputs: NodeInterfaceDefinition<I> = {} as NodeInterfaceDefinition<I>;
    public outputs: NodeInterfaceDefinition<O> = {} as NodeInterfaceDefinition<O>;

    constructor() {
      super();
      this._title = definition.title ?? definition.type;
      this.executeFactory('input', definition.inputs);
      this.executeFactory('output', definition.outputs);

      // if (definition.calculate) {
      //   this.calculate = (inputs: I, globalValues: CalculationContext) => ({
      //     ...definition.calculate!.call(this, inputs, globalValues),
      //     _code: inputs._code,
      //   })
      // }

      definition.onCreate?.call(this);

      this.name = definition.name ?? definition.type;
      this.updateModules(definition.modules);

      if (definition.variableName != undefined) this.state.variableName = definition.variableName;
      if (definition.codeTemplate) this.codeTemplate = definition.codeTemplate;

      this.addInput(
        '_code',
        new CodeNodeInterface('', []).use(setType, nodeType).use(allowMultipleConnections).setHidden(true),
      );
      this.addOutput(
        '_code',
        new CodeNodeInterface('', []).use(setType, nodeType).use(allowMultipleConnections).setHidden(true),
      );
    }

    public onPlaced(): void {
      definition.onPlaced?.call(this);
    }

    public onConnected(): void {
      definition.onConnected?.call(this);
    }

    public onDestroy(): void {
      definition.onDestroy?.call(this);
    }

    public onUnconnected(): void {
      definition.onUnconnected?.call(this);
    }

    public update(): void {
      definition.update?.call(this);
    }

    private executeFactory<V, T extends InterfaceFactory<V>>(type: 'input' | 'output', factory?: T): void {
      (Object.keys(factory || {}) as (keyof V)[]).forEach((k) => {
        const intf = factory![k]();
        if (type === 'input') {
          this.addInput(k as string, intf);
        } else {
          this.addOutput(k as string, intf);
        }
      });
    }
  };
}
